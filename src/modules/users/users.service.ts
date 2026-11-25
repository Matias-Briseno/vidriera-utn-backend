
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import * as bcrypt from "bcrypt";

import { PrismaService } from "../prisma/prisma.service.js";

import type { CreateStudentDto } from "./dto/create-student.dto.js";
import type { UpdateStudentDto } from "./dto/update-student.dto.js";
import type { CreateStaffDto } from "./dto/create-staff.dto.js";
import type { UpdateStaffDto } from "./dto/update-staff.dto.js";
import type { UpdateProfileDto } from "./dto/update-profile.dto.js";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}



  private async validateTechnicatura(tecnicaturaId?: number | null) {
    if (tecnicaturaId === undefined || tecnicaturaId === null) {
      return;
    }

    const tecnicatura = await this.prisma.tecnicaturas.findUnique({
      where: { id: tecnicaturaId },
      select: { id: true },
    });

    if (!tecnicatura) {
      throw new BadRequestException(
        "La tecnicatura indicada no existe.",
      );
    }
  }

  private async validateUniqueFields(
    email?: string,
    nroLegajo?: string,
    excludeUserId?: number,
  ) {
    if (email !== undefined) {
      const existingEmail = await this.prisma.users.findUnique({
        where: { email },
        select: { id: true },
      });

      if (
        existingEmail &&
        existingEmail.id !== excludeUserId
      ) {
        throw new ConflictException(
          "El email ya está registrado.",
        );
      }
    }

    if (nroLegajo !== undefined) {
      const existingLegajo = await this.prisma.users.findUnique({
        where: { nro_legajo: nroLegajo },
        select: { id: true },
      });

      if (
        existingLegajo &&
        existingLegajo.id !== excludeUserId
      ) {
        throw new ConflictException(
          "El número de legajo ya está registrado.",
        );
      }
    }
  }

  private async findUserById(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        "No se encontró el usuario.",
      );
    }

    return user;
  }

  private isPrismaErrorCode(
    error: unknown,
    code: string,
  ): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === code
    );
  }

  // =====================================================
  // PERFIL PROPIO
  // =====================================================

  async findMyProfile(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
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
        tecnicaturas: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        "No se encontró el usuario.",
      );
    }

    return user;
  }

  async updateMyProfile(
    userId: number,
    dto: UpdateProfileDto,
  ) {
    const existingUser = await this.findUserById(userId);

    if (existingUser.rol === "directivo") {
      throw new ForbiddenException(
        "El perfil del Directivo no puede modificarse.",
      );
    }

    await this.validateTechnicatura(dto.tecnicatura_id);

    const data = {
      ...(dto.nombre !== undefined
        ? { nombre: dto.nombre.trim() }
        : {}),

      ...(dto.apellido !== undefined
        ? { apellido: dto.apellido.trim() }
        : {}),

      ...(dto.foto_url !== undefined
        ? { foto_url: dto.foto_url }
        : {}),

      ...(dto.condicion_academica !== undefined
        ? { condicion_academica: dto.condicion_academica }
        : {}),

      ...(dto.tecnicatura_id !== undefined
        ? { tecnicatura_id: dto.tecnicatura_id }
        : {}),
    };

    const user = await this.prisma.users.update({
      where: { id: userId },
      data,
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
        tecnicaturas: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    return {
      message: "Perfil actualizado correctamente.",
      user,
    };
  }

  // =====================================================
  // ADMINISTRACIÓN DE ESTUDIANTES
  // =====================================================

  async findStudents() {
    return this.prisma.users.findMany({
      where: {
        rol: "estudiante",
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
        tecnicaturas: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async findStudentById(userId: number) {
    const user = await this.prisma.users.findFirst({
      where: {
        id: userId,
        rol: "estudiante",
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
        tecnicaturas: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        "No se encontró el estudiante.",
      );
    }

    return user;
  }

  async createStudent(dto: CreateStudentDto) {
    await this.validateUniqueFields(
      dto.email,
      dto.nro_legajo,
    );

    await this.validateTechnicatura(dto.tecnicatura_id);

    const passwordHash = await bcrypt.hash(
      dto.password,
      12,
    );

    const user = await this.prisma.users.create({
      data: {
        nombre: dto.nombre.trim(),
        apellido: dto.apellido.trim(),
        nro_legajo: dto.nro_legajo,
        email: dto.email,
        password_hash: passwordHash,
        tecnicatura_id: dto.tecnicatura_id ?? null,
        condicion_academica:
          dto.condicion_academica ?? null,
        rol: "estudiante",
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
      message: "Estudiante creado correctamente.",
      user,
    };
  }

  async updateStudent(
    userId: number,
    dto: UpdateStudentDto,
  ) {
    await this.findStudentById(userId);

    await this.validateUniqueFields(
      dto.email,
      dto.nro_legajo,
      userId,
    );

    await this.validateTechnicatura(dto.tecnicatura_id);

    const data = {
      ...(dto.nombre !== undefined
        ? { nombre: dto.nombre.trim() }
        : {}),

      ...(dto.apellido !== undefined
        ? { apellido: dto.apellido.trim() }
        : {}),

      ...(dto.nro_legajo !== undefined
        ? { nro_legajo: dto.nro_legajo }
        : {}),

      ...(dto.email !== undefined
        ? { email: dto.email }
        : {}),

      ...(dto.foto_url !== undefined
        ? { foto_url: dto.foto_url }
        : {}),

      ...(dto.condicion_academica !== undefined
        ? { condicion_academica: dto.condicion_academica }
        : {}),

      ...(dto.tecnicatura_id !== undefined
        ? { tecnicatura_id: dto.tecnicatura_id }
        : {}),
    };

    const user = await this.prisma.users.update({
      where: { id: userId },
      data,
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
      message: "Estudiante actualizado correctamente.",
      user,
    };
  }

  async deleteStudent(userId: number) {
    await this.findStudentById(userId);

    try {
      await this.prisma.users.delete({
        where: { id: userId },
      });

      return {
        message: "Estudiante eliminado correctamente.",
      };
    } catch (error) {
      if (this.isPrismaErrorCode(error, "P2003")) {
        throw new BadRequestException(
          "No se puede eliminar el estudiante porque tiene registros relacionados.",
        );
      }

      throw error;
    }
  }

  // =====================================================
  // ADMINISTRACIÓN DE DOCENTES Y BEDELÍA
  // =====================================================

  async findStaff() {
    return this.prisma.users.findMany({
      where: {
        rol: {
          in: ["docente", "bedelia"],
        },
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        foto_url: true,
        nro_legajo: true,
        email: true,
        tecnicatura_id: true,
        rol: true,
        created_at: true,
        tecnicaturas: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async findStaffById(userId: number) {
    const user = await this.prisma.users.findFirst({
      where: {
        id: userId,
        rol: {
          in: ["docente", "bedelia"],
        },
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        foto_url: true,
        nro_legajo: true,
        email: true,
        tecnicatura_id: true,
        rol: true,
        created_at: true,
        tecnicaturas: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        "No se encontró el usuario docente o de Bedelía.",
      );
    }

    return user;
  }

  async createStaff(dto: CreateStaffDto) {
    await this.validateUniqueFields(
      dto.email,
      dto.nro_legajo,
    );

    await this.validateTechnicatura(dto.tecnicatura_id);

    const passwordHash = await bcrypt.hash(
      dto.password,
      12,
    );

    const user = await this.prisma.users.create({
      data: {
        nombre: dto.nombre.trim(),
        apellido: dto.apellido.trim(),
        nro_legajo: dto.nro_legajo,
        email: dto.email,
        password_hash: passwordHash,
        tecnicatura_id: dto.tecnicatura_id ?? null,
        rol: dto.rol,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        foto_url: true,
        nro_legajo: true,
        email: true,
        tecnicatura_id: true,
        rol: true,
        created_at: true,
      },
    });

    return {
      message: "Usuario creado correctamente.",
      user,
    };
  }

  async updateStaff(
    userId: number,
    dto: UpdateStaffDto,
  ) {
    await this.findStaffById(userId);

    await this.validateUniqueFields(
      dto.email,
      dto.nro_legajo,
      userId,
    );

    await this.validateTechnicatura(dto.tecnicatura_id);

    const data = {
      ...(dto.nombre !== undefined
        ? { nombre: dto.nombre.trim() }
        : {}),

      ...(dto.apellido !== undefined
        ? { apellido: dto.apellido.trim() }
        : {}),

      ...(dto.nro_legajo !== undefined
        ? { nro_legajo: dto.nro_legajo }
        : {}),

      ...(dto.email !== undefined
        ? { email: dto.email }
        : {}),

      ...(dto.foto_url !== undefined
        ? { foto_url: dto.foto_url }
        : {}),

      ...(dto.rol !== undefined
        ? { rol: dto.rol }
        : {}),

      ...(dto.tecnicatura_id !== undefined
        ? { tecnicatura_id: dto.tecnicatura_id }
        : {}),
    };

    const user = await this.prisma.users.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        foto_url: true,
        nro_legajo: true,
        email: true,
        tecnicatura_id: true,
        rol: true,
        created_at: true,
      },
    });

    return {
      message: "Usuario actualizado correctamente.",
      user,
    };
  }

  async deleteStaff(userId: number) {
    await this.findStaffById(userId);

    try {
      await this.prisma.users.delete({
        where: { id: userId },
      });

      return {
        message: "Usuario eliminado correctamente.",
      };
    } catch (error) {
      if (this.isPrismaErrorCode(error, "P2003")) {
        throw new BadRequestException(
          "No se puede eliminar el usuario porque tiene registros relacionados.",
        );
      }

      throw error;
    }
  }
  
 // Reestablecer Contraseña 
async resetPassword(
  id: number,
  newPassword: string,
  requesterRole: string,
) {
  // Solamente Directivo y Bedelía pueden realizar esta operación.
  if (!["directivo", "bedelia"].includes(requesterRole)) {
    throw new ForbiddenException(
      "No tenés permisos para cambiar contraseñas.",
    );
  }

  // Buscamos al usuario cuya contraseña queremos cambiar.
  const targetUser = await this.prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      rol: true,
    },
  });

  if (!targetUser) {
    throw new NotFoundException("Usuario no encontrado.");
  }

  // No se permite cambiar la contraseña de un Directivo.
  if (targetUser.rol === "directivo") {
    throw new ForbiddenException(
      "No se puede cambiar la contraseña de un Directivo.",
    );
  }

  // Los únicos destinatarios permitidos son estos tres roles.
  const allowedTargetRoles = [
    "estudiante",
    "docente",
    "bedelia",
  ];

  if (!allowedTargetRoles.includes(targetUser.rol)) {
    throw new ForbiddenException(
      "No tenés permisos para modificar la contraseña de este usuario.",
    );
  }

  // Generamos el hash de la nueva contraseña.
  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Actualizamos la contraseña en PostgreSQL.
  await this.prisma.users.update({
    where: { id },
    data: {
      password_hash: passwordHash,
    },
  });

  return {
    message: "Contraseña restablecida correctamente.",
  };
}

}

