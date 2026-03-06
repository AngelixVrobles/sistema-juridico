"use client";
import { useState } from "react";
import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";

const loans = [
  { title: "Codigo Civil Comentado", code: "CIV-V01-003", person: "Juan Perez", dateOut: "15/Ene/2026", dateReturn: "15/Feb/2026" },
  { title: "Ley Federal del Trabajo", code: "LAB-V01-005", person: "Maria Garcia", dateOut: "20/Ene/2026", dateReturn: "20/Feb/2026" },
  { title: "Derecho Mercantil", code: "MER-V01-002", person: "Carlos Lopez", dateOut: "01/Feb/2026", dateReturn: "01/Mar/2026" },
  { title: "Constitucion Politica", code: "CON-V01-002", person: "Ana Rodriguez", dateOut: "10/Feb/2026", dateReturn: "10/Mar/2026" },
];

export default function Prestamos() {
  const [activeTab, setActiveTab] = useState("activos");
  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Prestamos" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Control de Prestamos</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Gestiona los prestamos de libros</p>
          </div>
          <Button icon="add">Nuevo Prestamo</Button>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary)] p-1 h-10 w-fit">
          {["activos", "historial"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`font-secondary rounded-full px-3 py-[6px] text-sm font-medium cursor-pointer transition-all ${
                activeTab === tab ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)]"
              }`}>{tab === "activos" ? "Activos" : "Historial"}</button>
          ))}
        </div>

        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Libro</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Codigo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[150px]">Prestado a</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Fecha Prestamo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Fecha Devolucion</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[100px]">Estado</span>
          </div>
          {loans.map((loan) => (
            <div key={loan.code} className="flex items-center px-4 py-3 border-b border-[var(--border)]">
              <span className="font-secondary text-[13px] text-[var(--foreground)] flex-1">{loan.title}</span>
              <span className="font-primary text-xs text-[var(--primary)] w-[120px]">{loan.code}</span>
              <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[150px]">{loan.person}</span>
              <span className="font-primary text-xs text-[var(--muted-foreground)] w-[120px]">{loan.dateOut}</span>
              <span className="font-primary text-xs text-[var(--muted-foreground)] w-[120px]">{loan.dateReturn}</span>
              <div className="w-[100px]"><Label variant="warning">Activo</Label></div>
            </div>
          ))}
          <div className="px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">Mostrando 1-4 de 12 prestamos activos</span>
          </div>
        </div>
      </main>
    </div>
  );
}
