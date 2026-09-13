/**
 * Configuração compartilhada entre layout, sitemap, robots e metadados.
 * Centraliza o `SITE_URL` para evitar deriva entre arquivos.
 */

const FALLBACK_URL = "https://universo.local";

const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

/**
 * Origem absoluta do site. Usada em canonical, sitemap, robots e nas URLs das
 * imagens de Open Graph — que precisam ser absolutas para funcionar.
 *
 * Sem a variável definida, o build cai no domínio fictício de fallback e as
 * prévias de compartilhamento quebram em produção silenciosamente. O aviso
 * abaixo existe porque esse é o tipo de erro que só aparece quando alguém cola
 * um link no WhatsApp e vê um retângulo vazio.
 */
export const SITE_URL = configured || FALLBACK_URL;

if (!configured && process.env.NODE_ENV === "production") {
  console.warn(
    "[config] NEXT_PUBLIC_SITE_URL não definida — usando " +
      `${FALLBACK_URL}. Canonical, sitemap e og:image ficarão com URLs inválidas. ` +
      "Defina a variável no ambiente de deploy.",
  );
}

export const SITE_NAME = "Universo";
export const SITE_TAGLINE = "Sistema Operacional do Cosmos";
