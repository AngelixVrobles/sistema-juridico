import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { SelectGroup } from "@/components/SelectGroup";

const vigas = [
  { name: "Viga 01 — Civil", total: 12, occupied: 8 },
  { name: "Viga 02 — Penal", total: 12, occupied: 6 },
  { name: "Viga 03 — Laboral", total: 12, occupied: 10 },
];

export default function Vigas() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Vigas / Estantes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Vigas y Estantes</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Visualiza la ocupacion de vigas y estantes</p>
          </div>
          <Button icon="add">Nueva Viga</Button>
        </div>
        <SelectGroup label="Seccion" options={["Civil","Penal","Laboral"]} className="w-[274px]" />
        <div className="flex flex-col gap-4">
          {vigas.map((viga) => (
            <div key={viga.name} className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-primary text-base font-semibold text-[var(--foreground)]">{viga.name}</span>
                <span className="font-secondary text-xs text-[var(--muted-foreground)]">{viga.total} posiciones | {viga.occupied} ocupadas</span>
              </div>
              <div className="flex gap-2 items-end">
                {Array.from({ length: viga.total }, (_, i) => (
                  <div
                    key={i}
                    className={`w-10 h-16 rounded flex items-center justify-center ${
                      i < viga.occupied ? "bg-[#3B82F6]" : "bg-[var(--secondary)]"
                    }`}
                  >
                    <span className={`font-primary text-[10px] ${i < viga.occupied ? "text-white" : "text-[var(--muted-foreground)]"}`}>
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-4 rounded-full bg-[var(--secondary)] overflow-hidden">
                <div
                  className="h-4 bg-[var(--primary)] rounded-full"
                  style={{ width: `${(viga.occupied / viga.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
