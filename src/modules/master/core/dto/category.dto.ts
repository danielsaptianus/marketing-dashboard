import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Urban Digital Twin', description: 'Nama kategori produk / solusi' })
  @IsString({ message: 'Nama kategori harus berupa string' })
  @IsNotEmpty({ message: 'Nama kategori wajib diisi' })
  category_name: string;

  @ApiProperty({ example: 1, description: 'ID Service induk' })
  @IsInt({ message: 'service_id harus berupa integer' })
  @IsNotEmpty({ message: 'service_id wajib diisi' })
  service_id: number;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Urban Digital Twin' })
  @IsString()
  @IsOptional()
  category_name?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  service_id?: number;
}
