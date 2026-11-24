import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { estado_tesis } from '../../../generated/prisma/client.js';

const opcionesUrl = {
  protocols: ['http', 'https'],
  require_protocol: true,
};

const mensajeUrl = (campo: string) =>
  `${campo} debe ser una URL válida que empiece con http:// o https://`;

export class CreateTesisDto {
  @IsInt({ message: 'La tecnicatura debe ser un número entero' })
  @IsNotEmpty({ message: 'La tecnicatura es obligatoria' })
  tecnicatura_id: number;

  @MaxLength(255, { message: 'El título no puede superar los 255 caracteres' })
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @MaxLength(120, { message: 'El tema no puede superar los 120 caracteres' })
  @IsString({ message: 'El tema debe ser un texto' })
  @IsNotEmpty({ message: 'El tema es obligatorio' })
  tema: string;

  @IsString({ message: 'El resumen debe ser un texto' })
  @IsNotEmpty({ message: 'El resumen es obligatorio' })
  resumen: string;

  @IsOptional()
  @IsEnum(estado_tesis, {
    message: `El estado debe ser uno de los siguientes valores: ${Object.values(estado_tesis).join(', ')}`,
  })
  estado?: estado_tesis;

  @IsDateString(
    {},
    { message: 'La fecha de publicación debe tener formato AAAA-MM-DD (por ejemplo, 2025-06-15)' },
  )
  @IsNotEmpty({ message: 'La fecha de publicación es obligatoria' })
  fecha_publicacion: string;

  @IsUrl(opcionesUrl, { message: mensajeUrl('La miniatura') })
  @IsNotEmpty({ message: 'La miniatura es obligatoria' })
  miniatura_url: string;

  @IsUrl(opcionesUrl, { message: mensajeUrl('La imagen principal') })
  @IsNotEmpty({ message: 'La imagen principal es obligatoria' })
  imagen_principal_url: string;

  @IsOptional()
  @IsUrl(opcionesUrl, { message: mensajeUrl('El enlace al PDF') })
  url_pdf?: string;

  @IsOptional()
  @IsUrl(opcionesUrl, { message: mensajeUrl('El enlace al video') })
  url_video?: string;

  @IsOptional()
  @IsUrl(opcionesUrl, { message: mensajeUrl('El enlace a GitHub') })
  url_github?: string;

  @IsOptional()
  @IsUrl(opcionesUrl, { message: mensajeUrl('El enlace a YouTube') })
  url_youtube?: string;
}