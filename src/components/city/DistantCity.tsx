import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { seeded } from '../../lib/paths';
import { skyState } from '../../lib/skyState';

interface Tower {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  rotation: number;
  tint: number;
}

// Real city far away: hazy towers and hills beyond the playable block, so the
// neighbourhood reads as one district of a much larger metropolis.
export default function DistantCity() {
  const towers = useMemo<Tower[]>(() => {
    const random = seeded(2917);
    const list: Tower[] = [];
    for (let i = 0; i < 320; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 100 + Math.pow(random(), 0.72) * 300;
      const distance = Math.max(0, radius - 100) / 300;
      const height = 9 + random() * 34 + distance * random() * 58;
      list.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        width: 7 + random() * 16,
        depth: 7 + random() * 16,
        height,
        rotation: (Math.floor(random() * 4) * Math.PI) / 4,
        tint: 0.62 + random() * 0.38,
      });
    }
    return list;
  }, []);

  const landmarks = useMemo(() => {
    const random = seeded(88);
    return Array.from({ length: 9 }, () => {
      const angle = random() * Math.PI * 2;
      const radius = 190 + random() * 190;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        width: 16 + random() * 14,
        depth: 16 + random() * 14,
        height: 62 + random() * 72,
        rotation: random() * Math.PI,
      };
    });
  }, []);

  const hills = useMemo(() => {
    const random = seeded(551);
    return Array.from({ length: 22 }, () => {
      const angle = random() * Math.PI * 2;
      const radius = 430 + random() * 260;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        radius: 70 + random() * 130,
        height: 26 + random() * 80,
      };
    });
  }, []);

  const mesh = useRef<THREE.InstancedMesh>(null);
  const landmarkMesh = useRef<THREE.InstancedMesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    if (mesh.current) {
      towers.forEach((tower, index) => {
        dummy.position.set(tower.x, tower.height / 2 - 0.2, tower.z);
        dummy.rotation.set(0, tower.rotation, 0);
        dummy.scale.set(tower.width, tower.height, tower.depth);
        dummy.updateMatrix();
        mesh.current?.setMatrixAt(index, dummy.matrix);
        color.setRGB(0.44 * tower.tint, 0.47 * tower.tint, 0.52 * tower.tint);
        mesh.current?.setColorAt(index, color);
      });
      mesh.current.instanceMatrix.needsUpdate = true;
      if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    }
    if (landmarkMesh.current) {
      landmarks.forEach((tower, index) => {
        dummy.position.set(tower.x, tower.height / 2 - 0.2, tower.z);
        dummy.rotation.set(0, tower.rotation, 0);
        dummy.scale.set(tower.width, tower.height, tower.depth);
        dummy.updateMatrix();
        landmarkMesh.current?.setMatrixAt(index, dummy.matrix);
      });
      landmarkMesh.current.instanceMatrix.needsUpdate = true;
    }
  }, [towers, landmarks]);

  useFrame(() => {
    if (material.current) {
      material.current.emissiveIntensity = 0.04 + skyState.night * 0.62;
    }
  });

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, towers.length]} castShadow={false} receiveShadow={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial ref={material} color="#7d8794" roughness={0.92} metalness={0.06} emissive="#ffd9a5" emissiveIntensity={0.04} />
      </instancedMesh>
      <instancedMesh ref={landmarkMesh} args={[undefined, undefined, landmarks.length]} castShadow={false} receiveShadow={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6f7a88" roughness={0.88} metalness={0.12} emissive="#ffcf94" emissiveIntensity={0.3} />
      </instancedMesh>
      {hills.map((hill, index) => (
        <mesh key={index} position={[hill.x, hill.height / 2 - 4, hill.z]} receiveShadow={false}>
          <coneGeometry args={[hill.radius, hill.height, 10]} />
          <meshStandardMaterial color="#3c4a3a" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
