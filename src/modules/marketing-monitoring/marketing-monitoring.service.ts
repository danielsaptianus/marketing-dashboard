import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateMarketingMonitoringDto } from './core/dto/create-marketing-monitoring.dto';
import { UpdateMarketingMonitoringDto } from './core/dto/update-marketing-monitoring.dto';
import { QueryMarketingMonitoringDto } from './core/dto/query-marketing-monitoring.dto';
import { CreateNoteDto } from './core/dto/create-note.dto';
import { JwtPayload } from '@modules/auth/core/interfaces/jwt-payload.interface';

@Injectable()
export class MarketingMonitoringService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // CREATE MARKETING MONITORING
  // ============================================
  async create(dto: CreateMarketingMonitoringDto, user: JwtPayload) {
    const {
      nama_proyek,
      mitra_id,
      service_id,
      category_id,
      status = 'Inisiasi',
      lead_source,
      last_contact,
      tahun = new Date().getFullYear(),
      deadline,
      keterangan_administratif,
      keterangan_crm,
      // Finansial
      nilai_spk = 0,
      potential_revenue = 0,
      nilai_diterima = 0,
      cost_project = 0,
      tanggal_deal,
    } = dto;

    // Validate Mitra exists
    const mitra = await this.prisma.mitra.findFirst({
      where: { id: mitra_id, deleted_at: null },
    });
    if (!mitra) {
      throw new BadRequestException(`Mitra ID ${mitra_id} tidak valid atau tidak ditemukan`);
    }

    // Validate Service exists
    const service = await this.prisma.service.findFirst({
      where: { id: service_id, deleted_at: null },
    });
    if (!service) {
      throw new BadRequestException(`Service ID ${service_id} tidak valid atau tidak ditemukan`);
    }

    // Validate Category exists if provided
    if (category_id) {
      const category = await this.prisma.category.findFirst({
        where: { id: category_id, service_id, deleted_at: null },
      });
      if (!category) {
        throw new BadRequestException(`Category ID ${category_id} tidak sesuai dengan Service ID ${service_id}`);
      }
    }

    const picId = typeof user.userId === 'number' ? user.userId : parseInt(String(user.userId), 10) || 1;
    const picName = user.name || user.email;

    // Calculate net profit
    const revenueBase = nilai_spk > 0 ? nilai_spk : nilai_diterima;
    const net_profit = revenueBase - cost_project;

    // Create in Prisma transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const monitoring = await tx.marketingMonitoring.create({
        data: {
          nama_proyek,
          mitra_id,
          service_id,
          category_id: category_id || null,
          pic_id: picId,
          pic_name: picName,
          status,
          lead_source: lead_source || null,
          last_contact: last_contact ? new Date(last_contact) : null,
          tahun,
          deadline: deadline ? new Date(deadline) : null,
          keterangan_administratif: keterangan_administratif || null,
          keterangan_crm: keterangan_crm || null,
          transaksi: {
            create: {
              nilai_spk,
              potential_revenue,
              nilai_diterima,
              cost_project,
              net_profit,
              tanggal_deal: tanggal_deal ? new Date(tanggal_deal) : null,
            },
          },
          catatan_monitoring: {
            create: {
              user_id: picId,
              user_name: picName,
              note_text: `Proyek dibuat dengan status awal: ${status}`,
              note_type: 'STATUS_CHANGE',
            },
          },
        },
        include: {
          mitra: true,
          service: true,
          category: true,
          transaksi: true,
          catatan_monitoring: true,
        },
      });

      return monitoring;
    });

    return result;
  }

  // ============================================
  // FIND ALL / LIST WITH FILTER & PAGINATION
  // ============================================
  async findAll(query: QueryMarketingMonitoringDto, user: JwtPayload) {
    const {
      mitra_id,
      service_id,
      category_id,
      status,
      tahun,
      search,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build dynamic where filter
    const where: any = {
      deleted_at: null,
    };

    if (mitra_id) where.mitra_id = mitra_id;
    if (service_id) where.service_id = service_id;
    if (category_id) where.category_id = category_id;
    if (status) where.status = status;
    if (tahun) where.tahun = tahun;

    if (search) {
      where.OR = [
        { nama_proyek: { contains: search, mode: 'insensitive' } },
        { pic_name: { contains: search, mode: 'insensitive' } },
        { lead_source: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.marketingMonitoring.count({ where }),
      this.prisma.marketingMonitoring.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort_by]: sort_order.toLowerCase() },
        include: {
          mitra: true,
          service: true,
          category: true,
          transaksi: true,
        },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // ============================================
  // FIND ONE BY ID
  // ============================================
  async findOne(id: number) {
    const monitoring = await this.prisma.marketingMonitoring.findFirst({
      where: { id, deleted_at: null },
      include: {
        mitra: true,
        service: true,
        category: true,
        transaksi: true,
        catatan_monitoring: {
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!monitoring) {
      throw new NotFoundException(`Data monitoring dengan ID ${id} tidak ditemukan`);
    }

    return monitoring;
  }

  // ============================================
  // UPDATE MARKETING MONITORING (WITH OWNERSHIP RULE)
  // ============================================
  async update(id: number, dto: UpdateMarketingMonitoringDto, user: JwtPayload) {
    const existing = await this.findOne(id);

    // Ownership check for Sales Admin (SRS Halaman 7)
    this.checkOwnership(existing.pic_id, user);

    const {
      nama_proyek,
      mitra_id,
      service_id,
      category_id,
      status,
      lead_source,
      last_contact,
      tahun,
      deadline,
      keterangan_administratif,
      keterangan_crm,
      // Finansial
      nilai_spk,
      potential_revenue,
      nilai_diterima,
      cost_project,
      tanggal_deal,
    } = dto;

    // Validate relationships if changed
    if (mitra_id) {
      const mitra = await this.prisma.mitra.findFirst({
        where: { id: mitra_id, deleted_at: null },
      });
      if (!mitra) throw new BadRequestException(`Mitra ID ${mitra_id} tidak valid`);
    }

    const currentServiceId = service_id || existing.service_id;
    if (service_id) {
      const service = await this.prisma.service.findFirst({
        where: { id: service_id, deleted_at: null },
      });
      if (!service) throw new BadRequestException(`Service ID ${service_id} tidak valid`);
    }

    if (category_id) {
      const category = await this.prisma.category.findFirst({
        where: { id: category_id, service_id: currentServiceId, deleted_at: null },
      });
      if (!category) throw new BadRequestException(`Category ID ${category_id} tidak valid untuk Service ID ${currentServiceId}`);
    }

    const userId = typeof user.userId === 'number' ? user.userId : parseInt(String(user.userId), 10) || 1;
    const userName = user.name || user.email;

    // Recalculate net profit if financial fields changed
    const currentNilaiSpk = nilai_spk !== undefined ? nilai_spk : (existing.transaksi?.nilai_spk || 0);
    const currentNilaiDiterima = nilai_diterima !== undefined ? nilai_diterima : (existing.transaksi?.nilai_diterima || 0);
    const currentCostProject = cost_project !== undefined ? cost_project : (existing.transaksi?.cost_project || 0);
    const revenueBase = currentNilaiSpk > 0 ? currentNilaiSpk : currentNilaiDiterima;
    const updatedNetProfit = revenueBase - currentCostProject;

    // Execute in transaction
    const updated = await this.prisma.$transaction(async (tx) => {
      // 1. Check if status changed -> auto create audit log
      if (status && status !== existing.status) {
        await tx.catatanMonitoring.create({
          data: {
            marketing_monitoring_id: id,
            user_id: userId,
            user_name: userName,
            note_text: `Status diubah dari '${existing.status}' menjadi '${status}'`,
            note_type: 'STATUS_CHANGE',
          },
        });
      }

      // 2. Update monitoring
      const res = await tx.marketingMonitoring.update({
        where: { id },
        data: {
          ...(nama_proyek && { nama_proyek }),
          ...(mitra_id && { mitra_id }),
          ...(service_id && { service_id }),
          ...(category_id !== undefined && { category_id }),
          ...(status && { status }),
          ...(lead_source !== undefined && { lead_source }),
          ...(last_contact !== undefined && { last_contact: last_contact ? new Date(last_contact) : null }),
          ...(tahun && { tahun }),
          ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
          ...(keterangan_administratif !== undefined && { keterangan_administratif }),
          ...(keterangan_crm !== undefined && { keterangan_crm }),
          transaksi: {
            upsert: {
              create: {
                nilai_spk: currentNilaiSpk,
                potential_revenue: potential_revenue !== undefined ? potential_revenue : 0,
                nilai_diterima: currentNilaiDiterima,
                cost_project: currentCostProject,
                net_profit: updatedNetProfit,
                tanggal_deal: tanggal_deal ? new Date(tanggal_deal) : null,
              },
              update: {
                ...(nilai_spk !== undefined && { nilai_spk }),
                ...(potential_revenue !== undefined && { potential_revenue }),
                ...(nilai_diterima !== undefined && { nilai_diterima }),
                ...(cost_project !== undefined && { cost_project }),
                net_profit: updatedNetProfit,
                ...(tanggal_deal !== undefined && { tanggal_deal: tanggal_deal ? new Date(tanggal_deal) : null }),
              },
            },
          },
        },
        include: {
          mitra: true,
          service: true,
          category: true,
          transaksi: true,
          catatan_monitoring: {
            orderBy: { created_at: 'desc' },
          },
        },
      });

      return res;
    });

    return updated;
  }

  // ============================================
  // SOFT DELETE MARKETING MONITORING
  // ============================================
  async remove(id: number, user: JwtPayload): Promise<{ message: string }> {
    const existing = await this.findOne(id);
    this.checkOwnership(existing.pic_id, user);

    await this.prisma.marketingMonitoring.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return { message: `Data marketing monitoring ID ${id} berhasil dihapus` };
  }

  // ============================================
  // ADD CRM NOTE
  // ============================================
  async addNote(id: number, dto: CreateNoteDto, user: JwtPayload) {
    await this.findOne(id);

    const userId = typeof user.userId === 'number' ? user.userId : parseInt(String(user.userId), 10) || 1;
    const userName = user.name || user.email;

    return this.prisma.catatanMonitoring.create({
      data: {
        marketing_monitoring_id: id,
        user_id: userId,
        user_name: userName,
        note_text: dto.note_text,
        note_type: dto.note_type || 'CRM_NOTE',
      },
    });
  }

  // ============================================
  // PRIVATE HELPER: OWNERSHIP CHECK
  // ============================================
  private checkOwnership(picId: number, user: JwtPayload) {
    const role = user.role?.toLowerCase() || '';
    const userId = typeof user.userId === 'number' ? user.userId : parseInt(String(user.userId), 10) || 1;

    // Super Administrator and Head of Marketing have full access
    const isPrivileged =
      role.includes('admin') && !role.includes('sales') ||
      role.includes('head') ||
      role.includes('super');

    if (!isPrivileged && picId !== userId) {
      throw new ForbiddenException(
        'Akses ditolak: Anda hanya dapat mengubah atau menghapus data tracking yang Anda inputkan sendiri.',
      );
    }
  }
}
