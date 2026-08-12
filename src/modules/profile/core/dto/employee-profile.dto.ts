import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeProfileResponseDto {
  @ApiProperty({ example: 82 })
  id: number;

  @ApiProperty({ example: 'Daniel' })
  fullname: string;

  @ApiProperty({ example: 'daniel@urbansolv.co.id' })
  email: string;

  @ApiPropertyOptional({ example: 'Marketing' })
  department?: string | null;

  @ApiPropertyOptional({ example: 'Sales Admin' })
  position?: string | null;

  @ApiPropertyOptional({ example: '08123456789' })
  phone?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatar?: string | null;
}
