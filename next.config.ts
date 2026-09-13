import type { NextConfig } from "next";

const devOrigins = (process.env.DEV_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

/**
 * Security headers — aplicados a todas as rotas.
 * CSP propositalmente omitida: páginas usam imagens/fontes/scripts de
 * múltiplos domínios externos (NASA, Wikipedia, Caltech, GoogleFonts), e uma
 * CSP rígida exigiria revisão por rota. As demais headers são "free wins".
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: devOrigins,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "apod.nasa.gov" },
      { protocol: "https", hostname: "epic.gsfc.nasa.gov" },
      { protocol: "https", hostname: "images-assets.nasa.gov" },
      { protocol: "https", hostname: "mars.nasa.gov" },
      { protocol: "https", hostname: "www.nasa.gov" },
      { protocol: "https", hostname: "wvs.earthdata.nasa.gov" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
