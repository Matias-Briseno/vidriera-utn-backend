-- CreateTable
CREATE TABLE "personas" (
    "id" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "foto_url" TEXT,

    CONSTRAINT "personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tecnicaturas" (
    "id" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen_url" TEXT NOT NULL,

    CONSTRAINT "tecnicaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tesis" (
    "id" INTEGER NOT NULL,
    "tecnicatura_id" INTEGER NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "anio" INTEGER NOT NULL,
    "tema" VARCHAR(120) NOT NULL,
    "resumen" TEXT NOT NULL,
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
    "persona_id" INTEGER NOT NULL,
    "rol_participacion" VARCHAR(30) NOT NULL DEFAULT 'integrante',

    CONSTRAINT "pk_tesis_participantes" PRIMARY KEY ("tesis_id","persona_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "nro_legajo" VARCHAR(30) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "tecnicatura_id" INTEGER NOT NULL,
    "condicion_academica" VARCHAR(50) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" VARCHAR(30) NOT NULL DEFAULT 'estudiante',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_persona_nombre_foto" ON "personas"("nombre_completo", "foto_url");

-- CreateIndex
CREATE UNIQUE INDEX "tecnicaturas_nombre_key" ON "tecnicaturas"("nombre");

-- CreateIndex
CREATE INDEX "idx_tesis_tecnicatura_id" ON "tesis"("tecnicatura_id");

-- CreateIndex
CREATE INDEX "idx_galeria_tesis_id" ON "tesis_galeria"("tesis_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_galeria_tesis_orden" ON "tesis_galeria"("tesis_id", "orden");

-- CreateIndex
CREATE INDEX "idx_tp_persona_id" ON "tesis_participantes"("persona_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_nro_legajo_key" ON "users"("nro_legajo");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_tecnicatura_id" ON "users"("tecnicatura_id");

-- AddForeignKey
ALTER TABLE "tesis" ADD CONSTRAINT "fk_tesis_tecnicatura" FOREIGN KEY ("tecnicatura_id") REFERENCES "tecnicaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tesis_galeria" ADD CONSTRAINT "fk_galeria_tesis" FOREIGN KEY ("tesis_id") REFERENCES "tesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tesis_participantes" ADD CONSTRAINT "fk_tp_persona" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tesis_participantes" ADD CONSTRAINT "fk_tp_tesis" FOREIGN KEY ("tesis_id") REFERENCES "tesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_tecnicatura" FOREIGN KEY ("tecnicatura_id") REFERENCES "tecnicaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
