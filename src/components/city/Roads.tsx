import { useMemo } from 'react';

export const ROAD_LINES = [-44, -16, 16, 44];
export const ROAD_WIDTH = 6;
export const ROAD_HALF = 44;

const ASPHALT = '#3a3f47';
const PAINT = '#e7e2d4';
const CONCRETE = '#cdc8ba';

export default function Roads() {
  const slabs = useMemo(() => {
    const list: { key: string; position: [number, number, number]; size: [number, number, number] }[] = [];
    ROAD_LINES.forEach((line) => {
      list.push({ key: 'v' + line, position: [line, 0.06, 0], size: [ROAD_WIDTH, 0.12, 88] });
      list.push({ key: 'h' + line, position: [0, 0.06, line], size: [88, 0.12, ROAD_WIDTH] });
    });
    return list;
  }, []);

  const sidewalks = useMemo(() => {
    const list: { key: string; position: [number, number, number]; size: [number, number, number] }[] = [];
    ROAD_LINES.forEach((line) => {
      [-1, 1].forEach((side) => {
        list.push({ key: 'sv' + line + side, position: [line + side * 4.1, 0.11, 0], size: [2.2, 0.22, 88] });
        list.push({ key: 'sh' + line + side, position: [0, 0.11, line + side * 4.1], size: [88, 0.22, 2.2] });
      });
    });
    return list;
  }, []);

  const dashes = useMemo(() => {
    const list: { key: string; position: [number, number, number]; size: [number, number, number] }[] = [];
    ROAD_LINES.forEach((line) => {
      for (let i = 0; i < 11; i += 1) {
        const offset = -40 + i * 8;
        list.push({ key: 'dv' + line + i, position: [line, 0.13, offset], size: [0.22, 0.02, 3] });
        list.push({ key: 'dh' + line + i, position: [offset, 0.13, line], size: [3, 0.02, 0.22] });
      }
    });
    return list;
  }, []);

  const crossings = useMemo(() => {
    const list: { key: string; position: [number, number, number]; rotation: number }[] = [];
    [-16, 16].forEach((x) => {
      [-16, 16].forEach((z) => {
        for (let i = -2; i <= 2; i += 1) {
          list.push({ key: 'cx' + x + z + i, position: [x + i * 1.05, 0.14, z + 4.9], rotation: 0 });
          list.push({ key: 'cz' + x + z + i, position: [x + 4.9, 0.14, z + i * 1.05], rotation: Math.PI / 2 });
        }
      });
    });
    return list;
  }, []);

  return (
    <group>
      {slabs.map((slab) => (
        <mesh key={slab.key} position={slab.position} receiveShadow>
          <boxGeometry args={slab.size} />
          <meshStandardMaterial color={ASPHALT} roughness={0.95} />
        </mesh>
      ))}
      {sidewalks.map((slab) => (
        <mesh key={slab.key} position={slab.position} receiveShadow castShadow>
          <boxGeometry args={slab.size} />
          <meshStandardMaterial color={CONCRETE} roughness={0.9} />
        </mesh>
      ))}
      {dashes.map((dash) => (
        <mesh key={dash.key} position={dash.position}>
          <boxGeometry args={dash.size} />
          <meshStandardMaterial color={PAINT} roughness={0.8} />
        </mesh>
      ))}
      {crossings.map((stripe) => (
        <mesh key={stripe.key} position={stripe.position} rotation={[0, stripe.rotation, 0]}>
          <boxGeometry args={[0.55, 0.02, 3]} />
          <meshStandardMaterial color={PAINT} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
