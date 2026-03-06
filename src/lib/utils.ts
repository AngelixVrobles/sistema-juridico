/** Formatea una fecha al estilo "01/ene./2026" usado en la UI */
export function fmt(date: Date): string {
  return date.toLocaleDateString("es-MX", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });
}

/** Respuesta JSON de error */
export function err(msg: string, status = 400) {
  return Response.json({ error: msg }, { status });
}
