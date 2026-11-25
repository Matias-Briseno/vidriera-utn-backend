
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";

import { TecnicaturasService } from "./tecnicaturas.service.js";

import { CreateTecnicaturaDto } from "./dto/create-tecnicatura.dto.js";
import { UpdateTecnicaturaDto } from "./dto/update-tecnicatura.dto.js";

@Controller("tecnicaturas")
export class TecnicaturasController {
  constructor(
    private readonly tecnicaturasService: TecnicaturasService,
  ) {}

  // CREAR
  @Post()
  create(@Body() dto: CreateTecnicaturaDto) {
    return this.tecnicaturasService.create(dto);
  }

  // LISTAR TODAS
  @Get()
  findAll() {
    return this.tecnicaturasService.findAll();
  }

  // BUSCAR POR ID
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.tecnicaturasService.findOne(id);
  }

  // ACTUALIZAR
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTecnicaturaDto,
  ) {
    return this.tecnicaturasService.update(id, dto);
  }

  // ELIMINAR
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.tecnicaturasService.remove(id);
  }
}
