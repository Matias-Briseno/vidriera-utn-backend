import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../prisma/prisma.service.js";
import { Prisma } from "../../generated/prisma/client.js";

import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (Buffer.byteLength(dto.password, "utf8") > 72) {
      throw new BadRequestException(
        "La contraseña supera el máximo permitido por bcrypt."
      );
    }

    const email = dto.email.trim().toLowerCase();
    const nroLegajo = dto.nro_legajo.trim();

    if (dto.tecnicatura_id !== undefined) {
      const tecnicatura = await this.prisma.tecnicaturas.findUnique({
        where: { id: dto.tecnicatura_id },
        select: { id: true },
      });

      if (!tecnicatura) {
        throw new BadRequestException("La tecnicatura indicada no existe.");
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      const user = await this.prisma.users.create({
        data: {
          nombre: dto.nombre.trim(),
          apellido: dto.apellido.trim(),
          nro_legajo: nroLegajo,
          email,
          password_hash: passwordHash,

          ...(dto.foto_url !== undefined
            ? { foto_url: dto.foto_url }
            : {}),

          ...(dto.condicion_academica !== undefined
            ? { condicion_academica: dto.condicion_academica }
            : {}),

          ...(dto.tecnicatura_id !== undefined
            ? {
                tecnicaturas: {
                  connect: { id: dto.tecnicatura_id },
                },
              }
            : {}),
        },
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

      return {
        message: "Usuario registrado correctamente.",
        user,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          "El email o el número de legajo ya está registrado."
        );
      }

      throw error;
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user || !user.password_hash) {
      throw new UnauthorizedException("Credenciales inválidas.");
    }

    const passwordCorrecta = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!passwordCorrecta) {
      throw new UnauthorizedException("Credenciales inválidas.");
    }

    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const { password_hash: _passwordHash, ...safeUser } = user;

    return {
      access_token: accessToken,
      token_type: "Bearer",
      user: safeUser,
    };
  }
}