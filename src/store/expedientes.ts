"use client";
import { create }           from "zustand";
import { useEffect }        from "react";
import { useSettingsStore } from "./settings";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Pago {
  id: string;
  desc: string;
  amount: number;
  date: string;
}

export interface Nota {
  id: string;
  text: string;
  date: string;
}

export interface Documento {
  id: string;
  name: string;
  type: string;
  size: string;
  filePath: string;
  uploadDate: string;
}

export interface Cliente {
  id:        string;
  nombre:    string;
  telefono:  string;
  email:     string;
  direccion: string;
  notas:     string;
  createdAt: string;
  updatedAt: string;
}

export interface Juzgado {
  id: string;
  nombre: string;
  jurisdiccion: string;
  direccion: string;
  telefono: string;
  expedientes: number;
}

export interface Expediente {
  id: string;
  num: string;
  client: string;
  clientPhone: string;
  clientEmail: string;
  court: string;
  lawyer: string;
  counterpart: string;
  description: string;
  type: string;
  status: "Activo" | "En Espera" | "Inactivo";
  quote: number;
  paymentMethod: string;
  pagos: Pago[];
  notas: Nota[];
  documentos: Documento[];
  createdAt: string;
  updatedAt: string;
}

export interface NewExpedienteData {
  client: string;
  clientPhone: string;
  clientEmail: string;
  court: string;
  lawyer: string;
  counterpart: string;
  description: string;
  type: string;
  status: "Activo" | "En Espera";
  quote: number;
  advance: number;
  paymentMethod: string;
}

// ─── Utilidades de cálculo ───────────────────────────────────────────────────

export function getPaid(exp: Expediente): number {
  return exp.pagos.reduce((sum, p) => sum + p.amount, 0);
}

export function getPercent(exp: Expediente): number {
  if (exp.quote === 0) return 0;
  return Math.min(100, Math.round((getPaid(exp) / exp.quote) * 100));
}

// ─── Helpers de API ──────────────────────────────────────────────────────────

const CACHE_TTL = 30_000;

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
  const url = api(path);
  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    let errorMsg = `HTTP ${res.status}`;
    try { const d = JSON.parse(text); errorMsg = d.error || errorMsg; } catch { errorMsg = text.slice(0, 200) || errorMsg; }
    console.error("[postJson] ERROR:", res.status, errorMsg);
    throw new Error(errorMsg);
  }
  return res.json();
}

async function putJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(api(path), {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    let errorMsg = `HTTP ${res.status}`;
    try { const d = JSON.parse(text); errorMsg = d.error || errorMsg; } catch { errorMsg = text.slice(0, 200) || errorMsg; }
    throw new Error(errorMsg);
  }
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(api(path), { method: "DELETE" });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error((d as Record<string,string>).error ?? "Error al eliminar");
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENTES STORE
// ═══════════════════════════════════════════════════════════════════════════════

interface ClientesState {
  clientes:    Cliente[];
  loading:     boolean;
  lastFetched: number;
  _init:       () => Promise<void>;
  refresh:     () => Promise<void>;
  addCliente:    (data: Omit<Cliente, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateCliente: (id: string, data: Partial<Omit<Cliente, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
}

let _clientesPoll: ReturnType<typeof setInterval> | null = null;

const _clientesStore = create<ClientesState>()((set, get) => ({
  clientes:    [],
  loading:     false,
  lastFetched: 0,

  _init: async () => {
    if (Date.now() - get().lastFetched < CACHE_TTL) return;
    await get().refresh();
    if (typeof window !== "undefined" && !_clientesPoll) {
      const ms = (useSettingsStore.getState().pollInterval || 30) * 1000;
      _clientesPoll = setInterval(() => _clientesStore.getState().refresh(), ms);
    }
  },

  refresh: async () => {
    set({ loading: true });
    const clientes = await getJson<Cliente[]>("/api/clientes");
    set({ clientes: clientes ?? get().clientes, loading: false, lastFetched: Date.now() });
  },

  addCliente: async (data) => {
    const cliente = await postJson<Cliente>("/api/clientes", data);
    set((s) => ({ clientes: [cliente, ...s.clientes] }));
  },

  updateCliente: async (id, data) => {
    await putJson(`/api/clientes/${id}`, data);
    set((s) => ({
      clientes: s.clientes.map((c) => c.id === id ? { ...c, ...data } : c),
    }));
  },

  deleteCliente: async (id) => {
    await del(`/api/clientes/${id}`);
    set((s) => ({ clientes: s.clientes.filter((c) => c.id !== id) }));
  },
}));

export function useClientesStore() {
  const state = _clientesStore();
  useEffect(() => { _clientesStore.getState()._init(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}

// ═══════════════════════════════════════════════════════════════════════════════
// JUZGADOS STORE
// ═══════════════════════════════════════════════════════════════════════════════

interface JuzgadosState {
  juzgados:    Juzgado[];
  loading:     boolean;
  lastFetched: number;
  _init:       () => Promise<void>;
  refresh:     () => Promise<void>;
  addJuzgado:    (data: Omit<Juzgado, "id" | "expedientes">) => Promise<void>;
  updateJuzgado: (id: string, data: Partial<Omit<Juzgado, "id" | "expedientes">>) => Promise<void>;
  deleteJuzgado: (id: string) => Promise<void>;
}

let _juzgadosPoll: ReturnType<typeof setInterval> | null = null;

const _juzgadosStore = create<JuzgadosState>()((set, get) => ({
  juzgados:    [],
  loading:     false,
  lastFetched: 0,

  _init: async () => {
    if (Date.now() - get().lastFetched < CACHE_TTL) return;
    await get().refresh();
    if (typeof window !== "undefined" && !_juzgadosPoll) {
      const ms = (useSettingsStore.getState().pollInterval || 30) * 1000;
      _juzgadosPoll = setInterval(() => _juzgadosStore.getState().refresh(), ms);
    }
  },

  refresh: async () => {
    set({ loading: true });
    const juzgados = await getJson<Juzgado[]>("/api/juzgados");
    set({ juzgados: juzgados ?? get().juzgados, loading: false, lastFetched: Date.now() });
  },

  addJuzgado: async (data) => {
    const juzgado = await postJson<Juzgado>("/api/juzgados", data);
    set((s) => ({ juzgados: [...s.juzgados, juzgado] }));
  },

  updateJuzgado: async (id, data) => {
    await putJson(`/api/juzgados/${id}`, data);
    set((s) => ({
      juzgados: s.juzgados.map((j) => j.id === id ? { ...j, ...data } : j),
    }));
  },

  deleteJuzgado: async (id) => {
    await del(`/api/juzgados/${id}`);
    set((s) => ({ juzgados: s.juzgados.filter((j) => j.id !== id) }));
  },
}));

export function useJuzgadosStore() {
  const state = _juzgadosStore();
  useEffect(() => { _juzgadosStore.getState()._init(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPEDIENTES STORE
// ═══════════════════════════════════════════════════════════════════════════════

interface ExpedientesState {
  expedientes: Expediente[];
  loading:     boolean;
  lastFetched: number;
  _init:       () => Promise<void>;
  refresh:     () => Promise<void>;

  addExpediente:    (data: NewExpedienteData) => Promise<string>;
  updateExpediente: (id: string, data: Partial<Omit<Expediente, "id" | "num" | "pagos" | "notas" | "documentos" | "createdAt">>) => Promise<void>;
  deleteExpediente: (id: string) => Promise<void>;

  addPago:    (expedienteId: string, amount: number, desc?: string) => Promise<void>;
  deletePago: (expedienteId: string, pagoId: string) => Promise<void>;

  addNota:    (expedienteId: string, text: string) => Promise<void>;
  deleteNota: (expedienteId: string, notaId: string) => Promise<void>;

  addDocumento:    (expedienteId: string, file: File) => Promise<void>;
  deleteDocumento: (expedienteId: string, docId: string) => Promise<void>;
}

let _expedientesPoll: ReturnType<typeof setInterval> | null = null;

const _expedientesStore = create<ExpedientesState>()((set, get) => ({
  expedientes: [],
  loading:     false,
  lastFetched: 0,

  _init: async () => {
    if (Date.now() - get().lastFetched < CACHE_TTL) return;
    await get().refresh();
    if (typeof window !== "undefined" && !_expedientesPoll) {
      const ms = (useSettingsStore.getState().pollInterval || 30) * 1000;
      _expedientesPoll = setInterval(() => _expedientesStore.getState().refresh(), ms);
    }
  },

  refresh: async () => {
    set({ loading: true });
    const expedientes = await getJson<Expediente[]>("/api/expedientes");
    set({ expedientes: expedientes ?? get().expedientes, loading: false, lastFetched: Date.now() });
  },

  // ── Expedientes ───────────────────────────────────────────────────────────

  addExpediente: async (data) => {
    const exp = await postJson<Expediente>("/api/expedientes", data);
    set((s) => ({ expedientes: [exp, ...s.expedientes] }));
    return exp.id;
  },

  updateExpediente: async (id, data) => {
    await putJson(`/api/expedientes/${id}`, data);
    set((s) => ({
      expedientes: s.expedientes.map((e) => e.id === id ? { ...e, ...data } : e),
    }));
  },

  deleteExpediente: async (id) => {
    await del(`/api/expedientes/${id}`);
    set((s) => ({ expedientes: s.expedientes.filter((e) => e.id !== id) }));
  },

  // ── Pagos ─────────────────────────────────────────────────────────────────

  addPago: async (expedienteId, amount, desc = "Abono") => {
    const pago = await postJson<Pago>(`/api/expedientes/${expedienteId}/pagos`, { amount, desc });
    set((s) => ({
      expedientes: s.expedientes.map((e) =>
        e.id === expedienteId ? { ...e, pagos: [...e.pagos, pago] } : e
      ),
    }));
  },

  deletePago: async (expedienteId, pagoId) => {
    await del(`/api/expedientes/${expedienteId}/pagos/${pagoId}`);
    set((s) => ({
      expedientes: s.expedientes.map((e) =>
        e.id === expedienteId
          ? { ...e, pagos: e.pagos.filter((p) => p.id !== pagoId) }
          : e
      ),
    }));
  },

  // ── Notas ─────────────────────────────────────────────────────────────────

  addNota: async (expedienteId, text) => {
    const nota = await postJson<Nota>(`/api/expedientes/${expedienteId}/notas`, { text });
    set((s) => ({
      expedientes: s.expedientes.map((e) =>
        e.id === expedienteId ? { ...e, notas: [...e.notas, nota] } : e
      ),
    }));
  },

  deleteNota: async (expedienteId, notaId) => {
    await del(`/api/expedientes/${expedienteId}/notas/${notaId}`);
    set((s) => ({
      expedientes: s.expedientes.map((e) =>
        e.id === expedienteId
          ? { ...e, notas: e.notas.filter((n) => n.id !== notaId) }
          : e
      ),
    }));
  },

  // ── Documentos ────────────────────────────────────────────────────────────

  addDocumento: async (expedienteId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(api(`/api/expedientes/${expedienteId}/documentos`), {
      method: "POST",
      body:   formData,
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error((d as Record<string,string>).error ?? "Error al subir documento");
    }
    const doc = await res.json() as Documento;
    set((s) => ({
      expedientes: s.expedientes.map((e) =>
        e.id === expedienteId
          ? { ...e, documentos: [doc, ...e.documentos] }
          : e
      ),
    }));
  },

  deleteDocumento: async (expedienteId, docId) => {
    await del(`/api/expedientes/${expedienteId}/documentos/${docId}`);
    set((s) => ({
      expedientes: s.expedientes.map((e) =>
        e.id === expedienteId
          ? { ...e, documentos: e.documentos.filter((d) => d.id !== docId) }
          : e
      ),
    }));
  },
}));

export function useExpedientesStore() {
  const state = _expedientesStore();
  useEffect(() => { _expedientesStore.getState()._init(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}
