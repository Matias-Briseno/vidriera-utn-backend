import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PrismaService } from "../../prisma/prisma.service.js";
import { JwtPayload } from "../interfaces/jwt-payload.interface.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.users.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        foto_url: true,
        nro_legajo: true,
        email: true,
        tecnicatura_id: true,
        condicion_academica: true,
        rol: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("El usuario ya no existe.");
    }

    return user;
  }
}