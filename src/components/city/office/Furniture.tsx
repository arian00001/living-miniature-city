export function Desk({ position, rotation = 0, wide = false }: { position: [number, number, number]; rotation?: number; wide?: boolean }) {
  const width = wide ? 2.3 : 1.8;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.08, 0.9]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.6} />
      </mesh>
      {[[-0.8, -0.34], [0.8, -0.34], [-0.8, 0.34], [0.8, 0.34]].map(([x, z]) => (
        <mesh key={x + ':' + z} position={[x, 0.36, z]} castShadow>
          <boxGeometry args={[0.07, 0.72, 0.07]} />
          <meshStandardMaterial color="#8a8f99" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 1.02, -0.24]} castShadow>
        <boxGeometry args={[0.86, 0.52, 0.05]} />
        <meshStandardMaterial color="#1c2430" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.02, -0.21]}>
        <boxGeometry args={[0.78, 0.44, 0.02]} />
        <meshStandardMaterial color="#8fc3ff" emissive="#8fc3ff" emissiveIntensity={0.85} />
      </mesh>
      <mesh position={[0, 0.8, -0.24]}>
        <boxGeometry args={[0.12, 0.16, 0.06]} />
        <meshStandardMaterial color="#5a6370" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.42, 0.78, 0.1]}>
        <boxGeometry args={[0.36, 0.03, 0.14]} />
        <meshStandardMaterial color="#d7d2c6" roughness={0.7} />
      </mesh>
    </group>
  );
}

export function Chair({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.44, 0.08, 0.44]} />
        <meshStandardMaterial color="#3b4452" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.72, -0.2]} castShadow>
        <boxGeometry args={[0.44, 0.46, 0.07]} />
        <meshStandardMaterial color="#3b4452" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.44, 8]} />
        <meshStandardMaterial color="#8a8f99" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />
        <meshStandardMaterial color="#6d7480" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.18, 0.44, 12]} />
        <meshStandardMaterial color="#c9b79a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.42, 12, 10]} />
        <meshStandardMaterial color="#5f8a52" roughness={1} />
      </mesh>
    </group>
  );
}

export function Sofa({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[2, 0.36, 0.85]} />
        <meshStandardMaterial color="#7d8794" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.62, -0.34]} castShadow>
        <boxGeometry args={[2, 0.5, 0.16]} />
        <meshStandardMaterial color="#6d7683" roughness={0.9} />
      </mesh>
      {[-0.86, 0.86].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]} castShadow>
          <boxGeometry args={[0.16, 0.34, 0.85]} />
          <meshStandardMaterial color="#6d7683" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function ReceptionDesk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 1.1, 1]} />
        <meshStandardMaterial color="#efeae0" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.14, 0]}>
        <boxGeometry args={[4.5, 0.08, 1.2]} />
        <meshStandardMaterial color="#c9c2b3" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.62, 0.52]}>
        <boxGeometry args={[4, 0.4, 0.04]} />
        <meshStandardMaterial color="#7ee787" emissive="#7ee787" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export function MeetingTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.12, 2.2]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.5} />
      </mesh>
      {[-2.4, 2.4].map((x) => (
        <mesh key={x} position={[x, 0.36, 0]} castShadow>
          <boxGeometry args={[0.2, 0.72, 1.6]} />
          <meshStandardMaterial color="#8a8f99" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[1.4, 0.03, 0.6]} />
        <meshStandardMaterial color="#cdd6e2" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Whiteboard({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[3.4, 1.8, 0.08]} />
        <meshStandardMaterial color="#f4f6f8" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.9, 0.06]}>
        <boxGeometry args={[2.6, 0.06, 0.01]} />
        <meshStandardMaterial color="#8fa2bb" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.55, 0.06]}>
        <boxGeometry args={[1.8, 0.06, 0.01]} />
        <meshStandardMaterial color="#a8b7c9" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Elevator({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[2.2, 2.6, 2.2]} />
        <meshStandardMaterial color="#c3cad4" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.3, 1.12]}>
        <boxGeometry args={[1.7, 2.2, 0.06]} />
        <meshStandardMaterial color="#8f99a6" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 2.5, 1.16]}>
        <boxGeometry args={[1.8, 0.16, 0.04]} />
        <meshStandardMaterial color="#7ee787" emissive="#7ee787" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

export function Stairs({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2, 3, 4, 5].map((step) => (
        <mesh key={step} position={[0, 0.12 + step * 0.22, step * 0.5]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.22, 0.5]} />
          <meshStandardMaterial color="#d8d3c8" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}
