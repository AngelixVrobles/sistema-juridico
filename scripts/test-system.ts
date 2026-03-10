/**
 * test-system.ts — Pruebas de sistema y benchmarks de rendimiento
 * Verifica todos los módulos: clientes, expedientes, biblioteca (secciones, vigas, libros, préstamos)
 * Uso: npx tsx scripts/test-system.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Colores para la consola ─────────────────────────────────────────────────
const C = {
  reset:  "\x1b[0m",
  green:  "\x1b[32m",
  red:    "\x1b[31m",
  yellow: "\x1b[33m",
  cyan:   "\x1b[36m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
};

// ─── Resultados ───────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const results: { suite: string; test: string; ok: boolean; ms: number; error?: string }[] = [];

async function test(suite: string, name: string, fn: () => Promise<void>) {
  const t0 = Date.now();
  try {
    await fn();
    const ms = Date.now() - t0;
    results.push({ suite, test: name, ok: true, ms });
    passed++;
    console.log(`  ${C.green}✓${C.reset} ${name} ${C.dim}(${ms}ms)${C.reset}`);
  } catch (e: unknown) {
    const ms = Date.now() - t0;
    const error = e instanceof Error ? e.message : String(e);
    results.push({ suite, test: name, ok: false, ms, error });
    failed++;
    console.log(`  ${C.red}✗${C.reset} ${name} ${C.dim}(${ms}ms)${C.reset}`);
    console.log(`    ${C.red}${error}${C.reset}`);
  }
}

function suite(name: string) {
  console.log(`\n${C.bold}${C.cyan}▶ ${name}${C.reset}`);
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

// ─── Test: Clientes ───────────────────────────────────────────────────────────
async function testClientes() {
  suite("Clientes");

  let clienteId = "";

  await test("Clientes", "Crear cliente", async () => {
    const c = await prisma.cliente.create({
      data: { nombre: "__TEST_Cliente__", telefono: "5500000001", email: "test@test.com", direccion: "Test 1", notas: "" },
    });
    assert(c.id.length > 0, "ID debe generarse");
    assert(c.nombre === "__TEST_Cliente__", "Nombre debe coincidir");
    clienteId = c.id;
  });

  await test("Clientes", "Leer cliente por ID", async () => {
    const c = await prisma.cliente.findUnique({ where: { id: clienteId } });
    assert(c !== null, "Cliente debe existir");
    assert(c!.nombre === "__TEST_Cliente__", "Nombre debe coincidir");
  });

  await test("Clientes", "Actualizar cliente", async () => {
    const c = await prisma.cliente.update({
      where: { id: clienteId },
      data: { telefono: "5599999999" },
    });
    assert(c.telefono === "5599999999", "Teléfono debe actualizarse");
  });

  await test("Clientes", "Listar clientes (conteo)", async () => {
    const count = await prisma.cliente.count();
    assert(count >= 1, "Debe haber al menos 1 cliente");
  });

  await test("Clientes", "Eliminar cliente", async () => {
    await prisma.cliente.delete({ where: { id: clienteId } });
    const c = await prisma.cliente.findUnique({ where: { id: clienteId } });
    assert(c === null, "Cliente debe haberse eliminado");
  });
}

// ─── Test: Juzgados ───────────────────────────────────────────────────────────
async function testJuzgados() {
  suite("Juzgados");

  let juzgadoId = "";

  await test("Juzgados", "Crear juzgado", async () => {
    const j = await prisma.juzgado.create({
      data: { nombre: "__TEST_Juzgado__", jurisdiccion: "Civil", direccion: "", telefono: "" },
    });
    assert(j.id.length > 0, "ID debe generarse");
    juzgadoId = j.id;
  });

  await test("Juzgados", "Leer juzgado por ID", async () => {
    const j = await prisma.juzgado.findUnique({ where: { id: juzgadoId } });
    assert(j !== null, "Juzgado debe existir");
    assert(j!.nombre === "__TEST_Juzgado__", "Nombre debe coincidir");
  });

  await test("Juzgados", "Actualizar jurisdicción", async () => {
    const j = await prisma.juzgado.update({
      where: { id: juzgadoId },
      data: { jurisdiccion: "Mercantil" },
    });
    assert(j.jurisdiccion === "Mercantil", "Jurisdicción debe actualizarse");
  });

  await test("Juzgados", "Eliminar juzgado", async () => {
    await prisma.juzgado.delete({ where: { id: juzgadoId } });
    const j = await prisma.juzgado.findUnique({ where: { id: juzgadoId } });
    assert(j === null, "Juzgado debe haberse eliminado");
  });
}

// ─── Test: Expedientes ────────────────────────────────────────────────────────
async function testExpedientes() {
  suite("Expedientes");

  let expedienteId = "";

  await test("Expedientes", "Crear expediente con pago inicial", async () => {
    const exp = await prisma.expediente.create({
      data: {
        numero: "EXP-TEST-001",
        cliente: "__TEST_Cliente__",
        clienteTelefono: "",
        clienteEmail: "",
        juzgado: "Juzgado Test",
        abogado: "Lic. Test",
        contraparte: "Contraparte Test",
        descripcion: "Expediente de prueba del sistema",
        tipo: "Civil",
        estado: "Activo",
        cotizacion: 15000,
        metodoPago: "Transferencia",
        pagos: { create: [{ descripcion: "Anticipo", monto: 5000 }] },
      },
      include: { pagos: true, notas: true, documentos: true },
    });
    assert(exp.id.length > 0, "ID debe generarse");
    assert(exp.numero === "EXP-TEST-001", "Número debe coincidir");
    assert(exp.pagos.length === 1, "Debe tener 1 pago");
    assert(exp.pagos[0].monto === 5000, "Monto anticipo debe ser 5000");
    expedienteId = exp.id;
  });

  await test("Expedientes", "Agregar nota al expediente", async () => {
    const nota = await prisma.nota.create({
      data: { expedienteId, texto: "Nota de prueba del sistema" },
    });
    assert(nota.id.length > 0, "Nota debe crearse");
    assert(nota.texto === "Nota de prueba del sistema", "Texto debe coincidir");
  });

  await test("Expedientes", "Agregar segundo pago", async () => {
    const pago = await prisma.pago.create({
      data: { expedienteId, descripcion: "Segunda Exhibición", monto: 3000 },
    });
    assert(pago.monto === 3000, "Monto debe ser 3000");
  });

  await test("Expedientes", "Leer expediente completo (include)", async () => {
    const exp = await prisma.expediente.findUnique({
      where: { id: expedienteId },
      include: { pagos: true, notas: true, documentos: true },
    });
    assert(exp !== null, "Expediente debe existir");
    assert(exp!.pagos.length === 2, "Debe tener 2 pagos");
    assert(exp!.notas.length === 1, "Debe tener 1 nota");
    assert(exp!.documentos.length === 0, "Debe tener 0 documentos");
  });

  await test("Expedientes", "Actualizar estado a 'En Espera'", async () => {
    const exp = await prisma.expediente.update({
      where: { id: expedienteId },
      data: { estado: "En Espera" },
    });
    assert(exp.estado === "En Espera", "Estado debe actualizarse");
  });

  await test("Expedientes", "Filtrar por estado", async () => {
    const activos = await prisma.expediente.findMany({ where: { estado: "En Espera" } });
    assert(activos.some((e) => e.id === expedienteId), "Debe aparecer en filtro 'En Espera'");
  });

  await test("Expedientes", "Buscar por cliente (contains)", async () => {
    const res = await prisma.expediente.findMany({
      where: { cliente: { contains: "__TEST_" } },
    });
    assert(res.length >= 1, "Debe encontrar el expediente de prueba");
  });

  await test("Expedientes", "Eliminar expediente en cascada", async () => {
    await prisma.expediente.delete({ where: { id: expedienteId } });
    const exp = await prisma.expediente.findUnique({ where: { id: expedienteId } });
    assert(exp === null, "Expediente debe haberse eliminado");
    const pagos = await prisma.pago.findMany({ where: { expedienteId } });
    assert(pagos.length === 0, "Pagos deben eliminarse en cascada");
    const notas = await prisma.nota.findMany({ where: { expedienteId } });
    assert(notas.length === 0, "Notas deben eliminarse en cascada");
  });
}

// ─── Test: Biblioteca ─────────────────────────────────────────────────────────
async function testBiblioteca() {
  suite("Biblioteca");

  let seccionId = "";
  let vigaId    = "";
  let libroId   = "";

  // Limpiar datos de prueba previos (para idempotencia entre ejecuciones)
  await test("Biblioteca", "Limpiar datos de prueba previos", async () => {
    const existing = await prisma.seccion.findFirst({ where: { prefijo: "TST" } });
    if (existing) {
      await prisma.prestamo.deleteMany({ where: { libro: { seccionId: existing.id } } });
      await prisma.libro.deleteMany({ where: { seccionId: existing.id } });
      await prisma.viga.deleteMany({ where: { seccionId: existing.id } });
      await prisma.seccion.delete({ where: { id: existing.id } });
    }
    // También limpiar libro TST-001 si quedó huérfano
    const libroHuerfano = await prisma.libro.findFirst({ where: { codigo: "TST-001" } });
    if (libroHuerfano) {
      await prisma.prestamo.deleteMany({ where: { libroId: libroHuerfano.id } });
      await prisma.libro.delete({ where: { id: libroHuerfano.id } });
    }
    assert(true, "Limpieza completada");
  });

  await test("Biblioteca", "Crear sección", async () => {
    const s = await prisma.seccion.create({
      data: { nombre: "__TEST_Sección__", prefijo: "TST", descripcion: "Sección de prueba" },
    });
    assert(s.id.length > 0, "ID debe generarse");
    seccionId = s.id;
  });

  await test("Biblioteca", "Crear viga en sección", async () => {
    const v = await prisma.viga.create({
      data: { numero: "V99", capacidad: 20, seccionId },
    });
    assert(v.id.length > 0, "ID debe generarse");
    assert(v.numero === "V99", "Número debe coincidir");
    vigaId = v.id;
  });

  await test("Biblioteca", "Crear libro en viga", async () => {
    const l = await prisma.libro.create({
      data: {
        codigo:   "TST-001",
        titulo:   "Libro de Prueba del Sistema",
        autor:    "Test Author",
        estado:   "Disponible",
        vigaId,
        seccionId,
      },
    });
    assert(l.id.length > 0, "ID debe generarse");
    assert(l.codigo === "TST-001", "Código debe coincidir");
    assert(l.estado === "Disponible", "Estado inicial debe ser Disponible");
    libroId = l.id;
  });

  await test("Biblioteca", "Leer libro con relaciones", async () => {
    const l = await prisma.libro.findUnique({
      where: { id: libroId },
      include: { viga: true, seccion: true },
    });
    assert(l !== null, "Libro debe existir");
    assert(l!.viga.numero === "V99", "Relación viga debe funcionar");
    assert(l!.seccion.nombre === "__TEST_Sección__", "Relación sección debe funcionar");
  });

  await test("Biblioteca", "Crear préstamo del libro", async () => {
    const p = await prisma.prestamo.create({
      data: {
        libroId,
        persona: "Lector de Prueba",
        fechaSalida: new Date(),
        devuelto: false,
      },
    });
    assert(p.id.length > 0, "ID debe generarse");
    assert(p.devuelto === false, "Estado inicial debe ser no devuelto");
    // Marcar libro como Prestado
    await prisma.libro.update({ where: { id: libroId }, data: { estado: "Prestado" } });
  });

  await test("Biblioteca", "Buscar libros disponibles", async () => {
    const disponibles = await prisma.libro.findMany({
      where: { estado: "Disponible" },
    });
    // El libro de prueba está Prestado, no debe aparecer
    assert(!disponibles.some((l) => l.id === libroId), "Libro prestado no debe aparecer como disponible");
  });

  await test("Biblioteca", "Devolver libro (actualizar préstamo)", async () => {
    const prestamos = await prisma.prestamo.findMany({ where: { libroId, devuelto: false } });
    assert(prestamos.length === 1, "Debe haber 1 préstamo activo");
    await prisma.prestamo.update({
      where: { id: prestamos[0].id },
      data: { devuelto: true, fechaDevolucion: new Date() },
    });
    await prisma.libro.update({ where: { id: libroId }, data: { estado: "Disponible" } });
    const l = await prisma.libro.findUnique({ where: { id: libroId } });
    assert(l!.estado === "Disponible", "Libro debe estar disponible tras devolución");
  });

  await test("Biblioteca", "Actualizar capacidad de viga", async () => {
    const v = await prisma.viga.update({ where: { id: vigaId }, data: { capacidad: 30 } });
    assert(v.capacidad === 30, "Capacidad debe actualizarse");
  });

  await test("Biblioteca", "Listar libros por sección", async () => {
    const libros = await prisma.libro.findMany({ where: { seccionId } });
    assert(libros.length >= 1, "Debe haber al menos 1 libro en la sección");
  });

  await test("Biblioteca", "Eliminar libro (con préstamos en cascada)", async () => {
    // Primero eliminar préstamos asociados (SQLite no hace cascada automática aquí)
    await prisma.prestamo.deleteMany({ where: { libroId } });
    await prisma.libro.delete({ where: { id: libroId } });
    const l = await prisma.libro.findUnique({ where: { id: libroId } });
    assert(l === null, "Libro debe haberse eliminado");
  });

  await test("Biblioteca", "Eliminar viga", async () => {
    await prisma.viga.delete({ where: { id: vigaId } });
    const v = await prisma.viga.findUnique({ where: { id: vigaId } });
    assert(v === null, "Viga debe haberse eliminado");
  });

  await test("Biblioteca", "Eliminar sección (limpieza)", async () => {
    // Eliminar cualquier libro/viga restante de la sección antes de borrarla
    await prisma.prestamo.deleteMany({ where: { libro: { seccionId } } });
    await prisma.libro.deleteMany({ where: { seccionId } });
    await prisma.viga.deleteMany({ where: { seccionId } });
    await prisma.seccion.delete({ where: { id: seccionId } });
    const s = await prisma.seccion.findUnique({ where: { id: seccionId } });
    assert(s === null, "Sección debe haberse eliminado");
  });
}

// ─── Benchmarks ───────────────────────────────────────────────────────────────
async function runBenchmarks() {
  suite("Benchmarks de Rendimiento");

  await test("Benchmark", "Contar todos los registros", async () => {
    const t0 = Date.now();
    const [clientes, expedientes, libros, prestamos, secciones, vigas] = await Promise.all([
      prisma.cliente.count(),
      prisma.expediente.count(),
      prisma.libro.count(),
      prisma.prestamo.count(),
      prisma.seccion.count(),
      prisma.viga.count(),
    ]);
    const ms = Date.now() - t0;
    console.log(`    ${C.dim}Clientes: ${clientes} | Expedientes: ${expedientes} | Libros: ${libros} | Préstamos: ${prestamos} | Secciones: ${secciones} | Vigas: ${vigas}${C.reset}`);
    assert(ms < 2000, `Conteo paralelo debe ser <2000ms (fue ${ms}ms)`);
  });

  await test("Benchmark", "Cargar 100 expedientes con relaciones", async () => {
    const t0 = Date.now();
    const exps = await prisma.expediente.findMany({
      take: 100,
      include: { pagos: true, notas: true, documentos: true },
      orderBy: { createdAt: "desc" },
    });
    const ms = Date.now() - t0;
    console.log(`    ${C.dim}Cargados ${exps.length} expedientes en ${ms}ms${C.reset}`);
    assert(ms < 3000, `Carga de 100 expedientes debe ser <3000ms (fue ${ms}ms)`);
  });

  await test("Benchmark", "Cargar 200 libros con relaciones", async () => {
    const t0 = Date.now();
    const libros = await prisma.libro.findMany({
      take: 200,
      include: { viga: true, seccion: true },
      orderBy: { titulo: "asc" },
    });
    const ms = Date.now() - t0;
    console.log(`    ${C.dim}Cargados ${libros.length} libros en ${ms}ms${C.reset}`);
    assert(ms < 3000, `Carga de 200 libros debe ser <3000ms (fue ${ms}ms)`);
  });

  await test("Benchmark", "Búsqueda full-text en expedientes", async () => {
    const t0 = Date.now();
    const res = await prisma.expediente.findMany({
      where: {
        OR: [
          { cliente:  { contains: "García" } },
          { numero:   { contains: "2024"   } },
          { juzgado:  { contains: "Civil"  } },
        ],
      },
    });
    const ms = Date.now() - t0;
    console.log(`    ${C.dim}Encontrados ${res.length} expedientes en ${ms}ms${C.reset}`);
    assert(ms < 1000, `Búsqueda debe ser <1000ms (fue ${ms}ms)`);
  });

  await test("Benchmark", "Estadísticas de pagos (aggregate)", async () => {
    const t0 = Date.now();
    const agg = await prisma.pago.aggregate({
      _sum: { monto: true },
      _count: { id: true },
      _avg: { monto: true },
    });
    const ms = Date.now() - t0;
    console.log(`    ${C.dim}Total cobrado: $${(agg._sum.monto ?? 0).toLocaleString()} | Pagos: ${agg._count.id} | Promedio: $${Math.round(agg._avg.monto ?? 0).toLocaleString()}${C.reset}`);
    assert(ms < 500, `Aggregate debe ser <500ms (fue ${ms}ms)`);
  });

  await test("Benchmark", "Préstamos activos (devuelto=false)", async () => {
    const t0 = Date.now();
    const activos = await prisma.prestamo.findMany({
      where: { devuelto: false },
      include: { libro: { include: { seccion: true } } },
    });
    const ms = Date.now() - t0;
    console.log(`    ${C.dim}Préstamos activos (no devueltos): ${activos.length} en ${ms}ms${C.reset}`);
    assert(ms < 1000, `Préstamos activos debe ser <1000ms (fue ${ms}ms)`);
  });

  await test("Benchmark", "Inserción masiva (50 operaciones)", async () => {
    const t0 = Date.now();
    // Crear y eliminar 50 registros para medir throughput
    const ids: string[] = [];
    for (let i = 0; i < 50; i++) {
      const c = await prisma.cliente.create({
        data: { nombre: `Benchmark_${i}`, telefono: "", email: "", direccion: "", notas: "" },
      });
      ids.push(c.id);
    }
    const msCreate = Date.now() - t0;
    // Cleanup
    await prisma.cliente.deleteMany({ where: { id: { in: ids } } });
    const msTotal = Date.now() - t0;
    const rate = Math.round(50 / (msCreate / 1000));
    console.log(`    ${C.dim}50 inserciones en ${msCreate}ms (~${rate} ops/seg) | Limpieza total: ${msTotal}ms${C.reset}`);
    assert(msCreate < 5000, `50 inserciones deben ser <5000ms (fue ${msCreate}ms)`);
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.cyan}║   Sistema Jurídico — Pruebas de Sistema v1.0     ║${C.reset}`);
  console.log(`${C.bold}${C.cyan}╚══════════════════════════════════════════════════╝${C.reset}`);
  console.log(`  ${C.dim}Fecha: ${new Date().toLocaleString("es-MX")}${C.reset}`);

  await testClientes();
  await testJuzgados();
  await testExpedientes();
  await testBiblioteca();
  await runBenchmarks();

  // ─── Resumen final ────────────────────────────────────────────────────────
  const total = passed + failed;
  const pct   = total > 0 ? Math.round((passed / total) * 100) : 0;
  const avgMs = results.length > 0 ? Math.round(results.reduce((a, r) => a + r.ms, 0) / results.length) : 0;

  console.log(`\n${C.bold}${C.cyan}──────────────────────────────────────────────────${C.reset}`);
  console.log(`${C.bold}  Resultados: ${passed}/${total} pruebas pasadas (${pct}%)${C.reset}`);
  console.log(`  Tiempo promedio por prueba: ${avgMs}ms`);

  if (failed > 0) {
    console.log(`\n${C.red}${C.bold}  FALLIDAS:${C.reset}`);
    results.filter((r) => !r.ok).forEach((r) => {
      console.log(`  ${C.red}✗ [${r.suite}] ${r.test}${C.reset}`);
      if (r.error) console.log(`    ${C.dim}${r.error}${C.reset}`);
    });
  }

  const statusIcon = failed === 0 ? `${C.green}${C.bold}✓ TODAS LAS PRUEBAS PASARON` : `${C.red}${C.bold}✗ ${failed} PRUEBA(S) FALLARON`;
  console.log(`\n  ${statusIcon}${C.reset}`);
  console.log(`${C.bold}${C.cyan}──────────────────────────────────────────────────${C.reset}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main()
  .catch((e) => {
    console.error(`\n${C.red}Error fatal:${C.reset}`, e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
