import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface SignProps {
  text: string;
  sub?: string;
  width?: number;
  height?: number;
  bg?: string;
  color?: string;
  accent?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  lit?: number;
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  size: number,
  weight: number,
) {
  let current = size;
  while (current > 12) {
    ctx.font = weight + ' ' + current + 'px Inter, system-ui, sans-serif';
    if (ctx.measureText(text).width <= maxWidth) break;
    current -= 2;
  }
  return current;
}

// Premium signage: a dark glass panel with a lime accent bar, tight set type and a
// widely tracked subtitle. The lettering is shrunk to fit instead of being clipped,
// and it is rasterised once so it stays crisp in world space.
export default function Sign({
  text,
  sub,
  width = 4.4,
  height = 1.1,
  bg = '#0b100e',
  color = '#f6faef',
  accent = '#a3e635',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  lit = 0.4,
}: SignProps) {
  const texture = useMemo(() => {
    const ratio = Math.max(0.16, height / width);
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = Math.max(96, Math.round(1024 * ratio));
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const w = canvas.width;
    const h = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, bg);
    grad.addColorStop(1, '#060a08');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const pad = Math.round(h * 0.16);
    const barW = Math.max(4, Math.round(h * 0.05));
    ctx.fillStyle = accent;
    ctx.fillRect(pad, Math.round(h * 0.2), barW, Math.round(h * 0.6));

    const left = pad + barW + Math.round(h * 0.13);
    const maxWidth = w - left - Math.round(h * 0.14);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const mainSize = fitText(ctx, text, maxWidth, Math.round(h * (sub ? 0.36 : 0.46)), '700');
    ctx.fillStyle = color;
    ctx.fillText(text, left, Math.round(h * (sub ? 0.38 : 0.5)));

    if (sub) {
      const subSize = fitText(ctx, sub.toUpperCase(), maxWidth, Math.round(h * 0.125), '700');
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.92;
      ctx.fillText(sub.toUpperCase(), left, Math.round(h * 0.72));
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(255,255,255,0.09)';
      ctx.fillRect(left, Math.round(h * 0.6), maxWidth, 1);
    }

    // hairline frame so the panel reads as a product, not a sticker
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = Math.max(1, Math.round(h * 0.004));
    ctx.strokeRect(1, 1, w - 2, h - 2);

    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    map.needsUpdate = true;
    return map;
  }, [text, sub, bg, color, accent, width, height]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.03]} castShadow>
        <boxGeometry args={[width + 0.09, height + 0.09, 0.05]} />
        <meshStandardMaterial color="#141a16" roughness={0.35} metalness={0.45} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={lit}
          roughness={0.34}
          metalness={0.12}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}