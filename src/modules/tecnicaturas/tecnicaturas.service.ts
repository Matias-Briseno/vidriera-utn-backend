import { Injectable } from '@nestjs/common';
import { CreateTecnicaturaDto } from './dto/create-tecnicatura.dto.js';
import { UpdateTecnicaturaDto } from './dto/update-tecnicatura.dto.js';

@Injectable()
export class TecnicaturasService {
  create(createTecnicaturaDto: CreateTecnicaturaDto) {
    return 'This action adds a new tecnicatura';
  }

  findAll() {
    return `This action returns all tecnicaturas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tecnicatura`;
  }

  update(id: number, updateTecnicaturaDto: UpdateTecnicaturaDto) {
    return `This action updates a #${id} tecnicatura`;
  }

  remove(id: number) {
    return `This action removes a #${id} tecnicatura`;
  }
}
