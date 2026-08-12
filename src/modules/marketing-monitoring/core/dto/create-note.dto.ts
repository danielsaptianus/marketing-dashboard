import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    example: 'Klien meminta penyesuaian penawaran harga modul Smart City',
    description: 'Isi catatan CRM / follow-up meeting / administrasi',
  })
  @IsString({ message: 'note_text harus berupa string' })
  @IsNotEmpty({ message: 'note_text wajib diisi' })
  note_text: string;

  @ApiPropertyOptional({
    example: 'CRM_NOTE',
    enum: ['CRM_NOTE', 'ADMINISTRATIVE', 'GENERAL'],
    default: 'CRM_NOTE',
  })
  @IsIn(['CRM_NOTE', 'ADMINISTRATIVE', 'GENERAL'], {
    message: 'note_type harus salah satu dari: CRM_NOTE, ADMINISTRATIVE, GENERAL',
  })
  @IsOptional()
  note_type?: string = 'CRM_NOTE';
}
