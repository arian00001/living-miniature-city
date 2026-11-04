import { useFrame } from '@react-three/fiber';
import { useCityStore } from '../../store/cityStore';

export default function SimulationClock() {
  const tick = useCityStore((state) => state.tick);
  useFrame((_, delta) => tick(Math.min(delta, 0.1)));
  return null;
}
