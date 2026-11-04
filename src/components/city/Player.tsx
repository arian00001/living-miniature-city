import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import Character from './Character';
import { playerInput, playerState } from '../../lib/player';
import { useCityStore } from '../../store/cityStore';

const SPEED = 3.6;
const TURN_RATE = 10;

export default function Player() {
  const group = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});
  const stride = useRef({ d: 0 });
  const [pose, setPose] = useState<'idle' | 'walk'>('idle');
  const camera = useThree((state) => state.camera);
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const move = useRef(new THREE.Vector3());
  const up = new THREE.Vector3(0, 1, 0);

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

    if (walking) {
      ix /= Math.max(1, magnitude);
      iy /= Math.max(1, magnitude);

      camera.getWorldDirection(forward.current);
      forward.current.y = 0;
      if (forward.current.lengthSq() < 0.0001) forward.current.set(0, 0, -1);
      forward.current.normalize();
      right.current.crossVectors(forward.current, up).normalize();

      move.current
        .copy(forward.current)
        .multiplyScalar(iy)
        .addScaledVector(right.current, ix)
        .normalize();

      const step = SPEED * delta;
      node.position.x += move.current.x * step;
      node.position.z += move.current.z * step;
      node.position.x = THREE.MathUtils.clamp(node.position.x, -70, 70);
      node.position.z = THREE.MathUtils.clamp(node.position.z, -70, 70);
      stride.current.d += step;

      const targetYaw = Math.atan2(move.current.x, move.current.z);
      let diff = targetYaw - node.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      node.rotation.y += diff * Math.min(1, delta * TURN_RATE);

      playerState.yaw = node.rotation.y;
    }

    playerState.x = node.position.x;
    playerState.z = node.position.z;
    playerState.walking = walking;

    if (walking && !playerState.active) {
      playerState.active = true;
      const { x, z } = node.position;
      useCityStore.getState().moveCamera([x + 8, 5.4, z + 10], [x, 1.2, z]);
    }

    setPose((current) => {
      const next = walking ? 'walk' : 'idle';
      return current === next ? current : next;
    });
  });

  return (
    <group ref={group} position={[playerState.x, 0, playerState.z]} rotation={[0, playerState.yaw, 0]}>
      <Character pose={pose} shirt="#2f6fd0" trousers="#27313f" distanceRef={stride.current} speed={SPEED} />
    </group>
  );
}
