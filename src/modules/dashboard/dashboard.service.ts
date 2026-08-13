import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { DashboardQueryDto } from './core/dto/dashboard-query.dto';
import {
  UrbansolvDashboardResponseDto,
  SccicDashboardResponseDto,
} from './core/dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // 1. GET URBANSOLV DASHBOARD DATA
  // ============================================
  async getUrbansolvDashboard(query: DashboardQueryDto): Promise<UrbansolvDashboardResponseDto> {
    const tahun = query.tahun || new Date().getFullYear();

    // Find Urbansolv Mitra ID dynamically
    const mitraUrbansolv = await this.prisma.mitra.findFirst({
      where: { nama_mitra: { contains: 'urbansolv', mode: 'insensitive' } },
    });
    const urbansolvId = mitraUrbansolv?.id || 2;

    // Fetch all non-deleted projects under Urbansolv in that year
    const projects = await this.prisma.marketingMonitoring.findMany({
      where: {
        mitra_id: urbansolvId,
        tahun,
        deleted_at: null,
      },
      include: {
        transaksi: true,
        category: true,
      },
    });

    // 1.1 Compute KPIs
    const closingProjects = projects.filter((p) => p.status === 'Closing');
    const totalRevenue = closingProjects.reduce((sum, p) => sum + (p.transaksi?.nilai_spk || 0), 0);
    const netProfit = closingProjects.reduce((sum, p) => sum + (p.transaksi?.net_profit || 0), 0);
    
    const totalValidProjects = projects.filter((p) => p.status !== 'Batal').length;
    const winRate = totalValidProjects > 0 ? Math.round((closingProjects.length / totalValidProjects) * 100) : 0;
    const averageDealSize = closingProjects.length > 0 ? Math.round(totalRevenue / closingProjects.length) : 0;

    const pipelineStatuses = ['Inisiasi', 'Proposal', 'Penawaran', 'Kontrak'];
    const totalPipelineValue = projects
      .filter((p) => pipelineStatuses.includes(p.status))
      .reduce((sum, p) => sum + (p.transaksi?.potential_revenue || p.transaksi?.nilai_spk || 0), 0);

    // 1.2 Funnel Pipeline Chart
    const funnelStatuses = ['Inisiasi', 'Proposal', 'Penawaran', 'Kontrak', 'Closing', 'Batal'];
    const funnel_chart = funnelStatuses.map((status) => {
      const statusProjects = projects.filter((p) => p.status === status);
      const value = statusProjects.reduce(
        (sum, p) => sum + (status === 'Closing' ? (p.transaksi?.nilai_spk || 0) : (p.transaksi?.potential_revenue || 0)),
        0,
      );
      return {
        status,
        count: statusProjects.length,
        value,
      };
    });

    // 1.3 Revenue Distribution by Category
    const categoryMap = new Map<string, number>();
    closingProjects.forEach((p) => {
      const catName = p.category?.category_name || 'Uncategorized';
      const val = p.transaksi?.nilai_spk || 0;
      categoryMap.set(catName, (categoryMap.get(catName) || 0) + val);
    });

    const category_distribution = Array.from(categoryMap.entries()).map(([category_name, value]) => ({
      category_name,
      value,
      percentage: totalRevenue > 0 ? Math.round((value / totalRevenue) * 100) : 0,
    })).sort((a, b) => b.value - a.value);

    // 1.4 Monthly Trend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthly_trend = months.map((month, idx) => {
      const monthProjects = closingProjects.filter((p) => {
        const date = p.transaksi?.tanggal_deal || p.created_at;
        return new Date(date).getMonth() === idx;
      });
      const value = monthProjects.reduce((sum, p) => sum + (p.transaksi?.nilai_spk || 0), 0);
      return {
        month,
        value,
      };
    });

    // 1.5 PIC Leaderboard
    const picMap = new Map<number, { name: string; revenue: number; count: number }>();
    closingProjects.forEach((p) => {
      const val = p.transaksi?.nilai_spk || 0;
      const current = picMap.get(p.pic_id) || { name: p.pic_name || 'Daniel', revenue: 0, count: 0 };
      picMap.set(p.pic_id, {
        name: current.name,
        revenue: current.revenue + val,
        count: current.count + 1,
      });
    });

    const leaderboard = Array.from(picMap.entries()).map(([pic_id, info]) => ({
      pic_id,
      pic_name: info.name,
      total_revenue: info.revenue,
      deals_count: info.count,
    })).sort((a, b) => b.total_revenue - a.total_revenue);

    // 1.6 Top Strategic Deals
    const top_deals = [...projects]
      .sort((a, b) => (b.transaksi?.nilai_spk || b.transaksi?.potential_revenue || 0) - (a.transaksi?.nilai_spk || a.transaksi?.potential_revenue || 0))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        nama_proyek: p.nama_proyek,
        nilai_spk: p.transaksi?.nilai_spk || p.transaksi?.potential_revenue || 0,
        status: p.status,
        pic_name: p.pic_name || 'Daniel',
      }));

    return {
      kpis: {
        total_revenue: totalRevenue,
        net_profit: netProfit,
        win_rate: winRate,
        average_deal_size: averageDealSize,
        total_pipeline_value: totalPipelineValue,
      },
      funnel_chart,
      category_distribution,
      monthly_trend,
      leaderboard,
      top_deals,
    };
  }

  // ============================================
  // 2. GET SCCIC DASHBOARD DATA
  // ============================================
  async getSccicDashboard(query: DashboardQueryDto): Promise<SccicDashboardResponseDto> {
    const tahun = query.tahun || new Date().getFullYear();

    // Find SCCIC Mitra ID dynamically
    const mitraSccic = await this.prisma.mitra.findFirst({
      where: { nama_mitra: { contains: 'sccic', mode: 'insensitive' } },
    });
    const sccicId = mitraSccic?.id || 1;

    // Fetch all non-deleted SCCIC projects for that year
    const projects = await this.prisma.marketingMonitoring.findMany({
      where: {
        mitra_id: sccicId,
        tahun,
        deleted_at: null,
      },
      include: {
        transaksi: true,
        category: true,
      },
    });

    const closingProjects = projects.filter((p) => p.status === 'Closing');
    const totalRevenueSpk = closingProjects.reduce((sum, p) => sum + (p.transaksi?.nilai_spk || 0), 0);
    const averageDealSize = closingProjects.length > 0 ? Math.round(totalRevenueSpk / closingProjects.length) : 0;
    
    const totalValidProjects = projects.filter((p) => p.status !== 'Batal').length;
    const winRate = totalValidProjects > 0 ? Math.round((closingProjects.length / totalValidProjects) * 100) : 0;

    // Revenue Distribution by Category
    const categoryMap = new Map<string, number>();
    closingProjects.forEach((p) => {
      const catName = p.category?.category_name || 'Uncategorized';
      const val = p.transaksi?.nilai_spk || 0;
      categoryMap.set(catName, (categoryMap.get(catName) || 0) + val);
    });

    const category_distribution = Array.from(categoryMap.entries()).map(([category_name, value]) => ({
      category_name,
      value,
      percentage: totalRevenueSpk > 0 ? Math.round((value / totalRevenueSpk) * 100) : 0,
    })).sort((a, b) => b.value - a.value);

    // Status Distribution / Funnel
    const funnelStatuses = ['Inisiasi', 'Proposal', 'Penawaran', 'Kontrak', 'Closing', 'Batal'];
    const status_distribution = funnelStatuses.map((status) => {
      const statusProjects = projects.filter((p) => p.status === status);
      const value = statusProjects.reduce(
        (sum, p) => sum + (status === 'Closing' ? (p.transaksi?.nilai_spk || 0) : (p.transaksi?.potential_revenue || 0)),
        0,
      );
      return {
        status,
        count: statusProjects.length,
        value,
      };
    });

    return {
      kpis: {
        total_revenue_spk: totalRevenueSpk,
        total_deals: closingProjects.length,
        average_deal_size: averageDealSize,
        win_rate: winRate,
      },
      category_distribution,
      status_distribution,
    };
  }
}
