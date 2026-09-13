import { TelemetrySpinner } from "@/src/components/hud";

export default function Loading() {
  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-8 flex items-center justify-center">
      <TelemetrySpinner
        label="UNIVERSO · ROTEAMENTO"
        phases={[
          "Carregando módulo",
          "Estabelecendo uplink",
          "Renderizando console",
        ]}
      />
    </div>
  );
}
