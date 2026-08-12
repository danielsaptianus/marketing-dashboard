import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, IsArray } from 'class-validator';

export class SubmitLeaveRequestDto {
  @ApiPropertyOptional({ example: 82, description: 'ID Employee (diisi otomatis bila kosong)' })
  @IsInt()
  @IsOptional()
  employee_id?: number;

  @ApiProperty({ example: 'annual', description: 'Tipe cuti (annual, sick, dll)' })
  @IsString()
  @IsNotEmpty({ message: 'type wajib diisi' })
  type: string;

  @ApiProperty({ example: '2026-04-20', description: 'Tanggal mulai cuti' })
  @IsString()
  @IsNotEmpty({ message: 'start_date wajib diisi' })
  start_date: string;

  @ApiProperty({ example: '2026-04-22', description: 'Tanggal akhir cuti' })
  @IsString()
  @IsNotEmpty({ message: 'end_date wajib diisi' })
  end_date: string;

  @ApiPropertyOptional({ example: 'Keperluan keluarga' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ example: 'paid' })
  @IsString()
  @IsOptional()
  leave_subtype?: string;

  @ApiPropertyOptional({ example: 'PT. ABC Indonesia' })
  @IsString()
  @IsOptional()
  destination_company?: string;

  @ApiPropertyOptional({ example: 'Jakarta' })
  @IsString()
  @IsOptional()
  destination_city?: string;

  @ApiPropertyOptional({ example: 'Client meeting' })
  @IsString()
  @IsOptional()
  trip_purpose?: string;

  @ApiPropertyOptional({ example: [2, 3], type: [Number] })
  @IsArray()
  @IsOptional()
  personnel_list?: number[];

  @ApiPropertyOptional({ example: 'Urgent task' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 'document_url_or_string' })
  @IsString()
  @IsOptional()
  document?: string;
}

export class LeaveResponseDto {
  @ApiProperty({ example: 1 })
  id: number | string;

  @ApiProperty({ example: 82 })
  employee_id: number | string;

  @ApiPropertyOptional({ example: 'Cuti Tahunan' })
  leave_type?: string;

  @ApiProperty({ example: '2026-04-20' })
  start_date: string;

  @ApiProperty({ example: '2026-04-22' })
  end_date: string;

  @ApiPropertyOptional({ example: 'Keperluan keluarga' })
  reason?: string;

  @ApiProperty({ example: 'pending' })
  status: string;
}
