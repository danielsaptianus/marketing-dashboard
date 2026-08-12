import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../auth.service';
import { LoginDto } from '../../core/dto/login.dto';
import { ForgotPasswordDto } from '../../core/dto/forgot-password.dto';
import { ResetPasswordDto } from '../../core/dto/reset-password.dto';
import {
  AuthTokensDto,
  MessageResponseDto,
} from '../../core/dto/auth-response.dto';
import { Public } from '@common/decorators/public.decorator';
import { ApiSuccessResponse } from '@common/decorators/api-response.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ============================================
  // 1. FORGOT PASSWORD
  // ============================================
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request Password Reset',
    description: 'Request password reset link via email. A reset token will be sent to the provided email address.',
  })
  @ApiSuccessResponse(MessageResponseDto)
  @ApiResponse({ status: 200, description: 'Password reset email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid email format or validation failed.' })
  @ApiResponse({ status: 404, description: 'Email not found in the system.' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  // ============================================
  // 2. LOGIN
  // ============================================
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticates a user with email and password. Upon successful authentication, access token and refresh token are returned in the response and stored as HTTP-only cookies for enhanced security.',
  })
  @ApiSuccessResponse(AuthTokensDto)
  @ApiResponse({ status: 200, description: 'Login successful. Access token and refresh token are returned and set as HTTP-only cookies.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data or validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid email or password.' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokensDto> {
    const tokens = await this.authService.login(loginDto);

    if (tokens.access_token) {
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
      };

      // Set access token cookies
      res.cookie('access_token', tokens.access_token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.cookie('Authentication', tokens.access_token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      if (tokens.refresh_token) {
        res.cookie('refresh_token', tokens.refresh_token, {
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
      }
    }

    return tokens;
  }

  // ============================================
  // 3. LOGOUT
  // ============================================
  @Get('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Logout',
    description: 'Logs out the currently authenticated user by invalidating the access token on the auth service and clearing all authentication cookies from the client.',
  })
  @ApiSuccessResponse(MessageResponseDto)
  @ApiResponse({ status: 200, description: 'Logout successful. All authentication cookies have been cleared.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. No active session found or access token cookie is missing.' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResponseDto> {
    const token =
      req.cookies?.access_token ||
      req.cookies?.Authentication ||
      req.headers.authorization?.replace('Bearer ', '');

    const clearOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      expires: new Date(0),
    };

    res.cookie('access_token', '', clearOptions);
    res.cookie('Authentication', '', clearOptions);
    res.cookie('refresh_token', '', clearOptions);

    return this.authService.logout(token);
  }

  // ============================================
  // 4. REFRESH TOKEN
  // ============================================
  @Public()
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh Access Token',
    description: 'Generates a new access token and refresh token using the existing refresh token from cookies. This endpoint should be called when the access token expires to maintain the user session without requiring re-authentication.',
  })
  @ApiSuccessResponse(AuthTokensDto)
  @ApiResponse({ status: 200, description: 'Token refresh successful. New access token and refresh token are returned and updated in cookies.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Refresh token not found, invalid, or expired.' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokensDto> {
    const refreshToken =
      req.cookies?.refresh_token ||
      req.headers['x-refresh-token'] ||
      req.headers.authorization?.replace('Bearer ', '');

    const tokens = await this.authService.refresh(String(refreshToken));

    if (tokens.access_token) {
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
      };

      res.cookie('access_token', tokens.access_token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie('Authentication', tokens.access_token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      if (tokens.refresh_token) {
        res.cookie('refresh_token', tokens.refresh_token, {
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
      }
    }

    return tokens;
  }

  // ============================================
  // 5. RESET PASSWORD
  // ============================================
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset Password',
    description: 'Reset password using token from email. The token must be valid and not expired.',
  })
  @ApiSuccessResponse(MessageResponseDto)
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  @ApiResponse({ status: 422, description: 'Validation failed. Invalid token or password format.' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
