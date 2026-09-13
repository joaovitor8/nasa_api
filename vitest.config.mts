import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Testes unitários de `src/lib` e de componentes de conteúdo.
 *
 * Ambiente padrão é `node` (os catálogos e o helper BFF são puros).
 * Testes que precisam de DOM declaram no topo do arquivo:
 *   // @vitest-environment jsdom
 */
export default defineConfig({
  resolve: {
    // Espelha o alias `@/*` -> `./*` do tsconfig.json
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // Sem globals: os testes importam `describe`/`it`/`expect` de "vitest"
    // explicitamente, então o tsconfig do projeto não precisa de `types`.
    globals: false,
    include: ["src/**/*.test.{ts,tsx}", "tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
  },
});
