-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "direccion" TEXT NOT NULL DEFAULT '',
    "notas" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Documento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expedienteId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT '',
    "tamanio" TEXT NOT NULL DEFAULT '',
    "rutaArchivo" TEXT NOT NULL DEFAULT '',
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Documento_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "Expediente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Documento" ("createdAt", "expedienteId", "fecha", "id", "nombre", "tamanio", "tipo") SELECT "createdAt", "expedienteId", "fecha", "id", "nombre", "tamanio", "tipo" FROM "Documento";
DROP TABLE "Documento";
ALTER TABLE "new_Documento" RENAME TO "Documento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
