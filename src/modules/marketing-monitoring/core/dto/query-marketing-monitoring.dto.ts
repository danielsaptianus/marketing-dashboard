import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryMarketingMonitoringDto {
  @ApiPropertyOptional({ example: 1, description: 'Filter berdasarkan ID Mitra (1: SCCIC, 2: Urbansolv)' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  mitra_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'Filter berdasarkan ID Service' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  service_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'Filter berdasarkan ID Kategori' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  category_id?: number;

  @ApiPropertyOptional({
    example: 'Inisiasi',
    description: 'Filter berdasarkan status pipeline',
    enum: ['Inisiasi', 'Proposal', 'Penawaran', 'Kontrak', 'Closing', 'Batal'],
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 2026, description: 'Filter berdasarkan tahun proyek' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  tahun?: number;

  @ApiPropertyOptional({ description: 'Pencarian kata kunci (nama proyek, PIC, nama kontak)' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'created_at', default: 'created_at', enum: ['created_at', 'nama_proyek', 'status', 'tahun', 'updated_at'] })
  @IsString()
  @IsOptional()
  sort_by?: string = 'created_at';

  @ApiPropertyOptional({ example: 'desc', default: 'desc', enum: ['asc', 'desc'] })
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
  @IsOptional()
  sort_order?: 'asc' | 'desc' = 'desc';
}
