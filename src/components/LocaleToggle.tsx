"use client";

import { useLocale, LOCALES, type Locale } from "@/src/lib/i18n";

interface LocaleToggleProps {
  className?: string;
  /** Variação compacta para uso na status bar. */
  compact?: boolean;
}

export function LocaleToggle({ className, compact = false }: LocaleToggleProps) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md ${compact ? "p-0.5" : "p-1"} ${className ?? ""}`}
      role="group"
      aria-label="Language toggle"
    >
      {LOCALES.map((opt) => {
        const active = opt.id === locale;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setLocale(opt.id as Locale)}
            aria-pressed={active}
            className={`font-mono uppercase tracking-[0.2em] transition-colors rounded-full ${
              compact ? "text-[9px] px-2 py-0.5" : "text-[10px] px-3 py-1"
            } ${
              active
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
