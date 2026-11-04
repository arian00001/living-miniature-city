import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { seeded } from '../../lib/paths';
import { skyState } from '../../lib/skyState';

function StreetTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 2, 10]} />
        <meshStandardMaterial color="#5f4a31" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.55, 0]} castShadow>
        <sphereGeometry args={[1.18, 14, 10]} />
        <meshStandardMaterial color="#547a49" roughness={1} />
      </mesh>
      <mesh position={[0.42, 2.05, 0.28]} castShadow>
        <sphereGeometry args={[0.72, 12, 9]} />
        <meshStandardMaterial color="#5f8850" roughness={1} />
      </mesh>
      <mesh position={[-0.36, 2.2, -0.3]} castShadow>
        <sphereGeometry args={[0.66, 12, 9]} />
        <meshStandardMaterial color="#4d7044" roughness={1} />
      </mesh>
    </group>
  );
}

function Lamp({ position, withLight }: { position: [number, number, number]; withLight: boolean }) {
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const night = skyState.night;
    if (bulb.current) bulb.current.emissiveIntensity = 0.08 + night * 3.2;
    if (light.current) light.current.intensity = night * 11;
  });

  return (
    <group position={position}>
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.09, 3.4, 10]} />
        <meshStandardMaterial color="#3c434b" metalness={0.65} roughness={0.42} />
      </mesh>
      <mesh position={[0, 3.45, 0]}>
        <cylinderGeometry args={[0.34, 0.2, 0.16, 12]} />
        <meshStandardMaterial color="#2f353c" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.34, 0]}>
        <sphereGeometry args={[0.24, 12, 10]} />
        <meshStandardMaterial ref={bulb} color="#fff6da" emissive="#ffdca4" emissiveIntensity={0.1} toneMapped={false} />
      </mesh>
      {withLight ? <pointLight ref={light} position={[0, 3.2, 0]} color="#ffd9a3" intensity={0} distance={17} decay={2} /> : null}
    </group>
  );
}

const LAMP_SPOTS: [number, number, number][] = [
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

export default function Environment() {
  const random = useMemo(() => seeded(133), []);

  const trees = useMemo(() => {
    const spots: { position: [number, number, number]; scale: number }[] = [];
    const lanes: [number, number, number, number][] = [
      [-58, -58, 58, -47],
      [-58, 47, 58, 58],
      [-58, -46, -47, 46],
      [47, -46, 58, 46],
    ];
    lanes.forEach(([x1, z1, x2, z2]) => {
      for (let i = 0; i < 7; i += 1) {
        spots.push({
          position: [
            x1 + (x2 - x1) * (i / 6) + (random() - 0.5) * 2.5,
            0,
            z1 + (z2 - z1) * (i / 6) + (random() - 0.5) * 2.5,
          ],
          scale: 0.6 + random() * 0.45,
        });
      }
    });
    return spots;
  }, [random]);

  const flowers = useMemo(() => {
    const tones = ['#e6c14f', '#d97a8a', '#c9d6f0', '#e8e0c0'];
    return Array.from({ length: 46 }, () => {
      const angle = random() * Math.PI * 2;
      const radius = 18 + random() * 30;
      return {
        position: [Math.cos(angle) * radius, 0.14, Math.sin(angle) * radius] as [number, number, number],
        color: tones[Math.floor(random() * tones.length)],
      };
    });
  }, [random]);

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
      {LAMP_SPOTS.map((position, index) => (
        <Lamp key={index} position={position} withLight={index % 2 === 0} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.05, 52]} receiveShadow>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial color="#34383f" roughness={0.95} />
      </mesh>
      {[-6, -2, 2, 6].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[10 + x, 0.09, 52]}>
          <planeGeometry args={[0.3, 6]} />
          <meshStandardMaterial color="#ded9cb" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
