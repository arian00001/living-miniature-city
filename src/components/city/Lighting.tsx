import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useCityStore } from '../../store/cityStore';
import { celestial, skyPalette } from '../../lib/sun';
import { skyState } from '../../lib/skyState';

// Sun, moon, sky tint and fog are all derived from the real Asia/Dhaka clock.
export default function Lighting() {
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);
  const sun = useRef<THREE.DirectionalLight>(null);
  const moon = useRef<THREE.DirectionalLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const rain = useCityStore((state) => state.weather) === 'rain';

  const cache = useMemo(() => ({
    sunColor: new THREE.Color('#fff9ea'),
    moonlight: new THREE.Color('#9db5e6'),
    hemiSky: new THREE.Color('#dce9f4'),
    hemiGround: new THREE.Color('#8b9581'),
    fog: new THREE.Color('#cdddea'),
    temp: new THREE.Color(),
    sunPos: new THREE.Vector3(0, 60, 20),
    moonPos: new THREE.Vector3(0, -60, -20),
  }), []);

  useEffect(() => {
    scene.fog = new THREE.Fog('#cdddea', 110, 520);
    scene.background = null;
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame((_, delta) => {
    const minutes = useCityStore.getState().minutes;
    const reading = celestial(minutes);
    skyState.minutes = reading.minutes;
    skyState.elevation = reading.elevation;
    skyState.night = reading.night;
    skyState.sunDir.set(reading.sunDir[0], reading.sunDir[1], reading.sunDir[2]);
    skyState.moonDir.set(reading.moonDir[0], reading.moonDir[1], reading.moonDir[2]);

    const palette = skyPalette(reading.elevation);
    const k = 1 - Math.exp(-delta * 2.2);
    const dim = rain ? 0.58 : 1;

    cache.sunPos.copy(skyState.sunDir).multiplyScalar(160);
    cache.moonPos.copy(skyState.moonDir).multiplyScalar(160);
    cache.temp.set(palette.sunColor);
    cache.sunColor.lerp(cache.temp, k);
    cache.temp.set(palette.horizon);
    cache.hemiSky.lerp(cache.temp, k);
    cache.temp.set(palette.ground);
    cache.hemiGround.lerp(cache.temp, k);
    cache.temp.set(palette.fog);
    cache.fog.lerp(cache.temp, k);

    if (sun.current) {
      sun.current.position.copy(cache.sunPos);
      sun.current.intensity += (palette.sunIntensity * dim - sun.current.intensity) * k;
      sun.current.color.copy(cache.sunColor);
    }
    if (moon.current) {
      moon.current.position.copy(cache.moonPos);
      moon.current.intensity += (palette.moonIntensity * dim - moon.current.intensity) * k;
    }
    if (ambient.current) {
      ambient.current.intensity += (palette.ambient * dim - ambient.current.intensity) * k;
    }
    if (hemi.current) {
      hemi.current.intensity += (palette.hemi * dim - hemi.current.intensity) * k;
      hemi.current.color.copy(cache.hemiSky);
      hemi.current.groundColor.copy(cache.hemiGround);
    }
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(cache.fog);
      const nearTarget = rain ? 55 : 130;
      const farTarget = rain ? 300 : 560;
      scene.fog.near += (nearTarget - scene.fog.near) * k;
      scene.fog.far += (farTarget - scene.fog.far) * k;
    }
    gl.toneMappingExposure += (palette.exposure - gl.toneMappingExposure) * k;
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.5} />
      <hemisphereLight ref={hemi} intensity={0.5} color="#dce9f4" groundColor="#8b9581" />
      <directionalLight
        ref={sun}
        intensity={2.8}
        color="#fff9ea"
        position={[70, 110, 50]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-95}
        shadow-camera-right={95}
        shadow-camera-top={95}
        shadow-camera-bottom={-95}
        shadow-camera-near={1}
        shadow-camera-far={420}
        shadow-bias={-0.0005}
        shadow-normalBias={0.025}
      />
      <directionalLight ref={moon} intensity={0} color="#9db5e6" position={[-60, 80, -50]} />
    </>
  );
}
