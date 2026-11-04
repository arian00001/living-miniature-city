import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { pointOnLoop, rectLoop } from '../../lib/paths';
import { trafficSignal } from '../../lib/traffic';
import { useCityStore } from '../../store/cityStore';

const LOOP = rectLoop(0, 0, 42.2, 42.2);
const CORNERS: [number, number][] = [
  [42.2, 42.2],
  [-42.2, 42.2],
  [42.2, -42.2],
  [-42.2, -42.2],
];

function Car({ offset, speed, color, van }: { offset: number; speed: number; color: string; van: boolean }) {
  const root = useRef<THREE.Group>(null);
  const wheels = useRef<(THREE.Mesh | null)[]>([]);
  const distance = useRef(offset);
  const night = useCityStore((state) => state.lightingMode === 'night');

  useFrame((_, delta) => {
    const point = pointOnLoop(LOOP, distance.current);
    const axis = Math.abs(Math.cos(point.angle)) > Math.abs(Math.sin(point.angle)) ? 'ns' : 'ew';
    const nearest = Math.min(
      ...CORNERS.map(([x, z]) => Math.hypot(point.x - x, point.z - z)),
    );
    const blocked = nearest < 5.5 && trafficSignal.phase !== axis;
    const step = blocked ? 0 : speed * delta;
    distance.current += step;

    if (root.current) {
      root.current.position.set(point.x, 0.34, point.z);
      root.current.rotation.y = point.angle;
    }
    wheels.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += step * 3.4;
    });
  });

  const length = van ? 3.4 : 2.7;
  const height = van ? 1.25 : 0.72;

  return (
    <group ref={root}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[1.35, height, length]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.35} />
      </mesh>
      {!van && (
        <mesh position={[0, height + 0.28, -0.2]} castShadow>
          <boxGeometry args={[1.2, 0.56, 1.5]} />
          <meshStandardMaterial color="#2b3a4c" roughness={0.25} metalness={0.5} />
        </mesh>
      )}
      {[[-0.66, 0.9], [0.66, 0.9], [-0.66, -0.9], [0.66, -0.9]].map(([x, z], index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            wheels.current[index] = mesh;
          }}
          position={[x, 0.26, z]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.26, 0.26, 0.16, 12]} />
          <meshStandardMaterial color="#20242c" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, height * 0.6, length / 2 + 0.02]}>
        <boxGeometry args={[1.2, 0.14, 0.08]} />
        <meshStandardMaterial
          color="#fff0c2"
          emissive="#ffe9b0"
          emissiveIntensity={night ? 2.4 : 0.3}
        />
      </mesh>
      <mesh position={[0, height * 0.6, -length / 2 - 0.02]}>
        <boxGeometry args={[1.15, 0.12, 0.08]} />
        <meshStandardMaterial color="#e2685f" emissive="#e2685f" emissiveIntensity={night ? 1.6 : 0.25} />
      </mesh>
    </group>
  );
}

export default function Vehicles() {
  const cars = [
    { offset: 0, speed: 7, color: '#dfe3ea', van: false },
    { offset: 62, speed: 8.5, color: '#c2557a', van: false },
    { offset: 140, speed: 6, color: '#5d7fa8', van: true },
    { offset: 240, speed: 9, color: '#e0b23f', van: false },
    { offset: 300, speed: 7.5, color: '#4f9d6b', van: false },
  ];

  return (
    <group>
      {cars.map((car, index) => (
        <Car key={index} {...car} />
      ))}
    </group>
  );
}
