import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from '../../dashboard.service';
import { DashboardQueryDto } from '../../core/dto/dashboard-query.dto';
import {
  UrbansolvDashboardResponseDto,
  SccicDashboardResponseDto,
} from '../../core/dto/dashboard-response.dto';
import { ApiSuccessResponse } from '@common/decorators/api-response.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { Permissions } from '@common/decorators/permissions.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('urbansolv')
  @Permissions('VIEW_URBANSOLV_DASHBOARD')
  @ApiOperation({
    summary: 'Get Urbansolv Dashboard Analytics Summary',
    description: 'Menampilkan data analitik dashboard Urbansolv: KPI Cards (Revenue, Profit, Win Rate, Deal Size), Funnel Pipeline, Distribusi Kategori Produk, Trend Bulanan, dan Leaderboard PIC.',
  })
  @ApiSuccessResponse(UrbansolvDashboardResponseDto)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Missing VIEW_URBANSOLV_DASHBOARD permission' })
  async getUrbansolvDashboard(
    @Query() query: DashboardQueryDto,
  ): Promise<UrbansolvDashboardResponseDto> {
    return this.dashboardService.getUrbansolvDashboard(query);
  }

  @Get('sccic')
  @Permissions('VIEW_SCCIC_DASHBOARD')
  @ApiOperation({
    summary: 'Get SCCIC Dashboard Analytics Summary',
    description: 'Menampilkan data analitik dashboard SCCIC: KPI Cards (Revenue SPK, Total Deals, Avg Deal Size, Win Rate), Distribusi Kategori, dan Distribusi Status Proyek.',
  })
  @ApiSuccessResponse(SccicDashboardResponseDto)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Missing VIEW_SCCIC_DASHBOARD permission' })
  async getSccicDashboard(
    @Query() query: DashboardQueryDto,
  ): Promise<SccicDashboardResponseDto> {
    return this.dashboardService.getSccicDashboard(query);
  }
}
