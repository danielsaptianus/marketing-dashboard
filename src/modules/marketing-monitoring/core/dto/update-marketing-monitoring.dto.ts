import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsDateString,
  IsIn,
  Min,
} from 'class-validator';

export class UpdateMarketingMonitoringDto {
  @ApiPropertyOptional({ example: 'Pengembangan Smart City Dashboard Bandung' })
  @IsString()
  @IsOptional()
  nama_proyek?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  mitra_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  service_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  category_id?: number;

  @ApiPropertyOptional({
    example: 'Proposal',
    enum: ['Inisiasi', 'Proposal', 'Penawaran', 'Kontrak', 'Closing', 'Batal'],
  })
  @IsIn(['Inisiasi', 'Proposal', 'Penawaran', 'Kontrak', 'Closing', 'Batal'], {
    message: 'Status harus salah satu dari: Inisiasi, Proposal, Penawaran, Kontrak, Closing, Batal',
  })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'Inbound Website' })
  @IsString()
  @IsOptional()
  lead_source?: string;

  @ApiPropertyOptional({ example: '2026-03-10T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  last_contact?: string;

  @ApiPropertyOptional({ example: 2026 })
  @IsInt()
  @Min(2000)
  @IsOptional()
  tahun?: number;

  @ApiPropertyOptional({ example: '2026-06-30T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiPropertyOptional({ example: 'Dokumen NDA & MoU sudah ditandatangani' })
  @IsString()
  @IsOptional()
  keterangan_administratif?: string;

  @ApiPropertyOptional({ example: 'Klien tertarik dengan integrasi AI dan modul 3D' })
  @IsString()
  @IsOptional()
  keterangan_crm?: string;

  // ============================================
  // Financial fields (Tabel Transaksi)
  // ============================================
  @ApiPropertyOptional({ example: 100000000 })
  @IsNumber()
  @IsOptional()
  nilai_spk?: number;

  @ApiPropertyOptional({ example: 120000000 })
  @IsNumber()
  @IsOptional()
  potential_revenue?: number;

  @ApiPropertyOptional({ example: 50000000 })
  @IsNumber()
  @IsOptional()
  nilai_diterima?: number;

  @ApiPropertyOptional({ example: 60000000 })
  @IsNumber()
  @IsOptional()
  cost_project?: number;

  @ApiPropertyOptional({ example: '2026-03-15T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  tanggal_deal?: string;
}
