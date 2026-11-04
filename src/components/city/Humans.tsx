import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { pointOnLoop, rectLoop } from '../../lib/paths';

const PATHS = [
  rectLoop(0, 0, 13.2, 13.2),
  rectLoop(30, -30, 13.4, 13.4),
  rectLoop(-30, 30, 13, 13),
  rectLoop(30, 30, 11.5, 11.5),
  rectLoop(-16, -52, 11.5, 5),
];

const SHIRTS = ['#3f6fd8', '#d8623f', '#4f9d6b', '#8f5bd8', '#e0b23f', '#3fb6c9', '#c2557a'];
const SKINS = ['#e0b48c', '#c98f63', '#f0cfae', '#a9764f'];

function Pedestrian({ pathIndex, speed, offset, shirt, skin }: { pathIndex: number; speed: number; offset: number; shirt: string; skin: string }) {
  const root = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const distance = useRef(offset);

  useFrame((_, delta) => {
    distance.current += speed * delta;
    const point = pointOnLoop(PATHS[pathIndex], distance.current);
    if (root.current) {
      root.current.position.set(point.x, 0, point.z);
      root.current.rotation.y = point.angle;
    }
    const swing = Math.sin(distance.current * 2.2);
    if (leftLeg.current) leftLeg.current.rotation.x = swing * 0.55;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing * 0.55;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.4;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.4;
  });

  return (
    <group ref={root}>
      <group ref={leftLeg} position={[-0.11, 0.6, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.13, 0.6, 0.13]} />
          <meshStandardMaterial color="#2f3a4a" roughness={0.9} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.11, 0.6, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.13, 0.6, 0.13]} />
          <meshStandardMaterial color="#2f3a4a" roughness={0.9} />
        </mesh>
      </group>
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[0.42, 0.56, 0.26]} />
        <meshStandardMaterial color={shirt} roughness={0.85} />
      </mesh>
      <group ref={leftArm} position={[-0.25, 1.1, 0]}>
        <mesh position={[0, -0.24, 0]} castShadow>
          <boxGeometry args={[0.1, 0.48, 0.1]} />
          <meshStandardMaterial color={shirt} roughness={0.85} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.25, 1.1, 0]}>
        <mesh position={[0, -0.24, 0]} castShadow>
          <boxGeometry args={[0.1, 0.48, 0.1]} />
          <meshStandardMaterial color={shirt} roughness={0.85} />
        </mesh>
      </group>
      <mesh position={[0, 1.28, 0]} castShadow>
        <sphereGeometry args={[0.15, 12, 10]} />
        <meshStandardMaterial color={skin} roughness={0.75} />
      </mesh>
    </group>
  );
}

export default function Humans() {
  const crowd = Array.from({ length: 12 }, (_, index) => ({
    pathIndex: index % PATHS.length,
    speed: 1.1 + (index % 4) * 0.25,
    offset: index * 9.5,
    shirt: SHIRTS[index % SHIRTS.length],
    skin: SKINS[index % SKINS.length],
  }));

  return (
    <group>
      {crowd.map((person, index) => (
        <Pedestrian key={index} {...person} />
      ))}
    </group>
  );
}
