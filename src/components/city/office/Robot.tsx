import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import GltfModel from '../../models/GltfModel';
import { MODELS } from '../../../data/models';

interface Props {
  position: [number, number, number];
  size?: number;
  phase?: number;
}

// Hovering lobby robot: idle float, slow scan, and a lean that reads as a servo twitch.
export default function Robot({ position, size = 1.75, phase = 0 }: Props) {
  const root = useRef<THREE.Group>(null);

  useFrame((state) => {
    const node = root.current;
    if (!node) return;
    const t = state.clock.elapsedTime + phase;
    node.position.set(position[0], position[1] + 0.1 + Math.sin(t * 1.3) * 0.07, position[2]);
    node.rotation.y = Math.sin(t * 0.6) * 0.6;
    node.rotation.z = Math.sin(t * 1.15) * 0.045;
    node.rotation.x = Math.sin(t * 0.85) * 0.03;
  });

  return (
    <group ref={root} position={position}>
      <GltfModel url={MODELS.robot} size={size} axis="height" />
    </group>
  );
}
