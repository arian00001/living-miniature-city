import { Chair, Desk, Plant } from './Furniture';
import Worker from './Worker';

interface ScientistSeat {
  x: number;
  z: number;
  shirt: string;
  skin: string;
  hairStyle: 'short' | 'bun' | 'ponytail' | 'buzz';
  phase: number;
  pose: 'type' | 'sit';
}

// The research bench: lab coats, monitors and hands on the keyboard. Each scientist runs on
// its own phase, so nobody types in lockstep and the room reads as genuinely busy.
const SEATS: ScientistSeat[] = [
  { x: -5.6, z: 2.5, shirt: '#eef1f4', skin: '#d8a87c', hairStyle: 'bun', phase: 0, pose: 'type' },
  { x: -5.6, z: -1.6, shirt: '#e9edf2', skin: '#c98f63', hairStyle: 'ponytail', phase: 1.7, pose: 'type' },
  { x: -11.3, z: -3.6, shirt: '#f4f6f8', skin: '#e0b189', hairStyle: 'short', phase: 3.4, pose: 'type' },
];

export default function Lab() {
  return (
    <group>
      {SEATS.map((seat, index) => (
        <group key={'scientist' + index}>
          <Desk position={[seat.x, 0, seat.z]} />
          <Chair position={[seat.x, 0, seat.z + 0.95]} rotation={Math.PI} />
          <Worker
            position={[seat.x, 0, seat.z + 1.0]}
            rotation={Math.PI}
            pose={seat.pose}
            shirt={seat.shirt}
            skin={seat.skin}
            hairStyle={seat.hairStyle}
            phase={seat.phase}
          />
        </group>
      ))}
      <Plant position={[-12.4, 0, 1.5]} scale={0.85} />
      <Plant position={[-3.9, 0, -6.9]} scale={0.75} tone="#356e31" />
    </group>
  );
}
