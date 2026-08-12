import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProfileService } from '../../profile.service';
import { EmployeeProfileResponseDto } from '../../core/dto/employee-profile.dto';
import { AttendanceResponseDto } from '../../core/dto/attendance.dto';
import {
  SubmitLeaveRequestDto,
  LeaveResponseDto,
} from '../../core/dto/employee-leave.dto';
import {
  ApiSuccessResponse,
  ApiSuccessArrayResponse,
} from '@common/decorators/api-response.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { GetUser } from '@common/decorators/get-user.decorator';
import { JwtPayload } from '@modules/auth/core/interfaces/jwt-payload.interface';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'profile', version: '1' })
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ============================================
  // 1. GET MY EMPLOYEE PROFILE
  // ============================================
  @Get('employee/me')
  @ApiOperation({
    summary: 'Get My Employee Profile',
    description: 'Mengambil data detail employee dari user yang sedang login dari HR Service eksternal.',
  })
  @ApiSuccessResponse(EmployeeProfileResponseDto)
  @ApiResponse({ status: 200, description: 'Data employee berhasil diambil.' })
  @ApiResponse({ status: 401, description: 'Belum login atau session sudah expired.' })
  @ApiResponse({ status: 404, description: 'Employee tidak ditemukan.' })
  async getMyEmployeeProfile(
    @GetUser() user: JwtPayload,
    @Req() req: Request,
  ): Promise<EmployeeProfileResponseDto> {
    const token = this.extractToken(req);
    return this.profileService.getMyEmployeeProfile(user, token);
  }

  // ============================================
  // 2. GET ATTENDANCE RECORDS
  // ============================================
  @Get('attendance')
  @ApiOperation({
    summary: 'Get My Attendance',
    description: 'Mengambil semua data kehadiran employee yang sedang login dari HR Service eksternal.',
  })
  @ApiSuccessArrayResponse(AttendanceResponseDto)
  @ApiResponse({ status: 200, description: 'Data kehadiran berhasil diambil.' })
  async getMyAttendance(
    @GetUser() user: JwtPayload,
    @Req() req: Request,
  ): Promise<AttendanceResponseDto[]> {
    const token = this.extractToken(req);
    return this.profileService.getMyAttendance(user, token);
  }

  // ============================================
  // 3. GET ALL EMPLOYEE LEAVES
  // ============================================
  @Get('employee-leave')
  @ApiOperation({
    summary: 'Get All Employee Leaves',
    description: 'Mengambil semua data permohonan cuti employee dari HR Service eksternal.',
  })
  @ApiSuccessArrayResponse(LeaveResponseDto)
  @ApiResponse({ status: 200, description: 'Daftar cuti berhasil diambil.' })
  async getMyEmployeeLeaves(
    @GetUser() user: JwtPayload,
    @Req() req: Request,
  ): Promise<LeaveResponseDto[]> {
    const token = this.extractToken(req);
    return this.profileService.getMyEmployeeLeaves(user, token);
  }

  // ============================================
  // 4. SUBMIT EMPLOYEE LEAVE REQUEST
  // ============================================
  @Post('employee-leave')
  @ApiOperation({
    summary: 'Submit Employee Leave Request',
    description: 'Membuat permohonan cuti baru untuk employee dan meneruskannya ke HR Service eksternal.',
  })
  @ApiSuccessResponse(LeaveResponseDto)
  @ApiResponse({ status: 201, description: 'Permohonan cuti berhasil dibuat.' })
  @ApiResponse({ status: 400, description: 'Validasi gagal atau data tidak lengkap.' })
  async submitLeaveRequest(
    @Body() dto: SubmitLeaveRequestDto,
    @GetUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    const token = this.extractToken(req);
    return this.profileService.submitLeaveRequest(dto, user, token);
  }

  // ============================================
  // 5. GET EMPLOYEE LEAVE BY ID
  // ============================================
  @Get('employee-leave/:id')
  @ApiOperation({
    summary: 'Get Employee Leave by ID',
    description: 'Mengambil data permohonan cuti berdasarkan ID dari HR Service eksternal.',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID dari permohonan cuti' })
  @ApiSuccessResponse(LeaveResponseDto)
  @ApiResponse({ status: 200, description: 'Data cuti berhasil diambil.' })
  @ApiResponse({ status: 404, description: 'Data cuti tidak ditemukan.' })
  async getLeaveDetailById(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    const token = this.extractToken(req);
    return this.profileService.getLeaveDetailById(id, user, token);
  }

  private extractToken(req: Request): string | undefined {
    return (
      req.cookies?.access_token ||
      req.cookies?.Authentication ||
      req.headers.authorization?.replace('Bearer ', '')
    );
  }
}
