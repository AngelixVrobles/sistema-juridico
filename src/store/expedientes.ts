import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function today(): string {
  return new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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
  uploadDate: string;
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

export function getPaid(exp: Expediente): number {
  return exp.pagos.reduce((sum, p) => sum + p.amount, 0);
}

export function getPercent(exp: Expediente): number {
  if (exp.quote === 0) return 0;
  return Math.min(100, Math.round((getPaid(exp) / exp.quote) * 100));
}

const seedData: Expediente[] = [
  {
    id: "exp1", num: "EXP-2026-001",
    client: "Juan Garcia Lopez", clientPhone: "+52 (555) 123-4567", clientEmail: "juan.garcia@email.com",
    court: "Juzgado 1ro de lo Civil", lawyer: "Lic. Martinez",
    counterpart: "Maria Perez", description: "Divorcio por mutuo consentimiento con disputa de bienes inmuebles.",
    type: "Divorcio", status: "Activo", quote: 20000, paymentMethod: "Transferencia",
    pagos: [
      { id: "p1", desc: "Anticipo", amount: 5000, date: "10/ene./2026" },
      { id: "p2", desc: "Abono", amount: 5000, date: "10/feb./2026" },
      { id: "p3", desc: "Abono", amount: 5000, date: "1/mar./2026" },
    ],
    notas: [
      { id: "n1", text: "Se presento demanda ante juzgado", date: "10/ene./2026" },
      { id: "n2", text: "Audiencia programada para el 15/Mar", date: "25/feb./2026" },
    ],
    documentos: [
      { id: "d1", name: "Demanda_Divorcio.docx", type: "DOCX", size: "245 KB", uploadDate: "10/ene./2026" },
      { id: "d2", name: "Acta_Matrimonio.pdf", type: "PDF", size: "1.2 MB", uploadDate: "10/ene./2026" },
    ],
    createdAt: "10/ene./2026", updatedAt: "1/mar./2026",
  },
  {
    id: "exp2", num: "EXP-2026-002",
    client: "Roberto Martinez", clientPhone: "+52 (555) 234-5678", clientEmail: "roberto.m@email.com",
    court: "Juzgado 2do Familiar", lawyer: "Lic. Martinez",
    counterpart: "Empresa ABC SA", description: "Pension alimenticia y custodia de menores.",
    type: "Familiar", status: "En Espera", quote: 30000, paymentMethod: "Efectivo",
    pagos: [
      { id: "p4", desc: "Anticipo", amount: 10000, date: "15/ene./2026" },
      { id: "p5", desc: "Abono", amount: 3500, date: "15/feb./2026" },
    ],
    notas: [{ id: "n3", text: "En espera de fallo del juzgado", date: "20/feb./2026" }],
    documentos: [{ id: "d3", name: "Acta_Nacimiento.pdf", type: "PDF", size: "890 KB", uploadDate: "15/ene./2026" }],
    createdAt: "15/ene./2026", updatedAt: "15/feb./2026",
  },
  {
    id: "exp3", num: "EXP-2026-003",
    client: "Carlos Hernandez", clientPhone: "+52 (555) 345-6789", clientEmail: "carlos.h@email.com",
    court: "Juzgado 3ro Penal", lawyer: "Lic. Gomez",
    counterpart: "Ministerio Publico", description: "Defensa penal por robo con violencia.",
    type: "Penal", status: "Activo", quote: 25000, paymentMethod: "Transferencia",
    pagos: [{ id: "p6", desc: "Pago total", amount: 25000, date: "5/feb./2026" }],
    notas: [],
    documentos: [{ id: "d4", name: "Poder_Notarial.pdf", type: "PDF", size: "567 KB", uploadDate: "5/feb./2026" }],
    createdAt: "5/feb./2026", updatedAt: "5/feb./2026",
  },
  {
    id: "exp4", num: "EXP-2026-004",
    client: "Ana Sanchez Mora", clientPhone: "+52 (555) 456-7890", clientEmail: "ana.sanchez@email.com",
    court: "Juzgado Laboral", lawyer: "Lic. Martinez",
    counterpart: "Empresa XYZ SA de CV", description: "Demanda laboral por despido injustificado.",
    type: "Laboral", status: "Inactivo", quote: 15000, paymentMethod: "Cheque",
    pagos: [{ id: "p7", desc: "Anticipo", amount: 4500, date: "1/ene./2026" }],
    notas: [{ id: "n4", text: "Caso cerrado sin acuerdo", date: "15/feb./2026" }],
    documentos: [],
    createdAt: "1/ene./2026", updatedAt: "15/feb./2026",
  },
  {
    id: "exp5", num: "EXP-2026-005",
    client: "Maria Rodriguez", clientPhone: "+52 (555) 567-8901", clientEmail: "maria.r@email.com",
    court: "Tribunal Contencioso Administrativo", lawyer: "Lic. Gomez",
    counterpart: "Municipio de Monterrey", description: "Recurso contencioso por negativa de licencia de construccion.",
    type: "Contencioso", status: "Activo", quote: 40000, paymentMethod: "Transferencia",
    pagos: [
      { id: "p8", desc: "Anticipo", amount: 15000, date: "20/feb./2026" },
      { id: "p9", desc: "Abono", amount: 9000, date: "5/mar./2026" },
    ],
    notas: [{ id: "n5", text: "Primera audiencia el 15/Mar/2026", date: "20/feb./2026" }],
    documentos: [{ id: "d5", name: "Recurso_Contencioso.docx", type: "DOCX", size: "312 KB", uploadDate: "20/feb./2026" }],
    createdAt: "20/feb./2026", updatedAt: "5/mar./2026",
  },
];

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

interface ExpedientesState {
  expedientes: Expediente[];
  nextNum: number;
  addExpediente: (data: NewExpedienteData) => string;
  updateExpediente: (id: string, data: Partial<Omit<Expediente, "id" | "num" | "pagos" | "notas" | "documentos" | "createdAt">>) => void;
  deleteExpediente: (id: string) => void;
  addPago: (expedienteId: string, amount: number, desc?: string) => void;
  deletePago: (expedienteId: string, pagoId: string) => void;
  addNota: (expedienteId: string, text: string) => void;
  deleteNota: (expedienteId: string, notaId: string) => void;
  addDocumento: (expedienteId: string, doc: Omit<Documento, "id">) => void;
  deleteDocumento: (expedienteId: string, docId: string) => void;
}

export const useExpedientesStore = create<ExpedientesState>()(
  persist(
    (set) => ({
      expedientes: seedData,
      nextNum: 6,

      addExpediente: (data) => {
        const id = genId();
        set((state) => {
          const year = new Date().getFullYear();
          const num = `EXP-${year}-${String(state.nextNum).padStart(3, "0")}`;
          const newExp: Expediente = {
            id, num,
            client: data.client, clientPhone: data.clientPhone, clientEmail: data.clientEmail,
            court: data.court, lawyer: data.lawyer, counterpart: data.counterpart,
            description: data.description, type: data.type, status: data.status,
            quote: data.quote, paymentMethod: data.paymentMethod,
            pagos: data.advance > 0 ? [{ id: genId(), desc: "Anticipo", amount: data.advance, date: today() }] : [],
            notas: [], documentos: [],
            createdAt: today(), updatedAt: today(),
          };
          return { expedientes: [...state.expedientes, newExp], nextNum: state.nextNum + 1 };
        });
        return id;
      },

      updateExpediente: (id, data) => {
        set((state) => ({
          expedientes: state.expedientes.map((e) =>
            e.id === id ? { ...e, ...data, updatedAt: today() } : e
          ),
        }));
      },

      deleteExpediente: (id) => {
        set((state) => ({ expedientes: state.expedientes.filter((e) => e.id !== id) }));
      },

      addPago: (expedienteId, amount, desc = "Abono") => {
        set((state) => ({
          expedientes: state.expedientes.map((e) =>
            e.id === expedienteId
              ? { ...e, pagos: [...e.pagos, { id: genId(), desc, amount, date: today() }], updatedAt: today() }
              : e
          ),
        }));
      },

      deletePago: (expedienteId, pagoId) => {
        set((state) => ({
          expedientes: state.expedientes.map((e) =>
            e.id === expedienteId
              ? { ...e, pagos: e.pagos.filter((p) => p.id !== pagoId), updatedAt: today() }
              : e
          ),
        }));
      },

      addNota: (expedienteId, text) => {
        set((state) => ({
          expedientes: state.expedientes.map((e) =>
            e.id === expedienteId
              ? { ...e, notas: [...e.notas, { id: genId(), text, date: today() }], updatedAt: today() }
              : e
          ),
        }));
      },

      deleteNota: (expedienteId, notaId) => {
        set((state) => ({
          expedientes: state.expedientes.map((e) =>
            e.id === expedienteId
              ? { ...e, notas: e.notas.filter((n) => n.id !== notaId), updatedAt: today() }
              : e
          ),
        }));
      },

      addDocumento: (expedienteId, doc) => {
        set((state) => ({
          expedientes: state.expedientes.map((e) =>
            e.id === expedienteId
              ? { ...e, documentos: [...e.documentos, { ...doc, id: genId() }], updatedAt: today() }
              : e
          ),
        }));
      },

      deleteDocumento: (expedienteId, docId) => {
        set((state) => ({
          expedientes: state.expedientes.map((e) =>
            e.id === expedienteId
              ? { ...e, documentos: e.documentos.filter((d) => d.id !== docId), updatedAt: today() }
              : e
          ),
        }));
      },
    }),
    {
      name: "expedientes-storage",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        }
        return localStorage;
      }),
    }
  )
);
