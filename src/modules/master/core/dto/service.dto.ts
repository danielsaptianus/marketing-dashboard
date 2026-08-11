import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Product', description: 'Nama service / jenis layanan' })
  @IsString({ message: 'Nama service harus berupa string' })
  @IsNotEmpty({ message: 'Nama service wajib diisi' })
  service_name: string;

  @ApiPropertyOptional({ example: 'Layanan berbasis produk software dan platform' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateServiceDto {
  @ApiPropertyOptional({ example: 'Product' })
  @IsString()
  @IsOptional()
  service_name?: string;

  @ApiPropertyOptional({ example: 'Layanan berbasis produk software dan platform' })
  @IsString()
  @IsOptional()
  description?: string;
}
