import { useMemo } from 'react';
import { seeded } from '../../lib/paths';

export default function Ground() {
  const patches = useMemo(() => {
    const random = seeded(7);
    return Array.from({ length: 26 }, () => ({
      x: (random() - 0.5) * 118,
      z: (random() - 0.5) * 118,
      r: 1.4 + random() * 3.4,
      shade: random() > 0.5 ? '#849c6d' : '#97af80',
    }));
  }, []);

  return (
    <group>
      <mesh position={[0, -6, 0]} rotation={[0, Math.PI / 4, 0]} receiveShadow>
        <cylinderGeometry args={[88, 44, 12, 4]} />
        <meshStandardMaterial color="#5d594b" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[124, 124]} />
        <meshStandardMaterial color="#8ea878" roughness={1} />
      </mesh>
      {patches.map((patch, index) => (
        <mesh key={index} rotation={[-Math.PI / 2, 0, 0]} position={[patch.x, 0.02, patch.z]}>
          <circleGeometry args={[patch.r, 12]} />
          <meshStandardMaterial color={patch.shade} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
