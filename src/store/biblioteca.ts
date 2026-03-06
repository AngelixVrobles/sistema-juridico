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

export interface Libro {
  id: string;
  code: string;
  title: string;
  author: string;
  section: string;
  viga: string;
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

const seedLibros: Libro[] = [
  { id: "lib1", code: "CIV-V01-003", title: "Codigo Civil Comentado", author: "Eduardo Garcia", section: "Civil", viga: "V01", position: "003", status: "Disponible", createdAt: "1/ene./2026" },
  { id: "lib2", code: "PEN-V02-001", title: "Derecho Penal Mexicano", author: "Raul Carranca", section: "Penal", viga: "V02", position: "001", status: "Prestado", createdAt: "1/ene./2026" },
  { id: "lib3", code: "LAB-V01-005", title: "Ley Federal del Trabajo", author: "Alberto Trueba", section: "Laboral", viga: "V01", position: "005", status: "Disponible", createdAt: "15/ene./2026" },
  { id: "lib4", code: "MER-V01-002", title: "Derecho Mercantil", author: "Roberto Mantilla", section: "Mercantil", viga: "V01", position: "002", status: "Disponible", createdAt: "20/ene./2026" },
  { id: "lib5", code: "CON-V01-002", title: "Constitucion Politica de los Estados Unidos Mexicanos", author: "Gobierno Federal", section: "Constitucional", viga: "V01", position: "002", status: "Disponible", createdAt: "1/ene./2026" },
];

const seedPrestamos: Prestamo[] = [
  { id: "pr1", bookId: "lib2", bookCode: "PEN-V02-001", bookTitle: "Derecho Penal Mexicano", person: "Juan Perez", dateOut: "15/ene./2026", dateReturn: "15/feb./2026", returned: false },
  { id: "pr2", bookId: "lib3", bookCode: "LAB-V01-005", bookTitle: "Ley Federal del Trabajo", person: "Maria Garcia", dateOut: "20/ene./2026", dateReturn: "20/feb./2026", returned: true },
  { id: "pr3", bookId: "lib4", bookCode: "MER-V01-002", bookTitle: "Derecho Mercantil", person: "Carlos Lopez", dateOut: "1/feb./2026", dateReturn: "1/mar./2026", returned: true },
];

const SECTION_PREFIX: Record<string, string> = {
  Civil: "CIV", Penal: "PEN", Laboral: "LAB", Mercantil: "MER",
  Constitucional: "CON", Otros: "OTR",
};

interface BibliotecaState {
  libros: Libro[];
  prestamos: Prestamo[];
  nextCode: Record<string, number>;
  addLibro: (data: Omit<Libro, "id" | "code" | "status" | "createdAt">) => void;
  updateLibro: (id: string, data: Partial<Omit<Libro, "id" | "code" | "createdAt">>) => void;
  deleteLibro: (id: string) => void;
  addPrestamo: (bookId: string, person: string, dateReturn: string) => void;
  returnPrestamo: (prestamoId: string) => void;
}

export const useBibliotecaStore = create<BibliotecaState>()(
  persist(
    (set, get) => ({
      libros: seedLibros,
      prestamos: seedPrestamos,
      nextCode: { Civil: 10, Penal: 5, Laboral: 8, Mercantil: 4, Constitucional: 4, Otros: 1 },

      addLibro: (data) => {
        set((state) => {
          const prefix = SECTION_PREFIX[data.section] || "LIB";
          const n = state.nextCode[data.section] || 1;
          const code = `${prefix}-${data.viga}-${String(n).padStart(3, "0")}`;
          const newLibro: Libro = {
            id: genId(), code,
            title: data.title, author: data.author, section: data.section,
            viga: data.viga, position: data.position || String(n).padStart(3, "0"),
            status: "Disponible", createdAt: today(),
          };
          return {
            libros: [...state.libros, newLibro],
            nextCode: { ...state.nextCode, [data.section]: n + 1 },
          };
        });
      },

      updateLibro: (id, data) => {
        set((state) => ({
          libros: state.libros.map((l) => (l.id === id ? { ...l, ...data } : l)),
        }));
      },

      deleteLibro: (id) => {
        set((state) => ({ libros: state.libros.filter((l) => l.id !== id) }));
      },

      addPrestamo: (bookId, person, dateReturn) => {
        const libro = get().libros.find((l) => l.id === bookId);
        if (!libro || libro.status === "Prestado") return;
        set((state) => ({
          libros: state.libros.map((l) =>
            l.id === bookId ? { ...l, status: "Prestado" as const } : l
          ),
          prestamos: [
            ...state.prestamos,
            {
              id: genId(), bookId, bookCode: libro.code, bookTitle: libro.title,
              person, dateOut: today(), dateReturn, returned: false,
            },
          ],
        }));
      },

      returnPrestamo: (prestamoId) => {
        set((state) => {
          const prestamo = state.prestamos.find((p) => p.id === prestamoId);
          if (!prestamo) return state;
          return {
            prestamos: state.prestamos.map((p) =>
              p.id === prestamoId ? { ...p, returned: true } : p
            ),
            libros: state.libros.map((l) =>
              l.id === prestamo.bookId ? { ...l, status: "Disponible" as const } : l
            ),
          };
        });
      },
    }),
    {
      name: "biblioteca-storage",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        }
        return localStorage;
      }),
    }
  )
);
