"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

import { useLocale } from "@/src/lib/i18n";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "universo:install-dismissed";

export function InstallPrompt() {
  const { locale } = useLocale();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY) === "1") return;

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const installed = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installed);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const result = await deferred.userChoice;
    if (result.outcome === "dismissed") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
    setVisible(false);
    setDeferred(null);
  };

  const handleDismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && deferred && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 max-w-sm bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
          style={{ boxShadow: "0 0 32px oklch(0.78 0.16 80 / 0.25)" }}
        >
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label={locale === "en" ? "Dismiss" : "Dispensar"}
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-lg shrink-0"
              style={{
                background: "color-mix(in oklch, oklch(0.78 0.16 80) 15%, transparent)",
                color: "oklch(0.78 0.16 80)",
              }}
            >
              <Download className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] mb-1" style={{ color: "oklch(0.78 0.16 80)" }}>
                {locale === "en" ? "Install Console" : "Instalar Console"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {locale === "en"
                  ? "Pin Universo to your dock for instant access and offline reads."
                  : "Fixe o Universo no dock para acesso instantâneo e leitura offline."}
              </p>
              <button
                onClick={handleInstall}
                className="w-full py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-[0.25em] transition-transform active:scale-95"
                style={{ background: "oklch(0.78 0.16 80)", color: "oklch(0.05 0 0)" }}
              >
                {locale === "en" ? "Install" : "Instalar"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
