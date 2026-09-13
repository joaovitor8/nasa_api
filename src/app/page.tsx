"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Orbit, Radio, Sparkles } from "lucide-react";

import { useLocale } from "@/src/lib/i18n";

export default function Home() {
  const { t } = useLocale();

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center pb-24 text-foreground">
      {/* Nebulosas decorativas */}
      <div className="absolute top-[-12%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-primary/[0.08] blur-[180px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-500/[0.07] blur-[160px] -z-10 pointer-events-none" />

      {/* Anel orbital decorativo (rotação lenta) */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{
          opacity: { duration: 1.4, delay: 0.4 },
          scale: { duration: 1.4, delay: 0.4, ease: "easeOut" },
          rotate: { duration: 240, repeat: Infinity, ease: "linear" },
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
      >
        <svg width="900" height="900" viewBox="0 0 900 900" className="opacity-[0.18] max-w-[110vw] max-h-[110vw]">
          <defs>
            <radialGradient id="ringFade" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="oklch(0.60 0.18 290)" stopOpacity="0" />
              <stop offset="100%" stopColor="oklch(0.60 0.18 290)" stopOpacity="0.4" />
            </radialGradient>
          </defs>
          <circle cx="450" cy="450" r="200" fill="none" stroke="url(#ringFade)" strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="450" cy="450" r="320" fill="none" stroke="url(#ringFade)" strokeWidth="1" strokeDasharray="1 8" />
          <circle cx="450" cy="450" r="430" fill="none" stroke="url(#ringFade)" strokeWidth="1" />
          {/* satélite minúsculo */}
          <circle cx="880" cy="450" r="3" fill="oklch(0.78 0.16 80)" />
          <circle cx="880" cy="450" r="6" fill="oklch(0.78 0.16 80)" opacity="0.3" />
        </svg>
      </motion.div>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 pt-28 pb-16 text-center max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-mono tracking-[0.3em] uppercase mb-8 backdrop-blur-sm"
          style={{ boxShadow: "0 0 24px oklch(0.60 0.18 290 / 0.15)" }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("home.badge")}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-6 leading-[1.05]"
        >
          {t("home.title.l1")} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-blue-400 to-primary inline-block">
            {t("home.title.l2")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {t("home.subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Link
            href="/mission-control"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-[0.25em] transition-all hover:scale-[1.02] hover:shadow-[0_0_32px_oklch(0.60_0.18_290/0.45)] active:scale-95"
          >
            {t("home.cta")}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/solar-system"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/5 text-foreground/90 text-xs font-mono uppercase tracking-[0.25em] backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 active:scale-95"
          >
            <Orbit className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
            {t("home.solar.label")}
          </Link>
        </motion.div>
      </section>

      {/* Indicador de sinal ao vivo (rodapé do hero) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-black/30 backdrop-blur-md text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <Radio className="w-3 h-3" />
        <span>{t("home.live.label")}</span>
      </motion.div>
    </div>
  );
}
