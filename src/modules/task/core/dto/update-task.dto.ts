import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsIn,
} from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Menyiapkan proposal penawaran teknis Smart City' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Membuat draf penawaran modul 3D Digital Twin Bandung' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'High', enum: ['High', 'Medium', 'Low'] })
  @IsIn(['High', 'Medium', 'Low'])
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ example: 'In_Progress', enum: ['Pending', 'In_Progress', 'Done'] })
  @IsIn(['Pending', 'In_Progress', 'Done'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: '2026-09-30T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  due_date?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  pic_id?: number;

  @ApiPropertyOptional({ example: 'Daniel' })
  @IsString()
  @IsOptional()
  pic_name?: string;

  @ApiPropertyOptional({ example: 'https://docs.google.com/document/d/1SOP-GUIDE' })
  @IsString()
  @IsOptional()
  sop_link?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  marketing_monitoring_id?: number;
}
