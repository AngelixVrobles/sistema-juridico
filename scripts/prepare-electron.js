/**
 * scripts/prepare-electron.js — Preparar build de Next.js para Electron
 *
 * Next.js standalone necesita que copiemos manualmente:
 *  - .next/static       → .next/standalone/.next/static
 *  - public/            → .next/standalone/public
 *  - prisma/biblioteca.db → .next/standalone/prisma/biblioteca.db   (DB semilla)
 *
 * También parchea server.js para usar HOSTNAME=127.0.0.1 por defecto.
 *
 * Uso: node scripts/prepare-electron.js
 */

const fs   = require("fs");
const path = require("path");

const ROOT       = path.join(__dirname, "..");
const STANDALONE = path.join(ROOT, ".next", "standalone");
const STATIC_SRC = path.join(ROOT, ".next", "static");
const STATIC_DST = path.join(STANDALONE, ".next", "static");
const PUBLIC_SRC = path.join(ROOT, "public");
const PUBLIC_DST = path.join(STANDALONE, "public");
const DB_SRC     = path.join(ROOT, "prisma", "biblioteca.db");
const DB_DST     = path.join(STANDALONE, "prisma", "biblioteca.db");

// ─── Helpers ──────────────────────────────────────────────────────────────────
function copyDir(src, dst) {
  if (!fs.existsSync(src)) {
    console.warn(`  ⚠ No existe: ${src}`);
    return 0;
  }
  fs.mkdirSync(dst, { recursive: true });
  let count = 0;

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      count += copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
      count++;
    }
  }
  return count;
}

function patchServerJs() {
  const serverJs = path.join(STANDALONE, "server.js");
  if (!fs.existsSync(serverJs)) {
    console.warn("  ⚠ server.js no encontrado, saltando patch");
    return;
  }
  let content = fs.readFileSync(serverJs, "utf-8");
  // Asegurar que el hostname sea 127.0.0.1 si no se especifica,
  // para que Electron pueda conectarse via localhost
  if (!content.includes("HOSTNAME_PATCHED")) {
    content = `// HOSTNAME_PATCHED\nprocess.env.HOSTNAME = process.env.HOSTNAME || "127.0.0.1";\n` + content;
    fs.writeFileSync(serverJs, content, "utf-8");
    console.log("  ✓ server.js parcheado con HOSTNAME=127.0.0.1");
  } else {
    console.log("  · server.js ya parcheado");
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log("▶ Preparando build de Next.js para Electron...\n");

  if (!fs.existsSync(STANDALONE)) {
    console.error(`✗ No existe .next/standalone. Ejecuta primero: npm run build`);
    process.exit(1);
  }

  console.log("  Copiando .next/static →", STATIC_DST);
  const staticCount = copyDir(STATIC_SRC, STATIC_DST);
  console.log(`  ✓ ${staticCount} archivos estáticos copiados\n`);

  console.log("  Copiando public/ →", PUBLIC_DST);
  const publicCount = copyDir(PUBLIC_SRC, PUBLIC_DST);
  console.log(`  ✓ ${publicCount} archivos públicos copiados\n`);

  console.log("  Copiando DB semilla →", DB_DST);
  if (fs.existsSync(DB_SRC)) {
    fs.mkdirSync(path.dirname(DB_DST), { recursive: true });
    fs.copyFileSync(DB_SRC, DB_DST);
    console.log("  ✓ Base de datos copiada\n");
  } else {
    console.warn("  ⚠ No se encontró biblioteca.db — la app iniciará sin datos semilla\n");
  }

  patchServerJs();

  console.log("\n✓ Build listo para empaquetar con electron-builder");
  console.log("  Siguiente paso: npm run electron:build:win\n");
}

main();
