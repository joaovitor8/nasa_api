import { ImageResponse } from "next/og";

/**
 * Gerador compartilhado das imagens de Open Graph.
 *
 * Restrições do Satori, o motor por trás de `next/og`, que explicam as
 * escolhas abaixo:
 *  - só flexbox; nada de grid;
 *  - `oklch()` não é suportado, então as cores do site viram hex aqui;
 *  - todo elemento com mais de um filho precisa de `display: flex` explícito.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Equivalentes em hex dos tokens do site, já que o Satori não lê oklch(). */
const COR = {
  fundo: "#05050a",
  texto: "#f5f5f7",
  suave: "#a1a1aa",
  borda: "#27272a",
};

interface OgCardProps {
  /** Linha pequena em maiúsculas acima do título (ex: "Glossário"). */
  eyebrow: string;
  title: string;
  /** Uma ou duas linhas de contexto. Cortado se muito longo. */
  description?: string;
  /** Cor de destaque; aceita hex. Padrão é o roxo do site. */
  accent?: string;
  /** Rodapé à direita (ex: tempo de leitura). */
  meta?: string;
}

export function ogCard({
  eyebrow,
  title,
  description,
  accent = "#8b5cf6",
  meta,
}: OgCardProps) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: COR.fundo,
        padding: "72px 80px",
        // Brilho sutil na diagonal, na cor do módulo.
        backgroundImage: `radial-gradient(circle at 85% 15%, ${accent}22, transparent 55%)`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: title.length > 46 ? 62 : 76,
            fontWeight: 700,
            lineHeight: 1.1,
            color: COR.texto,
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.45,
              color: COR.suave,
              maxWidth: 940,
            }}
          >
            {description.length > 170
              ? `${description.slice(0, 167).trimEnd()}…`
              : description}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${COR.borda}`,
          paddingTop: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: "0.2em",
            color: COR.texto,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 999,
              background: accent,
              marginRight: 16,
            }}
          />
          UNIVERSO
        </div>

        {meta && (
          <div style={{ display: "flex", fontSize: 24, color: COR.suave }}>{meta}</div>
        )}
      </div>
    </div>,
    OG_SIZE,
  );
}
