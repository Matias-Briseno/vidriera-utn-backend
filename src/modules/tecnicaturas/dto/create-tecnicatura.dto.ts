
import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateTecnicaturaDto {
  @IsString()
  @IsNotEmpty({ message: "El nombre es obligatorio." })
  @MaxLength(150)
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: "La descripción es obligatoria." })
  descripcion: string;

  @IsString()
  @IsNotEmpty({ message: "La imagen es obligatoria." })
  imagen_url: string;
}

