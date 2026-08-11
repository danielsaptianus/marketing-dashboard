import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../auth.service';
import { LoginDto } from '../../core/dto/login.dto';
import { AuthResponseDto, AuthUserDto } from '../../core/dto/auth-response.dto';
import { Public } from '@common/decorators/public.decorator';
import { GetUser } from '@common/decorators/get-user.decorator';
import { ApiSuccessResponse } from '@common/decorators/api-response.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { JwtPayload } from '../../core/interfaces/jwt-payload.interface';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login via Central Auth Service' })
  @ApiSuccessResponse(AuthUserDto)
  @ApiResponse({ status: 401, description: 'Invalid credentials or inactive account' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthUserDto> {
    const authResponse = await this.authService.login(loginDto);
    const token = authResponse?.access_token;

    if (token) {
      res.cookie('Authentication', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
    return authResponse.user;
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged-in user profile & permissions' })
  @ApiSuccessResponse(AuthUserDto)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@GetUser() user: JwtPayload): Promise<AuthUserDto> {
    return this.authService.getMe(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('Authentication', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
    });
    return { message: 'Logout successful' };
  }
}


