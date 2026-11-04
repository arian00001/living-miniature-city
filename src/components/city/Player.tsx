import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import Character from './Character';
import { playerInput, playerState } from '../../lib/player';
import { useCityStore } from '../../store/cityStore';

const CITY_SPEED = 3.6;
const OFFICE_SPEED = 2.4;
const TURN_RATE = 10;
const UP = new THREE.Vector3(0, 1, 0);

const BOUNDS = {
  city: { x: 70, z: 70 },
  office: { x: 12.1, z: 7.9 },
};

// Both spawn spots face into the space so the first step never walks into a wall.
const SPAWN = {
  city: { x: 0, z: 18, yaw: Math.PI },
  office: { x: 0, z: 6.2, yaw: Math.PI },
};

export default function Player() {
  const group = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});
  const stride = useRef({ d: 0 });
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

  // Switching between the city and the office moves the character to the matching spawn.
  useEffect(() => {
    const spawn = SPAWN[view];
    const node = group.current;
    if (node) {
      node.position.set(spawn.x, 0, spawn.z);
      node.rotation.y = spawn.yaw;
    }
    playerState.x = spawn.x;
    playerState.z = spawn.z;
    playerState.yaw = spawn.yaw;
    playerState.walking = false;
    stride.current.d = 0;
    if (view === 'office') {
      // Reveal the interior, then hand the camera back to the walk as soon as a stick moves.
      playerState.active = false;
      useCityStore.getState().moveCamera([spawn.x + 3.2, 2.2, spawn.z + 1.4], [spawn.x, 1.2, spawn.z]);
    }
  }, [view]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    const pressed = keys.current;
    const keyboardX = (pressed.d || pressed.arrowright ? 1 : 0) - (pressed.a || pressed.arrowleft ? 1 : 0);
    const keyboardY = (pressed.w || pressed.arrowup ? 1 : 0) - (pressed.s || pressed.arrowdown ? 1 : 0);
    let ix = playerInput.x + keyboardX;
    let iy = playerInput.y + keyboardY;
    const magnitude = Math.hypot(ix, iy);
    const walking = magnitude > 0.12;
    const indoor = view === 'office';
    const bounds = indoor ? BOUNDS.office : BOUNDS.city;
    const speed = indoor ? OFFICE_SPEED : CITY_SPEED;

    if (walking) {
      ix /= Math.max(1, magnitude);
      iy /= Math.max(1, magnitude);

      camera.getWorldDirection(forward.current);
      forward.current.y = 0;
      if (forward.current.lengthSq() < 0.0001) forward.current.set(0, 0, -1);
      forward.current.normalize();
      right.current.crossVectors(forward.current, UP).normalize();

      move.current
        .copy(forward.current)
        .multiplyScalar(iy)
        .addScaledVector(right.current, ix)
        .normalize();

      const step = speed * delta;
      node.position.x = THREE.MathUtils.clamp(node.position.x + move.current.x * step, -bounds.x, bounds.x);
      node.position.z = THREE.MathUtils.clamp(node.position.z + move.current.z * step, -bounds.z, bounds.z);
      stride.current.d += step;

      const targetYaw = Math.atan2(move.current.x, move.current.z);
      let diff = targetYaw - node.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      node.rotation.y += diff * Math.min(1, delta * TURN_RATE);

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
