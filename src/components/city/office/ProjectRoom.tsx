import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useProjects } from '../../../lib/projectsStore';
import { GlassPartition } from './Furniture';
import Sign from './Sign';

// Room measured from its own centre: 5.0 × 3.2, glass on three sides, a gap in the
// front wall aligned with the guided route.
const SLOT_X = [-1.88, -0.63, 0.63, 1.88];

function FloatingCard({ index, name, category, onSelect }: { index: number; name: string; category: string; onSelect: () => void }) {
  const node = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!node.current) return;
    const t = state.clock.elapsedTime;
    node.current.position.y = 1.42 + Math.sin(t * 0.9 + index * 1.2) * 0.055;
    node.current.rotation.y = Math.sin(t * 0.32 + index) * 0.1;
  });

  return (
    <group position={[SLOT_X[index % SLOT_X.length], 0, -0.85]}>
      <group ref={node} onClick={onSelect}>
        <mesh position={[0, 0, -0.04]} castShadow>
          <boxGeometry args={[1.2, 0.72, 0.05]} />
          <meshStandardMaterial color="#0e1512" roughness={0.28} metalness={0.45} />
        </mesh>
        <Sign text={name} sub={category} width={1.12} height={0.64} lit={0.75} />
      </group>
      <mesh position={[0, 0.72, -0.06]}>
        <boxGeometry args={[0.02, 1.4, 0.02]} />
        <meshStandardMaterial color="#243026" metalness={0.6} roughness={0.4} />
      </mesh>
      <pointLight position={[0, 1.5, 0.55]} color="#dcffb0" intensity={1.5} distance={3} decay={2} />
    </group>
  );
}

export default function ProjectRoom() {
  const projects = useProjects((state) => state.projects);
  const select = useProjects((state) => state.select);

  return (
    <group position={[-9.5, 0, -6.2]}>
      {/* front wall, split around the doorway */}
      <GlassPartition position={[-1.35, 0, 1.6]} width={2.1} height={2.5} />
      <GlassPartition position={[1.72, 0, 1.6]} width={1.2} height={2.5} />
      <GlassPartition position={[-2.5, 0, 0]} rotation={Math.PI / 2} width={3.2} height={2.5} />
      <GlassPartition position={[2.5, 0, -0.2]} rotation={Math.PI / 2} width={2.6} height={2.5} />

      <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.8, 3]} />
        <meshStandardMaterial color="#151d17" roughness={0.95} />
      </mesh>

      <group position={[0.2, 2.36, 1.58]}>
        <Sign text="Project Room" sub="Selected work" width={2.2} height={0.5} lit={0.55} />
      </group>

      {projects.slice(0, 4).map((project, index) => (
        <FloatingCard
          key={project.id}
          index={index}
          name={project.name}
          category={project.category || 'Project'}
          onSelect={() => select(project.id)}
        />
      ))}

      <pointLight position={[0, 2.3, 0.6]} color="#eaffcf" intensity={4} distance={6.5} decay={2} />
    </group>
  );
}