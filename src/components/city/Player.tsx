import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import Character from './Character';
import { playerInput, playerState } from '../../lib/player';
import { useCityStore } from '../../store/cityStore';
import { OFFICE_ROUTE, pointOnRoute, routeLength } from '../../data/officeRoute';

const CITY_SPEED = 3.6;
const TOUR_SPEED = 1.7;
const TURN_RATE = 9;
const UP = new THREE.Vector3(0, 1, 0);
const BOUNDS = { x: 70, z: 70 };
const SPAWN = { x: 0, z: 18, yaw: Math.PI };
const ROUTE_TOTAL = routeLength(OFFICE_ROUTE);

export default function Player() {
  const group = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});
  const stride = useRef({ d: 0 });
  const tour = useRef(0);
  const [pose, setPose] = useState<'idle' | 'walk'>('idle');
  const camera = useThree((state) => state.camera);
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const move = useRef(new THREE.Vector3());
  const view = useCityStore((state) => state.activeView);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = true;
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Office visits always start at the door, on the first step of the fixed tour.
  useEffect(() => {
    const node = group.current;
    playerState.active = false;
    playerState.walking = false;
    stride.current.d = 0;

    if (view === 'office') {
      tour.current = 0;
      const start = pointOnRoute(OFFICE_ROUTE, 0);
      if (node) {
        node.position.set(start.x, 0, start.z);
        node.rotation.y = start.yaw;
      }
      playerState.x = start.x;
      playerState.z = start.z;
      playerState.yaw = start.yaw;
      useCityStore.getState().moveCamera([start.x + 2.8, 2.15, start.z + 1.6], [start.x, 1.2, start.z]);
      return;
    }

    if (node) {
      node.position.set(SPAWN.x, 0, SPAWN.z);
      node.rotation.y = SPAWN.yaw;
    }
    playerState.x = SPAWN.x;
    playerState.z = SPAWN.z;
    playerState.yaw = SPAWN.yaw;
  }, [view]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    const pressed = keys.current;
    const keyboardX = (pressed.d || pressed.arrowright ? 1 : 0) - (pressed.a || pressed.arrowleft ? 1 : 0);
    const keyboardY = (pressed.w || pressed.arrowup ? 1 : 0) - (pressed.s || pressed.arrowdown ? 1 : 0);
    const ix = playerInput.x + keyboardX;
    const iy = playerInput.y + keyboardY;
    const magnitude = Math.hypot(ix, iy);
    const walking = magnitude > 0.12;

    if (view === 'office') {
      // Inside the office the joystick drives a fixed route: door → reception →
      // project room → boss room. Pulling down walks back along it.
      if (walking) {
        const push = Math.abs(iy) > 0.15 ? Math.sign(iy) : 1;
        tour.current = Math.min(ROUTE_TOTAL, Math.max(0, tour.current + push * TOUR_SPEED * delta));
        stride.current.d += TOUR_SPEED * delta;
      }
      const point = pointOnRoute(OFFICE_ROUTE, tour.current);
      node.position.set(point.x, 0, point.z);

      let diff = point.yaw - node.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      node.rotation.y += diff * Math.min(1, delta * TURN_RATE);

      playerState.x = point.x;
      playerState.z = point.z;
      playerState.yaw = node.rotation.y;
      playerState.walking = walking;
      playerState.active = walking;
      setPose((current) => {
        const next = walking ? 'walk' : 'idle';
        return current === next ? current : next;
      });
      return;
    }

    if (walking) {
      const nx = ix / Math.max(1, magnitude);
      const ny = iy / Math.max(1, magnitude);

      camera.getWorldDirection(forward.current);
      forward.current.y = 0;
      if (forward.current.lengthSq() < 0.0001) forward.current.set(0, 0, -1);
      forward.current.normalize();
      right.current.crossVectors(forward.current, UP).normalize();

      move.current
        .copy(forward.current)
        .multiplyScalar(ny)
        .addScaledVector(right.current, nx)
        .normalize();

      const step = CITY_SPEED * delta;
      node.position.x = THREE.MathUtils.clamp(node.position.x + move.current.x * step, -BOUNDS.x, BOUNDS.x);
      node.position.z = THREE.MathUtils.clamp(node.position.z + move.current.z * step, -BOUNDS.z, BOUNDS.z);
      stride.current.d += step;

      const targetYaw = Math.atan2(move.current.x, move.current.z);
      let diff = targetYaw - node.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      node.rotation.y += diff * Math.min(1, delta * 10);

      playerState.yaw = node.rotation.y;
      playerState.active = true;
    }

    playerState.x = node.position.x;
    playerState.z = node.position.z;
    playerState.walking = walking;

    setPose((current) => {
      const next = walking ? 'walk' : 'idle';
      return current === next ? current : next;
    });
  });

  return (
    <group ref={group} position={[playerState.x, 0, playerState.z]} rotation={[0, playerState.yaw, 0]}>
      <Character pose={pose} shirt="#2f6fd0" trousers="#27313f" distanceRef={stride.current} speed={3.6} />
    </group>
  );
}