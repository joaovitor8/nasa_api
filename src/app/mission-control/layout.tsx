import type { Metadata } from "next";

import { buildStaticMetadata } from "@/src/lib/metadata";

export const metadata: Metadata = buildStaticMetadata(
  "Mission Control",
  "Console central de telemetria e monitoramento de todos os módulos da plataforma Universo.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
