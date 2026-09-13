"use client";

import { useEffect, useRef } from "react";

interface StarsProps {
  className?: string;
  /** Quantidade de partículas. */
  quantity?: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  /** Componentes RGB pré-computados (ex: "30, 144, 255"). */
  rgb: string;
  /** Offset de pulsação para dessincronizar partículas. */
  phase: number;
}

const COLORS = [
  "#0000FF", "#F0FFFF", "#1E90FF", "#FFFFFF",
  "#FFFACD", "#FFFF00", "#FFA500", "#FF0000",
];

const hexToRgb = (hex: string): string => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};

const RGB_PALETTE = COLORS.map(hexToRgb);

export default function Stars({ className = "", quantity = 30 }: StarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let stars: Star[] = [];
    let frameId = 0;
    const size = { w: 0, h: 0 };

    const seedStar = (): Star => ({
      x: Math.random() * size.w,
      y: Math.random() * size.h,
      size: Math.random() * 1.9 + 0.1,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(2)),
      rgb: RGB_PALETTE[Math.floor(Math.random() * RGB_PALETTE.length)],
      phase: Math.random() * Math.PI * 2,
    });

    const reseed = () => {
      stars = Array.from({ length: quantity }, seedStar);
    };

    const resize = () => {
      size.w = container.offsetWidth;
      size.h = container.offsetHeight;
      canvas.width = size.w * dpr;
      canvas.height = size.h * dpr;
      canvas.style.width = `${size.w}px`;
      canvas.style.height = `${size.h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      reseed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, size.w, size.h);
      const t = performance.now() * 0.002;

      for (const star of stars) {
        if (star.alpha < star.targetAlpha) star.alpha += 0.02;

        const pulse = Math.sin(t + star.phase) * 0.5 + 0.5;
        const radius = star.size * (1 + 0.3 * pulse);
        const opacity = star.alpha * pulse;

        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.rgb}, ${opacity})`;
        ctx.fill();
      }

      frameId = requestAnimationFrame(draw);
    };

    resize();
    frameId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [quantity]);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
