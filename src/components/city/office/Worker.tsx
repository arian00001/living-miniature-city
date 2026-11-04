import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface WorkerProps {
  position: [number, number, number];
  rotation?: number;
  shirt?: string;
  skin?: string;
  typing?: boolean;
}

export default function Worker({ position, rotation = 0, shirt = '#3f6fd8', skin = '#d8a87c', typing = true }: WorkerProps) {
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!typing) return;
    const t = state.clock.elapsedTime;
    if (leftArm.current) leftArm.current.rotation.x = -0.95 + Math.sin(t * 6) * 0.16;
    if (rightArm.current) rightArm.current.rotation.x = -0.95 + Math.sin(t * 6 + 1.7) * 0.16;
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.34, 0.16]} castShadow>
        <boxGeometry args={[0.42, 0.14, 0.44]} />
        <meshStandardMaterial color="#2f3a4a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.46, 0.62, 0.28]} />
        <meshStandardMaterial color={shirt} roughness={0.8} />
      </mesh>
      <group ref={leftArm} position={[-0.27, 0.96, 0.02]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color={shirt} roughness={0.8} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.27, 0.96, 0.02]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color={shirt} roughness={0.8} />
        </mesh>
      </group>
      <mesh position={[0, 1.18, 0]} castShadow>
        <sphereGeometry args={[0.15, 14, 10]} />
        <meshStandardMaterial color={skin} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.24, -0.02]} castShadow>
        <sphereGeometry args={[0.152, 12, 8, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial color="#2b2622" roughness={0.9} />
      </mesh>
    </group>
  );
}
