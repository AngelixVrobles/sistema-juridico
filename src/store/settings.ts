"use client";
import { create }   from "zustand";
import { persist }  from "zustand/middleware";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Settings {
  officeName:   string;   // Nombre oficial del despacho
  userName:     string;   // Nombre del usuario activo
  userRole:     string;   // Rol del usuario
  darkMode:     boolean;  // Modo oscuro
  serverUrl:    string;   // URL del servidor remoto ("" = local)
  pollInterval: number;   // Intervalo de sincronización en segundos
}

interface SettingsStore extends Settings {
  update: (patch: Partial<Settings>) => void;
  reset:  () => void;
}

// ─── Valores por defecto ──────────────────────────────────────────────────────

const DEFAULTS: Settings = {
  officeName:   "Oficina de abogados José La Paz Lantigua",
  userName:     "Lic. José La Paz Lantigua",
  userRole:     "Abogado Titular",
  darkMode:     false,
  serverUrl:    "",
  pollInterval: 30,
};

// ─── Store con persistencia en localStorage ───────────────────────────────────

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      update: (patch) => set((s) => ({ ...s, ...patch })),
      reset:  () => set(DEFAULTS),
    }),
    {
      name:    "juridico-settings",
      // Solo persistir los campos de configuración (no acciones)
      partialize: (s) => ({
        officeName:   s.officeName,
        userName:     s.userName,
        userRole:     s.userRole,
        darkMode:     s.darkMode,
        serverUrl:    s.serverUrl,
        pollInterval: s.pollInterval,
      }),
    }
  )
);
