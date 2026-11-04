import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import GltfModel from '../../models/GltfModel';
import { MODELS } from '../../../data/models';

interface Props {
  position: [number, number, number];
  rotation?: number;
  size?: number;
}

// The scientist sits behind the reception desk: breathing, typing, glancing up.
export default function Scientist({ position, rotation = 0, size = 1.62 }: Props) {
  const root = useRef<THREE.Group>(null);

  useFrame((state) => {
    const node = root.current;
    if (!node) return;
    const t = state.clock.elapsedTime;
    node.position.set(position[0], position[1] + Math.sin(t * 1.7) * 0.013, position[2]);
    node.rotation.y = rotation + Math.sin(t * 0.55) * 0.07;
    node.rotation.x = Math.sin(t * 1.1) * 0.008;
  });

  return (
    <group ref={root} position={position}>
      <GltfModel url={MODELS.scientist} size={size} axis="height" />
    </group>
  );
}
