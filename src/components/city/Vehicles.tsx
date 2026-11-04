import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { pointOnLoop, rectLoop } from '../../lib/paths';
import { trafficSignal } from '../../lib/traffic';
import { skyState } from '../../lib/skyState';

const LOOP = rectLoop(0, 0, 42.2, 42.2);
const CORNERS: [number, number][] = [
  [42.2, 42.2],
  [-42.2, 42.2],
  [42.2, -42.2],
  [-42.2, -42.2],
];

function buildBodyGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-2.1, 0.42);
  shape.lineTo(2.06, 0.42);
  shape.quadraticCurveTo(2.17, 0.44, 2.13, 0.61);
  shape.lineTo(2.0, 0.79);
  shape.quadraticCurveTo(1.84, 0.93, 1.28, 0.95);
  shape.lineTo(0.52, 0.97);
  shape.lineTo(-1.24, 0.97);
  shape.quadraticCurveTo(-1.94, 0.96, -2.05, 0.78);
  shape.quadraticCurveTo(-2.14, 0.62, -2.1, 0.42);
  const depth = 1.6;
  const bevel = 0.075;
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 12,
    steps: 2,
  });
  geometry.rotateY(-Math.PI / 2);
  geometry.translate((depth + bevel * 2) / 2, 0, 0);
  geometry.computeVertexNormals();
  return geometry;
}

function buildCabinGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.28, 0.93);
  shape.lineTo(-1.0, 1.34);
  shape.quadraticCurveTo(-0.9, 1.44, -0.68, 1.44);
  shape.lineTo(0.32, 1.44);
  shape.quadraticCurveTo(0.6, 1.44, 0.72, 1.32);
  shape.lineTo(1.0, 0.93);
  shape.lineTo(-1.28, 0.93);
  const depth = 1.42;
  const bevel = 0.05;
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 10,
    steps: 1,
  });
  geometry.rotateY(-Math.PI / 2);
  geometry.translate((depth + bevel * 2) / 2, 0, 0);
  geometry.computeVertexNormals();
  return geometry;
}

const BODY_GEOMETRY = buildBodyGeometry();
const CABIN_GEOMETRY = buildCabinGeometry();
const TIRE_GEOMETRY = new THREE.TorusGeometry(0.243, 0.088, 14, 28);
const RIM_GEOMETRY = new THREE.CylinderGeometry(0.178, 0.178, 0.135, 22);
const HUB_GEOMETRY = new THREE.CylinderGeometry(0.056, 0.056, 0.15, 14);

const GLASS = new THREE.MeshStandardMaterial({
  color: '#25333f',
  roughness: 0.06,
  metalness: 0.5,
  transparent: true,
  opacity: 0.72,
  envMapIntensity: 1.6,
});
const TIRE = new THREE.MeshStandardMaterial({ color: '#191c20', roughness: 0.96, metalness: 0.04 });
const RIM = new THREE.MeshStandardMaterial({ color: '#c9ced6', roughness: 0.24, metalness: 0.94, envMapIntensity: 1.4 });
const TRIM = new THREE.MeshStandardMaterial({ color: '#22262c', roughness: 0.52, metalness: 0.45 });
const PLATE = new THREE.MeshStandardMaterial({ color: '#e6e7ea', roughness: 0.6 });

interface CarProps {
  offset: number;
  speed: number;
  color: string;
  scale?: number;
}

function Car({ offset, speed, color, scale = 1 }: CarProps) {
  const root = useRef<THREE.Group>(null);
  const wheels = useRef<(THREE.Group | null)[]>([]);
  const headlight = useRef<THREE.MeshStandardMaterial>(null);
  const taillight = useRef<THREE.MeshStandardMaterial>(null);
  const beams = useRef<THREE.Group>(null);
  const distance = useRef(offset);
  const currentSpeed = useRef(speed * 0.6);

  const paint = useMemo(
    () => new THREE.MeshStandardMaterial({ color, metalness: 0.66, roughness: 0.26, envMapIntensity: 1.35 }),
    [color],
  );

  useFrame((_, delta) => {
    const point = pointOnLoop(LOOP, distance.current);
    const axis = Math.abs(Math.cos(point.angle)) > Math.abs(Math.sin(point.angle)) ? 'ns' : 'ew';
    const nearest = Math.min(...CORNERS.map(([x, z]) => Math.hypot(point.x - x, point.z - z)));
    const blocked = nearest < 5.5 && trafficSignal.phase !== axis;
    const target = blocked ? 0 : speed;
    currentSpeed.current += (target - currentSpeed.current) * Math.min(1, delta * 2.4);
    const step = currentSpeed.current * delta;
    distance.current += step;

    if (root.current) {
      root.current.position.set(point.x, 0.13, point.z);
      root.current.rotation.y = point.angle;
      root.current.rotation.z = Math.sin(point.angle * 2) * 0.006;
    }
    wheels.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += step / 0.243;
    });

    const night = skyState.night;
    if (headlight.current) headlight.current.emissiveIntensity = 0.25 + night * 3.4;
    if (taillight.current) taillight.current.emissiveIntensity = 0.35 + night * 2.6 + (blocked ? 1.6 : 0);
    if (beams.current) beams.current.visible = night > 0.22;
  });

  const wheelPositions: [number, number, number][] = [
    [-0.82, 0.34, 1.32],
    [0.82, 0.34, 1.32],
    [-0.82, 0.34, -1.32],
    [0.82, 0.34, -1.32],
  ];

  return (
    <group ref={root} scale={scale}>
      <mesh geometry={BODY_GEOMETRY} material={paint} castShadow receiveShadow />
      <mesh geometry={CABIN_GEOMETRY} material={GLASS} castShadow />
      <mesh position={[0, 1.435, -0.18]} castShadow material={paint}>
        <boxGeometry args={[1.4, 0.055, 0.92]} />
      </mesh>

      <mesh position={[0, 0.42, 2.09]} material={TRIM}>
        <boxGeometry args={[1.62, 0.16, 0.14]} />
      </mesh>
      <mesh position={[0, 0.42, -2.09]} material={TRIM}>
        <boxGeometry args={[1.62, 0.16, 0.14]} />
      </mesh>
      <mesh position={[0, 0.62, 2.07]} material={TRIM}>
        <boxGeometry args={[0.96, 0.16, 0.06]} />
      </mesh>
      <mesh position={[0, 0.5, 2.11]} material={PLATE}>
        <boxGeometry args={[0.44, 0.1, 0.025]} />
      </mesh>

      <mesh position={[-0.55, 0.75, 2.03]}>
        <boxGeometry args={[0.3, 0.09, 0.07]} />
        <meshStandardMaterial ref={headlight} color="#fff6d8" emissive="#ffeec0" emissiveIntensity={0.3} toneMapped={false} />
      </mesh>
      <mesh position={[0.55, 0.75, 2.03]}>
        <boxGeometry args={[0.3, 0.09, 0.07]} />
        <meshStandardMaterial color="#fff6d8" emissive="#ffeec0" emissiveIntensity={0.3} toneMapped={false} />
      </mesh>
      <mesh position={[-0.58, 0.79, -2.06]}>
        <boxGeometry args={[0.32, 0.08, 0.06]} />
        <meshStandardMaterial ref={taillight} color="#e05a4e" emissive="#ff4a34" emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      <mesh position={[0.58, 0.79, -2.06]}>
        <boxGeometry args={[0.32, 0.08, 0.06]} />
        <meshStandardMaterial color="#e05a4e" emissive="#ff4a34" emissiveIntensity={0.4} toneMapped={false} />
      </mesh>

      <mesh position={[-0.92, 1.0, 0.62]} castShadow material={TRIM}>
        <boxGeometry args={[0.16, 0.07, 0.1]} />
      </mesh>
      <mesh position={[0.92, 1.0, 0.62]} castShadow material={TRIM}>
        <boxGeometry args={[0.16, 0.07, 0.1]} />
      </mesh>

      <group ref={beams} visible={false}>
        <mesh position={[-0.55, 0.72, 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.15, 6.2, 16, 1, true]} />
          <meshBasicMaterial color="#ffe6b8" transparent opacity={0.075} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} fog={false} />
        </mesh>
        <mesh position={[0.55, 0.72, 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.15, 6.2, 16, 1, true]} />
          <meshBasicMaterial color="#ffe6b8" transparent opacity={0.075} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} fog={false} />
        </mesh>
      </group>

      {wheelPositions.map((position, index) => (
        <group
          key={index}
          position={position}
          ref={(node) => {
            wheels.current[index] = node;
          }}
        >
          <mesh geometry={TIRE_GEOMETRY} material={TIRE} rotation={[0, Math.PI / 2, 0]} castShadow />
          <mesh geometry={RIM_GEOMETRY} material={RIM} rotation={[0, 0, Math.PI / 2]} />
          <mesh geometry={HUB_GEOMETRY} material={TRIM} rotation={[0, 0, Math.PI / 2]} />
        </group>
      ))}
    </group>
  );
}

export default function Vehicles() {
  const cars = [
    { offset: 0, speed: 8.5, color: '#dfe3ea' },
    { offset: 62, speed: 9.6, color: '#a8455f' },
    { offset: 140, speed: 7.4, color: '#4a6d99', scale: 1.06 },
    { offset: 240, speed: 10.4, color: '#c79a2f' },
    { offset: 300, speed: 8.8, color: '#2f6b4f' },
  ];

  return (
    <group>
      {cars.map((car, index) => (
        <Car key={index} {...car} />
      ))}
    </group>
  );
}
