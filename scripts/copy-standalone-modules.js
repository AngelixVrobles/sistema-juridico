/**
 * scripts/copy-standalone-modules.js
 *
 * electron-builder SIEMPRE filtra node_modules de extraResources/extraFiles.
 * Este afterPack hook copia el node_modules del servidor Next.js standalone
 * directamente al directorio de salida DESPUÉS del empaquetado pero ANTES
 * de que se cree el instalador NSIS/DMG.
 *
 * SIN este script, require('next') falla en la app instalada.
 */

const fs = require("fs");
const path = require("path");

function copyDir(src, dst) {
    if (!fs.existsSync(src)) return 0;
    fs.mkdirSync(dst, { recursive: true });
    let n = 0;
    for (const e of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, e.name);
        const d = path.join(dst, e.name);
        if (e.isDirectory()) n += copyDir(s, d);
        else { fs.copyFileSync(s, d); n++; }
    }
    return n;
}

exports.default = async function afterPack({ appOutDir, packager }) {
    const src = path.join(packager.projectDir, ".next", "standalone", "node_modules");
    const dst = path.join(appOutDir, "resources", "app", "node_modules");

    if (!fs.existsSync(src)) {
        console.warn("[afterPack] ⚠ No se encontró standalone/node_modules");
        return;
    }

    console.log("[afterPack] Copiando node_modules del servidor Next.js...");
    const t0 = Date.now();
    const n = copyDir(src, dst);
    console.log(`[afterPack] ✓ ${n} archivos en ${((Date.now() - t0) / 1000).toFixed(1)}s`);

    const nextPkg = path.join(dst, "next", "package.json");
    if (fs.existsSync(nextPkg)) {
        const { version } = JSON.parse(fs.readFileSync(nextPkg, "utf8"));
        console.log(`[afterPack] ✓ next@${version} verificado en el paquete`);
    } else {
        console.error("[afterPack] ✗ next NO encontrado — el servidor fallará al iniciar");
    }

    // Copiar el binario del motor de Prisma (.prisma/client/) que Next.js
    // standalone NO incluye pero es necesario para que la base de datos funcione.
    const prismaEngineSrc = path.join(packager.projectDir, "node_modules", ".prisma", "client");
    const prismaEngineDst = path.join(appOutDir, "resources", "app", "node_modules", ".prisma", "client");
    if (fs.existsSync(prismaEngineSrc)) {
        console.log("[afterPack] Copiando motor de Prisma (.prisma/client)...");
        const np = copyDir(prismaEngineSrc, prismaEngineDst);
        console.log(`[afterPack] ✓ Motor de Prisma copiado (${np} archivos)`);
    } else {
        console.error("[afterPack] ✗ .prisma/client NO encontrado — ejecuta 'npx prisma generate' antes de empaquetar");
    }

    // Copiar también el paquete @prisma/client completo desde el root, ya que el de
    // standalone a veces viene incompleto por el tree-shaking de Next.js/Turbopack.
    const prismaClientSrc = path.join(packager.projectDir, "node_modules", "@prisma", "client");
    const prismaClientDst = path.join(appOutDir, "resources", "app", "node_modules", "@prisma", "client");
    if (fs.existsSync(prismaClientSrc)) {
        console.log("[afterPack] Copiando @prisma/client completo...");
        copyDir(prismaClientSrc, prismaClientDst);
        console.log("[afterPack] ✓ @prisma/client copiado con éxito");
    }
};
