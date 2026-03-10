import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SECCIONES = [
  { nombre: "Derecho Civil",           prefijo: "CIV", icono: "menu_book",        descripcion: "Derecho civil, familia, sucesiones, contratos y obligaciones" },
  { nombre: "Derecho Penal",           prefijo: "PEN", icono: "gavel",            descripcion: "Derecho penal, procesal penal, criminologia y sistema acusatorio" },
  { nombre: "Derecho Laboral",         prefijo: "LAB", icono: "work",             descripcion: "Derecho del trabajo, seguridad social y relaciones laborales" },
  { nombre: "Derecho Mercantil",       prefijo: "MER", icono: "store",            descripcion: "Comercio, sociedades, titulos de credito y derecho bancario" },
  { nombre: "Derecho Constitucional",  prefijo: "CON", icono: "account_balance",  descripcion: "Derecho constitucional, garantias individuales y amparo" },
  { nombre: "Derecho Administrativo",  prefijo: "ADM", icono: "apartment",        descripcion: "Derecho administrativo, fiscal y procedimientos administrativos" },
  { nombre: "Codigos y Leyes",         prefijo: "COD", icono: "description",      descripcion: "Codigos federales, estatales y compilaciones legislativas" },
  { nombre: "Jurisprudencia",          prefijo: "JUR", icono: "library_books",    descripcion: "Tesis, jurisprudencias, semanario judicial y precedentes" },
];

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  for (const sec of SECCIONES) {
    const seccion = await prisma.seccion.upsert({
      where: { prefijo: sec.prefijo },
      update: {},
      create: {
        nombre:      sec.nombre,
        prefijo:     sec.prefijo,
        icono:       sec.icono,
        descripcion: sec.descripcion,
      },
    });

    // Crear 3 vigas por defecto para cada sección
    for (let i = 1; i <= 3; i++) {
      await prisma.viga.upsert({
        where: { seccionId_numero: { seccionId: seccion.id, numero: `V0${i}` } },
        update: {},
        create: { numero: `V0${i}`, capacidad: 20, seccionId: seccion.id },
      });
    }
  }

  console.log("✅ Seed completado. Secciones y vigas creadas.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
