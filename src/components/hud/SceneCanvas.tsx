"use client";

import { Suspense, type ReactNode } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { cn } from "@/src/lib/utils";

interface SceneCanvasProps extends Omit<CanvasProps, "children"> {
  children: ReactNode;
  className?: string;
  /** Camada decorativa exibida sobre o canvas (overlay HUD opcional). */
  overlay?: ReactNode;
  /** Slot DOM exibido enquanto a Suspense da cena ainda não resolveu. */
  loading?: ReactNode;
}

const DefaultLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-10 h-10 rounded-full border-2 border-dashed animate-spin-slow"
        style={{ borderColor: "var(--module-accent, currentColor)" }}
      />
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
        Compilando volume 3D
      </span>
    </div>
  </div>
);

export function SceneCanvas({
  children,
  className,
  overlay,
  loading,
  camera,
  gl,
  dpr,
  ...rest
}: SceneCanvasProps) {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <Suspense fallback={loading ?? <DefaultLoader />}>
        <Canvas
          camera={camera ?? { position: [0, 1.6, 6], fov: 45, near: 0.05, far: 5000 }}
          dpr={dpr ?? [1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", ...(gl ?? {}) }}
          {...rest}
        >
          {children}
        </Canvas>
      </Suspense>

      {overlay}
    </div>
  );
}
