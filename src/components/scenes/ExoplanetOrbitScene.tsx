"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Trail } from "@react-three/drei";
import { type Group, type Mesh } from "three";

import type { ExoplanetRow } from "@/src/lib/types/nasa";
import { SceneCanvas } from "@/src/components/hud";

/* ─── Helpers ─────────────────────────────────────────────────── */

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/** Mapeia raio planetário (R⊕) para um valor visual usável em escala. */
const planetVisualRadius = (rade: number | null): number => {
  if (!rade || rade <= 0) return 0.18;
  // log compressão: terra=1 → 0.18, jupiter≈11 → ~0.55, super-jupiter≈22 → ~0.78
  return clamp(0.12 + Math.log10(1 + rade) * 0.45, 0.1, 0.95);
};

/** Velocidade angular (rad/s) baseada no período orbital (dias). Lentos = mais devagar. */
const orbitalSpeed = (orbper: number | null): number => {
  if (!orbper || orbper <= 0) return 0.25;
  // 1 dia → ~0.6 rad/s, 365 dias → ~0.05 rad/s
  return clamp(0.6 / Math.pow(orbper, 0.4), 0.04, 0.9);
};

/** Cor da estrela hospedeira derivada do nome (hash determinístico). */
const starColorFromName = (name: string): string => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const palette = [
    "#ffd27a", // amarelo (G)
    "#fff4d6", // branco-amarelo (F)
    "#ffe9b5", // amarelo claro
    "#ff8a5a", // laranja (K)
    "#cf6b3c", // vermelho (M)
    "#cfd9ff", // branco-azulado (A)
  ];
  return palette[h % palette.length];
};

/* ─── Cena principal ──────────────────────────────────────────── */

interface ExoplanetSceneProps {
  planet: ExoplanetRow;
  /** Cor de destaque do módulo — usada no anel de órbita. */
  accent: string;
}

function PlanetSystem({ planet, accent }: ExoplanetSceneProps) {
  const group = useRef<Group>(null);
  const planetMesh = useRef<Mesh>(null);
  const starMesh = useRef<Mesh>(null);

  const { planetRadius, speed, orbitRadius, starColor } = useMemo(() => {
    const pr = planetVisualRadius(planet.pl_rade);
    return {
      planetRadius: pr,
      speed: orbitalSpeed(planet.pl_orbper),
      orbitRadius: 3.2,
      starColor: starColorFromName(planet.hostname),
    };
  }, [planet.pl_rade, planet.pl_orbper, planet.hostname]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * speed;
    if (planetMesh.current) planetMesh.current.rotation.y += delta * 0.6;
    if (starMesh.current) {
      const s = 1 + Math.sin(performance.now() * 0.0015) * 0.025;
      starMesh.current.scale.setScalar(s);
    }
  });

  // Pontos do anel de órbita (curva de 128 segmentos)
  const orbitPoints = useMemo(() => {
    const pts: Float32Array = new Float32Array(129 * 3);
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts[i * 3] = Math.cos(a) * orbitRadius;
      pts[i * 3 + 1] = 0;
      pts[i * 3 + 2] = Math.sin(a) * orbitRadius;
    }
    return pts;
  }, [orbitRadius]);

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={3.5} color={starColor} distance={20} decay={2} />
      <pointLight position={[6, 4, 6]} intensity={0.4} color="#ffffff" />

      {/* Estrela hospedeira */}
      <mesh ref={starMesh}>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshBasicMaterial color={starColor} toneMapped={false} />
      </mesh>
      {/* Halo da estrela */}
      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial color={starColor} transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color={starColor} transparent opacity={0.07} toneMapped={false} />
      </mesh>

      {/* Anel de órbita */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[orbitPoints, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={accent} transparent opacity={0.45} />
      </line>

      {/* Planeta + trail */}
      <group ref={group}>
        <Trail
          width={2}
          length={6}
          color={accent}
          attenuation={(t) => t * t}
        >
          <mesh ref={planetMesh} position={[orbitRadius, 0, 0]}>
            <sphereGeometry args={[planetRadius, 48, 48]} />
            <meshStandardMaterial
              color="#94a4c8"
              roughness={0.65}
              metalness={0.1}
              emissive={accent}
              emissiveIntensity={0.05}
            />
          </mesh>
        </Trail>
      </group>
    </>
  );
}

/* ─── Wrapper exportado ───────────────────────────────────────── */

interface ExoplanetOrbitSceneProps {
  planet: ExoplanetRow;
  accent: string;
  className?: string;
}

export function ExoplanetOrbitScene({ planet, accent, className }: ExoplanetOrbitSceneProps) {
  return (
    <SceneCanvas
      className={className}
      camera={{ position: [4.5, 3.2, 6.5], fov: 45, near: 0.1, far: 200 }}
    >
      <PlanetSystem planet={planet} accent={accent} />
      <Stars
        radius={120}
        depth={60}
        count={1800}
        factor={3}
        fade
        speed={0.35}
      />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={4}
        maxDistance={14}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </SceneCanvas>
  );
}
