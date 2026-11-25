
import "dotenv/config";
import * as bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import  { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = process.env.DIRECTIVO_EMAIL;
  const password = process.env.DIRECTIVO_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Faltan DIRECTIVO_EMAIL o DIRECTIVO_PASSWORD en el archivo .env",
    );
  }

  const existingDirectivo = await prisma.users.findFirst({
    where: {
      rol: "directivo",
    },
  });

  if (existingDirectivo) {
    console.log("Ya existe un usuario Directivo.");
    return;
  }

  const existingEmail = await prisma.users.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new Error(
      "El email configurado ya pertenece a otro usuario.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.users.create({
    data: {
      nombre: "Administrador",
      apellido: "Sistema",
      nro_legajo: "DIRECTIVO-001",
      email,
      password_hash: passwordHash,
      rol: "directivo",
    },
  });

  console.log("Usuario Directivo creado correctamente.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
