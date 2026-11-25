import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El nombre debe ser un texto.' })
  @MinLength(1, { message: 'El nombre debe tener al menos 1 carácter.' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres.' })
  nombre?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El apellido debe ser un texto.' })
  @MinLength(1, { message: 'El apellido debe tener al menos 1 carácter.' })
  @MaxLength(100, { message: 'El apellido no puede superar los 100 caracteres.' })
  apellido?: string;

  @IsOptional()
  @IsString({ message: 'La URL de la foto debe ser un texto.' })
  foto_url?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El ID de la tecnicatura debe ser un número entero.' })
  @Min(1, { message: 'El ID de la tecnicatura debe ser mayor o igual a 1.' })
  tecnicatura_id?: number | null;

  @IsOptional()
  @IsIn(['alumno', 'egresado'], {
    message: 'La condición académica debe ser "alumno" o "egresado".',
  })
  condicion_academica?: 'alumno' | 'egresado' | null;
}