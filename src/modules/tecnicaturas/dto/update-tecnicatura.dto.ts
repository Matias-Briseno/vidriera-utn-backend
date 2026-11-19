import { PartialType } from '@nestjs/mapped-types';
import { CreateTecnicaturaDto } from './create-tecnicatura.dto.js';

export class UpdateTecnicaturaDto extends PartialType(CreateTecnicaturaDto) {}
