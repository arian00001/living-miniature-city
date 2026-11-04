import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { pointOnLoop, rectLoop } from '../../lib/paths';
import { trafficSignal } from '../../lib/traffic';
import GltfModel from '../models/GltfModel';
import { MODELS } from '../../data/models';

const LOOP = rectLoop(0, 0, 42.2, 42.2);
const CORNERS: [number, number][] = [
  [42.2, 42.2],
  [-42.2, 42.2],
  [42.2, -42.2],
  [-42.2, -42.2],
];

interface VehicleProps {
  url: string;
  offset: number;
  speed: number;
  size: number;
  /** Suspension bounce, so the body is never perfectly still. */
  bounce?: number;
}

function RoadVehicle({ url, offset, speed, size, bounce = 0.014 }: VehicleProps) {
  const root = useRef<THREE.Group>(null);
  const distance = useRef(offset);
  const current = useRef(speed * 0.6);

  useFrame((state, delta) => {
    const point = pointOnLoop(LOOP, distance.current);
    const axis = Math.abs(Math.cos(point.angle)) > Math.abs(Math.sin(point.angle)) ? 'ns' : 'ew';
    const nearest = Math.min(...CORNERS.map(([x, z]) => Math.hypot(point.x - x, point.z - z)));
    const blocked = nearest < 5.5 && trafficSignal.phase !== axis;
    const target = blocked ? 0 : speed;
    current.current += (target - current.current) * Math.min(1, delta * 2.4);
    const step = current.current * delta;
    distance.current += step;

    const node = root.current;
    if (!node) return;
    const t = state.clock.elapsedTime;
    node.position.set(point.x, Math.abs(Math.sin(t * 7 + offset)) * bounce, point.z);
    node.rotation.y = point.angle;
    node.rotation.z = Math.sin(t * 2.1 + offset) * 0.011;
    node.rotation.x = Math.sin(t * 3.3 + offset) * 0.006;
  });

  return (
    <group ref={root}>
      <GltfModel url={url} size={size} axis="length" />
    </group>
  );
}

export default function Vehicles() {
  return (
    <group>
      <RoadVehicle url={MODELS.cooper1965} offset={0} speed={9.2} size={3.7} />
      <RoadVehicle url={MODELS.cooperLb} offset={78} speed={10.6} size={4.2} bounce={0.009} />
      <RoadVehicle url={MODELS.carMini} offset={172} speed={8.4} size={3.8} />
      <RoadVehicle url={MODELS.bus} offset={256} speed={6.6} size={7.2} bounce={0.02} />
    </group>
  );
}
