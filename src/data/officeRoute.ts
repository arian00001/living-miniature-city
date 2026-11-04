// The fixed tour inside the office: door → reception → project room → boss room.
// The joystick only moves along this line, so the visitor always sees the best of
// the interior and never walks through a wall or a desk.

export interface RouteStop {
  x: number;
  z: number;
  label: string;
  sub: string;
}

export const OFFICE_ROUTE: { x: number; z: number }[] = [
  { x: 0, z: 6.2 },
  { x: -4.6, z: 5.9 },
  { x: -7.4, z: 4.9 },
  { x: -8.4, z: 4.3 }, // reception
  { x: -9.4, z: 2.0 },
  { x: -8.6, z: -0.6 },
  { x: -8.8, z: -3.2 },
  { x: -8.6, z: -5.2 }, // project room
  { x: -6.4, z: -6.6 },
  { x: -1.4, z: -6.6 },
  { x: 3.2, z: -6.6 },
  { x: 5.6, z: -4.7 }, // boss room doorway
  { x: 9.3, z: -4.7 },
];

export const ROUTE_STOPS: RouteStop[] = [
  { x: -8.4, z: 4.3, label: 'Reception', sub: 'Say hello' },
  { x: -8.6, z: -5.2, label: 'Project Room', sub: 'Live work' },
  { x: 9.3, z: -4.7, label: 'Boss Room', sub: 'Dev // ayan' },
];

export function routeLength(points: { x: number; z: number }[]) {
  let total = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    total += Math.hypot(points[i + 1].x - points[i].x, points[i + 1].z - points[i].z);
  }
  return total;
}

export function pointOnRoute(points: { x: number; z: number }[], distance: number) {
  const total = routeLength(points);
  let d = Math.min(Math.max(distance, 0), total);
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const seg = Math.hypot(b.x - a.x, b.z - a.z);
    if (d <= seg) {
      const t = seg === 0 ? 0 : d / seg;
      return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, yaw: Math.atan2(b.x - a.x, b.z - a.z) };
    }
    d -= seg;
  }
  const last = points[points.length - 1];
  const prev = points[points.length - 2] ?? last;
  return { x: last.x, z: last.z, yaw: Math.atan2(last.x - prev.x, last.z - prev.z) };
}