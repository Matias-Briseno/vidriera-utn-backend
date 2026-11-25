import { Module } from "@nestjs/common";

import { TecnicaturasController } from "./tecnicaturas.controller.js";
import { TecnicaturasService } from "./tecnicaturas.service.js";

@Module({
  controllers: [TecnicaturasController],
  providers: [TecnicaturasService],
})
export class TecnicaturasModule {}
