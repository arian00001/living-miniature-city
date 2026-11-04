import { useMemo } from 'react';
import { seeded } from '../../lib/paths';

function Tree({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 2.2, 8]} />
        <meshStandardMaterial color="#6a5136" roughness={0.95} />
      </mesh>
      <mesh position={[0, 3, 0]} castShadow>
        <sphereGeometry args={[1.5, 16, 12]} />
        <meshStandardMaterial color="#5f8a52" roughness={1} />
      </mesh>
      <mesh position={[0.7, 3.9, 0.4]} castShadow>
        <sphereGeometry args={[0.95, 14, 10]} />
        <meshStandardMaterial color="#6d9a5c" roughness={1} />
      </mesh>
    </group>
  );
}

function Bench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.4, 0.12, 0.6]} />
        <meshStandardMaterial color="#9a7b52" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.75, -0.24]} castShadow>
        <boxGeometry args={[2.4, 0.5, 0.1]} />
        <meshStandardMaterial color="#9a7b52" roughness={0.9} />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.22, 0]} castShadow>
          <boxGeometry args={[0.12, 0.44, 0.5]} />
          <meshStandardMaterial color="#4c4a44" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function Park() {
  const trees = useMemo(() => {
    const random = seeded(21);
    return Array.from({ length: 9 }, () => ({
      position: [(random() - 0.5) * 26, 0, (random() - 0.5) * 10] as [number, number, number],
      scale: 0.65 + random() * 0.5,
    }));
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} receiveShadow>
        <planeGeometry args={[31, 15]} />
        <meshStandardMaterial color="#7fa268" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <circleGeometry args={[5.4, 24]} />
        <meshStandardMaterial color="#4f7fa8" roughness={0.25} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.7, 0.5, 18]} />
        <meshStandardMaterial color="#cdc7b8" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.34, 1.4, 12]} />
        <meshStandardMaterial color="#e6e1d5" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.42, 12, 10]} />
        <meshStandardMaterial color="#bcdcf2" transparent opacity={0.75} roughness={0.1} metalness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[1.9, 4.9, 32]} />
        <meshStandardMaterial color="#d9d2c0" roughness={0.95} />
      </mesh>
      {trees.map((tree, index) => (
        <Tree key={index} position={tree.position} scale={tree.scale} />
      ))}
      <Bench position={[-6, 0.08, 4.6]} />
      <Bench position={[6, 0.08, 4.6]} rotation={Math.PI} />
      <Bench position={[-9, 0.08, -3.4]} rotation={Math.PI / 2} />
      <Bench position={[9, 0.08, -3.4]} rotation={-Math.PI / 2} />
    </group>
  );
}
