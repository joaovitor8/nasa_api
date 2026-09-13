import type { Metadata } from "next";

import { buildModuleMetadata } from "@/src/lib/metadata";

export const metadata: Metadata = buildModuleMetadata("exoplanets");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
