
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";

import { CreateTecnicaturaDto } from "./dto/create-tecnicatura.dto.js";
import { UpdateTecnicaturaDto } from "./dto/update-tecnicatura.dto.js";

@Injectable()
export class TecnicaturasService {
  constructor(private readonly prisma: PrismaService) {}

  // CREAR TECNICATURA
  async create(dto: CreateTecnicaturaDto) {
    try {
      const tecnicatura = await this.prisma.tecnicaturas.create({
        data: {
          nombre: dto.nombre.trim(),
          descripcion: dto.descripcion.trim(),
          imagen_url: dto.imagen_url.trim(),
        },
      });

      return {
        message: "Tecnicatura creada correctamente.",
        tecnicatura,
      };
    } catch (error) {
      if (this.isPrismaError(error, "P2002")) {
        throw new ConflictException(
          "Ya existe una tecnicatura con ese nombre.",
        );
      }

      throw error;
    }
  }

  // LISTAR TODAS LAS TECNICATURAS
  async findAll() {
    return this.prisma.tecnicaturas.findMany({
      include: {
        _count: {
          select: {
            tesis: true,
            users: true,
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
    });
  }

  // BUSCAR UNA TECNICATURA POR ID
  async findOne(id: number) {
    const tecnicatura = await this.prisma.tecnicaturas.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tesis: true,
            users: true,
          },
        },
      },
    });

    if (!tecnicatura) {
      throw new NotFoundException(
        "No se encontró la tecnicatura.",
      );
    }

    return tecnicatura;
  }

  // ACTUALIZAR TECNICATURA
  async update(id: number, dto: UpdateTecnicaturaDto) {
    await this.findOne(id);

    try {
      const tecnicatura = await this.prisma.tecnicaturas.update({
        where: { id },
        data: {
          ...(dto.nombre !== undefined
            ? { nombre: dto.nombre.trim() }
            : {}),

          ...(dto.descripcion !== undefined
            ? { descripcion: dto.descripcion.trim() }
            : {}),

          ...(dto.imagen_url !== undefined
            ? { imagen_url: dto.imagen_url.trim() }
            : {}),
        },
      });

      return {
        message: "Tecnicatura actualizada correctamente.",
        tecnicatura,
      };
    } catch (error) {
      if (this.isPrismaError(error, "P2002")) {
        throw new ConflictException(
          "Ya existe una tecnicatura con ese nombre.",
        );
      }

      throw error;
    }
  }

  // ELIMINAR TECNICATURA
  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.prisma.tecnicaturas.delete({
        where: { id },
      });

      return {
        message: "Tecnicatura eliminada correctamente.",
      };
    } catch (error) {
      if (this.isPrismaError(error, "P2003")) {
        throw new BadRequestException(
          "No se puede eliminar la tecnicatura porque tiene usuarios o tesis asociados.",
        );
      }

      throw error;
    }
  }

  // VERIFICAR ERRORES DE PRISMA
  private isPrismaError(error: unknown, code: string): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === code
    );
  }
}
