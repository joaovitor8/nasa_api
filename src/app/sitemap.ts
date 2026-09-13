import type { MetadataRoute } from "next";

import { SITE_URL } from "@/src/lib/config";
import { ENABLED_MODULES } from "@/src/lib/modules";
import { SOLAR_BODIES } from "@/src/lib/solar-system";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/sobre", "/mission-control"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const moduleRoutes = ENABLED_MODULES.filter((m) => !m.external).map((m) => ({
    url: `${SITE_URL}${m.href}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const bodyRoutes = SOLAR_BODIES.map((b) => ({
    url: `${SITE_URL}/solar-system/${b.id}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...moduleRoutes, ...bodyRoutes];
}
