import { useMemo } from 'react';
import * as THREE from 'three';

export interface FacadeOptions {
  cols: number;
  rows: number;
  wall: string;
  glass: string;
  lit: string;
  litRatio?: number;
}

const SIZE = 256;
const cache = new Map<string, { map: THREE.Texture; emissiveMap: THREE.Texture }>();

function draw(options: FacadeOptions) {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = options.wall;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const rowHeight = SIZE / options.rows;
  const colWidth = SIZE / options.cols;

  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  for (let r = 0; r < options.rows; r += 1) ctx.fillRect(0, r * rowHeight, SIZE, 2);

  const emissive = document.createElement('canvas');
  emissive.width = SIZE;
  emissive.height = SIZE;
  const ectx = emissive.getContext('2d') as CanvasRenderingContext2D;
  ectx.fillStyle = '#000000';
  ectx.fillRect(0, 0, SIZE, SIZE);

  const w = colWidth * 0.6;
  const h = rowHeight * 0.56;
  const ratio = options.litRatio === undefined ? 0.5 : options.litRatio;

  for (let r = 0; r < options.rows; r += 1) {
    for (let c = 0; c < options.cols; c += 1) {
      const x = c * colWidth + (colWidth - w) / 2;
      const y = r * rowHeight + (rowHeight - h) / 2;
      ctx.fillStyle = options.glass;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.fillRect(x, y, w, Math.max(1, h * 0.18));
      if (Math.random() < ratio) {
        ectx.fillStyle = options.lit;
        ectx.fillRect(x, y, w, h);
      }
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  const emissiveMap = new THREE.CanvasTexture(emissive);
  emissiveMap.colorSpace = THREE.SRGBColorSpace;
  emissiveMap.anisotropy = 4;
  return { map, emissiveMap };
}

export function useFacade(options: FacadeOptions) {
  const key = JSON.stringify(options);
  return useMemo(() => {
    const cached = cache.get(key);
    if (cached) return cached;
    const made = draw(options);
    cache.set(key, made);
    return made;
  }, [key]);
}
