import type { Metadata } from "next";

import { buildStaticMetadata } from "@/src/lib/metadata";

export const metadata: Metadata = buildStaticMetadata(
  "Sobre",
  "Manifesto do Projeto Universo — arquitetura, propósito e construção do Sistema Operacional do Cosmos.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
