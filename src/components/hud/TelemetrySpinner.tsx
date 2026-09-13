"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

const DEFAULT_PHASES = [
  "Estabelecendo handshake orbital",
  "Decodificando telemetria",
  "Sincronizando feixe de dados",
  "Aguardando confirmação da estação",
];

interface TelemetrySpinnerProps {
  phases?: string[];
  label?: string;
  className?: string;
  /** Intervalo entre frases em ms. */
  interval?: number;
}

export function TelemetrySpinner({
  phases = DEFAULT_PHASES,
  label = "TRANSMISSÃO EM CURSO",
  className,
  interval = 1800,
}: TelemetrySpinnerProps) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (phases.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % phases.length), interval);
    return () => clearInterval(t);
  }, [phases.length, interval]);

  return (
    <div className={cn("flex flex-col items-center justify-center gap-6 py-16 text-center", className)}>
      <div className="relative w-20 h-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-dashed"
          style={{ borderColor: "var(--module-accent, var(--primary))" }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, ease: "linear", repeat: Infinity }}
          className="absolute inset-2 rounded-full border border-white/20"
        />
        <div
          className="absolute inset-0 m-auto w-2 h-2 rounded-full"
          style={{
            background: "var(--module-accent, var(--primary))",
            boxShadow: "var(--module-glow, 0 0 20px currentColor)",
          }}
        />
      </div>

      <div className="space-y-1.5">
        <div
          className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground"
          style={{ animation: "hud-pulse 2s ease-in-out infinite" }}
        >
          {label}
        </div>
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-mono"
          style={{ color: "var(--module-accent, var(--primary))" }}
        >
          {phases[i]}
          <span className="ml-0.5 inline-block w-2 h-3.5 -mb-0.5 bg-current animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
