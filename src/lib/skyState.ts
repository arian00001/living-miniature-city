import * as THREE from 'three';

// Shared, mutable sky readings. Written once per frame by <Lighting /> so that
// lamps, windows, headlights and the sky dome never trigger React re-renders.
export interface SkyRuntime {
  minutes: number;
  elevation: number;
  night: number;
  sunDir: THREE.Vector3;
  moonDir: THREE.Vector3;
}

export const skyState: SkyRuntime = {
  minutes: 720,
  elevation: 1,
  night: 0,
  sunDir: new THREE.Vector3(0, 1, 0.2).normalize(),
  moonDir: new THREE.Vector3(0, -1, -0.2).normalize(),
};
