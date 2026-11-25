-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('estudiante', 'docente', 'bedelia', 'directivo');

-- CreateEnum
CREATE TYPE "condicion_academica" AS ENUM ('alumno', 'egresado');

-- CreateEnum
CREATE TYPE "rol_participacion" AS ENUM ('integrante', 'director', 'codirector');

-- CreateEnum
CREATE TYPE "estado_tesis" AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- CreateTable
CREATE TABLE "tecnicaturas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen_url" TEXT NOT NULL,

    CONSTRAINT "tecnicaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "foto_url" TEXT,
    "nro_legajo" VARCHAR(30) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" TEXT,
    "tecnicatura_id" INTEGER,
    "condicion_academica" "condicion_academica",
    "rol" "rol_usuario" NOT NULL DEFAULT 'estudiante',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tesis" (
    "id" SERIAL NOT NULL,
    "tecnicatura_id" INTEGER NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "tema" VARCHAR(120) NOT NULL,
    "resumen" TEXT NOT NULL,
    "estado" "estado_tesis" NOT NULL DEFAULT 'pendiente',
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "fecha_publicacion" DATE NOT NULL,
    "miniatura_url" TEXT NOT NULL,
    "imagen_principal_url" TEXT NOT NULL,
    "url_pdf" TEXT,
    "url_video" TEXT,
    "url_github" TEXT,
    "url_youtube" TEXT,

    CONSTRAINT "tesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tesis_galeria" (
    "id" SERIAL NOT NULL,
    "tesis_id" INTEGER NOT NULL,
    "imagen_url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "tesis_galeria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tesis_participantes" (
    "tesis_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rol_participacion" "rol_participacion" NOT NULL DEFAULT 'integrante',

    CONSTRAINT "pk_tesis_participantes" PRIMARY KEY ("tesis_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tecnicaturas_nombre_key" ON "tecnicaturas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "users_nro_legajo_key" ON "users"("nro_legajo");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_tecnicatura_id" ON "users"("tecnicatura_id");

-- CreateIndex
CREATE INDEX "idx_tesis_tecnicatura_id" ON "tesis"("tecnicatura_id");

-- CreateIndex
CREATE INDEX "idx_tesis_estado" ON "tesis"("estado");

-- CreateIndex
CREATE INDEX "idx_galeria_tesis_id" ON "tesis_galeria"("tesis_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_galeria_tesis_orden" ON "tesis_galeria"("tesis_id", "orden");

-- CreateIndex
CREATE INDEX "idx_tp_user_id" ON "tesis_participantes"("user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_tecnicatura" FOREIGN KEY ("tecnicatura_id") REFERENCES "tecnicaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tesis" ADD CONSTRAINT "fk_tesis_tecnicatura" FOREIGN KEY ("tecnicatura_id") REFERENCES "tecnicaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tesis_galeria" ADD CONSTRAINT "fk_galeria_tesis" FOREIGN KEY ("tesis_id") REFERENCES "tesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tesis_participantes" ADD CONSTRAINT "fk_tp_tesis" FOREIGN KEY ("tesis_id") REFERENCES "tesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tesis_participantes" ADD CONSTRAINT "fk_tp_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
