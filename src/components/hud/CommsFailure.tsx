"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface CommsFailureProps {
  message?: string;
  detail?: string;
  onRetry?: () => void;
  className?: string;
}

export function CommsFailure({
  message = "Falha de comunicação com a base de dados.",
  detail,
  onRetry,
  className,
}: CommsFailureProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 py-16 text-center",
        className,
      )}
    >
      <div
        className="w-16 h-16 rounded-full border-2 border-destructive/40 bg-destructive/10 flex items-center justify-center"
        style={{ animation: "hud-flicker 3s linear infinite" }}
      >
        <AlertTriangle className="w-7 h-7 text-destructive" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <div className="text-[10px] font-mono tracking-[0.35em] text-destructive uppercase">
          Sinal Perdido — Code 503
        </div>
        <p className="text-sm text-foreground/90">{message}</p>
        {detail && (
          <p className="text-xs font-mono text-muted-foreground/80 pt-2">{detail}</p>
        )}
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 hover:scale-105 text-xs font-mono uppercase tracking-[0.25em] transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reconectar
        </button>
      )}
    </div>
  );
}
