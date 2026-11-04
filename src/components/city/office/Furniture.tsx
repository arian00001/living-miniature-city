const METAL = '#8d949e';
const DARK = '#232a33';

export function Desk({ position, rotation = 0, wide = false }: { position: [number, number, number]; rotation?: number; wide?: boolean }) {
  const width = wide ? 2.2 : 1.7;
  const depth = 0.85;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.73, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.06, depth]} />
        <meshStandardMaterial color="#f3f2ee" roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.68, 0]} castShadow>
        <boxGeometry args={[width - 0.18, 0.06, depth - 0.12]} />
        <meshStandardMaterial color="#dfe0dc" roughness={0.6} />
      </mesh>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => (
        <mesh key={sx + ':' + sz} position={[(sx * (width - 0.16)) / 2, 0.35, (sz * (depth - 0.14)) / 2]} castShadow>
          <boxGeometry args={[0.055, 0.7, 0.055]} />
          <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
      {/* monitor */}
      <group position={[0, 0, -0.2]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[0.09, 0.16, 0.09]} />
          <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.87, 0]} castShadow>
          <boxGeometry args={[0.52, 0.05, 0.2]} />
          <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.11, 0.015]} castShadow>
          <boxGeometry args={[0.94, 0.54, 0.045]} />
          <meshStandardMaterial color="#151b23" roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.11, 0.042]}>
          <planeGeometry args={[0.86, 0.47]} />
          <meshStandardMaterial color="#9fd0ff" emissive="#8ec5ff" emissiveIntensity={1.1} roughness={0.2} toneMapped={false} />
        </mesh>
      </group>
      {/* keyboard and mug */}
      <mesh position={[0, 0.775, 0.2]} rotation={[-0.06, 0, 0]}>
        <boxGeometry args={[0.44, 0.025, 0.15]} />
        <meshStandardMaterial color="#2b323b" roughness={0.6} />
      </mesh>
      <mesh position={[0.5, 0.79, 0.12]}>
        <cylinderGeometry args={[0.045, 0.04, 0.1, 12]} />
        <meshStandardMaterial color="#e8e6e0" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Chair({ position, rotation = 0, executive = false }: { position: [number, number, number]; rotation?: number; executive?: boolean }) {
  const shell = executive ? '#2f3b2a' : '#39424d';
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.46, 0]} castShadow>
        <boxGeometry args={[0.46, 0.09, 0.46]} />
        <meshStandardMaterial color={shell} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.72, -0.21]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.44, executive ? 0.56 : 0.46, 0.08]} />
        <meshStandardMaterial color={shell} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.36, 10]} />
        <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4].map((index) => {
        const angle = (index / 5) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.16, 0.05, Math.sin(angle) * 0.16]} rotation={[0, -angle, 0.06]}>
            <boxGeometry args={[0.32, 0.035, 0.06]} />
            <meshStandardMaterial color={DARK} roughness={0.5} metalness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

export function GlassPartition({
  position,
  rotation = 0,
  width = 4,
  height = 2.4,
}: {
  position: [number, number, number];
  rotation?: number;
  width?: number;
  height?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, 0.035]} />
        <meshStandardMaterial color="#cfe3e8" transparent opacity={0.22} roughness={0.06} metalness={0.35} />
      </mesh>
      <mesh position={[0, height / 2 + 0.03, 0]} castShadow>
        <boxGeometry args={[width, 0.06, 0.07]} />
        <meshStandardMaterial color={DARK} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[width, 0.06, 0.07]} />
        <meshStandardMaterial color={DARK} metalness={0.55} roughness={0.35} />
      </mesh>
      {[-width / 2, 0, width / 2].map((x) => (
        <mesh key={x} position={[x, height / 2, 0]} castShadow>
          <boxGeometry args={[0.06, height, 0.07]} />
          <meshStandardMaterial color={DARK} metalness={0.55} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export function ReceptionDesk({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 1.05, 0.72]} />
        <meshStandardMaterial color="#f6f5f1" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.09, 0]} castShadow>
        <boxGeometry args={[3.4, 0.08, 0.86]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.72, 0.38]}>
        <boxGeometry args={[2.6, 0.06, 0.02]} />
        <meshStandardMaterial color="#80cbc4" emissive="#80cbc4" emissiveIntensity={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[1.05, 1.2, 0.1]} castShadow>
        <boxGeometry args={[0.6, 0.42, 0.05]} />
        <meshStandardMaterial color="#151b23" roughness={0.4} />
      </mesh>
      <mesh position={[1.05, 1.2, 0.13]}>
        <planeGeometry args={[0.54, 0.36]} />
        <meshStandardMaterial color="#9fd0ff" emissive="#8ec5ff" emissiveIntensity={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.9, 1.16, 0.1]}>
        <cylinderGeometry args={[0.075, 0.06, 0.16, 12]} />
        <meshStandardMaterial color="#e8e6e0" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Sofa({ position, rotation = 0, color = '#388e3c' }: { position: [number, number, number]; rotation?: number; color?: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.34, 0.86]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.6, -0.3]} castShadow>
        <boxGeometry args={[2.1, 0.6, 0.24]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {[-0.86, 0.86].map((x) => (
        <mesh key={x} position={[x, 0.5, 0.06]} castShadow>
          <boxGeometry args={[0.24, 0.38, 0.82]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}
      {[-0.5, 0.5].map((x) => (
        <mesh key={'cushion' + x} position={[x, 0.53, 0.02]} castShadow>
          <boxGeometry args={[0.92, 0.15, 0.72]} />
          <meshStandardMaterial color="#43a047" roughness={0.9} />
        </mesh>
      ))}
      {[[-0.9, -0.32], [0.9, -0.32], [-0.9, 0.32], [0.9, 0.32]].map(([x, z]) => (
        <mesh key={'leg' + x + z} position={[x, 0.08, z]}>
          <cylinderGeometry args={[0.04, 0.03, 0.16, 8]} />
          <meshStandardMaterial color="#3b3327" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export function CoffeeTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.07, 28]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 12]} />
        <meshStandardMaterial color="#5d4636" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.3, 0.32, 0.05, 20]} />
        <meshStandardMaterial color="#5d4636" roughness={0.7} />
      </mesh>
      <mesh position={[0.16, 0.53, 0.1]}>
        <cylinderGeometry args={[0.055, 0.05, 0.14, 12]} />
        <meshStandardMaterial color="#eceae4" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Plant({ position, scale = 1, tone = '#3f7d3a' }: { position: [number, number, number]; scale?: number; tone?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.17, 0.34, 14]} />
        <meshStandardMaterial color="#d8d2c6" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.04, 14]} />
        <meshStandardMaterial color="#4b3c2b" roughness={1} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const angle = (index / 6) * Math.PI * 2;
        const lean = 0.28 + (index % 2) * 0.16;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.14, 0.95 + (index % 3) * 0.12, Math.sin(angle) * 0.14]}
            rotation={[Math.cos(angle) * lean, -angle, Math.sin(angle) * lean]}
            castShadow
          >
            <coneGeometry args={[0.11, 0.95, 7]} />
            <meshStandardMaterial color={index % 2 === 0 ? tone : '#4f9147'} roughness={0.9} side={2} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#4b6b32" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Whiteboard({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[2.6, 1.4, 0.07]} />
        <meshStandardMaterial color="#f7f7f4" roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.15, 0.045]}>
        <boxGeometry args={[2.4, 1.2, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[2.6, 0.05, 0.06]} />
        <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}
