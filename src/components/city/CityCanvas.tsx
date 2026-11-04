import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import CityScene from './CityScene';
import CameraRig from '../camera/CameraRig';
import { useCityStore } from '../../store/cityStore';

const isCompact = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 820px), (pointer: coarse)').matches;
};

export default function CityCanvas() {
  const setReady = useCityStore((state) => state.setReady);
  // Phones get a lean renderer: fewer pixels, cheaper anti-aliasing, and the adaptive
  // scaler is allowed to drop resolution so the frame rate holds.
  const [compact] = useState(isCompact);

  return (
    <Canvas
      shadows
      dpr={compact ? [1, 1.2] : [1, 1.7]}
      performance={{ min: 0.5 }}
      camera={{ position: [0, 150, 165], fov: 42, near: 1, far: 640 }}
      gl={{
        antialias: !compact,
        powerPreference: 'high-performance',
        stencil: false,
        alpha: false,
        preserveDrawingBuffer: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        setReady(true);
      }}
    >
      <Suspense fallback={null}>
        <CityScene />
        <CameraRig />
      </Suspense>
    </Canvas>
  );
}
