import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
} from '@nestjs/common';
import { TesisService } from './tesis.service.js';
import { CreateTesisDto } from './dto/create-tesi.dto.js';
import { UpdateTesisDto } from './dto/update-tesi.dto.js';

@Controller('tesis')
export class TesisController {
  constructor(private readonly tesisService: TesisService) {}

  @Post()
  create(@Body() dto: CreateTesisDto) {
    return this.tesisService.create(dto);
  }

  @Get()
  findAll() {
    return this.tesisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tesisService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTesisDto) {
    return this.tesisService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tesisService.remove(id);
  }
}
