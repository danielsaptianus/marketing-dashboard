import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AttendanceResponseDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: '2026-04-17' })
  date: string;

  @ApiPropertyOptional({ example: '08:00:00' })
  check_in?: string | null;

  @ApiPropertyOptional({ example: '17:00:00' })
  check_out?: string | null;

  @ApiProperty({ example: 'hadir' })
  status: string;
}
