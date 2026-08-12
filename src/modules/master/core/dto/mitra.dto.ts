import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateMitraDto {
  @ApiProperty({ example: 'Urbansolv', description: 'Nama entitas mitra bisnis' })
  @IsString({ message: 'Nama mitra harus berupa string' })
  @IsNotEmpty({ message: 'Nama mitra wajib diisi' })
  nama_mitra: string;

  @ApiPropertyOptional({ example: 'Technology & Urban Solutions' })
  @IsString()
  @IsOptional()
  company_style?: string;

  @ApiPropertyOptional({ example: 'ITB Innovation Park, Gedung 01, Lantai 09' })
  @IsString()
  @IsOptional()
  alamat?: string;

  @ApiPropertyOptional({ example: 'Daniel' })
  @IsString()
  @IsOptional()
  contact_name?: string;

  @ApiPropertyOptional({ example: 'Tech Lead / Management' })
  @IsString()
  @IsOptional()
  contact_position?: string;

  @ApiPropertyOptional({ example: '6282230668151' })
  @IsString()
  @IsOptional()
  contact_phone?: string;

  @ApiPropertyOptional({ example: 'daniel@urbansolv.co.id' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsOptional()
  contact_email?: string;
}

export class UpdateMitraDto {
  @ApiPropertyOptional({ example: 'Urbansolv' })
  @IsString()
  @IsOptional()
  nama_mitra?: string;

  @ApiPropertyOptional({ example: 'Technology & Urban Solutions' })
  @IsString()
  @IsOptional()
  company_style?: string;

  @ApiPropertyOptional({ example: 'ITB Innovation Park, Gedung 01, Lantai 09' })
  @IsString()
  @IsOptional()
  alamat?: string;

  @ApiPropertyOptional({ example: 'Daniel' })
  @IsString()
  @IsOptional()
  contact_name?: string;

  @ApiPropertyOptional({ example: 'Tech Lead / Management' })
  @IsString()
  @IsOptional()
  contact_position?: string;

  @ApiPropertyOptional({ example: '6282230668151' })
  @IsString()
  @IsOptional()
  contact_phone?: string;

  @ApiPropertyOptional({ example: 'daniel@urbansolv.co.id' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsOptional()
  contact_email?: string;
}
