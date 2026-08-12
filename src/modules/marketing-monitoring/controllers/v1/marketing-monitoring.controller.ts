import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { MarketingMonitoringService } from '../../marketing-monitoring.service';
import { CreateMarketingMonitoringDto } from '../../core/dto/create-marketing-monitoring.dto';
import { UpdateMarketingMonitoringDto } from '../../core/dto/update-marketing-monitoring.dto';
import { QueryMarketingMonitoringDto } from '../../core/dto/query-marketing-monitoring.dto';
import { CreateNoteDto } from '../../core/dto/create-note.dto';
import {
  MarketingMonitoringResponseDto,
  CatatanMonitoringResponseDto,
} from '../../core/dto/marketing-monitoring-response.dto';
import {
  ApiSuccessResponse,
  ApiSuccessArrayResponse,
} from '@common/decorators/api-response.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { Permissions } from '@common/decorators/permissions.decorator';
import { GetUser } from '@common/decorators/get-user.decorator';
import { JwtPayload } from '@modules/auth/core/interfaces/jwt-payload.interface';

@ApiTags('Marketing Monitoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'marketing-monitoring', version: '1' })
export class MarketingMonitoringController {
  constructor(
    private readonly monitoringService: MarketingMonitoringService,
  ) {}

  @Post()
  @Permissions('ADD_MARKETING_MONITORING')
  @ApiOperation({
    summary: 'Tambah data sales tracking / marketing monitoring baru',
    description: 'Menyimpan data proyek, informasi finansial transaksi (SPK/Cost/Profit), dan auto-assign PIC dari token pengguna',
  })
  @ApiSuccessResponse(MarketingMonitoringResponseDto)
  async create(
    @Body() createDto: CreateMarketingMonitoringDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.monitoringService.create(createDto, user);
  }

  @Get()
  @Permissions('VIEW_MARKETING_MONITORING')
  @ApiOperation({
    summary: 'Get list sales tracking dengan filter, search, sorting & pagination',
    description: 'Menampilkan data tracking penjualan. Mendukung filter berdasarkan mitra, service, kategori, status pipeline, tahun, serta pencarian kata kunci',
  })
  @ApiSuccessArrayResponse(MarketingMonitoringResponseDto)
  async findAll(
    @Query() query: QueryMarketingMonitoringDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.monitoringService.findAll(query, user);
  }

  @Get(':id')
  @Permissions('VIEW_MARKETING_MONITORING')
  @ApiOperation({
    summary: 'Get detail sales tracking by ID',
    description: 'Menampilkan rincian data proyek, transaksi finansial, dan seluruh log riwayat perubahan status / catatan CRM',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(MarketingMonitoringResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.monitoringService.findOne(id);
  }

  @Patch(':id')
  @Permissions('UPDATE_MARKETING_MONITORING')
  @ApiOperation({
    summary: 'Update data sales tracking (dengan validasi hak akses kepemilikan)',
    description: 'Sales Admin hanya dapat mengubah data miliknya sendiri. Perubahan status akan otomatis dicatat ke riwayat log audit',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(MarketingMonitoringResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMarketingMonitoringDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.monitoringService.update(id, updateDto, user);
  }

  @Delete(':id')
  @Permissions('DELETE_MARKETING_MONITORING')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Hapus data sales tracking (Soft Delete)',
    description: 'Menghapus data tracking secara soft delete (Sales Admin dibatasi hanya data miliknya)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Data marketing monitoring berhasil dihapus' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.monitoringService.remove(id, user);
  }

  @Post(':id/notes')
  @Permissions('UPDATE_MARKETING_MONITORING')
  @ApiOperation({
    summary: 'Tambah catatan CRM / follow-up meeting pada proyek',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(CatatanMonitoringResponseDto)
  async addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() noteDto: CreateNoteDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.monitoringService.addNote(id, noteDto, user);
  }
}
