"use client";
import { useState } from "react";
import Link from "next/link";
import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button } from "@/components/Button";
import { SearchBox } from "@/components/SearchBox";
import { Label } from "@/components/Label";
import { Progress } from "@/components/Progress";
import { useExpedientesStore, getPercent, getPaid } from "@/store/expedientes";

const statusVariant = { Activo: "success", "En Espera": "warning", Inactivo: "error" } as const;

export default function ListaExpedientes() {
  const { expedientes, deleteExpediente } = useExpedientesStore();
  const [activeTab, setActiveTab] = useState("todos");
  const [search, setSearch] = useState("");
  const tabs = ["Todos", "Activos", "En Espera", "Inactivos"];

  const filtered = expedientes.filter((e) => {
    const matchesTab =
      activeTab === "todos" ? true
      : activeTab === "activos" ? e.status === "Activo"
      : activeTab === "en espera" ? e.status === "En Espera"
      : e.status === "Inactivo";
    const matchesSearch =
      search === "" ||
      e.client.toLowerCase().includes(search.toLowerCase()) ||
      e.num.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  function handleDelete(id: string, num: string) {
    if (window.confirm(`¿Eliminar el expediente ${num}? Esta accion no se puede deshacer.`)) {
      deleteExpediente(id);
    }
  }

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
            <SearchBox placeholder="Buscar expediente..." value={search} onChange={setSearch} />
            <Button icon="home" href="/" variant="outline">Menu Principal</Button>
            <Button icon="add" href="/expedientes/nuevo">Nuevo Expediente</Button>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary)] p-1 h-10 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`font-secondary rounded-full px-3 py-[6px] text-sm font-medium cursor-pointer transition-all ${
                activeTab === tab.toLowerCase()
                  ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted-foreground)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[140px]">No. Expediente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Cliente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[170px]">Juzgado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Abogado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[90px]">Estado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Pago</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[40px]"></span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">No se encontraron expedientes</span>
            </div>
          ) : (
            filtered.map((e) => {
              const pct = getPercent(e);
              return (
                <div key={e.id} className="flex items-center border-b border-[var(--border)] group">
                  <Link
                    href={`/expedientes/detalle/${e.id}`}
                    className="flex items-center flex-1 px-4 py-3 cursor-pointer hover:bg-[var(--muted)]/40 transition-colors"
                  >
                    <span className="font-primary text-xs text-[var(--primary)] w-[140px]">{e.num}</span>
                    <span className="font-secondary text-[13px] font-medium text-[var(--foreground)] flex-1">{e.client}</span>
                    <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[170px]">{e.court}</span>
                    <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[120px]">{e.lawyer}</span>
                    <div className="w-[90px]"><Label variant={statusVariant[e.status]}>{e.status}</Label></div>
                    <div className="flex items-center gap-2 w-[120px]">
                      <Progress value={pct} className="w-[70px]" />
                      <span className="font-primary text-xs text-[var(--foreground)]">{pct}%</span>
                    </div>
                  </Link>
                  <div className="w-[40px] flex items-center justify-center pr-2">
                    <button
                      onClick={() => handleDelete(e.id, e.num)}
                      className="opacity-0 group-hover:opacity-100 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all cursor-pointer"
                      title="Eliminar expediente"
                    >
                      <span className="icon-material" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}

          <div className="px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">
              Mostrando {filtered.length} de {expedientes.length} expedientes
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
