import { useMemo } from 'react';
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

// Premium signage: a dark glass panel with a lime accent bar, tight set type and a
// widely tracked subtitle. Lettering is rasterised once so it stays crisp in world space.
export default function Sign({
  text,
  sub,
  width = 4.4,
  height = 1.1,
  bg = '#0c1110',
  color = '#f6faef',
  accent = '#a3e635',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  lit = 0.3,
}: SignProps) {
  const texture = useMemo(() => {
    const ratio = Math.max(0.22, height / width);
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = Math.max(110, Math.round(1024 * ratio));
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    if (ctx) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const pad = Math.round(h * 0.16);
      ctx.fillStyle = accent;
      ctx.fillRect(pad, Math.round(h * 0.22), Math.max(4, Math.round(h * 0.055)), Math.round(h * 0.56));

      const left = pad + Math.round(h * 0.14);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const mainSize = Math.round(h * (sub ? 0.4 : 0.5));
      ctx.font = '700 ' + mainSize + 'px Inter, Helvetica, Arial, sans-serif';
      (ctx as unknown as { letterSpacing: string }).letterSpacing = Math.round(mainSize * 0.02) + 'px';
      ctx.fillStyle = color;
      ctx.fillText(text, left, Math.round(h * (sub ? 0.4 : 0.52)));

      if (sub) {
        const subSize = Math.round(h * 0.135);
        ctx.font = '600 ' + subSize + 'px Inter, Helvetica, Arial, sans-serif';
        (ctx as unknown as { letterSpacing: string }).letterSpacing = Math.round(subSize * 0.24) + 'px';
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.9;
        ctx.fillText(sub.toUpperCase(), left, Math.round(h * 0.73));
        ctx.globalAlpha = 1;
      }
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    return map;
  }, [text, sub, bg, color, accent, width, height]);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.03]} castShadow>
        <boxGeometry args={[width + 0.09, height + 0.09, 0.05]} />
        <meshStandardMaterial color="#141a16" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={lit}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}