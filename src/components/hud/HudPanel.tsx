import { type ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface HudPanelProps {
  /** Texto pequeno em monospace exibido no canto superior. */
  label?: string;
  /** Slot livre à direita do label (badges, contadores, ações). */
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Quando true, desenha cantos angulares no estilo HUD. */
  brackets?: boolean;
  /** Variação visual: glass = vidro fosco, solid = painel opaco escuro. */
  variant?: "glass" | "solid";
}

export function HudPanel({
  label,
  badge,
  children,
  className,
  contentClassName,
  brackets = true,
  variant = "glass",
}: HudPanelProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 md:p-8",
        variant === "glass" &&
          "border border-white/10 bg-white/[0.03] backdrop-blur-xl",
        variant === "solid" &&
          "border border-white/5 bg-[#05050a]",
        className,
      )}
    >
      {brackets && (
        <>
          <span
            className="absolute top-2 left-2 w-3 h-3 border-t border-l"
            style={{ borderColor: "var(--module-accent, currentColor)" }}
          />
          <span
            className="absolute top-2 right-2 w-3 h-3 border-t border-r"
            style={{ borderColor: "var(--module-accent, currentColor)" }}
          />
          <span
            className="absolute bottom-2 left-2 w-3 h-3 border-b border-l"
            style={{ borderColor: "var(--module-accent, currentColor)" }}
          />
          <span
            className="absolute bottom-2 right-2 w-3 h-3 border-b border-r"
            style={{ borderColor: "var(--module-accent, currentColor)" }}
          />
        </>
      )}

      {(label || badge) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5 gap-3">
          {label ? (
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground">
              {label}
            </span>
          ) : (
            <span />
          )}
          {badge}
        </div>
      )}

      <div className={contentClassName}>{children}</div>
    </div>
  );
}
