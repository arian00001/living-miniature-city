import { useCityStore } from '../../../store/cityStore';
import { isWorkingHours } from '../../../data/office';
import { Chair, CoffeeTable, Desk, GlassPartition, Plant, ReceptionDesk, Sofa, Whiteboard } from './Furniture';
import Sign from './Sign';
import Worker from './Worker';
import Scientist from './Scientist';
import Robot from './Robot';

const SHIRTS = ['#3f6fd8', '#3fb6c9', '#8f5bd8', '#d8623f', '#4f9d6b', '#c9a03c'];

const DESKS: [number, number][] = [
  [-2.6, -5.2],
  [2.4, -5.2],
  [-2.6, -1.7],
  [2.4, -1.7],
  [-2.6, 1.9],
  [2.4, 1.9],
];

export default function OfficeInterior() {
  const minutes = useCityStore((state) => state.minutes);
  const working = isWorkingHours(minutes);

  return (
    <group>
      {/* open-plan workstations divided by black-framed glass */}
      {DESKS.map(([x, z], index) => (
        <group key={'desk' + index}>
          <Desk position={[x, 0, z]} />
          <Chair position={[x, 0, z + 0.95]} rotation={Math.PI} />
          {working && index < 5 && (
            <Worker
              position={[x, 0, z + 1.0]}
              rotation={Math.PI}
              shirt={SHIRTS[index % SHIRTS.length]}
              skin={index % 2 === 0 ? '#d8a87c' : '#c98f63'}
              hairStyle={index % 3 === 0 ? 'bun' : 'short'}
            />
          )}
        </group>
      ))}

      <GlassPartition position={[-0.1, 0, -1.8]} rotation={Math.PI / 2} width={9.4} height={2.3} />

      {/* reception, with the company board facing the door */}
      <group>
        <Sign text="DevStyle Tech" sub="Innovate · Create · Grow" position={[-8.4, 2.5, 1.6]} width={4.6} height={1.15} />
        <ReceptionDesk position={[-8.4, 0, 3.3]} />
        <Scientist position={[-8.4, 0, 2.4]} rotation={0} />
        <Worker position={[-8.4, 0, 5.7]} rotation={Math.PI} pose="idle" shirt="#c4553f" skin="#c98f63" hairStyle="short" />
        <Plant position={[-12.1, 0, 6.9]} scale={1.15} />
        <Plant position={[-12.1, 0, 0.4]} />
      </group>

      {/* boss room behind glass, at the back-right corner */}
      <group>
        <GlassPartition position={[9.2, 0, -2.7]} width={6} height={2.5} />
        <GlassPartition position={[6.2, 0, -5.6]} rotation={Math.PI / 2} width={5.8} height={2.5} />
        <Sign text="Boss Room" position={[9.2, 2.62, -2.62]} width={2.4} height={0.52} bg="#e8f5e9" color="#1b5e20" lit={0.5} />
        <Desk position={[9.4, 0, -6.9]} wide />
        <Chair position={[9.4, 0, -5.95]} rotation={Math.PI} executive />
        {working && <Worker position={[9.4, 0, -5.9]} rotation={Math.PI} shirt="#243447" skin="#c98f63" hairStyle="short" />}
        <Chair position={[7.6, 0, -4.4]} rotation={Math.PI / 2} />
        <Plant position={[12.1, 0, -7.5]} scale={0.95} />
      </group>

      {/* lounge with the green sofa and round wooden table */}
      <group>
        <mesh position={[10.4, 0.012, 4.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[4.4, 5.6]} />
          <meshStandardMaterial color="#d6dbd2" roughness={0.95} />
        </mesh>
        <Sofa position={[10.4, 0, 7.1]} rotation={Math.PI} />
        <Sofa position={[10.4, 0, 2.1]} rotation={0} />
        <CoffeeTable position={[10.4, 0, 4.6]} />
        <Plant position={[12.2, 0, 0.6]} scale={1.05} tone="#356e31" />
      </group>

      {/* circulation and greenery */}
      <Whiteboard position={[-5.2, 0, -8.1]} />
      <Plant position={[5.4, 0, 7.6]} scale={1.2} />
      <Plant position={[0.8, 0, 7.7]} />
      <Plant position={[-4.8, 0, -7.7]} scale={0.9} tone="#356e31" />
      <Plant position={[0.8, 0, -7.7]} scale={0.9} />

      {/* the robot greets people as they come through the door */}
      <Robot position={[3.3, 0, 6.5]} size={1.8} />

      {/* interior fill so the open plan reads at night */}
      <pointLight position={[0, 3, 0]} color="#fff3dd" intensity={9} distance={18} decay={2} />
      <pointLight position={[-8, 2.6, 3]} color="#ffeacd" intensity={5} distance={11} decay={2} />
      <pointLight position={[9, 2.6, -5]} color="#ffe9c6" intensity={5} distance={11} decay={2} />
    </group>
  );
}
