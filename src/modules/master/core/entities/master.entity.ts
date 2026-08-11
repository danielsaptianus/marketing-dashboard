import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MitraEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Urbansolv' })
  nama_mitra: string;

  @ApiPropertyOptional({ example: 'Technology & Urban Solutions' })
  company_style?: string | null;

  @ApiPropertyOptional({ example: 'ITB Innovation Park, Gedung 01, Lantai 09' })
  alamat?: string | null;

  @ApiPropertyOptional({ example: 'Valdi Firstianto' })
  contact_name?: string | null;

  @ApiPropertyOptional({ example: 'Tech Lead / Management' })
  contact_position?: string | null;

  @ApiPropertyOptional({ example: '6282230668151' })
  contact_phone?: string | null;

  @ApiPropertyOptional({ example: 'contact@urbansolv.co.id' })
  contact_email?: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class CategoryEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Urban Digital Twin' })
  category_name: string;

  @ApiProperty({ example: 1 })
  service_id: number;

  @ApiPropertyOptional()
  service?: any;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class ServiceEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Product' })
  service_name: string;

  @ApiPropertyOptional({ example: 'Layanan berbasis produk software dan platform' })
  description?: string | null;

  @ApiPropertyOptional({ type: () => [CategoryEntity] })
  categories?: CategoryEntity[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
