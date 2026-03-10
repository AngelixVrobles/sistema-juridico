-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Libro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "seccionId" TEXT NOT NULL,
    "vigaId" TEXT,
    "posicion" TEXT NOT NULL DEFAULT '',
    "estado" TEXT NOT NULL DEFAULT 'Disponible',
    "portada" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Libro_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Libro_vigaId_fkey" FOREIGN KEY ("vigaId") REFERENCES "Viga" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Libro" ("autor", "codigo", "createdAt", "estado", "id", "posicion", "seccionId", "titulo", "updatedAt", "vigaId") SELECT "autor", "codigo", "createdAt", "estado", "id", "posicion", "seccionId", "titulo", "updatedAt", "vigaId" FROM "Libro";
DROP TABLE "Libro";
ALTER TABLE "new_Libro" RENAME TO "Libro";
CREATE UNIQUE INDEX "Libro_codigo_key" ON "Libro"("codigo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
