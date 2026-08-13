import { ApiProperty } from '@nestjs/swagger';

export class KpiCardDto {
  @ApiProperty({ example: 150000000 })
  total_revenue: number;

  @ApiProperty({ example: 89000000 })
  net_profit: number;

  @ApiProperty({ example: 75 })
  win_rate: number;

  @ApiProperty({ example: 50000000 })
  average_deal_size: number;

  @ApiProperty({ example: 250000000 })
  total_pipeline_value: number;
}

export class FunnelChartItemDto {
  @ApiProperty({ example: 'Inisiasi' })
  status: string;

  @ApiProperty({ example: 12 })
  count: number;

  @ApiProperty({ example: 120000000 })
  value: number;
}

export class CategoryChartItemDto {
  @ApiProperty({ example: 'Urban Digital Twin' })
  category_name: string;

  @ApiProperty({ example: 75000000 })
  value: number;

  @ApiProperty({ example: 50 })
  percentage: number;
}

export class MonthlyTrendItemDto {
  @ApiProperty({ example: 'Jan' })
  month: string;

  @ApiProperty({ example: 15000000 })
  value: number;
}

export class LeaderboardItemDto {
  @ApiProperty({ example: 1 })
  pic_id: number;

  @ApiProperty({ example: 'Daniel' })
  pic_name: string;

  @ApiProperty({ example: 95000000 })
  total_revenue: number;

  @ApiProperty({ example: 3 })
  deals_count: number;
}

export class TopDealItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Implementasi Urban Digital Twin Kawasan Industri Cikarang' })
  nama_proyek: string;

  @ApiProperty({ example: 110000000 })
  nilai_spk: number;

  @ApiProperty({ example: 'Closing' })
  status: string;

  @ApiProperty({ example: 'Daniel' })
  pic_name: string;
}

export class UrbansolvDashboardResponseDto {
  @ApiProperty({ type: KpiCardDto })
  kpis: KpiCardDto;

  @ApiProperty({ type: [FunnelChartItemDto] })
  funnel_chart: FunnelChartItemDto[];

  @ApiProperty({ type: [CategoryChartItemDto] })
  category_distribution: CategoryChartItemDto[];

  @ApiProperty({ type: [MonthlyTrendItemDto] })
  monthly_trend: MonthlyTrendItemDto[];

  @ApiProperty({ type: [LeaderboardItemDto] })
  leaderboard: LeaderboardItemDto[];

  @ApiProperty({ type: [TopDealItemDto] })
  top_deals: TopDealItemDto[];
}

export class SccicKpiCardDto {
  @ApiProperty({ example: 318750000 })
  total_revenue_spk: number;

  @ApiProperty({ example: 5 })
  total_deals: number;

  @ApiProperty({ example: 63750000 })
  average_deal_size: number;

  @ApiProperty({ example: 80 })
  win_rate: number;
}

export class SccicDashboardResponseDto {
  @ApiProperty({ type: SccicKpiCardDto })
  kpis: SccicKpiCardDto;

  @ApiProperty({ type: [CategoryChartItemDto] })
  category_distribution: CategoryChartItemDto[];

  @ApiProperty({ type: [FunnelChartItemDto] })
  status_distribution: FunnelChartItemDto[];
}
