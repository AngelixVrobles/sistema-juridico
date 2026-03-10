import { prisma } from "@/lib/prisma";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL?.replace(/[^/\\]+$/, "***"),
    prismaEngine: process.env.PRISMA_QUERY_ENGINE_LIBRARY ? "set" : "not set",
    cwd: process.cwd(),
  };

  try {
    // Test database connection using count (avoids BigInt serialization issue with $queryRaw)
    const seccionCount = await prisma.seccion.count();
    const expedienteCount = await prisma.expediente.count();
    diagnostics.dbConnection = "OK";
    diagnostics.tables = { secciones: seccionCount, expedientes: expedienteCount };
  } catch (e: unknown) {
    diagnostics.dbConnection = "FAILED";
    diagnostics.dbError = e instanceof Error ? e.message : String(e);
    diagnostics.dbStack = e instanceof Error ? e.stack?.split("\n").slice(0, 5) : undefined;
  }

  const status = diagnostics.dbConnection === "OK" ? 200 : 500;
  return Response.json(diagnostics, { status });
}
