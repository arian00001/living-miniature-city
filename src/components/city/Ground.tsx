import { useMemo } from 'react';
import { seeded } from '../../lib/paths';

// The city sits on continuous land that runs to the horizon instead of a floating island.
export default function Ground() {
  const patches = useMemo(() => {
    const random = seeded(7);
    return Array.from({ length: 34 }, () => ({
      x: (random() - 0.5) * 120,
      z: (random() - 0.5) * 120,
      r: 1.6 + random() * 4.2,
      shade: random() > 0.5 ? '#7f8f68' : '#93a37c',
    }));
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]} receiveShadow>
        <planeGeometry args={[1800, 1800]} />
        <meshStandardMaterial color="#59614c" roughness={1} />
      </mesh>
      <mesh position={[0, -0.13, 0]} receiveShadow>
        <boxGeometry args={[127, 0.3, 127]} />
        <meshStandardMaterial color="#5f684f" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[126, 126]} />
        <meshStandardMaterial color="#7d8c64" roughness={1} />
      </mesh>
      {patches.map((patch, index) => (
        <mesh key={index} rotation={[-Math.PI / 2, 0, 0]} position={[patch.x, 0.02, patch.z]}>
          <circleGeometry args={[patch.r, 14]} />
          <meshStandardMaterial color={patch.shade} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
