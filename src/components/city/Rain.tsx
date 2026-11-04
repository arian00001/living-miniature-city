import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCityStore } from '../../store/cityStore';

const COUNT = 1200;

export default function Rain() {
  const weather = useCityStore((state) => state.weather);
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 120;
      array[i * 3 + 1] = Math.random() * 60;
      array[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    return array;
  }, []);

  useFrame((_, delta) => {
    if (weather !== 'rain' || !points.current) return;
    const attribute = points.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;
    for (let i = 1; i < array.length; i += 3) {
      array[i] -= delta * 46;
      if (array[i] < 0) array[i] = 58;
    }
    attribute.needsUpdate = true;
  });

  if (weather !== 'rain') return null;

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#a9cbe8" size={0.3} transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}
