import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { pointOnLoop, rectLoop } from '../../lib/paths';
import { trafficSignal } from '../../lib/traffic';
import GltfModel from '../models/GltfModel';
import { MODELS } from '../../data/models';

const LOOP = rectLoop(0, 0, 42.2, 42.2);
const LANE = 1.5;
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
  /** +1 keeps right of the centre line, -1 the other side, so nothing overlaps. */
  lane?: number;
  bounce?: number;
}

function RoadVehicle({ url, offset, speed, size, lane = 1, bounce = 0.006 }: VehicleProps) {
  const root = useRef<THREE.Group>(null);
  const distance = useRef(offset);
  const current = useRef(speed * 0.6);
  const yaw = useRef(0);

  useFrame((state, delta) => {
    const point = pointOnLoop(LOOP, distance.current);
    const axis = Math.abs(Math.cos(point.angle)) > Math.abs(Math.sin(point.angle)) ? 'ns' : 'ew';
    const nearest = Math.min(...CORNERS.map(([x, z]) => Math.hypot(point.x - x, point.z - z)));
    const blocked = nearest < 6 && trafficSignal.phase !== axis;
    const target = blocked ? 0 : speed;
    current.current += (target - current.current) * Math.min(1, delta * 2.2);
    distance.current += current.current * delta;

    const node = root.current;
    if (!node) return;
    const t = state.clock.elapsedTime;

    // Sit in a real lane: offset sideways from the loop centre line.
    const nx = Math.cos(point.angle) * LANE * lane;
    const nz = -Math.sin(point.angle) * LANE * lane;
    node.position.set(point.x + nx, Math.abs(Math.sin(t * 6 + offset)) * bounce, point.z + nz);

    // Ease the heading instead of snapping it at every corner.
    let diff = point.angle - yaw.current;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    yaw.current += diff * Math.min(1, delta * 4.5);
    node.rotation.set(0, yaw.current, 0);
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
      <RoadVehicle url={MODELS.cooper1965} offset={0} speed={9.4} size={3.7} lane={1} />
      <RoadVehicle url={MODELS.cooperLb} offset={96} speed={10.8} size={4.2} lane={-1} bounce={0.005} />
      <RoadVehicle url={MODELS.carMini} offset={182} speed={8.6} size={3.8} lane={1} />
      <RoadVehicle url={MODELS.bus} offset={268} speed={6.2} size={7.2} lane={-1} bounce={0.014} />
      <RoadVehicle url={MODELS.carMini} offset={344} speed={9.9} size={3.6} lane={-1} />
    </group>
  );
}