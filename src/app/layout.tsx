import type { Metadata } from "next";
import { JetBrains_Mono, Geist } from "next/font/google";
import { ToastProvider }  from "@/context/ToastContext";
import { ThemeProvider }  from "@/context/ThemeProvider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Gestion Juridica",
  description: "Biblioteca Juridica y Expedientes Juridicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: el script bloqueante aplica data-theme en el cliente
    // antes de que React hidrate. React ve el atributo pero el servidor no lo tiene,
    // por lo que sin este prop lanzaría un warning de hidratación inofensivo.
    <html lang="es" className="h-full" suppressHydrationWarning>
      <head>
        {/* ── Script bloqueante: aplica data-theme ANTES del primer paint ── */}
        {/* Elimina el flash blanco al iniciar en modo oscuro               */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var s=JSON.parse(localStorage.getItem('juridico-settings')||'{}');var dm=s&&s.state&&s.state.darkMode;document.documentElement.setAttribute('data-theme',dm?'dark':'light');}catch(e){}})();`
        }} />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${geist.variable} h-full antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <ToastProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
