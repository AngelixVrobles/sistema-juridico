"use client";
import { useState, useEffect, useCallback } from "react";

// ─── Tipos ─────────────────────────────────────────────────────────────────────

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

// ─── Hook principal ─────────────────────────────────────────────────────────────

export function useBibliotecaStore() {
  const [libros,    setLibros]    = useState<Libro[]>([]);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [vigas,     setVigas]     = useState<Viga[]>([]);
  const [loading,   setLoading]   = useState(true);

  // ── Fetch ───────────────────────────────────────────────────────────────────

  const fetchLibros = useCallback(async () => {
    const res = await fetch("/api/biblioteca/libros");
    if (res.ok) setLibros(await res.json());
  }, []);

  const fetchPrestamos = useCallback(async () => {
    const res = await fetch("/api/biblioteca/prestamos");
    if (res.ok) setPrestamos(await res.json());
  }, []);

  const fetchSecciones = useCallback(async () => {
    const res = await fetch("/api/biblioteca/secciones");
    if (res.ok) setSecciones(await res.json());
  }, []);

  const fetchVigas = useCallback(async () => {
    const res = await fetch("/api/biblioteca/vigas");
    if (res.ok) setVigas(await res.json());
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchLibros(), fetchPrestamos(), fetchSecciones(), fetchVigas()]);
    setLoading(false);
  }, [fetchLibros, fetchPrestamos, fetchSecciones, fetchVigas]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Libros ──────────────────────────────────────────────────────────────────

  async function addLibro(data: { title: string; author: string; section: string; viga: string; position: string }) {
    await fetch("/api/biblioteca/libros", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    await Promise.all([fetchLibros(), fetchSecciones(), fetchVigas()]);
  }

  async function updateLibro(id: string, data: Partial<Pick<Libro, "title" | "author" | "section" | "viga" | "position" | "status">>) {
    await fetch(`/api/biblioteca/libros/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    await fetchLibros();
  }

  async function deleteLibro(id: string) {
    const res = await fetch(`/api/biblioteca/libros/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Error al eliminar");
    }
    await Promise.all([fetchLibros(), fetchSecciones()]);
  }

  // ── Préstamos ───────────────────────────────────────────────────────────────

  async function addPrestamo(bookId: string, person: string, dateReturn: string) {
    await fetch("/api/biblioteca/prestamos", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ bookId, person, dateReturn }),
    });
    await fetchAll();
  }

  async function returnPrestamo(prestamoId: string) {
    await fetch(`/api/biblioteca/prestamos/${prestamoId}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ returned: true }),
    });
    await fetchAll();
  }

  // ── Secciones ───────────────────────────────────────────────────────────────

  async function addSeccion(data: { nombre: string; prefijo: string; descripcion: string; icono: string }) {
    const res = await fetch("/api/biblioteca/secciones", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error ?? "Error al crear sección");
    }
    await Promise.all([fetchSecciones(), fetchVigas()]);
  }

  async function updateSeccion(id: string, data: Partial<Pick<Seccion, "nombre" | "prefijo" | "descripcion" | "icono">>) {
    await fetch(`/api/biblioteca/secciones/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    await fetchSecciones();
  }

  async function deleteSeccion(id: string) {
    const res = await fetch(`/api/biblioteca/secciones/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error ?? "Error al eliminar sección");
    }
    await Promise.all([fetchSecciones(), fetchVigas()]);
  }

  // ── Vigas ───────────────────────────────────────────────────────────────────

  async function addViga(data: { numero: string; capacidad: number; seccionId: string }) {
    const res = await fetch("/api/biblioteca/vigas", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error ?? "Error al crear viga");
    }
    await Promise.all([fetchVigas(), fetchSecciones()]);
  }

  async function deleteViga(id: string) {
    const res = await fetch(`/api/biblioteca/vigas/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error ?? "Error al eliminar viga");
    }
    await Promise.all([fetchVigas(), fetchSecciones()]);
  }

  return {
    libros, prestamos, secciones, vigas, loading,
    addLibro, updateLibro, deleteLibro,
    addPrestamo, returnPrestamo,
    addSeccion, updateSeccion, deleteSeccion,
    addViga, deleteViga,
    refresh: fetchAll,
  };
}
