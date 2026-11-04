import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

export interface GltfModelProps {
  url: string;
  /** Metric size the model is fitted to: its footprint length, or its height. */
  size: number;
  axis?: 'length' | 'height';
  yaw?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
}

interface FitProps {
  url: string;
  size: number;
  axis: 'length' | 'height';
  castShadow: boolean;
}

// The downloaded models arrive in wildly different units and orientations, so every
// instance is rescaled to a metric size and dropped exactly on the ground plane.
function FittedObject({ url, size, axis, castShadow }: FitProps) {
  const { scene } = useGLTF(url);

  const object = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = castShadow;
        mesh.receiveShadow = true;
      }
    });

    const bounds = new THREE.Box3().setFromObject(cloned);
    const dims = bounds.getSize(new THREE.Vector3());
    const base = axis === 'height' ? dims.y : Math.max(dims.x, dims.z, dims.y);
    if (base > 0.0001) cloned.scale.setScalar(size / base);

    const fitted = new THREE.Box3().setFromObject(cloned);
    const center = fitted.getCenter(new THREE.Vector3());
    cloned.position.set(-center.x, -fitted.min.y, -center.z);
    return cloned;
  }, [scene, size, axis, castShadow]);

  return <primitive object={object} />;
}

export default function GltfModel({
  url,
  size,
  axis = 'length',
  yaw = 0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  castShadow = true,
}: GltfModelProps) {
  return (
    <group position={position} rotation={rotation}>
      <group rotation={[0, yaw, 0]}>
        <Suspense fallback={null}>
          <FittedObject url={url} size={size} axis={axis} castShadow={castShadow} />
        </Suspense>
      </group>
    </group>
  );
}
