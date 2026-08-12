import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MitraResponseDto,
  ServiceResponseDto,
  CategoryResponseDto,
} from '@modules/master/core/dto/master-response.dto';

export class TransaksiResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  marketing_monitoring_id: number;

  @ApiProperty({ example: 100000000, description: 'Nilai kontrak yang disepakati (SPK)' })
  nilai_spk: number;

  @ApiProperty({ example: 120000000, description: 'Estimasi nilai proyek' })
  potential_revenue: number;

  @ApiProperty({ example: 50000000, description: 'Nilai kas/pembayaran yang telah diterima' })
  nilai_diterima: number;

  @ApiProperty({ example: 60000000, description: 'Total biaya operasional proyek' })
  cost_project: number;

  @ApiProperty({ example: 40000000, description: 'Keuntungan bersih (Nilai - Cost)' })
  net_profit: number;

  @ApiPropertyOptional({ example: '2026-03-15T00:00:00.000Z' })
  tanggal_deal?: Date | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class CatatanMonitoringResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  marketing_monitoring_id: number;

  @ApiProperty({ example: 1 })
  user_id: number;

  @ApiPropertyOptional({ example: 'Daniel' })
  user_name?: string | null;

  @ApiProperty({ example: 'Status diubah dari Inisiasi ke Proposal' })
  note_text: string;

  @ApiProperty({ example: 'STATUS_CHANGE', enum: ['STATUS_CHANGE', 'CRM_NOTE', 'ADMINISTRATIVE', 'GENERAL'] })
  note_type: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class MarketingMonitoringResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pengembangan Smart City Dashboard Bandung' })
  nama_proyek: string;

  @ApiProperty({ example: 1 })
  mitra_id: number;

  @ApiPropertyOptional({ type: () => MitraResponseDto })
  mitra?: MitraResponseDto;

  @ApiProperty({ example: 1 })
  service_id: number;

  @ApiPropertyOptional({ type: () => ServiceResponseDto })
  service?: ServiceResponseDto;

  @ApiPropertyOptional({ example: 1 })
  category_id?: number | null;

  @ApiPropertyOptional({ type: () => CategoryResponseDto })
  category?: CategoryResponseDto | null;

  @ApiProperty({ example: 1, description: 'ID Sales PIC (User ID)' })
  pic_id: number;

  @ApiPropertyOptional({ example: 'Daniel' })
  pic_name?: string | null;

  @ApiProperty({
    example: 'Inisiasi',
    enum: ['Inisiasi', 'Proposal', 'Penawaran', 'Kontrak', 'Closing', 'Batal'],
  })
  status: string;

  @ApiPropertyOptional({ example: 'Inbound Website' })
  lead_source?: string | null;

  @ApiPropertyOptional({ example: '2026-03-10T00:00:00.000Z' })
  last_contact?: Date | null;

  @ApiProperty({ example: 2026 })
  tahun: number;

  @ApiPropertyOptional({ example: '2026-06-30T00:00:00.000Z' })
  deadline?: Date | null;

  @ApiPropertyOptional({ example: 'Dokumen NDA & MoU sudah ditandatangani' })
  keterangan_administratif?: string | null;

  @ApiPropertyOptional({ example: 'Klien tertarik dengan modul Digital Twin 3D' })
  keterangan_crm?: string | null;

  @ApiPropertyOptional({ type: () => TransaksiResponseDto })
  transaksi?: TransaksiResponseDto | null;

  @ApiPropertyOptional({ type: () => [CatatanMonitoringResponseDto] })
  catatan_monitoring?: CatatanMonitoringResponseDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
