import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: 1 })
  id: number | string;

  @ApiProperty({ example: 'Daniel Kasep' })
  name: string;

  @ApiProperty({ example: 'user@urbansolv.co.id' })
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

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}


