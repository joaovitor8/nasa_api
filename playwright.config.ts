import { existsSync } from "node:fs";

import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT || 3000);
/** Alvo externo (staging/preview). Vazio conta como não definido. */
const EXTERNAL_BASE_URL = process.env.PLAYWRIGHT_BASE_URL?.trim() || undefined;
const BASE_URL = EXTERNAL_BASE_URL ?? `http://127.0.0.1:${PORT}`;

/**
 * Alguns ambientes (containers de CI gerenciados) já trazem um Chromium cuja
 * build não bate com a que o @playwright/test espera baixar. Quando esse
 * binário existe, usamos ele; no CI do GitHub, `playwright install` cuida disso
 * e a variável fica indefinida.
 */
const PREINSTALLED_CHROMIUM = "/opt/pw-browsers/chromium";
const executablePath = existsSync(PREINSTALLED_CHROMIUM)
  ? PREINSTALLED_CHROMIUM
  : undefined;

/**
 * Smoke end-to-end: garante que as rotas principais renderizam de verdade.
 *
 * Roda contra o build de produção (`next build` + `next start`), não o dev
 * server — é o que realmente vai para a Vercel, e é onde erros de RSC e de
 * pré-renderização aparecem.
 *
 * O Chromium já vem instalado no ambiente (PLAYWRIGHT_BROWSERS_PATH);
 * não rode `playwright install`.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } },
    },
  ],

  // Contra alvo externo não subimos servidor local.
  webServer: EXTERNAL_BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run start",
        url: BASE_URL,
        // Sempre build novo: reaproveitar um servidor já de pé faz a suíte
        // testar código antigo em silêncio — falha pior que falha barulhenta.
        reuseExistingServer: false,
        timeout: 180_000,
      },
});
