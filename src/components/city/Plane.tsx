import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import GltfModel from '../models/GltfModel';
import { MODELS } from '../../data/models';

const RADIUS = 82;
const ALTITUDE = 38;

export default function Plane() {
  const root = useRef<THREE.Group>(null);

  useFrame((state) => {
    const node = root.current;
    if (!node) return;
    const t = state.clock.elapsedTime;
    const angle = t * 0.07 + 1.2;
    node.position.set(Math.cos(angle) * RADIUS, ALTITUDE + Math.sin(t * 0.42) * 2.6, Math.sin(angle) * RADIUS);
    node.rotation.y = -angle;
    node.rotation.z = -0.3 + Math.sin(t * 0.5) * 0.03;
    node.rotation.x = Math.sin(t * 0.75) * 0.035;
  });

  return (
    <group ref={root}>
      <GltfModel url={MODELS.plane} size={18} axis="length" castShadow={false} />
    </group>
  );
}
