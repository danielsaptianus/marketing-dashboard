import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { LoginDto } from './core/dto/login.dto';
import { AuthResponseDto, AuthUserDto } from './core/dto/auth-response.dto';
import { JwtPayload } from './core/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private configService: ConfigService) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') ||
      process.env.AUTH_SERVICE_URL ||
      'https://auth-service.urbansolv.co.id';
    const appName =
      this.configService.get<string>('APP_NAME') ||
      process.env.APP_NAME ||
      'marketing-dashboard';

    const email = loginDto.email;
    const password = loginDto.password;

    const xApiKey =
      this.configService.get<string>('X_API_KEY') ||
      process.env.X_API_KEY;

    try {
      this.logger.log(`Attempting login for ${email} via ${authServiceUrl} (app_key: ${appName})`);
      const response = await axios.post(
        `${authServiceUrl}/api/v1/auth/login`,
        {
          email,
          password,
          app_key: appName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(xApiKey ? { 'x-api-key': xApiKey } : {}),
          },
        },
      );

      const rawData = response.data?.data || response.data;
      const token =
        rawData?.access_token ||
        rawData?.token ||
        rawData?.accessToken;

      const rawUser = rawData?.user || rawData;

      const formattedUser: AuthUserDto = {
        id: rawUser?.id || rawUser?.userId || 1,
        name:
          rawUser?.name ||
          `${rawUser?.firstName || rawUser?.first_name || ''} ${rawUser?.lastName || rawUser?.last_name || ''}`.trim() ||
          email,
        email: rawUser?.email || email,
        role:
          rawUser?.role ||
          rawUser?.positionName ||
          rawUser?.position?.name ||
          rawUser?.roles?.[0] ||
          'Member',
        permissions: Array.isArray(rawUser?.permissions)
          ? rawUser.permissions
          : [],
        avatar: rawUser?.avatar || null,
        phone: rawUser?.phone || null,
      };

      return {
        access_token: token,
        user: formattedUser,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        const status =
          axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          'Failed to login';
        this.logger.error(`Login failed: ${message}`, { status });
        throw new HttpException(message, status);
      }
      this.logger.error('Internal server error during login', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMe(user: JwtPayload): Promise<AuthUserDto> {
    return {
      id: user.userId,
      name: user.name || user.email,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
    };
  }
}



