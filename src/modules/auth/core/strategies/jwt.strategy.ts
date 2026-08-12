import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const key =
      configService.get<string>('jwt.publicKey') ||
      configService.get<string>('jwt.secret') ||
      'default-secret';

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return (
            request?.cookies?.access_token ||
            request?.cookies?.Authentication ||
            null
          );
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: key,
      algorithms: ['ES256', 'RS256', 'HS256'],
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    if (!payload) {
      throw new UnauthorizedException('Token payload tidak valid');
    }

    const rawUserId = payload.userId ?? payload.id ?? payload.sub;
    const userId =
      typeof rawUserId === 'string' && !isNaN(Number(rawUserId))
        ? Number(rawUserId)
        : rawUserId;
    const email = payload.email || '';
    const role =
      payload.role ||
      payload.positionName ||
      payload.position?.name ||
      payload.roles?.[0] ||
      'Member';
    const permissions = Array.isArray(payload.permissions)
      ? payload.permissions
      : [];

    return {
      userId,
      email,
      role,
      permissions,
      name:
        payload.name ||
        `${payload.firstName || payload.first_name || ''} ${payload.lastName || payload.last_name || ''}`.trim() ||
        undefined,
    };
  }
}
