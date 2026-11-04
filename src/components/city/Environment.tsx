import { useMemo } from 'react';
import { seeded } from '../../lib/paths';

function StreetTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.2, 2, 8]} />
        <meshStandardMaterial color="#6a5136" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.7, 0]} castShadow>
        <sphereGeometry args={[1.25, 14, 10]} />
        <meshStandardMaterial color="#628c54" roughness={1} />
      </mesh>
    </group>
  );
}

function Lamp({ position, lit }: { position: [number, number, number]; lit: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 3.2, 8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.3, 0]}>
        <sphereGeometry args={[0.26, 12, 10]} />
        <meshStandardMaterial
          color="#fff3cf"
          emissive="#ffdf9c"
          emissiveIntensity={lit ? 2.2 : 0.15}
        />
      </mesh>
    </group>
  );
}

export default function Environment() {
  const random = useMemo(() => seeded(133), []);
  const lit = useCityStoreLamp();

  const trees = useMemo(() => {
    const spots: { position: [number, number, number]; scale: number }[] = [];
    const lanes: [number, number, number, number][] = [
      [-58, -58, 58, -46],
      [-58, 46, 58, 58],
      [-58, -46, -46, 46],
      [46, -46, 58, 46],
    ];
    lanes.forEach(([x1, z1, x2, z2]) => {
      for (let i = 0; i < 7; i += 1) {
        const x = x1 + (x2 - x1) * (i / 6) + (random() - 0.5) * 3;
        const z = z1 + (z2 - z1) * (i / 6) + (random() - 0.5) * 3;
        spots.push({ position: [x, 0, z], scale: 0.6 + random() * 0.45 });
      }
    });
    return spots;
  }, [random]);

  const flowers = useMemo(() => {
    const spots: { position: [number, number, number]; color: string }[] = [];
    const tones = ['#e6c14f', '#d97a8a', '#c9d6f0', '#e8e0c0'];
    for (let i = 0; i < 46; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 18 + random() * 30;
      spots.push({
        position: [Math.cos(angle) * radius, 0.14, Math.sin(angle) * radius],
        color: tones[Math.floor(random() * tones.length)],
      });
    }
    return spots;
  }, [random]);

  const lamps: [number, number, number][] = [
    [-16, 0, -20],
    [16, 0, -20],
    [-16, 0, 20],
    [16, 0, 20],
    [-44, 0, -20],
    [44, 0, -20],
    [-44, 0, 20],
    [44, 0, 20],
    [-20, 0, -44],
    [20, 0, -44],
    [-20, 0, 44],
    [20, 0, 44],
  ];

  return (
    <group>
      {trees.map((tree, index) => (
        <StreetTree key={index} position={tree.position} scale={tree.scale} />
      ))}
      {flowers.map((flower, index) => (
        <mesh key={index} position={flower.position}>
          <sphereGeometry args={[0.16, 6, 5]} />
          <meshStandardMaterial color={flower.color} roughness={0.9} />
        </mesh>
      ))}
      {lamps.map((position, index) => (
        <Lamp key={index} position={position} lit={lit} />
      ))}
      {/* parking bays on the south edge */}
      {[-6, -2, 2, 6].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[10 + x, 0.09, 52]}>
          <planeGeometry args={[0.3, 6]} />
          <meshStandardMaterial color="#e7e2d4" roughness={0.9} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.05, 52]} receiveShadow>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial color="#3a3f47" roughness={0.95} />
      </mesh>
    </group>
  );
}

function useCityStoreLamp() {
  return false;
}
