import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { pointOnLoop, rectLoop, seeded } from '../../lib/paths';
import Character, { type HairStyle } from './Character';

// Every loop runs on the pavement beside a road, so nobody ever walks through a wall.
const PATHS = [
  rectLoop(0, 0, 20.1, 20.1),
  rectLoop(30, -30, 9.9, 9.9),
  rectLoop(-30, 30, 9.9, 9.9),
  rectLoop(30, 30, 9.9, 9.9),
  rectLoop(-30, -30, 9.9, 9.9),
  rectLoop(-16, -52, 11.5, 5),
];

const SHIRTS = ['#3f6fd8', '#c4553f', '#3f8f62', '#7d55c0', '#c9a03c', '#3f93a6', '#b4527a', '#e0e2e6', '#2f4257'];
const TROUSERS = ['#2c3646', '#3a3f47', '#4a4a52', '#232b36', '#54565e'];
const SKINS = ['#e3b795', '#c68d63', '#f0cfae', '#a8744c', '#7f5334', '#d9a578'];
const HAIRS = ['#1d1712', '#2c2119', '#463225', '#6b4f34', '#12212c'];
const HAIR_STYLES: HairStyle[] = ['short', 'buzz', 'bun', 'long', 'ponytail', 'short'];

interface Walker {
  pathIndex: number;
  speed: number;
  offset: number;
  shirt: string;
  trousers: string;
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  scale: number;
}

function Pedestrian({ walker }: { walker: Walker }) {
  const root = useRef<THREE.Group>(null);
  const distance = useRef({ d: walker.offset });

  useFrame((_, delta) => {
    distance.current.d += walker.speed * delta;
    const point = pointOnLoop(PATHS[walker.pathIndex], distance.current.d);
    if (root.current) {
      root.current.position.set(point.x, 0.12, point.z);
      root.current.rotation.y = point.angle;
    }
  });

  return (
    <group ref={root}>
      <Character
        pose="walk"
        distanceRef={distance.current}
        speed={walker.speed}
        shirt={walker.shirt}
        trousers={walker.trousers}
        skin={walker.skin}
        hair={walker.hair}
        hairStyle={walker.hairStyle}
        scale={walker.scale}
      />
    </group>
  );
}

export default function Humans() {
  const walkers = useMemo<Walker[]>(() => {
    const random = seeded(613);
    const pick = <T,>(list: T[]) => list[Math.floor(random() * list.length)];
    return Array.from({ length: 11 }, (_, index) => ({
      pathIndex: index % PATHS.length,
      speed: 1.05 + random() * 0.55,
      offset: index * 9.7 + random() * 4,
      shirt: pick(SHIRTS),
      trousers: pick(TROUSERS),
      skin: pick(SKINS),
      hair: pick(HAIRS),
      hairStyle: pick(HAIR_STYLES),
      scale: 0.94 + random() * 0.12,
    }));
  }, []);

  const groups = useMemo(
    () => [
      { position: [-22, 0.12, -46] as [number, number, number], rotation: 0.5, shirt: '#3f8f62', skin: SKINS[1], hair: HAIRS[0], pose: 'talk' as const },
      { position: [-19.4, 0.12, -46.4] as [number, number, number], rotation: -2.4, shirt: '#e0e2e6', skin: SKINS[3], hair: HAIRS[2], pose: 'talk' as const },
      { position: [12, 0.12, -46] as [number, number, number], rotation: 2.1, shirt: '#c4553f', skin: SKINS[0], hair: HAIRS[1], pose: 'idle' as const },
    ],
    [],
  );

  return (
    <group>
      {walkers.map((walker, index) => (
        <Pedestrian key={index} walker={walker} />
      ))}
      {groups.map((person, index) => (
        <group key={'idle-' + index} position={person.position} rotation={[0, person.rotation, 0]}>
          <Character pose={person.pose} shirt={person.shirt} skin={person.skin} hair={person.hair} trousers="#333b47" />
        </group>
      ))}
    </group>
  );
}