import { type ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export interface DataPoint {
  label: string;
  value: ReactNode;
  unit?: string;
  /** Marca o ponto em vermelho (sinal de alerta/anomalia). */
  alert?: boolean;
}

interface DataMatrixProps {
  data: DataPoint[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

const COL_CLASS: Record<1 | 2 | 3 | 4, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

export function DataMatrix({ data, className, columns = 2 }: DataMatrixProps) {
  return (
    <div
      className={cn(
        "grid gap-px rounded-lg overflow-hidden border border-white/5 bg-white/5",
        COL_CLASS[columns],
        className,
      )}
    >
      {data.map((dp, i) => (
        <div
          key={i}
          className="bg-background/70 backdrop-blur-sm p-3 flex flex-col gap-1"
        >
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground/70">
            {dp.label}
          </span>
          <div
            className={cn(
              "text-sm font-mono font-bold tabular-nums leading-tight",
              dp.alert && "text-destructive",
            )}
            style={
              dp.alert
                ? undefined
                : { color: "var(--module-accent, var(--foreground))" }
            }
          >
            {dp.value}
            {dp.unit && (
              <span className="ml-1 text-[10px] font-normal text-muted-foreground/70">
                {dp.unit}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
