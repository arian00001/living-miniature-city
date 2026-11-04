import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import CityScene from './CityScene';
import CameraRig from '../camera/CameraRig';
import { useCityStore } from '../../store/cityStore';

export default function CityCanvas() {
  const setReady = useCityStore((state) => state.setReady);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 150, 165], fov: 42, near: 1, far: 700 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
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
