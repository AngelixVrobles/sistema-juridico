"use client";
import { useState, useEffect, useCallback } from "react";

// ─── Tipos ─────────────────────────────────────────────────────────────────────

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

// ─── Hook de clientes ────────────────────────────────────────────────────────────

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

export function useClientesStore() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading,  setLoading]  = useState(true);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/clientes");
    if (res.ok) setClientes(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  async function addCliente(data: Omit<Cliente, "id" | "createdAt" | "updatedAt">) {
    const res = await fetch("/api/clientes", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error ?? "Error al crear cliente");
    }
    await fetchClientes();
  }

  async function updateCliente(id: string, data: Partial<Omit<Cliente, "id" | "createdAt" | "updatedAt">>) {
    const res = await fetch(`/api/clientes/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error ?? "Error al actualizar cliente");
    }
    await fetchClientes();
  }

  async function deleteCliente(id: string) {
    await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    await fetchClientes();
  }

  return { clientes, loading, addCliente, updateCliente, deleteCliente, refresh: fetchClientes };
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

// ─── Utilidades de cálculo ──────────────────────────────────────────────────────

export function getPaid(exp: Expediente): number {
  return exp.pagos.reduce((sum, p) => sum + p.amount, 0);
}

export function getPercent(exp: Expediente): number {
  if (exp.quote === 0) return 0;
  return Math.min(100, Math.round((getPaid(exp) / exp.quote) * 100));
}

// ─── Hook de juzgados ──────────────────────────────────────────────────────────

export interface Juzgado {
  id: string;
  nombre: string;
  jurisdiccion: string;
  direccion: string;
  telefono: string;
  expedientes: number;
}

export function useJuzgadosStore() {
  const [juzgados, setJuzgados] = useState<Juzgado[]>([]);
  const [loading,  setLoading]  = useState(true);

  const fetchJuzgados = useCallback(async () => {
    const res = await fetch("/api/juzgados");
    if (res.ok) setJuzgados(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchJuzgados(); }, [fetchJuzgados]);

  async function addJuzgado(data: Omit<Juzgado, "id" | "expedientes">) {
    const res = await fetch("/api/juzgados", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error ?? "Error al crear juzgado");
    }
    await fetchJuzgados();
  }

  async function updateJuzgado(id: string, data: Partial<Omit<Juzgado, "id" | "expedientes">>) {
    await fetch(`/api/juzgados/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    await fetchJuzgados();
  }

  async function deleteJuzgado(id: string) {
    await fetch(`/api/juzgados/${id}`, { method: "DELETE" });
    await fetchJuzgados();
  }

  return { juzgados, loading, addJuzgado, updateJuzgado, deleteJuzgado, refresh: fetchJuzgados };
}

// ─── Hook principal de expedientes ──────────────────────────────────────────────

export function useExpedientesStore() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading,     setLoading]     = useState(true);

  const fetchExpedientes = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/expedientes");
    if (res.ok) setExpedientes(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchExpedientes(); }, [fetchExpedientes]);

  // ── Expedientes ─────────────────────────────────────────────────────────────

  async function addExpediente(data: NewExpedienteData): Promise<string> {
    const res = await fetch("/api/expedientes", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    const exp: Expediente = await res.json();
    await fetchExpedientes();
    return exp.id;
  }

  async function updateExpediente(
    id: string,
    data: Partial<Omit<Expediente, "id" | "num" | "pagos" | "notas" | "documentos" | "createdAt">>
  ) {
    await fetch(`/api/expedientes/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    await fetchExpedientes();
  }

  async function deleteExpediente(id: string) {
    await fetch(`/api/expedientes/${id}`, { method: "DELETE" });
    await fetchExpedientes();
  }

  // ── Pagos ───────────────────────────────────────────────────────────────────

  async function addPago(expedienteId: string, amount: number, desc = "Abono") {
    await fetch(`/api/expedientes/${expedienteId}/pagos`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ amount, desc }),
    });
    await fetchExpedientes();
  }

  async function deletePago(expedienteId: string, pagoId: string) {
    await fetch(`/api/expedientes/${expedienteId}/pagos/${pagoId}`, { method: "DELETE" });
    await fetchExpedientes();
  }

  // ── Notas ───────────────────────────────────────────────────────────────────

  async function addNota(expedienteId: string, text: string) {
    await fetch(`/api/expedientes/${expedienteId}/notas`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ text }),
    });
    await fetchExpedientes();
  }

  async function deleteNota(expedienteId: string, notaId: string) {
    await fetch(`/api/expedientes/${expedienteId}/notas/${notaId}`, { method: "DELETE" });
    await fetchExpedientes();
  }

  // ── Documentos ──────────────────────────────────────────────────────────────

  async function addDocumento(expedienteId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/expedientes/${expedienteId}/documentos`, {
      method: "POST",
      body:   formData,
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error ?? "Error al subir documento");
    }
    await fetchExpedientes();
  }

  async function deleteDocumento(expedienteId: string, docId: string) {
    await fetch(`/api/expedientes/${expedienteId}/documentos/${docId}`, { method: "DELETE" });
    await fetchExpedientes();
  }

  return {
    expedientes, loading,
    addExpediente, updateExpediente, deleteExpediente,
    addPago, deletePago,
    addNota, deleteNota,
    addDocumento, deleteDocumento,
    refresh: fetchExpedientes,
  };
}
