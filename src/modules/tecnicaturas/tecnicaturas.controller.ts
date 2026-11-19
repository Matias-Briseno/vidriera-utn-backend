import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TecnicaturasService } from './tecnicaturas.service.js';
import { CreateTecnicaturaDto } from './dto/create-tecnicatura.dto.js';
import { UpdateTecnicaturaDto } from './dto/update-tecnicatura.dto.js';

@Controller('tecnicaturas')
export class TecnicaturasController {
  constructor(private readonly tecnicaturasService: TecnicaturasService) {}

  @Post()
  create(@Body() createTecnicaturaDto: CreateTecnicaturaDto) {
    return this.tecnicaturasService.create(createTecnicaturaDto);
  }

  @Get()
  findAll() {
    return this.tecnicaturasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tecnicaturasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTecnicaturaDto: UpdateTecnicaturaDto) {
    return this.tecnicaturasService.update(+id, updateTecnicaturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tecnicaturasService.remove(+id);
  }
}
