export type Point2 = [number, number];

export function rectLoop(cx: number, cz: number, hx: number, hz: number): Point2[] {
  return [
    [cx - hx, cz - hz],
    [cx + hx, cz - hz],
    [cx + hx, cz + hz],
    [cx - hx, cz + hz],
  ];
}

export function loopLength(points: Point2[]): number {
  let total = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    total += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  return total;
}

export function pointOnLoop(points: Point2[], distance: number) {
  const total = loopLength(points) || 1;
  let d = ((distance % total) + total) % total;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d <= seg) {
      const t = seg === 0 ? 0 : d / seg;
      return {
        x: a[0] + (b[0] - a[0]) * t,
        z: a[1] + (b[1] - a[1]) * t,
        angle: Math.atan2(b[0] - a[0], b[1] - a[1]),
      };
    }
    d -= seg;
  }
  return { x: points[0][0], z: points[0][1], angle: 0 };
}

export function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}
