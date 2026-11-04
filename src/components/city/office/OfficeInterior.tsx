import { useCityStore } from '../../../store/cityStore';
import { floorY, isWorkingHours, officeFloors } from '../../../data/office';
import { Chair, Desk, Elevator, MeetingTable, Plant, ReceptionDesk, Sofa, Stairs, Whiteboard } from './Furniture';
import Worker from './Worker';

const SHIRTS = ['#3f6fd8', '#3fb6c9', '#8f5bd8', '#d8623f', '#4f9d6b'];

function CornerColumns() {
  const corners: [number, number][] = [
    [-7, -7],
    [7, -7],
    [-7, 7],
    [7, 7],
  ];
  return (
    <>
      {corners.map(([x, z]) => (
        <mesh key={x + ':' + z} position={[x, 1.35, z]} castShadow>
          <boxGeometry args={[0.28, 2.7, 0.28]} />
          <meshStandardMaterial color="#e3e8ef" roughness={0.5} />
        </mesh>
      ))}
    </>
  );
}

function BackWall() {
  return (
    <mesh position={[0, 1.4, -7.4]} receiveShadow>
      <boxGeometry args={[15, 2.8, 0.2]} />
      <meshStandardMaterial color="#eef1f6" roughness={0.7} />
    </mesh>
  );
}

function ReceptionFloor() {
  return (
    <group>
      <ReceptionDesk position={[0, 0, 1.6]} />
      <Worker position={[0, 0, 2.7]} rotation={0} shirt="#4f9d6b" skin="#e0b48c" />
      <Sofa position={[-5, 0, 5]} rotation={Math.PI} />
      <Sofa position={[5, 0, 5]} rotation={Math.PI} />
      <Plant position={[-6.5, 0, 1]} />
      <Plant position={[6.5, 0, 1]} />
      <Elevator position={[5.4, 0, -5.6]} />
      <Stairs position={[-5.6, 0, -6]} />
    </group>
  );
}

function DevelopmentFloor({ working }: { working: boolean }) {
  const desks: [number, number, number][] = [
    [-4.6, 0, -3.4],
    [0, 0, -3.4],
    [4.6, 0, -3.4],
    [-4.6, 0, 1.6],
    [0, 0, 1.6],
    [4.6, 0, 1.6],
  ];
  return (
    <group>
      {desks.map((position, index) => (
        <group key={index}>
          <Desk position={position} />
          <Chair position={[position[0], 0, position[2] + 1.1]} rotation={Math.PI} />
          {working && (
            <Worker
              position={[position[0], 0, position[2] + 1.15]}
              rotation={Math.PI}
              shirt={SHIRTS[index % SHIRTS.length]}
              skin={index % 2 === 0 ? '#d8a87c' : '#c98f63'}
            />
          )}
        </group>
      ))}
      <Whiteboard position={[0, 0, -6.6]} />
      <Plant position={[-6.6, 0, 5.6]} />
      <Plant position={[6.6, 0, 5.6]} />
    </group>
  );
}

function CreativeFloor({ working }: { working: boolean }) {
  const desks: [number, number, number][] = [
    [-4.4, 0, -3],
    [0, 0, -3],
    [4.4, 0, -3],
  ];
  return (
    <group>
      {desks.map((position, index) => (
        <group key={index}>
          <Desk position={position} wide />
          <Chair position={[position[0], 0, position[2] + 1.1]} rotation={Math.PI} />
          {working && <Worker position={[position[0], 0, position[2] + 1.15]} rotation={Math.PI} shirt="#8f5bd8" skin="#f0cfae" />}
        </group>
      ))}
      <Whiteboard position={[0, 0, -6.6]} />
      <Sofa position={[-4.6, 0, 4.6]} rotation={Math.PI / 2} />
      <Sofa position={[4.6, 0, 4.6]} rotation={-Math.PI / 2} />
      <Plant position={[0, 0, 5.8]} />
    </group>
  );
}

function MeetingFloor({ working }: { working: boolean }) {
  const seats: [number, number][] = [
    [-2, -1.7],
    [0, -1.7],
    [2, -1.7],
    [-2, 1.7],
    [0, 1.7],
    [2, 1.7],
  ];
  return (
    <group>
      <MeetingTable position={[0, 0, 0]} />
      {seats.map(([x, z], index) => (
        <group key={index}>
          <Chair position={[x, 0, z]} rotation={z > 0 ? Math.PI : 0} />
          {working && index % 2 === 0 && (
            <Worker position={[x, 0, z + (z > 0 ? 0.1 : -0.1)]} rotation={z > 0 ? Math.PI : 0} shirt={SHIRTS[index % SHIRTS.length]} skin="#e0b48c" typing={false} />
          )}
        </group>
      ))}
      <mesh position={[0, 1.9, -6.8]} castShadow>
        <boxGeometry args={[4.4, 2.2, 0.1]} />
        <meshStandardMaterial color="#1b2530" roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.9, -6.72]}>
        <boxGeometry args={[4.1, 1.9, 0.02]} />
        <meshStandardMaterial color="#8fc3ff" emissive="#8fc3ff" emissiveIntensity={0.75} />
      </mesh>
      <Whiteboard position={[5.6, 0, -5.6]} rotation={-Math.PI / 2} />
      <Plant position={[-6.4, 0, 5.4]} />
    </group>
  );
}

function ManagementFloor({ working }: { working: boolean }) {
  return (
    <group>
      <Desk position={[0, 0, -4]} wide />
      <Chair position={[0, 0, -5.1]} rotation={Math.PI} />
      {working && <Worker position={[0, 0, -5.05]} rotation={Math.PI} shirt="#2f3b4a" skin="#c98f63" />}
      <Sofa position={[-4.6, 0, 3.4]} rotation={Math.PI / 2} />
      <Sofa position={[4.6, 0, 3.4]} rotation={-Math.PI / 2} />
      <Plant position={[-6.4, 0, -5.6]} scale={1.2} />
      <Plant position={[6.4, 0, 5.6]} scale={1.2} />
      <mesh position={[0, 0.55, 7.2]} castShadow>
        <boxGeometry args={[13, 1.1, 0.12]} />
        <meshStandardMaterial color="#cfe0ef" transparent opacity={0.45} roughness={0.2} />
      </mesh>
    </group>
  );
}

function FloorContent({ index, working }: { index: number; working: boolean }) {
  if (index === 1) return <ReceptionFloor />;
  if (index === 2) return <DevelopmentFloor working={working} />;
  if (index === 3) return <CreativeFloor working={working} />;
  if (index === 4) return <MeetingFloor working={working} />;
  return <ManagementFloor working={working} />;
}

export default function OfficeInterior() {
  const selectedFloor = useCityStore((state) => state.selectedFloor);
  const minutes = useCityStore((state) => state.minutes);
  const working = isWorkingHours(minutes);

  return (
    <group>
      {officeFloors.map((floor) => {
        const y = floorY(floor.index);
        const active = floor.index === selectedFloor;
        return (
          <group key={floor.index} position={[0, y, 0]}>
            <mesh position={[0, -0.12, 0]} receiveShadow>
              <boxGeometry args={[16, 0.24, 16]} />
              <meshStandardMaterial color={active ? '#f2efe8' : '#c6cdd8'} transparent opacity={active ? 1 : 0.16} roughness={0.85} />
            </mesh>
            {active && (
              <>
                <BackWall />
                <CornerColumns />
                <FloorContent index={floor.index} working={working} />
              </>
            )}
          </group>
        );
      })}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[22, 0.2, 22]} />
        <meshStandardMaterial color="#b9b3a4" roughness={0.9} />
      </mesh>
    </group>
  );
}
