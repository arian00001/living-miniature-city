import { useMemo } from 'react';
import * as THREE from 'three';

interface SignProps {
  text: string;
  sub?: string;
  width?: number;
  height?: number;
  bg?: string;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  lit?: number;
}

// Painted signage: the words are rasterised once, so the panel keeps crisp lettering
// from any camera distance.
export default function Sign({
  text,
  sub,
  width = 4.4,
  height = 1.1,
  bg = '#80CBC4',
  color = '#0d2b27',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  lit = 0.3,
}: SignProps) {
  const texture = useMemo(() => {
    const ratio = Math.max(0.2, height / width);
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = Math.max(96, Math.round(1024 * ratio));
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const mainSize = Math.round(canvas.height * (sub ? 0.4 : 0.46));
      ctx.font = '700 ' + mainSize + 'px Inter, Helvetica, Arial, sans-serif';
      ctx.fillText(text, canvas.width / 2, canvas.height * (sub ? 0.4 : 0.52));
      if (sub) {
        ctx.globalAlpha = 0.72;
        ctx.font = '500 ' + Math.round(canvas.height * 0.16) + 'px Inter, Helvetica, Arial, sans-serif';
        ctx.fillText(sub, canvas.width / 2, canvas.height * 0.74);
        ctx.globalAlpha = 1;
      }
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }, [text, sub, bg, color, width, height]);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={lit} roughness={0.5} metalness={0.05} />
    </mesh>
  );
}
