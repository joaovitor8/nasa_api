"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import {
  AdditiveBlending,
  BackSide,
  Color,
  DoubleSide,
  ShaderMaterial,
  type Mesh,
  type Group,
} from "three";

import { SceneCanvas } from "@/src/components/hud";

/* ─── Shader: disco de acreção ────────────────────────────────── */

const accretionVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const accretionFragment = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  uniform float uTime;
  uniform vec3 uHot;
  uniform vec3 uCool;
  uniform vec3 uAccent;

  // hash + noise determinístico — turbulência do plasma
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    // Coordenadas polares centradas no disco
    vec2 c = vUv - 0.5;
    float r = length(c) * 2.0;          // 0 = centro, 1 = borda externa
    float ang = atan(c.y, c.x);

    // Discard fora do anel (núcleo + borda externa)
    float inner = 0.30;
    float outer = 1.0;
    if (r < inner || r > outer) discard;

    // Rotação do plasma + turbulência radial
    float rot = uTime * 0.6;
    float swirl = noise(vec2(ang * 2.5 + rot * 1.2, r * 6.0 - rot * 0.4));
    float bands = sin(ang * 14.0 - rot * 2.5 + r * 12.0) * 0.5 + 0.5;
    float plasma = mix(swirl, bands, 0.55);

    // Temperatura: quente perto do horizonte, frio na borda
    float t = smoothstep(inner, outer, r);
    vec3 color = mix(uHot, uCool, t);
    color = mix(color, uAccent, 0.18);

    // Doppler boost — lado que se aproxima ~50% mais brilhante
    float doppler = 0.65 + 0.55 * (cos(ang) * 0.5 + 0.5);

    // Falloff radial suave nas bordas internas/externas
    float edgeIn = smoothstep(inner, inner + 0.05, r);
    float edgeOut = 1.0 - smoothstep(outer - 0.15, outer, r);
    float alpha = edgeIn * edgeOut;

    float intensity = (0.55 + plasma * 0.85) * doppler;
    vec3 final = color * intensity;

    gl_FragColor = vec4(final, alpha);
  }
`;

/* ─── Shader: glow esférico ao redor do horizonte ──────────────── */

const glowVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const glowFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.5);
    gl_FragColor = vec4(uColor * fresnel * uIntensity, fresnel);
  }
`;

/* ─── Componente da cena ──────────────────────────────────────── */

interface BlackHoleProps {
  spinSpeed: number;
  diskTilt: number;
}

function BlackHole({ spinSpeed, diskTilt }: BlackHoleProps) {
  const diskRef = useRef<Mesh>(null);
  const diskMatRef = useRef<ShaderMaterial>(null);
  const photonRingRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  const diskMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: accretionVertex,
        fragmentShader: accretionFragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uHot: { value: new Color("#fff5c2") },
          uCool: { value: new Color("#9c2bff") },
          uAccent: { value: new Color("#d44dff") },
        },
      }),
    [],
  );

  const glowMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: glowVertex,
        fragmentShader: glowFragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: BackSide,
        uniforms: {
          uColor: { value: new Color("#c084ff") },
          uIntensity: { value: 1.6 },
        },
      }),
    [],
  );

  useFrame((_, delta) => {
    if (diskMatRef.current) {
      diskMatRef.current.uniforms.uTime.value += delta;
    }
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * spinSpeed * 0.6;
    }
    if (photonRingRef.current) {
      photonRingRef.current.rotation.z -= delta * spinSpeed * 0.25;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Horizonte de eventos — esfera negra */}
      <mesh>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Glow Fresnel ao redor do horizonte */}
      <mesh scale={1.45} material={glowMaterial}>
        <sphereGeometry args={[1.0, 48, 48]} />
      </mesh>

      {/* Photon ring — anel fino brilhante na borda do horizonte */}
      <mesh ref={photonRingRef} rotation={[Math.PI / 2 + diskTilt, 0, 0]}>
        <torusGeometry args={[1.18, 0.018, 16, 128]} />
        <meshBasicMaterial color="#fff8d6" toneMapped={false} />
      </mesh>

      {/* Disco de acreção */}
      <mesh
        ref={diskRef}
        rotation={[Math.PI / 2 + diskTilt, 0, 0]}
      >
        <ringGeometry args={[1.25, 4.2, 256, 1]} />
        <primitive
          object={diskMaterial}
          ref={diskMatRef}
          attach="material"
        />
      </mesh>
    </group>
  );
}

/* ─── Wrapper exportado ───────────────────────────────────────── */

interface BlackHoleSceneProps {
  className?: string;
  /** Velocidade angular do disco de acreção. */
  spinSpeed?: number;
  /** Inclinação do disco (radianos). */
  diskTilt?: number;
}

export function BlackHoleScene({
  className,
  spinSpeed = 1,
  diskTilt = 0.18,
}: BlackHoleSceneProps) {
  return (
    <SceneCanvas
      className={className}
      camera={{ position: [0, 1.6, 7], fov: 45, near: 0.1, far: 500 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.05} />
      <BlackHole spinSpeed={spinSpeed} diskTilt={diskTilt} />
      <Stars
        radius={180}
        depth={80}
        count={3500}
        factor={4}
        fade
        speed={0.2}
      />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={3.5}
        maxDistance={18}
        autoRotate
        autoRotateSpeed={0.25}
      />
    </SceneCanvas>
  );
}
