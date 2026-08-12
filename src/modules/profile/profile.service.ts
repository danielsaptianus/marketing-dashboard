import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { JwtPayload } from '@modules/auth/core/interfaces/jwt-payload.interface';
import { SubmitLeaveRequestDto } from './core/dto/employee-leave.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private configService: ConfigService) {}

  private getHrServiceUrl(): string {
    const url =
      this.configService.get<string>('HR_SERVICE_URL') ||
      process.env.HR_SERVICE_URL ||
      'https://hr-service.urbansolv.co.id/api/v1/external';
    return url.replace(/\/+$/, '');
  }

  private getHeaders(token?: string) {
    const xApiKey =
      this.configService.get<string>('X_API_KEY') || process.env.X_API_KEY;

    return {
      'Content-Type': 'application/json',
      ...(xApiKey ? { 'x-api-key': xApiKey } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // ============================================
  // 1. GET MY EMPLOYEE PROFILE (FROM HR SERVICE)
  // ============================================
  async getMyEmployeeProfile(user: JwtPayload, token?: string) {
    const hrServiceUrl = this.getHrServiceUrl();

    try {
      this.logger.log(`Fetching employee profile for user ${user.email} from ${hrServiceUrl}`);
      
      // Try HR profile endpoint
      const response = await axios.get(`${hrServiceUrl}/profile/employee/me`, {
        headers: this.getHeaders(token),
        params: { email: user.email, user_id: user.userId },
      }).catch(async () => {
        // Fallback to employee/me or employee/{id}
        return axios.get(`${hrServiceUrl}/employee/me`, {
          headers: this.getHeaders(token),
          params: { email: user.email },
        });
      });

      return response.data?.data || response.data;
    } catch (error: any) {
      this.logger.warn(`Failed to fetch from HR Service, fallback to JWT claims: ${error?.message}`);
      // Graceful fallback to user token payload claims
      return {
        id: user.userId,
        fullname: user.name || user.email.split('@')[0],
        email: user.email,
        department: 'Marketing',
        position: user.role,
      };
    }
  }

  // ============================================
  // 2. GET ATTENDANCE RECORDS
  // ============================================
  async getMyAttendance(user: JwtPayload, token?: string) {
    const hrServiceUrl = this.getHrServiceUrl();

    try {
      const response = await axios.get(`${hrServiceUrl}/profile/attendance`, {
        headers: this.getHeaders(token),
        params: { email: user.email, employee_id: user.userId },
      }).catch(async () => {
        return axios.get(`${hrServiceUrl}/attendance/me`, {
          headers: this.getHeaders(token),
        });
      });

      return response.data?.data || response.data || [];
    } catch (error) {
      this.handleAxiosError(error, 'Gagal mengambil data kehadiran dari HR Service');
    }
  }

  // ============================================
  // 3. GET EMPLOYEE LEAVES
  // ============================================
  async getMyEmployeeLeaves(user: JwtPayload, token?: string) {
    const hrServiceUrl = this.getHrServiceUrl();

    try {
      const response = await axios.get(`${hrServiceUrl}/profile/employee-leave`, {
        headers: this.getHeaders(token),
        params: { email: user.email, employee_id: user.userId },
      }).catch(async () => {
        return axios.get(`${hrServiceUrl}/employee-leave`, {
          headers: this.getHeaders(token),
        });
      });

      return response.data?.data || response.data || [];
    } catch (error) {
      this.handleAxiosError(error, 'Gagal mengambil data cuti dari HR Service');
    }
  }

  // ============================================
  // 4. SUBMIT LEAVE REQUEST
  // ============================================
  async submitLeaveRequest(dto: SubmitLeaveRequestDto, user: JwtPayload, token?: string) {
    const hrServiceUrl = this.getHrServiceUrl();

    try {
      const employeeId = dto.employee_id || (typeof user.userId === 'number' ? user.userId : 1);
      const payload = {
        ...dto,
        employee_id: employeeId,
      };

      const response = await axios.post(`${hrServiceUrl}/profile/employee-leave`, payload, {
        headers: this.getHeaders(token),
      }).catch(async () => {
        return axios.post(`${hrServiceUrl}/employee-leave`, payload, {
          headers: this.getHeaders(token),
        });
      });

      return response.data?.data || response.data;
    } catch (error) {
      this.handleAxiosError(error, 'Gagal mengajukan permohonan cuti ke HR Service');
    }
  }

  // ============================================
  // 5. GET LEAVE DETAIL BY ID
  // ============================================
  async getLeaveDetailById(id: string | number, user: JwtPayload, token?: string) {
    const hrServiceUrl = this.getHrServiceUrl();

    try {
      const response = await axios.get(`${hrServiceUrl}/profile/employee-leave/${id}`, {
        headers: this.getHeaders(token),
      }).catch(async () => {
        return axios.get(`${hrServiceUrl}/employee-leave/${id}`, {
          headers: this.getHeaders(token),
        });
      });

      return response.data?.data || response.data;
    } catch (error) {
      this.handleAxiosError(error, `Gagal mengambil detail cuti ID ${id}`);
    }
  }

  // ============================================
  // HELPER ERROR HANDLER
  // ============================================
  private handleAxiosError(error: any, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      const status =
        axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        defaultMessage;
      this.logger.error(`${defaultMessage}: ${message}`, { status });
      throw new HttpException(message, status);
    }
    this.logger.error(`Internal error: ${defaultMessage}`, error);
    throw new HttpException(
      defaultMessage,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
