"use client";

import { useEffect, useState } from "react";

import { useT } from "@/src/lib/i18n";
import { LocaleToggle } from "@/src/components/LocaleToggle";

const formatUTC = (d: Date) => {
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss} UTC`;
};

const formatDate = (d: Date) => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

export function SystemStatusBar() {
  const [now, setNow] = useState<Date | null>(null);
  const t = useT();

  useEffect(() => {
    const update = () => setNow(new Date());
    const raf = requestAnimationFrame(update);
    const intv = setInterval(update, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(intv);
    };
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-6 border-b border-white/[0.06] bg-black/85 backdrop-blur-md flex items-center justify-between px-4 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/80 select-none">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_oklch(0.78_0.18_145)] animate-pulse" />
        <span>{t("status.nominal")}</span>
        <span className="hidden sm:inline opacity-50 mx-2">·</span>
        <span className="hidden sm:inline opacity-60">{t("status.uplink")}</span>
      </div>

      <div className="hidden md:flex items-center gap-3 opacity-60">
        <span>Universe.OS</span>
        <span className="opacity-50">·</span>
        <span>v1.2.0</span>
        <span className="opacity-50">·</span>
        <span>{t("status.channel")}</span>
      </div>

      <div className="flex items-center gap-3 tabular-nums">
        <span className="hidden sm:inline opacity-60">{now ? formatDate(now) : "----.--.--"}</span>
        <span className="opacity-50 hidden sm:inline">·</span>
        <span>{now ? formatUTC(now) : "--:--:-- UTC"}</span>
        <LocaleToggle compact className="ml-2" />
      </div>
    </div>
  );
}
