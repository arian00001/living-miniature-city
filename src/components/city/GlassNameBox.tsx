import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Sign from './office/Sign';

const GLASS = '#e9f7d6';
const FRAME = '#26332b';

const W = 8.8;
const H = 2.45;
const D = 1.3;

interface GlassNameBoxProps {
  name: string;
  sub?: string;
  position?: [number, number, number];
}

const CORNERS: [number, number][] = [
  [-W / 2, -D / 2],
  [W / 2, -D / 2],
  [-W / 2, D / 2],
  [W / 2, D / 2],
];

// The studio name floats above the office inside a single glass case: translucent
// shell, machined frame, one backlit panel within. It drifts slowly, so the light
// slides across the glass instead of the name sitting there like a decal.
export default function GlassNameBox({ name, sub = 'Headquarters', position = [0, 0, 0] }: GlassNameBoxProps) {
  const node = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!node.current) return;
    const t = state.clock.elapsedTime;
    node.current.position.y = position[1] + Math.sin(t * 0.62) * 0.14;
    node.current.rotation.y = Math.sin(t * 0.2) * 0.07;
  });

  return (
    <group ref={node} position={position}>
      <mesh>
        <boxGeometry args={[W, H, D]} />
        <meshPhysicalMaterial
          color={GLASS}
          transparent
          opacity={0.14}
          roughness={0.03}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.04}
          reflectivity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {CORNERS.map(([x, z]) => (
        <mesh key={'v' + x + z} position={[x, 0, z]}>
          <boxGeometry args={[0.055, H, 0.055]} />
          <meshStandardMaterial color={FRAME} metalness={0.75} roughness={0.28} />
        </mesh>
      ))}
      {[-H / 2, H / 2].map((y) =>
        [-D / 2, D / 2].map((z) => (
          <mesh key={'rz' + y + z} position={[0, y, z]}>
            <boxGeometry args={[W, 0.055, 0.055]} />
            <meshStandardMaterial color={FRAME} metalness={0.75} roughness={0.28} />
          </mesh>
        )),
      )}
      {[-H / 2, H / 2].map((y) =>
        [-W / 2, W / 2].map((x) => (
          <mesh key={'rx' + y + x} position={[x, y, 0]}>
            <boxGeometry args={[0.055, 0.055, D]} />
            <meshStandardMaterial color={FRAME} metalness={0.75} roughness={0.28} />
          </mesh>
        )),
      )}

      <group position={[0, 0, D / 2 - 0.16]}>
        <Sign text={name} sub={sub} width={W - 1.5} height={1.62} lit={0.85} />
      </group>

      <mesh position={[0, -H / 2 + 0.09, D / 2 - 0.05]}>
        <boxGeometry args={[W - 1.2, 0.035, 0.05]} />
        <meshBasicMaterial color="#b4f04a" toneMapped={false} />
      </mesh>
      <pointLight position={[0, -0.4, 1.7]} color="#dcffb0" intensity={9} distance={11} decay={2} />
    </group>
  );
}
