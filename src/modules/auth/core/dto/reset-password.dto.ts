import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token reset password yang dikirimkan ke email',
  })
  @IsString({ message: 'Token harus berupa string' })
  @IsNotEmpty({ message: 'Token wajib diisi' })
  token: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Password baru pengguna (minimal 6 karakter)',
  })
  @IsString({ message: 'Password harus berupa string' })
  @MinLength(6, { message: 'Password baru minimal 6 karakter' })
  @IsNotEmpty({ message: 'Password baru wajib diisi' })
  new_password: string;
}
