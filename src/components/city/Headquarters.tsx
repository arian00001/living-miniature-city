import { useCityStore } from '../../store/cityStore';
import { useFacade } from '../../lib/facade';
import { FLOOR_SIZE, floorY, officeFloors } from '../../data/office';
import OfficeInterior from './office/OfficeInterior';

export default function Headquarters() {
  const view = useCityStore((state) => state.activeView);
  const lit = useCityStore((state) =>
    state.lightingMode === 'night' ? 1.2 : state.lightingMode === 'sunset' ? 0.4 : 0.05,
  );
  const facade = useFacade({ cols: 6, rows: 1, wall: '#3a4c60', glass: '#a9c9ea', lit: '#dcecff', litRatio: 0.75 });

  if (view === 'office') return <OfficeInterior />;

  const topY = floorY(5) + 1.7;

  return (
    <group>
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[23, 0.6, 23]} />
        <meshStandardMaterial color="#cdc7b8" roughness={0.9} />
      </mesh>

      {officeFloors.map((floor) => {
        const y = floorY(floor.index) + 0.5;
        return (
          <group key={floor.index}>
            <mesh position={[0, y, 0]} castShadow receiveShadow>
              <boxGeometry args={[FLOOR_SIZE + 2, 2.4, FLOOR_SIZE + 2]} />
              <meshStandardMaterial
                map={facade.map}
                emissiveMap={facade.emissiveMap}
                emissive="#fff0d0"
                emissiveIntensity={lit}
                roughness={0.3}
                metalness={0.45}
              />
            </mesh>
            <mesh position={[0, y - 1.18, 0]} castShadow>
              <boxGeometry args={[FLOOR_SIZE + 3, 0.24, FLOOR_SIZE + 3]} />
              <meshStandardMaterial color="#e6e1d5" roughness={0.85} />
            </mesh>
          </group>
        );
      })}

      {/* entrance canopy and doors */}
      <mesh position={[0, 3.4, 10.4]} castShadow>
        <boxGeometry args={[9, 0.3, 3.4]} />
        <meshStandardMaterial color="#e9e4d8" roughness={0.8} />
      </mesh>
      {[-3.6, 3.6].map((x) => (
        <mesh key={x} position={[x, 1.7, 10.4]} castShadow>
          <boxGeometry args={[0.3, 3.4, 0.3]} />
          <meshStandardMaterial color="#dcd7ca" roughness={0.7} metalness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 1.7, 9.2]}>
        <boxGeometry args={[6, 3.2, 0.24]} />
        <meshStandardMaterial color="#dfe8f2" roughness={0.15} metalness={0.3} transparent opacity={0.72} />
      </mesh>

      {/* company sign */}
      <mesh position={[0, 3.9, 9.35]}>
        <boxGeometry args={[6.4, 0.9, 0.16]} />
        <meshStandardMaterial color="#7ee787" emissive="#7ee787" emissiveIntensity={1.1} />
      </mesh>

      {/* rooftop garden */}
      <mesh position={[0, topY, 0]} receiveShadow>
        <boxGeometry args={[FLOOR_SIZE + 1, 0.4, FLOOR_SIZE + 1]} />
        <meshStandardMaterial color="#8ea878" roughness={1} />
      </mesh>
      <mesh position={[0, topY + 0.8, 0]} castShadow>
        <boxGeometry args={[6, 1.2, 5]} />
        <meshStandardMaterial color="#e9e4d8" roughness={0.85} />
      </mesh>
      {[-5, 5].map((x) =>
        [-5, 5].map((z) => (
          <group key={x + ':' + z} position={[x, topY + 0.9, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.12, 1.2, 8]} />
              <meshStandardMaterial color="#6a5136" roughness={0.95} />
            </mesh>
            <mesh position={[0, 0.85, 0]} castShadow>
              <sphereGeometry args={[0.72, 12, 10]} />
              <meshStandardMaterial color="#5f8a52" roughness={1} />
            </mesh>
          </group>
        )),
      )}
      {[-3.4, 3.4].map((x) => (
        <mesh key={x} position={[x, topY + 0.62, 6.6]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[3.4, 0.1, 1.4]} />
          <meshStandardMaterial color="#2f3b4a" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* penthouse balcony on the management floor */}
      <mesh position={[0, floorY(5) + 0.9, 9.4]} castShadow>
        <boxGeometry args={[8, 0.2, 2.6]} />
        <meshStandardMaterial color="#e9e4d8" roughness={0.8} />
      </mesh>
      <mesh position={[0, floorY(5) + 1.5, 10.6]}>
        <boxGeometry args={[8, 1, 0.12]} />
        <meshStandardMaterial color="#cfe0ef" transparent opacity={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
}
