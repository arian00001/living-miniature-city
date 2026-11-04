import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useCityStore } from '../../store/cityStore';
import type { LightingMode } from '../../types';

const PRESETS: Record<LightingMode, { ambient: number; hemi: number; sun: number; sunColor: string; bg: string; fog: string; sunPosition: [number, number, number] }> = {
  day: { ambient: 0.55, hemi: 0.55, sun: 2.1, sunColor: '#fff4d9', bg: '#bdd8f2', fog: '#c9dff2', sunPosition: [62, 92, 44] },
  sunset: { ambient: 0.42, hemi: 0.34, sun: 1.7, sunColor: '#ffb173', bg: '#f0b98f', fog: '#eec2a1', sunPosition: [-74, 32, 34] },
  night: { ambient: 0.17, hemi: 0.14, sun: 0.3, sunColor: '#93b2ff', bg: '#060c17', fog: '#0a1424', sunPosition: [-42, 58, -28] },
};

export default function Lighting() {
  const scene = useThree((state) => state.scene);
  const mode = useCityStore((state) => state.lightingMode);
  const rain = useCityStore((state) => state.weather) === 'rain';
  const ambient = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const target = useMemo(() => PRESETS[mode], [mode]);

  const colors = useRef({
    bg: new THREE.Color(PRESETS.day.bg),
    fog: new THREE.Color(PRESETS.day.fog),
    sun: new THREE.Color(PRESETS.day.sunColor),
  });

  useEffect(() => {
    scene.background = colors.current.bg;
    scene.fog = new THREE.Fog(PRESETS.day.fog, 120, 340);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 2.4);
    const dim = rain ? 0.78 : 1;

    if (ambient.current) ambient.current.intensity += (target.ambient * dim - ambient.current.intensity) * k;
    if (hemi.current) hemi.current.intensity += (target.hemi * dim - hemi.current.intensity) * k;
    if (sun.current) {
      sun.current.intensity += (target.sun * dim - sun.current.intensity) * k;
      sun.current.color.lerp(new THREE.Color(target.sunColor), k);
      sun.current.position.lerp(new THREE.Vector3(target.sunPosition[0], target.sunPosition[1], target.sunPosition[2]), k);
    }

    colors.current.bg.lerp(new THREE.Color(target.bg), k);
    colors.current.fog.lerp(new THREE.Color(target.fog), k);
    colors.current.sun.lerp(new THREE.Color(target.sunColor), k);

    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(colors.current.fog);
      scene.fog.near += ((rain ? 70 : 120) - scene.fog.near) * k;
      scene.fog.far += ((rain ? 230 : 340) - scene.fog.far) * k;
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={PRESETS.day.ambient} />
      <hemisphereLight ref={hemi} intensity={PRESETS.day.hemi} color="#dff0ff" groundColor="#7c8b68" />
      <directionalLight
        ref={sun}
        intensity={PRESETS.day.sun}
        color={PRESETS.day.sunColor}
        position={PRESETS.day.sunPosition}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-camera-near={1}
        shadow-camera-far={300}
        shadow-bias={-0.0006}
      />
    </>
  );
}
