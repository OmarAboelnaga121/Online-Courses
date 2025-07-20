import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import prisma from '../../prismaClient';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'defaultSecret'),
    });
  }

  async validate(payload: any) {
    const user = await prisma.user.findFirst({where: {id: payload.sub}});
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { userId: user.id, username: user.username, role: user.role };
  }
} 