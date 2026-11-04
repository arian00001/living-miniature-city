import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/cityStore';

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Flight {
  fromPosition: THREE.Vector3;
  toPosition: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  t: number;
}

export default function CameraRig() {
  const camera = useThree((state) => state.camera);
  const controls = useRef<any>(null);
  const flight = useRef<Flight | null>(null);
  const handledCamera = useRef(0);
  const handledZoom = useRef(0);
  const request = useCityStore((state) => state.cameraRequest);
  const zoomRequest = useCityStore((state) => state.zoomRequest);

  useFrame((_, delta) => {
    const ctrl = controls.current;
    if (!ctrl) return;

    const start = (toPosition: THREE.Vector3, toTarget: THREE.Vector3) => {
      flight.current = {
        fromPosition: camera.position.clone(),
        toPosition,
        fromTarget: ctrl.target.clone(),
        toTarget,
        t: 0,
      };
    };

    if (request && request.key !== handledCamera.current) {
      handledCamera.current = request.key;
      start(new THREE.Vector3(request.position[0], request.position[1], request.position[2]), new THREE.Vector3(request.target[0], request.target[1], request.target[2]));
    }

    if (zoomRequest && zoomRequest.key !== handledZoom.current) {
      handledZoom.current = zoomRequest.key;
      const target = ctrl.target.clone();
      const offset = camera.position.clone().sub(target).multiplyScalar(zoomRequest.factor);
      const distance = Math.min(180, Math.max(9, offset.length()));
      offset.setLength(distance);
      start(target.clone().add(offset), target);
    }

    const active = flight.current;
    if (!active) return;
    active.t = Math.min(1, active.t + delta / 1.1);
    const k = ease(active.t);
    camera.position.lerpVectors(active.fromPosition, active.toPosition, k);
    ctrl.target.lerpVectors(active.fromTarget, active.toTarget, k);
    ctrl.update();
    if (active.t >= 1) flight.current = null;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      target={[0, 2, 0]}
      minDistance={9}
      maxDistance={180}
      minPolarAngle={0.16}
      maxPolarAngle={Math.PI / 2.35}
      enablePan
      screenSpacePanning={false}
    />
  );
}
