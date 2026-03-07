"use client";
import { create }            from "zustand";
import { useEffect }         from "react";
import { useSettingsStore }  from "./settings";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Libro {
  id: string;
  code: string;
  title: string;
  author: string;
  section: string;
  sectionId: string;
  viga: string;
  vigaId: string | null;
  position: string;
  status: "Disponible" | "Prestado";
  createdAt: string;
}

export interface Prestamo {
  id: string;
  bookId: string;
  bookCode: string;
  bookTitle: string;
  person: string;
  dateOut: string;
  dateReturn: string;
  returned: boolean;
}

export interface Seccion {
  id: string;
  nombre: string;
  prefijo: string;
  descripcion: string;
  icono: string;
  bookCount: number;
  vigaCount: number;
}

export interface Viga {
  id: string;
  numero: string;
  capacidad: number;
  seccionId: string;
  seccionNombre: string;
  seccionPrefijo: string;
  libroCount: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CACHE_TTL = 30_000; // 30 segundos

function api(path: string): string {
  const { serverUrl } = useSettingsStore.getState();
  const base = serverUrl ? serverUrl.replace(/\/$/, "") : "";
  return `${base}${path}`;
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(api(path));
    if (res.ok) return res.json();
    return null;
  } catch {
    return null;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(api(path), {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error((d as Record<string,string>).error ?? "Error en la petición");
  }
  return res.json();
}

async function putJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(api(path), {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error al actualizar");
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(api(path), { method: "DELETE" });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error((d as Record<string,string>).error ?? "Error al eliminar");
  }
}

// ─── Estado del store ────────────────────────────────────────────────────────

interface BibliotecaState {
  libros:      Libro[];
  prestamos:   Prestamo[];
  secciones:   Seccion[];
  vigas:       Viga[];
  loading:     boolean;
  lastFetched: number;

  // Acciones internas
  _init:    () => Promise<void>;
  refresh:  () => Promise<void>;
  _refetchMeta: () => Promise<void>;

  // Libros
  addLibro:    (data: { title: string; author: string; section: string; viga: string; position: string }) => Promise<void>;
  updateLibro: (id: string, data: Partial<Pick<Libro, "title" | "author" | "section" | "viga" | "position" | "status">>) => Promise<void>;
  deleteLibro: (id: string) => Promise<void>;

  // Préstamos
  addPrestamo:    (bookId: string, person: string, dateReturn: string) => Promise<void>;
  returnPrestamo: (prestamoId: string) => Promise<void>;

  // Secciones
  addSeccion:    (data: { nombre: string; prefijo: string; descripcion: string; icono: string }) => Promise<void>;
  updateSeccion: (id: string, data: Partial<Pick<Seccion, "nombre" | "prefijo" | "descripcion" | "icono">>) => Promise<void>;
  deleteSeccion: (id: string) => Promise<void>;

  // Vigas
  addViga:    (data: { numero: string; capacidad: number; seccionId: string }) => Promise<void>;
  deleteViga: (id: string) => Promise<void>;
}

// ─── Timer de polling (módulo, no estado) ────────────────────────────────────

let _pollTimer: ReturnType<typeof setInterval> | null = null;

// ─── Zustand store singleton ──────────────────────────────────────────────────

const _store = create<BibliotecaState>()((set, get) => ({
  libros:      [],
  prestamos:   [],
  secciones:   [],
  vigas:       [],
  loading:     false,
  lastFetched: 0,

  // ── Init (con caché) ──────────────────────────────────────────────────────

  _init: async () => {
    if (Date.now() - get().lastFetched < CACHE_TTL) return;
    await get().refresh();

    // Iniciar polling una sola vez
    if (typeof window !== "undefined" && !_pollTimer) {
      const ms = (useSettingsStore.getState().pollInterval || 30) * 1000;
      _pollTimer = setInterval(() => {
        _store.getState().refresh();
      }, ms);
    }
  },

  // ── Fetch completo ────────────────────────────────────────────────────────

  refresh: async () => {
    set({ loading: true });
    try {
      const [libros, prestamos, secciones, vigas] = await Promise.all([
        getJson<Libro[]>("/api/biblioteca/libros"),
        getJson<Prestamo[]>("/api/biblioteca/prestamos"),
        getJson<Seccion[]>("/api/biblioteca/secciones"),
        getJson<Viga[]>("/api/biblioteca/vigas"),
      ]);
      set({
        libros:      libros      ?? get().libros,
        prestamos:   prestamos   ?? get().prestamos,
        secciones:   secciones   ?? get().secciones,
        vigas:       vigas       ?? get().vigas,
        loading:     false,
        lastFetched: Date.now(),
      });
    } catch {
      set({ loading: false });
    }
  },

  // Refrescar solo secciones y vigas (conteos cambian al añadir/borrar libros)
  _refetchMeta: async () => {
    const [secciones, vigas] = await Promise.all([
      getJson<Seccion[]>("/api/biblioteca/secciones"),
      getJson<Viga[]>("/api/biblioteca/vigas"),
    ]);
    set({ secciones: secciones ?? get().secciones, vigas: vigas ?? get().vigas });
  },

  // ── Libros ───────────────────────────────────────────────────────────────

  addLibro: async (data) => {
    const libro = await postJson<Libro>("/api/biblioteca/libros", data);
    set((s) => ({ libros: [libro, ...s.libros] }));
    get()._refetchMeta(); // actualizar conteos en background
  },

  updateLibro: async (id, data) => {
    await putJson(`/api/biblioteca/libros/${id}`, data);
    set((s) => ({
      libros: s.libros.map((b) => (b.id === id ? { ...b, ...data } : b)),
    }));
  },

  deleteLibro: async (id) => {
    await del(`/api/biblioteca/libros/${id}`);
    set((s) => ({ libros: s.libros.filter((b) => b.id !== id) }));
    get()._refetchMeta();
  },

  // ── Préstamos ─────────────────────────────────────────────────────────────

  addPrestamo: async (bookId, person, dateReturn) => {
    const prestamo = await postJson<Prestamo>("/api/biblioteca/prestamos", { bookId, person, dateReturn });
    set((s) => ({
      prestamos: [prestamo, ...s.prestamos],
      libros:    s.libros.map((b) => b.id === bookId ? { ...b, status: "Prestado" as const } : b),
    }));
  },

  returnPrestamo: async (prestamoId) => {
    const updated = await putJson<Prestamo>(`/api/biblioteca/prestamos/${prestamoId}`, { returned: true });
    set((s) => ({
      prestamos: s.prestamos.map((p) => p.id === prestamoId ? { ...p, returned: true } : p),
      libros:    s.libros.map((b) => b.id === updated.bookId ? { ...b, status: "Disponible" as const } : b),
    }));
  },

  // ── Secciones ─────────────────────────────────────────────────────────────

  addSeccion: async (data) => {
    const seccion = await postJson<Seccion>("/api/biblioteca/secciones", data);
    set((s) => ({ secciones: [...s.secciones, seccion] }));
  },

  updateSeccion: async (id, data) => {
    await putJson(`/api/biblioteca/secciones/${id}`, data);
    set((s) => ({
      secciones: s.secciones.map((sec) => sec.id === id ? { ...sec, ...data } : sec),
    }));
  },

  deleteSeccion: async (id) => {
    await del(`/api/biblioteca/secciones/${id}`);
    set((s) => ({
      secciones: s.secciones.filter((sec) => sec.id !== id),
      vigas:     s.vigas.filter((v) => v.seccionId !== id),
    }));
  },

  // ── Vigas ─────────────────────────────────────────────────────────────────

  addViga: async (data) => {
    const viga = await postJson<Viga>("/api/biblioteca/vigas", data);
    set((s) => ({
      vigas:     [...s.vigas, viga],
      secciones: s.secciones.map((sec) =>
        sec.id === data.seccionId ? { ...sec, vigaCount: sec.vigaCount + 1 } : sec
      ),
    }));
  },

  deleteViga: async (id) => {
    const viga = get().vigas.find((v) => v.id === id);
    await del(`/api/biblioteca/vigas/${id}`);
    set((s) => ({
      vigas:     s.vigas.filter((v) => v.id !== id),
      secciones: s.secciones.map((sec) =>
        sec.id === viga?.seccionId ? { ...sec, vigaCount: Math.max(0, sec.vigaCount - 1) } : sec
      ),
    }));
  },
}));

// ─── Hook público (mismo nombre que antes → cero cambios en páginas) ──────────

export function useBibliotecaStore() {
  const state = _store();

  // Trigger init on first mount (con caché automática)
  useEffect(() => {
    _store.getState()._init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
