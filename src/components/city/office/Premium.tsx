import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

const BOOKS = ['#2f4858', '#7d4b3a', '#3f6a4a', '#8a7b3f', '#5a4b8a', '#a3552f', '#2b3f5c', '#6b6f46', '#8f3f4c'];

// A tall shelf with real book rows — the reading corner the first office had.
export function Bookshelf({ position, rotation = 0, scale = 1 }: { position: [number, number, number]; rotation?: number; scale?: number }) {
  const rows = useMemo(() => {
    const list: { key: string; x: number; y: number; z: number; w: number; h: number; color: string; lean: number }[] = [];
    for (let shelf = 0; shelf < 4; shelf += 1) {
      let cursor = -0.72;
      let i = 0;
      while (cursor < 0.66) {
        const w = 0.045 + ((shelf * 7 + i * 3) % 5) * 0.011;
        const h = 0.3 + ((shelf + i) % 4) * 0.035;
        list.push({
          key: shelf + '-' + i,
          x: cursor + w / 2,
          y: 0.42 + shelf * 0.52,
          z: 0,
          w,
          h,
          color: BOOKS[(shelf * 3 + i) % BOOKS.length],
          lean: i % 9 === 0 ? 0.14 : 0,
        });
        cursor += w + 0.014;
        i += 1;
      }
    }
    return list;
  }, []);

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh position={[0, 1.05, -0.06]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 2.1, 0.3]} />
        <meshStandardMaterial color="#2a2f28" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.05, 0.09]}>
        <boxGeometry args={[1.46, 1.96, 0.02]} />
        <meshStandardMaterial color="#151a16" roughness={0.8} />
      </mesh>
      {[0.42, 0.94, 1.46, 1.98].map((y) => (
        <mesh key={'shelf' + y} position={[0, y - 0.2, 0.06]} castShadow>
          <boxGeometry args={[1.52, 0.035, 0.26]} />
          <meshStandardMaterial color="#3b4235" roughness={0.6} />
        </mesh>
      ))}
      {rows.map((book) => (
        <mesh key={book.key} position={[book.x, book.y, 0.06]} rotation={[0, 0, book.lean]} castShadow>
          <boxGeometry args={[book.w, book.h, 0.19]} />
          <meshStandardMaterial color={book.color} roughness={0.72} />
        </mesh>
      ))}
    </group>
  );
}

export function Rug({ position, size = [4.6, 3.2], color = '#1d2a22' }: { position: [number, number, number]; size?: [number, number]; color?: string }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}

export function Credenza({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.78, 0.46]} />
        <meshStandardMaterial color="#20261f" roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.83, 0]}>
        <boxGeometry args={[2.16, 0.05, 0.5]} />
        <meshStandardMaterial color="#3d4a3c" roughness={0.4} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.1, 0.16]}>
        <boxGeometry args={[2.0, 0.02, 0.02]} />
        <meshStandardMaterial color="#a3e635" emissive="#84cc16" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[-0.6, 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.08, 0.34, 12]} />
        <meshStandardMaterial color="#2f7f5f" roughness={0.25} metalness={0.1} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

export function Cove({ position, width }: { position: [number, number, number]; width: number }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[width, 0.035, 0.035]} />
      <meshStandardMaterial color="#d9f99d" emissive="#a3e635" emissiveIntensity={2.2} />
    </mesh>
  );
}

// Watering can held by the gardeners, with a short falling stream.
export function WateringCan({ position, rotation = 0, tilt = 0.5 }: { position: [number, number, number]; rotation?: number; tilt?: number }) {
  const drops = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!drops.current) return;
    drops.current.children.forEach((child, index) => {
      const t = (state.clock.elapsedTime * 1.6 + index * 0.22) % 1;
      child.position.y = -t * 0.62;
      child.position.x = t * 0.16;
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.opacity = 0.85 * (1 - t);
    });
  });

  return (
    <group position={position} rotation={[0, rotation, tilt]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.085, 0.105, 0.2, 12]} />
        <meshStandardMaterial color="#3c8f74" roughness={0.35} metalness={0.35} />
      </mesh>
      <mesh position={[0.15, 0.05, 0]} rotation={[0, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.02, 0.035, 0.24, 8]} />
        <meshStandardMaterial color="#3c8f74" roughness={0.35} metalness={0.35} />
      </mesh>
      <group ref={drops} position={[0.26, 0.02, 0]}>
        {[0, 1, 2, 3, 4].map((index) => (
          <mesh key={index} position={[0, -index * 0.12, (index % 2 ? 1 : -1) * 0.02]}>
            <sphereGeometry args={[0.017, 6, 5]} />
            <meshStandardMaterial color="#cfeeff" transparent opacity={0.8} roughness={0.1} metalness={0.1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}