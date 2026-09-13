/**
 * Configuração compartilhada entre layout, sitemap, robots e metadados.
 * Centraliza o `SITE_URL` para evitar deriva entre arquivos.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://universo.local";

export const SITE_NAME = "Universo";
export const SITE_TAGLINE = "Sistema Operacional do Cosmos";
