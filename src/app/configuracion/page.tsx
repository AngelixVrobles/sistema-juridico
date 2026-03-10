"use client";
import { useState, useEffect } from "react";
import { Icon }             from "@/components/Icon";
import { InputGroup }       from "@/components/InputGroup";
import { SelectGroup }      from "@/components/SelectGroup";
import { Button }           from "@/components/Button";
import { useSettingsStore } from "@/store/settings";
import { useToast }         from "@/context/ToastContext";

// ── Toggle switch component ───────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-[var(--primary)]" : "bg-[var(--border)]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ── Section card ─────────────────────────────────────────────────────────────

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3 pb-1 border-b border-[var(--border)]">
        <Icon name={icon} size={20} outlined className="text-[var(--primary)]" />
        <h2 className="font-primary text-base font-bold text-[var(--foreground)]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

const POLL_OPTIONS = ["15", "30", "60", "120"];

export default function ConfiguracionPage() {
  const settings = useSettingsStore();
  const toast    = useToast();

  // Formulario local (se guarda al presionar "Guardar")
  const [officeName,   setOfficeName]   = useState(settings.officeName);
  const [userName,     setUserName]     = useState(settings.userName);
  const [userRole,     setUserRole]     = useState(settings.userRole);
  const [darkMode,     setDarkMode]     = useState(settings.darkMode);
  const [serverUrl,    setServerUrl]    = useState(settings.serverUrl);
  const [pollInterval, setPollInterval] = useState(String(settings.pollInterval));

  // ── Sincronizar formulario cuando el store de Zustand hidrata desde localStorage ──
  // Corre UNA SOLA VEZ después del montaje. Para ese momento, el middleware persist
  // ya leyó localStorage de forma sincrónica, por lo que getState() devuelve los
  // valores reales. Con dependencias vacías nunca sobreescribe ediciones no guardadas.
  useEffect(() => {
    const s = useSettingsStore.getState();
    setOfficeName(s.officeName);
    setUserName(s.userName);
    setUserRole(s.userRole);
    setDarkMode(s.darkMode);
    setServerUrl(s.serverUrl);
    setPollInterval(String(s.pollInterval));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSave() {
    settings.update({
      officeName,
      userName,
      userRole,
      darkMode,
      serverUrl:    serverUrl.trim(),
      pollInterval: Number(pollInterval) || 30,
    });
    toast.success("Configuración guardada correctamente.");
  }

  function handleReset() {
    settings.reset();
    // Sync local form state
    const d = useSettingsStore.getState();
    setOfficeName(d.officeName);
    setUserName(d.userName);
    setUserRole(d.userRole);
    setDarkMode(d.darkMode);
    setServerUrl(d.serverUrl);
    setPollInterval(String(d.pollInterval));
    toast.info("Configuración restablecida a los valores por defecto.");
  }

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">

      {/* Header */}
      <div className="flex items-center gap-4 px-8 py-5 border-b border-[var(--border)] bg-[var(--card)] flex-shrink-0">
        <a
          href="/"
          className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <Icon name="arrow_back" size={20} />
          <span className="font-secondary text-sm">Inicio</span>
        </a>
        <div className="h-5 w-px bg-[var(--border)]" />
        <div className="flex items-center gap-2">
          <Icon name="settings" size={22} outlined className="text-[var(--primary)]" />
          <h1 className="font-primary text-xl font-bold text-[var(--foreground)]">
            Configuración del Sistema
          </h1>
        </div>
      </div>

      {/* Body */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* 1. Datos del Despacho */}
          <Section icon="business" title="Datos del Despacho">
            <InputGroup
              label="Nombre oficial del despacho"
              value={officeName}
              onChange={setOfficeName}
              placeholder="Ej. Oficina de abogados José La Paz Lantigua"
            />
            <p className="font-secondary text-xs text-[var(--muted-foreground)]">
              Este nombre aparece en la pantalla de inicio, los reportes y el sidebar.
            </p>
          </Section>

          {/* 2. Usuario */}
          <Section icon="person" title="Usuario">
            <div className="flex gap-4">
              <InputGroup
                label="Nombre completo"
                value={userName}
                onChange={setUserName}
                placeholder="Ej. Lic. José La Paz Lantigua"
                className="flex-1"
              />
              <InputGroup
                label="Rol o cargo"
                value={userRole}
                onChange={setUserRole}
                placeholder="Ej. Abogado Titular"
                className="flex-1"
              />
            </div>
            <p className="font-secondary text-xs text-[var(--muted-foreground)]">
              Se muestra en la parte inferior del panel de navegación.
            </p>
          </Section>

          {/* 3. Apariencia */}
          <Section icon="palette" title="Apariencia">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="font-secondary text-sm font-medium text-[var(--foreground)]">
                  Modo oscuro
                </span>
                <span className="font-secondary text-xs text-[var(--muted-foreground)]">
                  Aplica una paleta de colores oscura en toda la interfaz
                </span>
              </div>
              <Toggle checked={darkMode} onChange={setDarkMode} />
            </div>
          </Section>

          {/* 4. Sincronización multi-computadora */}
          <Section icon="sync" title="Sincronización (Multi-computadora)">
            <div className="flex flex-col gap-1">
              <InputGroup
                label="URL del servidor remoto"
                value={serverUrl}
                onChange={setServerUrl}
                placeholder="http://192.168.1.10:3131  (dejar vacío para usar servidor local)"
              />
              <p className="font-secondary text-xs text-[var(--muted-foreground)] leading-relaxed">
                <strong>Mac (servidor):</strong> deja este campo vacío — siempre usa el servidor local.
                <br />
                <strong>Windows (cliente):</strong> ingresa la IP de la Mac en tu red local. Ej: <code>http://192.168.1.5:3131</code>
                <br />
                Cambia en Configuración → Sincronización → recarga la app para aplicar.
              </p>
            </div>

            <SelectGroup
              label="Intervalo de actualización automática (segundos)"
              value={pollInterval}
              options={POLL_OPTIONS}
              onChange={setPollInterval}
            />
            <p className="font-secondary text-xs text-[var(--muted-foreground)]">
              Con qué frecuencia se consulta el servidor para obtener cambios de la otra computadora.
            </p>
          </Section>

          {/* Acciones */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={handleReset}>
              Restablecer valores por defecto
            </Button>
            <Button icon="save" onClick={handleSave}>
              Guardar cambios
            </Button>
          </div>

        </div>
      </main>

    </div>
  );
}
