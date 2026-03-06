-- CreateTable
CREATE TABLE "Seccion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "prefijo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL DEFAULT '',
    "icono" TEXT NOT NULL DEFAULT 'menu_book',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Viga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL DEFAULT 20,
    "seccionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Viga_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Libro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "seccionId" TEXT NOT NULL,
    "vigaId" TEXT,
    "posicion" TEXT NOT NULL DEFAULT '',
    "estado" TEXT NOT NULL DEFAULT 'Disponible',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Libro_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Libro_vigaId_fkey" FOREIGN KEY ("vigaId") REFERENCES "Viga" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prestamo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "libroId" TEXT NOT NULL,
    "persona" TEXT NOT NULL,
    "fechaSalida" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaDevolucion" DATETIME,
    "devuelto" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Prestamo_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Juzgado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "jurisdiccion" TEXT NOT NULL DEFAULT '',
    "direccion" TEXT NOT NULL DEFAULT '',
    "telefono" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Expediente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "clienteTelefono" TEXT NOT NULL DEFAULT '',
    "clienteEmail" TEXT NOT NULL DEFAULT '',
    "juzgado" TEXT NOT NULL DEFAULT '',
    "abogado" TEXT NOT NULL DEFAULT '',
    "contraparte" TEXT NOT NULL DEFAULT '',
    "descripcion" TEXT NOT NULL DEFAULT '',
    "tipo" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Activo',
    "cotizacion" REAL NOT NULL DEFAULT 0,
    "metodoPago" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expedienteId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL DEFAULT 'Abono',
    "monto" REAL NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pago_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "Expediente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Nota" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expedienteId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Nota_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "Expediente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expedienteId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT '',
    "tamanio" TEXT NOT NULL DEFAULT '',
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Documento_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "Expediente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Seccion_nombre_key" ON "Seccion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Seccion_prefijo_key" ON "Seccion"("prefijo");

-- CreateIndex
CREATE UNIQUE INDEX "Viga_seccionId_numero_key" ON "Viga"("seccionId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "Libro_codigo_key" ON "Libro"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Juzgado_nombre_key" ON "Juzgado"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Expediente_numero_key" ON "Expediente"("numero");
