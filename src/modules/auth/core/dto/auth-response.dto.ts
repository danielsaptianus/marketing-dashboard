import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: 1 })
  id: number | string;

  @ApiProperty({ example: 'Daniel' })
  name: string;

  @ApiProperty({ example: 'daniel@urbansolv.co.id' })
  email: string;

  @ApiProperty({ example: 'Sales Admin' })
  role: string;

  @ApiProperty({
    example: ['VIEW_URBANSOLV_DASHBOARD', 'VIEW_MARKETING_MONITORING'],
    type: [String],
  })
  permissions: string[];

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatar?: string | null;

  @ApiPropertyOptional({ example: '08123456789' })
  phone?: string | null;
}

export class AuthTokensDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiPropertyOptional({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token?: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}
