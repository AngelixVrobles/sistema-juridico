"use client";
import { useEffect } from "react";
import { useSettingsStore } from "@/store/settings";

// Tipo mínimo de electronAPI necesario en este módulo
type ElectronAPI = {
  saveTheme?: (isDark: boolean) => void;
};

/**
 * ThemeProvider — aplica el tema (oscuro/claro) en el elemento <html>.
 * Lee `darkMode` del settings store y escribe el atributo data-theme.
 *
 * El script bloqueante en layout.tsx ya aplica el tema antes del primer
 * paint (elimina el flash blanco). Este provider lo mantiene sincronizado
 * durante la sesión y notifica al proceso principal de Electron para que
 * actualice el backgroundColor de la ventana en caliente.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useSettingsStore((s) => s.darkMode);

  useEffect(() => {
    // 1. Aplicar data-theme en el DOM
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );

    // 2. Persistir en el proceso principal de Electron (archivo nativo).
    //    Esto permite que createWindow() lea la preferencia al reiniciar
    //    y sincronice backgroundColor antes de mostrar la ventana.
    const api = (window as Window & { electronAPI?: ElectronAPI }).electronAPI;
    api?.saveTheme?.(darkMode);
  }, [darkMode]);

  return <>{children}</>;
}
