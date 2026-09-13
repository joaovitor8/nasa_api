import { cn } from "@/src/lib/utils";

interface ScanlineProps {
  className?: string;
  /** Intensidade da varredura horizontal animada. */
  intensity?: "subtle" | "default" | "strong";
}

const INTENSITY: Record<NonNullable<ScanlineProps["intensity"]>, string> = {
  subtle:  "opacity-30",
  default: "opacity-60",
  strong:  "opacity-100",
};

export function Scanline({ className, intensity = "default" }: ScanlineProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0 hud-scanlines" />
      <div
        className={cn(
          "absolute inset-x-0 h-16 -top-16",
          INTENSITY[intensity],
        )}
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--module-accent-soft, rgba(255,255,255,0.06)), transparent)",
          animation: "scanline 6s linear infinite",
        }}
      />
    </div>
  );
}
