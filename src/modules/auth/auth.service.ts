import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { LoginDto } from './core/dto/login.dto';
import { ForgotPasswordDto } from './core/dto/forgot-password.dto';
import { ResetPasswordDto } from './core/dto/reset-password.dto';
import { AuthTokensDto, MessageResponseDto } from './core/dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private configService: ConfigService) {}

  private getAuthServiceUrl(): string {
    return (
      this.configService.get<string>('AUTH_SERVICE_URL') ||
      process.env.AUTH_SERVICE_URL ||
      'https://auth-service.urbansolv.co.id'
    );
  }

  private getAppName(): string {
    return (
      this.configService.get<string>('APP_NAME') ||
      process.env.APP_NAME ||
      'marketing-dashboard'
    );
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
  // 1. LOGIN
  // ============================================
  async login(loginDto: LoginDto): Promise<AuthTokensDto> {
    const authServiceUrl = this.getAuthServiceUrl();
    const appName = this.getAppName();

    try {
      this.logger.log(`Attempting login for ${loginDto.email} via ${authServiceUrl} (app_key: ${appName})`);
      const response = await axios.post(
        `${authServiceUrl}/api/v1/auth/login`,
        {
          email: loginDto.email,
          password: loginDto.password,
          app_key: appName,
        },
        { headers: this.getHeaders() },
      );

      const rawData = response.data?.data || response.data;
      const accessToken =
        rawData?.access_token || rawData?.accessToken || rawData?.token;
      const refreshToken =
        rawData?.refresh_token || rawData?.refreshToken;

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      this.handleAxiosError(error, 'Login failed');
    }
  }

  // ============================================
  // 2. LOGOUT
  // ============================================
  async logout(token?: string): Promise<MessageResponseDto> {
    const authServiceUrl = this.getAuthServiceUrl();
    try {
      if (token) {
        await axios.get(`${authServiceUrl}/api/v1/auth/logout`, {
          headers: this.getHeaders(token),
        }).catch((err) => {
          this.logger.warn(`Auth service logout warning: ${err.message}`);
        });
      }
      return { message: 'Logout successful' };
    } catch (error) {
      // Even if remote fails, we return success so local cookies are cleared
      return { message: 'Logout successful' };
    }
  }

  // ============================================
  // 3. REFRESH TOKEN
  // ============================================
  async refresh(refreshToken: string): Promise<AuthTokensDto> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token tidak ditemukan');
    }

    const authServiceUrl = this.getAuthServiceUrl();
    const appName = this.getAppName();

    try {
      const response = await axios.get(`${authServiceUrl}/api/v1/auth/refresh`, {
        headers: this.getHeaders(refreshToken),
        params: { app_key: appName },
      });

      const rawData = response.data?.data || response.data;
      const accessToken =
        rawData?.access_token || rawData?.accessToken || rawData?.token;
      const newRefreshToken =
        rawData?.refresh_token || rawData?.refreshToken || refreshToken;

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      this.handleAxiosError(error, 'Failed to refresh token');
    }
  }

  // ============================================
  // 4. FORGOT PASSWORD
  // ============================================
  async forgotPassword(dto: ForgotPasswordDto): Promise<MessageResponseDto> {
    const authServiceUrl = this.getAuthServiceUrl();
    const appName = this.getAppName();

    try {
      this.logger.log(`Requesting password reset for ${dto.email}`);
      const response = await axios.post(
        `${authServiceUrl}/api/v1/auth/forgot-password`,
        {
          email: dto.email,
          app_key: appName,
        },
        { headers: this.getHeaders() },
      );

      const message =
        response.data?.message ||
        response.data?.data?.message ||
        'Password reset email sent successfully';
      return { message };
    } catch (error) {
      this.handleAxiosError(error, 'Failed to send password reset email');
    }
  }

  // ============================================
  // 5. RESET PASSWORD
  // ============================================
  async resetPassword(dto: ResetPasswordDto): Promise<MessageResponseDto> {
    const authServiceUrl = this.getAuthServiceUrl();
    const appName = this.getAppName();

    try {
      this.logger.log('Submitting reset password request');
      const response = await axios.post(
        `${authServiceUrl}/api/v1/auth/reset-password`,
        {
          token: dto.token,
          new_password: dto.new_password,
          app_key: appName,
        },
        { headers: this.getHeaders() },
      );

      const message =
        response.data?.message ||
        response.data?.data?.message ||
        'Password reset successful';
      return { message };
    } catch (error) {
      this.handleAxiosError(error, 'Failed to reset password');
    }
  }

  // ============================================
  // ERROR HANDLER HELPER
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
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
