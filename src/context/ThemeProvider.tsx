"use client";
import { useEffect }        from "react";
import { useSettingsStore } from "@/store/settings";

/**
 * ThemeProvider — aplica el tema (oscuro/claro) en el elemento <html>.
 * Lee `darkMode` del settings store y escribe el atributo data-theme.
 * Se suscribe automáticamente a cambios del store.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useSettingsStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return <>{children}</>;
}
