import { useEffect, useMemo, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../store/cityStore';
import { cineShots } from '../../data/cineShots';
import { playerState } from '../../lib/player';

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (t: number) => t * t * (3 - 2 * t);

interface Flight {
  fromPosition: THREE.Vector3;
  toPosition: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  t: number;
}

export default function CameraRig() {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const gl = useThree((state) => state.gl);
  const controls = useRef<any>(null);
  const flight = useRef<Flight | null>(null);
  const handledCamera = useRef(0);
  const handledZoom = useRef(0);
  const handledTour = useRef(-1);
  const shotIndex = useRef(0);
  const shotProgress = useRef(0);
  const request = useCityStore((state) => state.cameraRequest);
  const zoomRequest = useCityStore((state) => state.zoomRequest);
  const cinematic = useCityStore((state) => state.cinematic);
  const tourKey = useCityStore((state) => state.tourKey);

  const vectors = useMemo(
    () =>
      cineShots.map((shot) => ({
        from: new THREE.Vector3(...shot.from),
        to: new THREE.Vector3(...shot.to),
        lookFrom: new THREE.Vector3(...shot.lookFrom),
        lookTo: new THREE.Vector3(...shot.lookTo),
      })),
    [],
  );
  const target = useMemo(() => new THREE.Vector3(), []);
  const desiredCamera = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());
  const UP = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // The tour owns the camera, so any deliberate drag on the scene hands control back.
  useEffect(() => {
    const exitTour = () => {
      if (useCityStore.getState().cinematic) useCityStore.getState().setCinematic(false);
    };
    const element = gl.domElement;
    element.addEventListener('pointerdown', exitTour);
    element.addEventListener('wheel', exitTour, { passive: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key.toLowerCase() === 't') exitTour();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      element.removeEventListener('pointerdown', exitTour);
      element.removeEventListener('wheel', exitTour);
      window.removeEventListener('keydown', onKey);
    };
  }, [gl]);

  useEffect(() => {
    if (tourKey === handledTour.current) return;
    handledTour.current = tourKey;
    shotIndex.current = 0;
    shotProgress.current = 0;
    flight.current = null;
    if (cinematic) {
      camera.position.copy(vectors[0].from);
      target.copy(vectors[0].lookFrom);
      camera.lookAt(target);
      camera.fov = cineShots[0].fovFrom;
      camera.updateProjectionMatrix();
      if (controls.current) controls.current.target.copy(target);
    }
  }, [tourKey, cinematic, camera, vectors, target]);

  useFrame((state, delta) => {
    const ctrl = controls.current;
    if (!ctrl) return;

    if (cinematic) {
      ctrl.enabled = false;
      const shot = cineShots[shotIndex.current];
      shotProgress.current += delta / shot.duration;
      if (shotProgress.current >= 1) {
        shotProgress.current = 0;
        shotIndex.current = (shotIndex.current + 1) % cineShots.length;
      }
      const index = shotIndex.current;
      const active = cineShots[index];
      const points = vectors[index];
      const k = smooth(Math.min(1, Math.max(0, shotProgress.current)));
      const drift = Math.sin(state.clock.elapsedTime * 0.4) * 0.35;
      camera.position.lerpVectors(points.from, points.to, k);
      camera.position.y += drift;
      target.lerpVectors(points.lookFrom, points.lookTo, k);
      camera.lookAt(target);
      camera.fov = active.fovFrom + (active.fovTo - active.fovFrom) * k;
      camera.updateProjectionMatrix();
      ctrl.target.copy(target);
      return;
    }

    ctrl.enabled = true;

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
      playerState.active = false;
      start(
        new THREE.Vector3(request.position[0], request.position[1], request.position[2]),
        new THREE.Vector3(request.target[0], request.target[1], request.target[2]),
      );
    }

    if (zoomRequest && zoomRequest.key !== handledZoom.current) {
      handledZoom.current = zoomRequest.key;
      const center = ctrl.target.clone();
      const offset = camera.position.clone().sub(center).multiplyScalar(zoomRequest.factor);
      const distance = Math.min(180, Math.max(6, offset.length()));
      offset.setLength(distance);
      start(center.clone().add(offset), center);
    }

    // Cinematic third person: while walking, the camera trails behind the character and lets the
    // buildings pan past the lens; standing still it drifts in a slow orbit to show the skyline.
    if (playerState.active && !flight.current) {
      const indoor = useCityStore.getState().activeView === 'office';
      const forwardX = Math.sin(playerState.yaw);
      const forwardZ = Math.cos(playerState.yaw);

      if (playerState.walking) {
        ctrl.enabled = false;
        const back = indoor ? 3.1 : 5.4;
        const height = indoor ? 1.95 : 2.65;
        desiredCamera.current.set(playerState.x - forwardX * back, height, playerState.z - forwardZ * back);
        camera.position.lerp(desiredCamera.current, Math.min(1, delta * 3.6));
        lookAt.current.set(playerState.x + forwardX * 2.6, 1.34, playerState.z + forwardZ * 2.6);
        ctrl.target.lerp(lookAt.current, Math.min(1, delta * 5));
        camera.lookAt(ctrl.target);
        return;
      }

      ctrl.enabled = true;
      lookAt.current.set(playerState.x, indoor ? 1.25 : 1.3, playerState.z);
      ctrl.target.lerp(lookAt.current, Math.min(1, delta * 3.2));
      const orbit = delta * (indoor ? 0.05 : 0.15);
      camera.position.sub(ctrl.target).applyAxisAngle(UP, orbit).add(ctrl.target);
      camera.position.y = THREE.MathUtils.clamp(camera.position.y, 1.6, indoor ? 2.9 : 32);
      ctrl.update();
      return;
    }

    const activeFlight = flight.current;
    if (!activeFlight) return;
    activeFlight.t = Math.min(1, activeFlight.t + delta / 1.1);
    const k = ease(activeFlight.t);
    camera.position.lerpVectors(activeFlight.fromPosition, activeFlight.toPosition, k);
    ctrl.target.lerpVectors(activeFlight.fromTarget, activeFlight.toTarget, k);
    ctrl.update();
    if (activeFlight.t >= 1) flight.current = null;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      target={[0, 2, 0]}
      minDistance={6}
      maxDistance={180}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI / 2.15}
      enablePan
      screenSpacePanning={false}
    />
  );
}
