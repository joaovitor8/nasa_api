"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Gauge,
  Globe2,
  Moon,
  Orbit,
  Ruler,
  ThermometerSun,
  Timer,
  Weight,
} from "lucide-react";
import axios from "axios";

import { useLocale } from "@/src/lib/i18n";
import { BODY_TYPE_LABEL, type SolarBody } from "@/src/lib/solar-system";
import { withAlpha } from "@/src/lib/utils";
import {
  CommsFailure,
  HudPanel,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

interface WikiData {
  title: string;
  extract: string;
  thumbnail: string | null;
  pageUrl: string;
  description: string | null;
}

const fetchWiki = async (title: string, lang: "pt" | "en"): Promise<WikiData> => {
  const res = await axios.get<WikiData>(
    `/api/wikipedia?title=${encodeURIComponent(title)}&lang=${lang}`,
  );
  return res.data;
};

const formatScientific = (raw: string): string => {
  const match = raw.match(/^([\d.]+)e([+-]?\d+)$/);
  if (!match) return raw;
  const [, base, exp] = match;
  const supers: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "-": "⁻", "+": "",
  };
  const expFmt = exp.split("").map((c) => supers[c] ?? c).join("");
  return `${base} × 10${expFmt}`;
};

const formatRotation = (hours: number, locale: string): string => {
  const abs = Math.abs(hours);
  const retro = hours < 0 ? (locale === "en" ? " (retrograde)" : " (retrógrado)") : "";
  if (abs < 48) return `${abs.toFixed(1)} h${retro}`;
  return `${(abs / 24).toFixed(1)} ${locale === "en" ? "days" : "dias"}${retro}`;
};

const formatOrbit = (days: number | null, locale: string): string => {
  if (days === null) return "—";
  if (days < 365) return `${days.toLocaleString(locale === "en" ? "en-US" : "pt-BR")} ${locale === "en" ? "days" : "dias"}`;
  const years = days / 365.25;
  return `${years.toFixed(years > 100 ? 0 : 2)} ${locale === "en" ? "years" : "anos"}`;
};

const formatDistance = (au: number | null, locale: string): string => {
  if (au === null) return "—";
  const mkm = au * 149.6;
  const numFmt = locale === "en" ? "en-US" : "pt-BR";
  return `${au.toFixed(2)} UA · ${mkm.toLocaleString(numFmt, { maximumFractionDigits: 1 })} M km`;
};

interface StatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}

function Stat({ label, value, icon, accent }: StatProps) {
  return (
    <div
      className="rounded-xl border bg-white/2 p-4 flex flex-col gap-2"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </div>
      <div className="font-mono text-base md:text-lg font-bold tabular-nums wrap-break-word" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

export function BodyDetail({ body }: { body: SolarBody }) {
  const { locale } = useLocale();
  const wikiTitle = locale === "en" ? body.wikiEn : body.wikiPt;
  const wikiLang: "pt" | "en" = locale === "en" ? "en" : "pt";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["wiki", wikiTitle, wikiLang],
    queryFn: () => fetchWiki(wikiTitle, wikiLang),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const bodyTheme = {
    accent: body.accent,
    accentSoft: withAlpha(body.accent, 0.15),
    glow: `0 0 32px ${withAlpha(body.accent, 0.35)}`,
  };

  const typeLabel = BODY_TYPE_LABEL[body.type];
  const numFmt = locale === "en" ? "en-US" : "pt-BR";

  return (
    <ModuleScope theme={bodyTheme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Voltar */}
        <Link
          href="/solar-system"
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70 hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-3 h-3" />
          {locale === "en" ? "Back to system" : "Voltar ao sistema"}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 mb-10"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full shrink-0 relative"
              style={{
                background: body.accent,
                boxShadow: `0 0 40px ${withAlpha(body.accent, 0.6)}`,
              }}
            >
              {body.hasRings && (
                <div
                  className="absolute inset-x-[-25%] top-1/2 h-1.5 rounded-full -translate-y-1/2"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${body.accent}, transparent)`,
                    transform: "translateY(-50%) rotate(-15deg)",
                  }}
                />
              )}
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {(locale === "en" ? typeLabel.en : typeLabel.pt).toUpperCase()} · ORBIT {body.orbitIndex || "★"}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
                {locale === "en" ? body.en : body.pt}
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: body.accent }}>
                {locale === "en" ? body.en : body.pt} · {body.en !== body.pt && (locale === "en" ? body.pt : body.en)}
              </p>
            </div>
          </div>

          <a
            href={data?.pageUrl ?? `https://${wikiLang}.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-[0.25em] border transition-colors hover:bg-white/5"
            style={{
              color: body.accent,
              borderColor: `color-mix(in oklch, ${body.accent} 30%, transparent)`,
            }}
          >
            Wikipedia <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>

        {/* Hero + extract */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          {/* Imagem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 relative aspect-square rounded-2xl border border-white/10 overflow-hidden bg-black/60 flex items-center justify-center"
            style={{ boxShadow: bodyTheme.glow }}
          >
            {error && (
              <CommsFailure
                message={locale === "en" ? "Encyclopedia archive unreachable." : "Arquivo enciclopédico indisponível."}
                onRetry={() => refetch()}
              />
            )}
            {isLoading && !error && (
              <TelemetrySpinner
                label={`WIKIPEDIA · ${(locale === "en" ? body.en : body.pt).toUpperCase()}`}
                phases={
                  locale === "en"
                    ? ["Querying encyclopedia", "Fetching imagery", "Compiling dossier"]
                    : ["Consultando enciclopédia", "Carregando imagem", "Compilando dossiê"]
                }
              />
            )}
            {data?.thumbnail && !error && !isLoading && (
              <Image
                src={data.thumbnail}
                alt={data.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            )}
            {!data?.thumbnail && !isLoading && !error && (
              <div
                className="w-32 h-32 rounded-full"
                style={{
                  background: body.accent,
                  boxShadow: `0 0 80px ${withAlpha(body.accent, 0.7)}`,
                }}
              />
            )}

            <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 z-10" style={{ borderColor: body.accent }} />
            <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 z-10" style={{ borderColor: body.accent }} />
            <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 z-10" style={{ borderColor: body.accent }} />
            <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 z-10" style={{ borderColor: body.accent }} />
          </motion.div>

          {/* Extract Wikipedia */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-7"
          >
            <HudPanel
              label={locale === "en" ? "Encyclopedia Excerpt" : "Trecho Enciclopédico"}
              variant="solid"
              className="h-full"
            >
              {isLoading && !error && (
                <div className="space-y-3 animate-pulse">
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-5/6" />
                  <div className="h-3 bg-white/10 rounded w-4/6" />
                </div>
              )}
              {data?.extract && !isLoading && (
                <>
                  {data.description && (
                    <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70 mb-3">
                      {data.description}
                    </span>
                  )}
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-justify font-light">
                    {data.extract}
                  </p>
                  <a
                    href={data.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-[10px] font-mono uppercase tracking-[0.25em]"
                    style={{ color: body.accent }}
                  >
                    {locale === "en" ? "Full article" : "Artigo completo"} <ArrowUpRight className="w-3 h-3" />
                  </a>
                </>
              )}
              {!data?.extract && !isLoading && !error && (
                <p className="text-sm text-muted-foreground italic">
                  {locale === "en"
                    ? "No encyclopedia entry available."
                    : "Nenhum trecho enciclopédico disponível."}
                </p>
              )}
            </HudPanel>
          </motion.div>
        </div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/70 mb-3">
            {locale === "en" ? "Physical telemetry" : "Telemetria física"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat
              label={locale === "en" ? "Diameter" : "Diâmetro"}
              value={`${body.diameterKm.toLocaleString(numFmt)} km`}
              icon={<Ruler className="w-3.5 h-3.5" />}
              accent={body.accent}
            />
            <Stat
              label={locale === "en" ? "Mass" : "Massa"}
              value={`${formatScientific(body.massKg)} kg`}
              icon={<Weight className="w-3.5 h-3.5" />}
              accent={body.accent}
            />
            <Stat
              label={locale === "en" ? "Distance from Sun" : "Distância do Sol"}
              value={formatDistance(body.distanceAuFromSun, locale)}
              icon={<Orbit className="w-3.5 h-3.5" />}
              accent={body.accent}
            />
            <Stat
              label={locale === "en" ? "Orbital period" : "Período orbital"}
              value={formatOrbit(body.orbitalPeriodDays, locale)}
              icon={<Timer className="w-3.5 h-3.5" />}
              accent={body.accent}
            />
            <Stat
              label={locale === "en" ? "Day length" : "Duração do dia"}
              value={formatRotation(body.rotationPeriodHours, locale)}
              icon={<Gauge className="w-3.5 h-3.5" />}
              accent={body.accent}
            />
            <Stat
              label={locale === "en" ? "Moons" : "Luas"}
              value={body.moonsCount.toString()}
              icon={<Moon className="w-3.5 h-3.5" />}
              accent={body.accent}
            />
            <Stat
              label={locale === "en" ? "Mean temperature" : "Temperatura média"}
              value={`${body.meanTempC.toLocaleString(numFmt)} °C`}
              icon={<ThermometerSun className="w-3.5 h-3.5" />}
              accent={body.accent}
            />
            <Stat
              label={locale === "en" ? "Discovered" : "Descoberta"}
              value={body.discovered === "Antiguidade" && locale === "en" ? "Ancient" : body.discovered}
              icon={<Calendar className="w-3.5 h-3.5" />}
              accent={body.accent}
            />
          </div>

          {body.hasRings && (
            <div
              className="mt-4 px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em]"
              style={{
                background: bodyTheme.accentSoft,
                borderColor: `color-mix(in oklch, ${body.accent} 25%, transparent)`,
                color: body.accent,
              }}
            >
              <Globe2 className="w-3.5 h-3.5" />
              {locale === "en" ? "Visible ring system" : "Sistema de anéis perceptível"}
            </div>
          )}
        </motion.div>

        {/* Voltar fim */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/solar-system"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-[0.25em] border transition-colors hover:bg-white/5"
            style={{
              color: body.accent,
              borderColor: `color-mix(in oklch, ${body.accent} 30%, transparent)`,
            }}
          >
            <ArrowLeft className="w-3 h-3" />
            {locale === "en" ? "Other bodies" : "Outros corpos"}
          </Link>
        </div>
      </div>
    </ModuleScope>
  );
}
