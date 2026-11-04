import Ground from './Ground';
import SkyDome from './SkyDome';
import DistantCity from './DistantCity';
import Roads from './Roads';
import Lighting from './Lighting';
import Buildings from './Buildings';
import Environment from './Environment';
import Humans from './Humans';
import Gardeners from './Gardeners';
import Vehicles from './Vehicles';
import Plane from './Plane';
import Player from './Player';
import TrafficLights from './TrafficLights';
import Rain from './Rain';
import SimulationClock from './SimulationClock';
import { useCityStore } from '../../store/cityStore';

export default function CityScene() {
  const clearSelection = useCityStore((state) => state.clearSelection);
  return (
    <>
      <SimulationClock />
      <Lighting />
      <group onPointerMissed={() => clearSelection()}>
        <SkyDome />
        <Ground />
        <DistantCity />
        <Roads />
        <Buildings />
        <Environment />
        <Vehicles />
        <Plane />
        <Player />
        <TrafficLights />
        <Humans />
        <Gardeners />
        <Rain />
      </group>
    </>
  );
}