import OfficeInterior from './office/OfficeInterior';
import Sign from './office/Sign';

const WALL = '#f5f5f5';
const TRIM = '#dfdfdf';
const FRAME = '#212121';
const PAVING = '#eceff1';
const LAWN = '#6c9a4a';

const FENCE_X = 20;
const FENCE_Z = 17;

function Fence() {
  const posts: [number, number][] = [];
  for (let x = -FENCE_X; x <= FENCE_X; x += 2.5) {
    if (Math.abs(x) > 3.4) posts.push([x, FENCE_Z]);
    posts.push([x, -FENCE_Z]);
  }
  for (let z = -FENCE_Z + 2.5; z < FENCE_Z; z += 2.5) {
    posts.push([-FENCE_X, z]);
    posts.push([FENCE_X, z]);
  }
  return (
    <group>
      {posts.map(([x, z], index) => (
        <mesh key={index} position={[x, 1.28, z]} castShadow>
          <boxGeometry args={[0.09, 1.55, 0.09]} />
          <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.45} />
        </mesh>
      ))}
      {[-FENCE_Z, FENCE_Z].map((z) => (
        <group key={'rail-z' + z}>
          <mesh position={[0, 1.85, z]}>
            <boxGeometry args={[FENCE_X * 2, 0.06, 0.06]} />
            <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.75, z]}>
            <boxGeometry args={[FENCE_X * 2, 0.06, 0.06]} />
            <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.45} />
          </mesh>
        </group>
      ))}
      {[-FENCE_X, FENCE_X].map((x) => (
        <group key={'rail-x' + x}>
          <mesh position={[x, 1.85, 0]}>
            <boxGeometry args={[0.06, 0.06, FENCE_Z * 2]} />
            <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.45} />
          </mesh>
          <mesh position={[x, 0.75, 0]}>
            <boxGeometry args={[0.06, 0.06, FENCE_Z * 2]} />
            <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.45} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GuardHouse() {
  return (
    <group position={[15.4, 0.5, 12.6]}>
      <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 2.6, 4.2]} />
        <meshStandardMaterial color={WALL} roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.72, 0]} castShadow>
        <boxGeometry args={[5, 0.24, 5] } />
        <meshStandardMaterial color="#2e7d32" roughness={0.6} />
      </mesh>
      <mesh position={[-1, 1.6, 2.12]}>
        <boxGeometry args={[1.6, 1.1, 0.06]} />
        <meshStandardMaterial color="#cfe3e8" roughness={0.1} metalness={0.3} transparent opacity={0.55} />
      </mesh>
      <mesh position={[1.35, 1.05, 2.12]} castShadow>
        <boxGeometry args={[0.85, 2, 0.07]} />
        <meshStandardMaterial color={FRAME} roughness={0.5} />
      </mesh>
      <mesh position={[-1, 1.6, 2.16]}>
        <boxGeometry args={[1.66, 1.16, 0.03]} />
        <meshStandardMaterial color={FRAME} roughness={0.5} />
      </mesh>
      <mesh position={[-1, 1.6, 2.19]}>
        <boxGeometry args={[1.5, 1, 0.02]} />
        <meshStandardMaterial color="#cfe3e8" roughness={0.1} metalness={0.3} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Gardens() {
  const shrubs: [number, number, number][] = [
    [-16, 13.5, 0.55],
    [-11, 14.6, 0.42],
    [-2.4, 14.9, 0.38],
    [8.5, 14.4, 0.5],
    [18, 6, 0.45],
    [18, -6, 0.5],
    [-18, 7, 0.46],
    [-18, -7, 0.4],
    [-9, -14.6, 0.44],
    [4, -14.8, 0.4],
  ];
  const trees: [number, number][] = [
    [-17.2, 11.4],
    [17.4, 13.4],
    [-17.4, -12.4],
    [17.2, -12.8],
    [-6, 14.6],
  ];
  return (
    <group>
      {shrubs.map(([x, z, s], index) => (
        <mesh key={'shrub' + index} position={[x, 0.5 + s, z]} castShadow>
          <sphereGeometry args={[s, 10, 8]} />
          <meshStandardMaterial color={index % 2 === 0 ? '#4f8b3d' : '#5c9a46'} roughness={1} />
        </mesh>
      ))}
      {trees.map(([x, z], index) => (
        <group key={'tree' + index} position={[x, 0.5, z]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.18, 2.2, 8]} />
            <meshStandardMaterial color="#6b5238" roughness={0.95} />
          </mesh>
          <mesh position={[0, 2.75, 0]} castShadow>
            <sphereGeometry args={[1.15, 12, 10]} />
            <meshStandardMaterial color="#4c7d3c" roughness={1} />
          </mesh>
          <mesh position={[0.45, 2.15, 0.3]} castShadow>
            <sphereGeometry args={[0.72, 10, 8]} />
            <meshStandardMaterial color="#5a8f45" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function Headquarters() {
  const mullions = [-6, -3, 0, 3, 6];

  return (
    <group>
      {/* compound paving */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <boxGeometry args={[40, 0.5, 34]} />
        <meshStandardMaterial color={PAVING} roughness={0.85} />
      </mesh>

      {/* lawn strips between the fence and the building */}
      {[
        { x: -18.2, z: 0, w: 3.4, d: 33.4 },
        { x: 18.2, z: 0, w: 3.4, d: 33.4 },
        { x: 0, z: 14.4, w: 33.4, d: 5 },
        { x: 0, z: -14.4, w: 33.4, d: 4.6 },
      ].map((patch, index) => (
        <mesh key={'lawn' + index} position={[patch.x, 0.52, patch.z]} receiveShadow>
          <boxGeometry args={[patch.w, 0.06, patch.d]} />
          <meshStandardMaterial color={LAWN} roughness={1} />
        </mesh>
      ))}

      <Gardens />
      <Fence />
      <GuardHouse />

      {/* gate pillars and barrier */}
      {[-3.9, 3.9].map((x) => (
        <group key={'gate' + x} position={[x, 0.5, 16.6]}>
          <mesh position={[0, 1.25, 0]} castShadow>
            <boxGeometry args={[0.8, 2.5, 0.8]} />
            <meshStandardMaterial color={WALL} roughness={0.75} />
          </mesh>
          <mesh position={[0, 2.56, 0]}>
            <boxGeometry args={[1, 0.14, 1]} />
            <meshStandardMaterial color="#80cbc4" roughness={0.6} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.5, 16.6]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[7.4, 0.12, 0.12]} />
        <meshStandardMaterial color="#e0e3e6" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* entry path from the gate to the door */}
      <mesh position={[0, 0.55, 13]} receiveShadow>
        <boxGeometry args={[5.6, 0.06, 8]} />
        <meshStandardMaterial color="#dfe4e6" roughness={0.9} />
      </mesh>

      {/* office floor slab */}
      <mesh position={[0, 0.54, 0]} receiveShadow>
        <boxGeometry args={[27, 0.12, 18]} />
        <meshStandardMaterial color="#eceff1" roughness={0.9} />
      </mesh>

      {/* shell: off-white walls, no roof so the plan stays readable */}
      <mesh position={[0, 2.22, -9.05]} castShadow receiveShadow>
        <boxGeometry args={[27.4, 3.2, 0.26]} />
        <meshStandardMaterial color={WALL} roughness={0.75} />
      </mesh>
      {[-13.6, 13.6].map((x) => (
        <mesh key={'side' + x} position={[x, 2.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.26, 3.2, 18.4]} />
          <meshStandardMaterial color={WALL} roughness={0.75} />
        </mesh>
      ))}
      {[-10.1, 10.1].map((x) => (
        <mesh key={'front' + x} position={[x, 2.22, 9.05]} castShadow receiveShadow>
          <boxGeometry args={[7.2, 3.2, 0.26]} />
          <meshStandardMaterial color={WALL} roughness={0.75} />
        </mesh>
      ))}

      {/* glazed shopfront with black mullions */}
      <mesh position={[0, 2.1, 9.13]}>
        <boxGeometry args={[13, 2.9, 0.06]} />
        <meshStandardMaterial color="#d7e6ee" roughness={0.08} metalness={0.25} transparent opacity={0.34} />
      </mesh>
      {mullions.map((x) => (
        <mesh key={'mullion' + x} position={[x, 2.1, 9.16]} castShadow>
          <boxGeometry args={[0.12, 2.9, 0.16]} />
          <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 2.1, 9.19]} castShadow>
        <boxGeometry args={[2.4, 2.7, 0.1]} />
        <meshStandardMaterial color={FRAME} metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.05, 9.23]}>
        <boxGeometry args={[2.1, 2.5, 0.05]} />
        <meshStandardMaterial color="#e4f1f6" roughness={0.06} metalness={0.3} transparent opacity={0.4} />
      </mesh>

      {/* parapet band and signage */}
      <mesh position={[0, 3.86, 0]}>
        <boxGeometry args={[27.9, 0.2, 19]} />
        <meshStandardMaterial color={TRIM} roughness={0.7} />
      </mesh>
      <Sign text="DevStyle Tech" sub="Innovate · Create · Grow" position={[0, 3.3, 9.2]} width={6.6} height={1.2} />

      {/* freestanding board on the lawn */}
      <group position={[-7.4, 0.5, 12.4]}>
        <mesh position={[-1.5, 0.65, 0]} castShadow>
          <boxGeometry args={[0.12, 1.3, 0.12]} />
          <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.45} />
        </mesh>
        <mesh position={[1.5, 0.65, 0]} castShadow>
          <boxGeometry args={[0.12, 1.3, 0.12]} />
          <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.45} />
        </mesh>
        <Sign text="DevStyle Tech" position={[0, 1.6, 0]} width={4.2} height={1.1} />
      </group>

      <group position={[0, 0.6, 0]}>
        <OfficeInterior />
      </group>
    </group>
  );
}
