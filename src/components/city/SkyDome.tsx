import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { skyPalette } from '../../lib/sun';
import { skyState } from '../../lib/skyState';
import { seeded } from '../../lib/paths';

const RADIUS = 520;

function mixHex(a: string, b: string, t: number) {
  const channel = (offset: number) => {
    const av = parseInt(a.slice(offset, offset + 2), 16);
    const bv = parseInt(b.slice(offset, offset + 2), 16);
    return Math.round(av + (bv - av) * t).toString(16).padStart(2, '0');
  };
  return '#' + channel(1) + channel(3) + channel(5);
}

function paintGradient(canvas: HTMLCanvasElement, zenith: string, horizon: string, ground: string) {
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, zenith);
  gradient.addColorStop(0.42, mixHex(zenith, horizon, 0.72));
  gradient.addColorStop(0.5, horizon);
  gradient.addColorStop(0.58, mixHex(horizon, ground, 0.55));
  gradient.addColorStop(1, ground);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, height);
}

function useGlowTexture(inner: string, outer: string) {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, inner);
      gradient.addColorStop(0.28, mixHex(inner, outer, 0.55) + 'cc');
      gradient.addColorStop(0.62, outer + '44');
      gradient.addColorStop(1, outer + '00');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [inner, outer]);
}

export default function SkyDome() {
  const sunGlow = useGlowTexture('#fff6dc', '#ffb367');
  const moonGlow = useGlowTexture('#e8f0ff', '#7e9bd8');
  const sunRef = useRef<THREE.Mesh>(null);
  const sunHalo = useRef<THREE.Sprite>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const moonHalo = useRef<THREE.Sprite>(null);
  const starsRef = useRef<THREE.Points>(null);
  const lastPaint = useRef(0);

  const canvas = useMemo(() => {
    const element = document.createElement('canvas');
    element.width = 8;
    element.height = 256;
    paintGradient(element, '#2c659f', '#dce9f4', '#8b9581');
    return element;
  }, []);

  const skyTexture = useMemo(() => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    return texture;
  }, [canvas]);

  const starGeometry = useMemo(() => {
    const random = seeded(481);
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(1 - random() * 0.96);
      const radius = RADIUS * 0.94;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useEffect(() => () => {
    skyTexture.dispose();
    starGeometry.dispose();
    sunGlow.dispose();
    moonGlow.dispose();
  }, [skyTexture, starGeometry, sunGlow, moonGlow]);

  useFrame((state) => {
    const palette = skyPalette(skyState.elevation);
    const now = state.clock.elapsedTime;

    if (now - lastPaint.current > 0.25) {
      lastPaint.current = now;
      paintGradient(canvas, palette.zenith, palette.horizon, palette.ground);
      skyTexture.needsUpdate = true;
    }

    const sunDistance = RADIUS * 0.86;
    const sun = skyState.sunDir;
    const moon = skyState.moonDir;
    const sunVisible = sun.y > -0.16;
    const moonVisible = moon.y > -0.12;

    if (sunRef.current) {
      sunRef.current.position.copy(sun).multiplyScalar(sunDistance);
      sunRef.current.visible = sunVisible;
      const material = sunRef.current.material as THREE.MeshBasicMaterial;
      material.color.set(palette.sunColor);
    }
    if (sunHalo.current) {
      sunHalo.current.position.copy(sun).multiplyScalar(sunDistance * 0.99);
      sunHalo.current.visible = sunVisible;
      const material = sunHalo.current.material as THREE.SpriteMaterial;
      material.opacity = Math.min(1, Math.max(0, (sun.y + 0.16) * 3.2));
      const scale = 150 - Math.min(90, Math.abs(sun.y) * 70);
      sunHalo.current.scale.set(scale, scale, 1);
    }
    if (moonRef.current) {
      moonRef.current.position.copy(moon).multiplyScalar(sunDistance);
      moonRef.current.visible = moonVisible;
    }
    if (moonHalo.current) {
      moonHalo.current.position.copy(moon).multiplyScalar(sunDistance * 0.99);
      moonHalo.current.visible = moonVisible;
      const material = moonHalo.current.material as THREE.SpriteMaterial;
      material.opacity = 0.32 * skyState.night;
    }
    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial;
      material.opacity = Math.max(0, skyState.night - 0.05) * 0.95;
      starsRef.current.visible = material.opacity > 0.02;
    }
  });

  return (
    <group renderOrder={-10}>
      <mesh scale={[1, 1, 1]} frustumCulled={false}>
        <sphereGeometry args={[RADIUS, 32, 20]} />
        <meshBasicMaterial map={skyTexture} side={THREE.BackSide} fog={false} depthWrite={false} toneMapped={false} />
      </mesh>
      <points ref={starsRef} geometry={starGeometry} frustumCulled={false}>
        <pointsMaterial size={2.1} sizeAttenuation={false} color="#dfe8ff" transparent opacity={0} depthWrite={false} fog={false} toneMapped={false} />
      </points>
      <sprite ref={sunHalo} scale={[150, 150, 1]}>
        <spriteMaterial map={sunGlow} blending={THREE.AdditiveBlending} transparent depthWrite={false} fog={false} toneMapped={false} />
      </sprite>
      <mesh ref={sunRef} frustumCulled={false}>
        <sphereGeometry args={[11, 24, 16]} />
        <meshBasicMaterial color="#fff4d8" fog={false} toneMapped={false} />
      </mesh>
      <sprite ref={moonHalo} scale={[42, 42, 1]}>
        <spriteMaterial map={moonGlow} blending={THREE.AdditiveBlending} transparent depthWrite={false} fog={false} toneMapped={false} />
      </sprite>
      <mesh ref={moonRef} frustumCulled={false}>
        <sphereGeometry args={[8, 20, 14]} />
        <meshBasicMaterial color="#e9eefb" fog={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
