import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MinLength(1, { message: 'El nombre debe tener al menos 1 carácter.' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres.' })
  nombre: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El apellido debe ser un texto.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @MinLength(1, { message: 'El apellido debe tener al menos 1 carácter.' })
  @MaxLength(100, { message: 'El apellido no puede superar los 100 caracteres.' })
  apellido: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El número de legajo debe ser un texto.' })
  @IsNotEmpty({ message: 'El número de legajo es obligatorio.' })
  @MinLength(1, { message: 'El número de legajo debe tener al menos 1 carácter.' })
  @MaxLength(30, { message: 'El número de legajo no puede superar los 30 caracteres.' })
  nro_legajo: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @MaxLength(150, { message: 'El correo electrónico no puede superar los 150 caracteres.' })
  email: string;

  @IsString({ message: 'La contraseña debe ser un texto.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(72, { message: 'La contraseña no puede superar los 72 caracteres.' })
  password: string;

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
