import { NextResponse } from "next/server";

import { badRequest } from "@/src/lib/upstream";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Whitelist espelha as camadas oferecidas pela UI em src/app/(pages)/gibs/page.tsx
const ALLOWED_LAYERS = [
  "MODIS_Terra_CorrectedReflectance_TrueColor",
  "MODIS_Terra_Land_Surface_Temp_Day",
  "MODIS_Terra_Aerosol",
  "MODIS_Terra_Cloud_Water_Path",
] as const;
type GibsLayer = (typeof ALLOWED_LAYERS)[number];
const isAllowedLayer = (v: string): v is GibsLayer =>
  (ALLOWED_LAYERS as readonly string[]).includes(v);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Sem data, pegamos a de ontem (para garantir que o satélite já processou a imagem global)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const defaultDate = yesterday.toISOString().split("T")[0];

  const date = searchParams.get("date") || defaultDate;
  if (!ISO_DATE.test(date)) {
    return badRequest("Data inválida. Use o formato YYYY-MM-DD.");
  }

  const rawLayer =
    searchParams.get("layer") || "MODIS_Terra_CorrectedReflectance_TrueColor";
  if (!isAllowedLayer(rawLayer)) {
    return badRequest("Camada GIBS não suportada.");
  }
  const layer: GibsLayer = rawLayer;

  // URL do NASA Worldview Snapshot — BBOX global, EPSG:4326, 1920x960
  const imageUrl = `https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&TIME=${date}&BBOX=-90,-180,90,180&CRS=EPSG:4326&LAYERS=${layer}&WRAP=day,night&FORMAT=image/jpeg&WIDTH=1920&HEIGHT=960`;

  return NextResponse.json({ imageUrl, date, layer });
}
