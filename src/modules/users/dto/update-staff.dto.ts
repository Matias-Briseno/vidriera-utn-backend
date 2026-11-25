import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateStaffDto {
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
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El número de legajo debe ser un texto.' })
  @MinLength(1, { message: 'El número de legajo debe tener al menos 1 carácter.' })
  @MaxLength(30, { message: 'El número de legajo no puede superar los 30 caracteres.' })
  nro_legajo?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
  @MaxLength(150, { message: 'El correo electrónico no puede superar los 150 caracteres.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'La URL de la foto debe ser un texto.' })
  foto_url?: string | null;

  @IsOptional()
  @IsIn(['docente', 'bedelia'], {
    message: 'El rol debe ser "docente" o "bedelia".',
  })
  rol?: 'docente' | 'bedelia';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El ID de la tecnicatura debe ser un número entero.' })
  @Min(1, { message: 'El ID de la tecnicatura debe ser mayor o igual a 1.' })
  tecnicatura_id?: number | null;
}
