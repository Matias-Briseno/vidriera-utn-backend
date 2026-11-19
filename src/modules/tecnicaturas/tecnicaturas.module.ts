import { Module } from '@nestjs/common';
import { TecnicaturasService } from './tecnicaturas.service.js';
import { TecnicaturasController } from './tecnicaturas.controller.js';

@Module({
  controllers: [TecnicaturasController],
  providers: [TecnicaturasService],
})
export class TecnicaturasModule {}
