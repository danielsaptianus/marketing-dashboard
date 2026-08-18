import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubtaskResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  task_id: number;

  @ApiProperty({ example: 'Menghubungi PIC IT Pemkot Bandung' })
  title: string;

  @ApiProperty({ example: false })
  is_done: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class TaskResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Menyiapkan proposal penawaran teknis Smart City' })
  title: string;

  @ApiPropertyOptional({ example: 'Membuat draf penawaran modul 3D Digital Twin Bandung' })
  description?: string | null;

  @ApiProperty({ example: 'Medium' })
  priority: string;

  @ApiProperty({ example: 'Pending' })
  status: string;

  @ApiPropertyOptional({ example: '2026-09-30T00:00:00.000Z' })
  due_date?: Date | null;

  @ApiProperty({ example: 1 })
  pic_id: number;

  @ApiPropertyOptional({ example: 'Daniel' })
  pic_name?: string | null;

  @ApiPropertyOptional({ example: 'https://docs.google.com/document/d/1SOP-GUIDE' })
  sop_link?: string | null;

  @ApiPropertyOptional({ example: 1 })
  marketing_monitoring_id?: number | null;

  @ApiProperty({ type: [SubtaskResponseDto] })
  subtasks: SubtaskResponseDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class SopResponseDto {
  @ApiProperty({ example: 1 })
  task_id: number;

  @ApiProperty({ example: 'Menyiapkan proposal penawaran teknis Smart City' })
  task_title: string;

  @ApiProperty({ example: 'https://docs.google.com/document/d/1SOP-GUIDE' })
  sop_link: string;

  @ApiProperty({ example: 'Daniel' })
  pic_name: string;
}
