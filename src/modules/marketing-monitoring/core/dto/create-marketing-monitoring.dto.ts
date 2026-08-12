import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsDateString,
  IsIn,
  Min,
} from 'class-validator';

export class CreateMarketingMonitoringDto {
  @ApiProperty({
    example: 'Pengembangan Smart City Dashboard Bandung',
    description: 'Nama unik dari proyek yang sedang ditawarkan atau dikerjakan',
  })
  @IsString({ message: 'Nama proyek harus berupa string' })
  @IsNotEmpty({ message: 'Nama proyek wajib diisi' })
  nama_proyek: string;

  @ApiProperty({ example: 1, description: 'ID Mitra bisnis (1: SCCIC, 2: Urbansolv)' })
  @IsInt({ message: 'mitra_id harus berupa integer' })
  @IsNotEmpty({ message: 'mitra_id wajib diisi' })
  mitra_id: number;

  @ApiProperty({ example: 1, description: 'ID Service / Layanan utama' })
  @IsInt({ message: 'service_id harus berupa integer' })
  @IsNotEmpty({ message: 'service_id wajib diisi' })
  service_id: number;

  @ApiPropertyOptional({ example: 1, description: 'ID Kategori turunan' })
  @IsInt({ message: 'category_id harus berupa integer' })
  @IsOptional()
  category_id?: number;

  @ApiPropertyOptional({
    example: 'Inisiasi',
    description: 'Tahapan pipeline sales',
    enum: ['Inisiasi', 'Proposal', 'Penawaran', 'Kontrak', 'Closing', 'Batal'],
    default: 'Inisiasi',
  })
  @IsIn(['Inisiasi', 'Proposal', 'Penawaran', 'Kontrak', 'Closing', 'Batal'], {
    message: 'Status harus salah satu dari: Inisiasi, Proposal, Penawaran, Kontrak, Closing, Batal',
  })
  @IsOptional()
  status?: string = 'Inisiasi';

  @ApiPropertyOptional({ example: 'Inbound Website', description: 'Sumber perolehan lead' })
  @IsString()
  @IsOptional()
  lead_source?: string;

  @ApiPropertyOptional({
    example: '2026-03-10T00:00:00.000Z',
    description: 'Tanggal terakhir interaksi dengan klien',
  })
  @IsDateString({}, { message: 'Format last_contact harus ISO Date string' })
  @IsOptional()
  last_contact?: string;

  @ApiPropertyOptional({ example: 2026, description: 'Tahun proyek berjalan' })
  @IsInt({ message: 'tahun harus berupa integer' })
  @Min(2000, { message: 'tahun minimal 2000' })
  @IsOptional()
  tahun?: number = new Date().getFullYear();

  @ApiPropertyOptional({
    example: '2026-06-30T00:00:00.000Z',
    description: 'Batas waktu penyelesaian proyek',
  })
  @IsDateString({}, { message: 'Format deadline harus ISO Date string' })
  @IsOptional()
  deadline?: string;

  @ApiPropertyOptional({
    example: 'Dokumen NDA & MoU sudah ditandatangani',
    description: 'Catatan administratif terkait proyek, status dokumen, legalitas',
  })
  @IsString()
  @IsOptional()
  keterangan_administratif?: string;

  @ApiPropertyOptional({
    example: 'Klien tertarik dengan integrasi AI dan modul 3D',
    description: 'Catatan interaksi dan insight komunikasi dengan klien (meeting, follow-up, feedback)',
  })
  @IsString()
  @IsOptional()
  keterangan_crm?: string;

  // ============================================
  // Financial fields (Tabel Transaksi)
  // ============================================
  @ApiPropertyOptional({ example: 100000000, description: 'Nilai kontrak yang disepakati (SPK)' })
  @IsNumber({}, { message: 'nilai_spk harus berupa angka' })
  @IsOptional()
  nilai_spk?: number = 0;

  @ApiPropertyOptional({ example: 120000000, description: 'Estimasi nilai proyek' })
  @IsNumber({}, { message: 'potential_revenue harus berupa angka' })
  @IsOptional()
  potential_revenue?: number = 0;

  @ApiPropertyOptional({ example: 50000000, description: 'Nilai aktual yang diterima' })
  @IsNumber({}, { message: 'nilai_diterima harus berupa angka' })
  @IsOptional()
  nilai_diterima?: number = 0;

  @ApiPropertyOptional({ example: 60000000, description: 'Total biaya proyek' })
  @IsNumber({}, { message: 'cost_project harus berupa angka' })
  @IsOptional()
  cost_project?: number = 0;

  @ApiPropertyOptional({
    example: '2026-03-15T00:00:00.000Z',
    description: 'Tanggal kesepakatan proyek (closing / deal)',
  })
  @IsDateString({}, { message: 'Format tanggal_deal harus ISO Date string' })
  @IsOptional()
  tanggal_deal?: string;
}
