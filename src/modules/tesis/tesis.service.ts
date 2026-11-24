import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js'; // ajustá la ruta
import { CreateTesisDto } from './dto/create-tesi.dto.js';
import { UpdateTesisDto } from './dto/update-tesi.dto.js';

@Injectable()
export class TesisService {
  constructor(private prisma: PrismaService) {}

  // Verifica que la tecnicatura exista antes de guardar
  private async verificarTecnicatura(id: number) {
    const tecnicatura = await this.prisma.tecnicaturas.findUnique({
      where: { id },
    });
    if (!tecnicatura) {
      throw new BadRequestException(`La tecnicatura con id ${id} no existe`);
    }
  }

  async create(dto: CreateTesisDto) {
    await this.verificarTecnicatura(dto.tecnicatura_id);

    return this.prisma.tesis.create({
      data: {
        ...dto,
        fecha_publicacion: new Date(dto.fecha_publicacion),
      },
    });
  }

  findAll() {
    return this.prisma.tesis.findMany({
      include: {
        tecnicaturas: { select: { id: true, nombre: true } },
      },
    });
  }

  async findOne(id: number) {
    const tesis = await this.prisma.tesis.findUnique({
      where: { id },
      include: {
        tecnicaturas: { select: { id: true, nombre: true } },
        tesis_galeria: { orderBy: { orden: 'asc' } },
        tesis_participantes: {
          include: {
            users: {
              select: { id: true, nombre: true, apellido: true, foto_url: true },
            },
          },
        },
      },
    });

    if (!tesis) {
      throw new NotFoundException(`No existe la tesis con id ${id}`);
    }
    return tesis;
  }

  async update(id: number, dto: UpdateTesisDto) {
    await this.findOne(id); // si no existe, lanza 404

    if (dto.tecnicatura_id !== undefined) {
      await this.verificarTecnicatura(dto.tecnicatura_id);
    }

    return this.prisma.tesis.update({
      where: { id },
      data: {
        ...dto,
        fecha_publicacion: dto.fecha_publicacion
          ? new Date(dto.fecha_publicacion)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.tesis.delete({ where: { id } });
  }

}