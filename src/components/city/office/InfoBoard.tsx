import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export interface BoardRow {
  label: string;
  value: string;
  url?: string;
  action?: 'projects';
}

interface InfoBoardProps {
  title: string;
  sub?: string;
  rows: BoardRow[];
  width?: number;
  height?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  onAction?: (action: 'projects') => void;
}

const CANVAS_W = 1024;
const PAD_X = 44;

function fit(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, size: number, weight: number) {
  let current = size;
  while (current > 10) {
    ctx.font = weight + ' ' + current + 'px Inter, system-ui, sans-serif';
    if (ctx.measureText(text).width <= maxWidth) break;
    current -= 2;
  }
  return current;
}

// A dark-glass information board: a title, a lime kicker and rows of links that can be
// clicked straight in the 3D world. Everything is rasterised once, so it stays crisp.
export default function InfoBoard({
  title,
  sub,
  rows,
  width = 2.5,
  height = 1.9,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onAction,
}: InfoBoardProps) {
  const { texture, rowCenters } = useMemo(() => {
    const h = Math.round((CANVAS_W * height) / width);
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W;
    canvas.height = h;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#111a15');
    grad.addColorStop(1, '#070b09');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, h);

    ctx.fillStyle = 'rgba(163,230,53,0.9)';
    ctx.fillRect(0, 0, CANVAS_W, 4);

    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    const titleSize = Math.round(h * 0.095);
    ctx.fillStyle = '#f5faee';
    ctx.font = '700 ' + titleSize + 'px Inter, system-ui, sans-serif';
    ctx.fillText(title, PAD_X, Math.round(h * 0.08));

    if (sub) {
      const subSize = Math.round(h * 0.038);
      ctx.font = '700 ' + subSize + 'px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#a3e635';
      ctx.fillText(sub.toUpperCase(), PAD_X, Math.round(h * 0.08 + titleSize * 1.22));
    }

    const dividerY = Math.round(h * 0.3);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(PAD_X, dividerY, CANVAS_W - PAD_X * 2, 1);

    const areaTop = h * 0.34;
    const rowH = (h * 0.6) / Math.max(1, rows.length);
    const centers: number[] = [];

    rows.forEach((row, index) => {
      const center = areaTop + rowH * (index + 0.5);
      centers.push(center);
      if (index > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(PAD_X, Math.round(areaTop + rowH * index), CANVAS_W - PAD_X * 2, 1);
      }

      const labelSize = Math.round(h * 0.032);
      ctx.fillStyle = 'rgba(226,240,210,0.52)';
      ctx.font = '700 ' + labelSize + 'px Inter, system-ui, sans-serif';
      ctx.fillText(row.label.toUpperCase(), PAD_X, Math.round(center - rowH * 0.42));

      const valueSize = fit(ctx, row.value, CANVAS_W - PAD_X * 2 - 44, Math.round(h * 0.052), 600);
      ctx.fillStyle = '#f7fbf1';
      ctx.font = '600 ' + valueSize + 'px Inter, system-ui, sans-serif';
      ctx.fillText(row.value, PAD_X, Math.round(center + rowH * 0.02));

      ctx.fillStyle = '#a3e635';
      ctx.font = '700 ' + Math.round(h * 0.055) + 'px Inter, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('\u203A', CANVAS_W - PAD_X, Math.round(center));
      ctx.textAlign = 'left';
    });

    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    map.needsUpdate = true;
    return { texture: map, rowCenters: centers };
  }, [title, sub, rows, width, height]);

  useEffect(() => () => texture.dispose(), [texture]);

  const rowWorldHeight = useMemo(() => {
    const h = (CANVAS_W * height) / width;
    return ((h * 0.6) / Math.max(1, rows.length) / h) * height * 0.92;
  }, [rows.length, width, height]);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[width + 0.14, height + 0.14, 0.08]} />
        <meshStandardMaterial color="#131a15" roughness={0.32} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0, -0.008]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.42}
          roughness={0.3}
          metalness={0.12}
          toneMapped={false}
        />
      </mesh>

      {rows.map((row, index) => {
        const y = height / 2 - (rowCenters[index] / ((CANVAS_W * height) / width)) * height;
        return (
          <mesh
            key={row.label + index}
            position={[0, y, 0.02]}
            onClick={(event) => {
              event.stopPropagation();
              if (row.action) onAction?.(row.action);
              else if (row.url) window.open(row.url, '_blank', 'noopener,noreferrer');
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            <planeGeometry args={[width * 0.94, rowWorldHeight]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}