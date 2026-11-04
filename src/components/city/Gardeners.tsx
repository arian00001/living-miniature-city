import Character from './Character';
import { WateringCan } from './office/Premium';

interface GardenerProps {
  position: [number, number, number];
  rotation?: number;
  shirt: string;
  skin: string;
}

// Gardeners stand at the beds with a can in hand, the water always falling.
function Gardener({ position, rotation = 0, shirt, skin }: GardenerProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Character pose="idle" shirt={shirt} skin={skin} hair="#241d18" trousers="#3f4a3d" />
      <WateringCan position={[0.26, 0.95, 0.16]} rotation={-0.5} />
    </group>
  );
}

// Gardeners on the headquarters lawns and by the park beds.
export default function Gardeners() {
  return (
    <group>
      <Gardener position={[-16.6, 0.52, 10.4]} rotation={0.7} shirt="#4f7d3f" skin="#c98f63" />
      <Gardener position={[16.8, 0.52, -8.2]} rotation={-2.2} shirt="#3f8f62" skin="#d8a87c" />
      <Gardener position={[-19.6, 0.06, -48.4]} rotation={1.1} shirt="#5c8f4a" skin="#a8744c" />
      <Gardener position={[16.2, 0.52, 11.6]} rotation={2.6} shirt="#6b8f3f" skin="#e0b189" />
    </group>
  );
}