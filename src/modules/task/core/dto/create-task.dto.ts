import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsIn,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubtaskDto {
  @ApiProperty({ example: 'Menghubungi PIC IT Pemkot Bandung' })
  @IsString()
  @IsNotEmpty({ message: 'Judul subtask wajib diisi' })
  title: string;
}

export class CreateTaskDto {
  @ApiProperty({
    example: 'Menyiapkan proposal penawaran teknis Smart City',
    description: 'Judul tugas utama',
  })
  @IsString({ message: 'Judul tugas harus berupa string' })
  @IsNotEmpty({ message: 'Judul tugas wajib diisi' })
  title: string;

  @ApiPropertyOptional({
    example: 'Membuat draf penawaran modul 3D Digital Twin Bandung',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'Medium',
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  })
  @IsIn(['High', 'Medium', 'Low'], {
    message: 'Priority harus salah satu dari: High, Medium, Low',
  })
  @IsOptional()
  priority?: string = 'Medium';

  @ApiPropertyOptional({
    example: 'Pending',
    enum: ['Pending', 'In_Progress', 'Done'],
    default: 'Pending',
  })
  @IsIn(['Pending', 'In_Progress', 'Done'], {
    message: 'Status harus salah satu dari: Pending, In_Progress, Done',
  })
  @IsOptional()
  status?: string = 'Pending';

  @ApiPropertyOptional({ example: '2026-09-30T00:00:00.000Z' })
  @IsDateString({}, { message: 'Format due_date harus ISO Date string' })
  @IsOptional()
  due_date?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID PIC Sales Member. Otomatis terisi user login jika kosong.' })
  @IsInt()
  @IsOptional()
  pic_id?: number;

  @ApiPropertyOptional({ example: 'Daniel' })
  @IsString()
  @IsOptional()
  pic_name?: string;

  @ApiPropertyOptional({
    example: 'https://docs.google.com/document/d/1SOP-GUIDE',
    description: 'Link panduan dokumen SOP eksternal',
  })
  @IsString()
  @IsOptional()
  sop_link?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID proyek sales tracking terkait' })
  @IsInt()
  @IsOptional()
  marketing_monitoring_id?: number;

  @ApiPropertyOptional({ type: [CreateSubtaskDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubtaskDto)
  @IsOptional()
  subtasks?: CreateSubtaskDto[];
}
