import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

export const revalidate = 3600; // 1h — InSight feed atualiza lentamente

export async function GET() {
  return handleRoute(
    {
      tag: "MARS",
      fallbackMessage:
        "Sinal perdido. A tempestade de areia bloqueou a transmissão do lander.",
      messages: {
        429: "Cota de telemetria estourada. Aguarde alguns minutos.",
      },
    },
    () =>
      fetchUpstream("https://api.nasa.gov/insight_weather/", {
        nasaAuth: true,
        params: { feedtype: "json", ver: "1.0" },
      }),
  );
}
