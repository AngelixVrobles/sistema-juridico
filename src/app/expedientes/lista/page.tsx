"use client";
import { useState } from "react";
import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button } from "@/components/Button";
import { SearchBox } from "@/components/SearchBox";
import { Label } from "@/components/Label";
import { Progress } from "@/components/Progress";

const expedientes = [
  { num: "EXP-2026-001", client: "Juan Garcia Lopez", court: "Juzgado 1ro Civil", lawyer: "Lic. Martinez", status: "Activo" as const, pago: 75 },
  { num: "EXP-2026-002", client: "Roberto Martinez", court: "Juzgado 2do Familiar", lawyer: "Lic. Martinez", status: "En Espera" as const, pago: 45 },
  { num: "EXP-2026-003", client: "Carlos Hernandez", court: "Juzgado 3ro Penal", lawyer: "Lic. Gomez", status: "Activo" as const, pago: 100 },
  { num: "EXP-2026-004", client: "Ana Sanchez Mora", court: "Juzgado Laboral", lawyer: "Lic. Martinez", status: "Inactivo" as const, pago: 30 },
  { num: "EXP-2026-005", client: "Maria Rodriguez", court: "Tribunal Contencioso", lawyer: "Lic. Gomez", status: "Activo" as const, pago: 60 },
];

const statusVariant = { "Activo": "success", "En Espera": "warning", "Inactivo": "error" } as const;

export default function ListaExpedientes() {
  const [activeTab, setActiveTab] = useState("todos");
  const tabs = ["Todos", "Activos", "En Espera", "Inactivos"];
  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Expedientes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Expedientes Juridicos</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Gestiona todos los expedientes del bufete</p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBox placeholder="Buscar expediente..." />
            <Button icon="add">Nuevo Expediente</Button>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary)] p-1 h-10 w-fit">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
              className={`font-secondary rounded-full px-3 py-[6px] text-sm font-medium cursor-pointer transition-all ${
                activeTab === tab.toLowerCase() ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)]"
              }`}>{tab}</button>
          ))}
        </div>

        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[140px]">No. Expediente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Cliente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[150px]">Juzgado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[130px]">Abogado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[100px]">Estado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Pago</span>
          </div>
          {expedientes.map((e) => (
            <div key={e.num} className="flex items-center px-4 py-3 border-b border-[var(--border)] cursor-pointer hover:bg-[var(--muted)]/30">
              <span className="font-primary text-xs text-[var(--primary)] w-[140px]">{e.num}</span>
              <span className="font-secondary text-[13px] font-medium text-[var(--foreground)] flex-1">{e.client}</span>
              <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[150px]">{e.court}</span>
              <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[130px]">{e.lawyer}</span>
              <div className="w-[100px]"><Label variant={statusVariant[e.status]}>{e.status}</Label></div>
              <div className="flex items-center gap-2 w-[120px]">
                <Progress value={e.pago} className="w-[80px]" />
                <span className="font-primary text-xs text-[var(--foreground)]">{e.pago}%</span>
              </div>
            </div>
          ))}
          <div className="px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">Mostrando 1-5 de 23 expedientes</span>
          </div>
        </div>
      </main>
    </div>
  );
}
