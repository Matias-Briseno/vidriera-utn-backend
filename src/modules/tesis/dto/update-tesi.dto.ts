import { PartialType } from '@nestjs/mapped-types';
import { CreateTesisDto } from './create-tesi.dto.js';

export class UpdateTesisDto extends PartialType(CreateTesisDto) {}