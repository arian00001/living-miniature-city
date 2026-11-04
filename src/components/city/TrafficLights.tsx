import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { trafficSignal } from '../../lib/traffic';

const POLES: { position: [number, number, number]; axis: 'ns' | 'ew' }[] = [
  { position: [45.4, 0, -45.4], axis: 'ns' },
  { position: [-45.4, 0, 45.4], axis: 'ns' },
  { position: [45.4, 0, 45.4], axis: 'ew' },
  { position: [-45.4, 0, -45.4], axis: 'ew' },
];

function Pole({ position, axis, greenRef, redRef }: { position: [number, number, number]; axis: 'ns' | 'ew'; greenRef: (mesh: THREE.MeshStandardMaterial | null) => void; redRef: (mesh: THREE.MeshStandardMaterial | null) => void }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.9, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 3.8, 8]} />
        <meshStandardMaterial color="#3b434f" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[0.34, 0.9, 0.3]} />
        <meshStandardMaterial color="#232b36" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.72, 0.17]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshStandardMaterial ref={redRef} color="#e2685f" emissive="#e2685f" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 3.3, 0.17]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshStandardMaterial ref={greenRef} color="#63d78d" emissive="#63d78d" emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.08, 12]} />
        <meshStandardMaterial color="#cdc8ba" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function TrafficLights() {
  const greens = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const reds = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const timer = useRef(0);

  useFrame((_, delta) => {
    timer.current += delta;
    trafficSignal.timer += delta;
    if (timer.current > 7) {
      timer.current = 0;
      trafficSignal.phase = trafficSignal.phase === 'ns' ? 'ew' : 'ns';
    }
    POLES.forEach((pole, index) => {
      const green = greens.current[index];
      const red = reds.current[index];
      const isGreen = trafficSignal.phase === pole.axis;
      if (green) green.emissiveIntensity = isGreen ? 2.2 : 0.12;
      if (red) red.emissiveIntensity = isGreen ? 0.12 : 2.2;
    });
  });

  return (
    <group>
      {POLES.map((pole, index) => (
        <Pole
          key={index}
          position={pole.position}
          axis={pole.axis}
          greenRef={(material) => {
            greens.current[index] = material;
          }}
          redRef={(material) => {
            reds.current[index] = material;
          }}
        />
      ))}
    </group>
  );
}
