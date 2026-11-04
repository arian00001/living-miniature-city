import { useMemo } from 'react';
import { ROUTE_STOPS, OFFICE_ROUTE } from '../../../data/officeRoute';
import Sign from './Sign';

// The guided walk made visible: soft lime studs along the route plus a label at
// every stop, so the visitor can see where the joystick is about to take them.
export default function OfficeRoute() {
  const studs = useMemo(() => {
    const list: { key: string; x: number; z: number }[] = [];
    for (let i = 0; i < OFFICE_ROUTE.length - 1; i += 1) {
      const a = OFFICE_ROUTE[i];
      const b = OFFICE_ROUTE[i + 1];
      const steps = Math.max(2, Math.round(Math.hypot(b.x - a.x, b.z - a.z) / 0.85));
      for (let s = 0; s < steps; s += 1) {
        const t = s / steps;
        list.push({ key: i + '-' + s, x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t });
      }
    }
    return list;
  }, []);

  return (
    <group>
      {studs.map((stud) => (
        <mesh key={stud.key} position={[stud.x, 0.014, stud.z]}>
          <cylinderGeometry args={[0.062, 0.062, 0.012, 12]} />
          <meshStandardMaterial color="#a3e635" emissive="#84cc16" emissiveIntensity={1.5} roughness={0.4} />
        </mesh>
      ))}
      {ROUTE_STOPS.map((stop) => (
        <group key={stop.label} position={[stop.x, 1.95, stop.z]}>
          <Sign text={stop.label} sub={stop.sub} width={1.7} height={0.44} lit={0.55} />
        </group>
      ))}
    </group>
  );
}