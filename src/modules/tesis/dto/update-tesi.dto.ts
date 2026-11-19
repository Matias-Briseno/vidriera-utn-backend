import { PartialType } from '@nestjs/mapped-types';
import { CreateTesiDto } from './create-tesi.dto.js';

export class UpdateTesiDto extends PartialType(CreateTesiDto) {}
