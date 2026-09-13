import { type CSSProperties, type ReactNode } from "react";
import type { ModuleTheme } from "@/src/lib/modules";
import { cn } from "@/src/lib/utils";

interface ModuleScopeProps {
  theme: ModuleTheme;
  children: ReactNode;
  className?: string;
  /** Aplica um glow ambiente decorativo ao redor do escopo. */
  ambient?: boolean;
}

export function ModuleScope({ theme, children, className, ambient }: ModuleScopeProps) {
  const style = {
    "--module-accent": theme.accent,
    "--module-accent-soft": theme.accentSoft,
    "--module-glow": theme.glow,
  } as CSSProperties;

  return (
    <div
      data-module-scope
      style={style}
      className={cn(ambient && "relative isolate", className)}
    >
      {ambient && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-32 -z-10 blur-[120px] opacity-40"
          style={{ background: `radial-gradient(circle at 30% 20%, ${theme.accentSoft}, transparent 60%)` }}
        />
      )}
      {children}
    </div>
  );
}
