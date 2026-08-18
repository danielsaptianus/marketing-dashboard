import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTaskDto {
  @ApiPropertyOptional({ example: 1, description: 'Filter berdasarkan ID PIC Sales Member' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  pic_id?: number;

  @ApiPropertyOptional({ example: 'Pending', enum: ['Pending', 'In_Progress', 'Done'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'Medium', enum: ['High', 'Medium', 'Low'] })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ example: 1, description: 'Filter berdasarkan proyek sales tracking terkait' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  marketing_monitoring_id?: number;

  @ApiPropertyOptional({ description: 'Pencarian kata kunci pada judul atau deskripsi tugas' })
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
}
