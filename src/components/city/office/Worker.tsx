import Character from '../Character';
import type { HairStyle } from '../Character';

export type WorkerPose = 'type' | 'sit' | 'talk' | 'idle';

interface WorkerProps {
  position: [number, number, number];
  rotation?: number;
  shirt?: string;
  skin?: string;
  hair?: string;
  hairStyle?: HairStyle;
  pose?: WorkerPose;
  typing?: boolean;
}

export default function Worker({
  position,
  rotation = 0,
  shirt = '#3f6fd8',
  skin = '#d8a87c',
  hair = '#241d18',
  hairStyle = 'short',
  pose,
  typing = true,
}: WorkerProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Character
        pose={pose ?? (typing ? 'type' : 'sit')}
        shirt={shirt}
        skin={skin}
        hair={hair}
        hairStyle={hairStyle}
        trousers="#2d3644"
      />
    </group>
  );
}
