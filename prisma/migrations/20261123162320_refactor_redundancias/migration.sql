/*
  Warnings:

  - You are about to drop the column `anio` on the `tesis` table. All the data in the column will be lost.
  - The primary key for the `tesis_participantes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `persona_id` on the `tesis_participantes` table. All the data in the column will be lost.
  - The `rol_participacion` column on the `tesis_participantes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `condicion_academica` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rol` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `personas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `tesis_participantes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('estudiante', 'docente', 'bedelia', 'directivo');

-- CreateEnum
CREATE TYPE "condicion_academica" AS ENUM ('alumno', 'egresado');

-- CreateEnum
CREATE TYPE "rol_participacion" AS ENUM ('integrante', 'director', 'codirector');

-- CreateEnum
CREATE TYPE "estado_tesis" AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- DropForeignKey
ALTER TABLE "tesis_participantes" DROP CONSTRAINT "fk_tp_persona";

-- DropIndex
DROP INDEX "idx_tp_persona_id";

-- AlterTable
CREATE SEQUENCE tecnicaturas_id_seq;
ALTER TABLE "tecnicaturas" ALTER COLUMN "id" SET DEFAULT nextval('tecnicaturas_id_seq');
ALTER SEQUENCE tecnicaturas_id_seq OWNED BY "tecnicaturas"."id";

-- AlterTable
CREATE SEQUENCE tesis_id_seq;
ALTER TABLE "tesis" DROP COLUMN "anio",
ADD COLUMN     "estado" "estado_tesis" NOT NULL DEFAULT 'pendiente',
ALTER COLUMN "id" SET DEFAULT nextval('tesis_id_seq');
ALTER SEQUENCE tesis_id_seq OWNED BY "tesis"."id";

-- AlterTable
ALTER TABLE "tesis_participantes" DROP CONSTRAINT "pk_tesis_participantes",
DROP COLUMN "persona_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "rol_participacion",
ADD COLUMN     "rol_participacion" "rol_participacion" NOT NULL DEFAULT 'integrante',
ADD CONSTRAINT "pk_tesis_participantes" PRIMARY KEY ("tesis_id", "user_id");

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "foto_url" TEXT,
ALTER COLUMN "tecnicatura_id" DROP NOT NULL,
DROP COLUMN "condicion_academica",
ADD COLUMN     "condicion_academica" "condicion_academica",
ALTER COLUMN "password_hash" DROP NOT NULL,
DROP COLUMN "rol",
ADD COLUMN     "rol" "rol_usuario" NOT NULL DEFAULT 'estudiante';

-- DropTable
DROP TABLE "personas";

-- CreateIndex
CREATE INDEX "idx_tesis_estado" ON "tesis"("estado");

-- CreateIndex
CREATE INDEX "idx_tp_user_id" ON "tesis_participantes"("user_id");

-- AddForeignKey
ALTER TABLE "tesis_participantes" ADD CONSTRAINT "fk_tp_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
