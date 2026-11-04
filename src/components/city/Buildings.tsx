import { useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { useCityStore } from '../../store/cityStore';
import { useFacade } from '../../lib/facade';
import Headquarters from './Headquarters';
import Park from './Park';

function useNightIntensity() {
  return useCityStore((state) =>
    state.lightingMode === 'night' ? 1.3 : state.lightingMode === 'sunset' ? 0.45 : 0.05,
  );
}

function Selectable({ id, position, size, children }: { id: string; position: [number, number, number]; size: number; children: ReactNode }) {
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const selected = useCityStore((state) => state.selectedBuildingId === id);
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        selectBuilding(id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {children}
      {(selected || hovered) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.16, 0]}>
          <ringGeometry args={[size * 0.86, size, 48]} />
          <meshBasicMaterial color="#7ee787" transparent opacity={selected ? 0.8 : 0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function Plinth({ w, d, color = '#c9c3b4' }: { w: number; d: number; color?: string }) {
  return (
    <mesh position={[0, 0.28, 0]} receiveShadow castShadow>
      <boxGeometry args={[w, 0.56, d]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function DevLab() {
  const lit = useNightIntensity();
  const facade = useFacade({ cols: 4, rows: 6, wall: '#3c4a61', glass: '#9dc0ee', lit: '#cfe4ff' });
  return (
    <group>
      <Plinth w={16} d={16} />
      <mesh position={[-3.6, 4.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.4, 8.6, 12]} />
        <meshStandardMaterial map={facade.map} emissiveMap={facade.emissiveMap} emissive="#ffffff" emissiveIntensity={lit} roughness={0.42} metalness={0.32} />
      </mesh>
      <mesh position={[4, 6.9, -1.6]} castShadow receiveShadow>
        <boxGeometry args={[6.4, 13.2, 8.6]} />
        <meshStandardMaterial map={facade.map} emissiveMap={facade.emissiveMap} emissive="#ffffff" emissiveIntensity={lit} roughness={0.42} metalness={0.32} />
      </mesh>
      <mesh position={[4, 13.7, -1.6]} castShadow>
        <boxGeometry args={[4.4, 0.5, 5.4]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
      <mesh position={[4, 15.8, -1.6]}>
        <cylinderGeometry args={[0.07, 0.07, 4, 6]} />
        <meshStandardMaterial color="#8d99a8" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[4, 17.9, -1.6]}>
        <sphereGeometry args={[0.22, 10, 8]} />
        <meshStandardMaterial color="#7ee787" emissive="#7ee787" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[-3.6, 1.7, 6.1]} castShadow>
        <boxGeometry args={[4, 3.4, 0.3]} />
        <meshStandardMaterial color="#1d2633" roughness={0.45} metalness={0.25} />
      </mesh>
      <mesh position={[-3.6, 3.6, 6.8]} castShadow>
        <boxGeometry args={[5.2, 0.24, 1.8]} />
        <meshStandardMaterial color="#d7d2c6" roughness={0.85} />
      </mesh>
    </group>
  );
}

function CreativeStudio() {
  const lit = useNightIntensity();
  const facade = useFacade({ cols: 4, rows: 4, wall: '#c68d6c', glass: '#f4dcc6', lit: '#ffd7a6' });
  return (
    <group>
      <Plinth w={15} d={15} />
      <mesh position={[-2.6, 2.9, 1]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 5.8, 10]} />
        <meshStandardMaterial color="#c68d6c" roughness={0.85} />
      </mesh>
      <mesh position={[3.8, 4.6, -2.2]} castShadow receiveShadow>
        <boxGeometry args={[6.6, 9.2, 7.4]} />
        <meshStandardMaterial map={facade.map} emissiveMap={facade.emissiveMap} emissive="#ffffff" emissiveIntensity={lit} roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[3.8, 9.35, -2.2]} castShadow>
        <boxGeometry args={[7, 0.3, 7.8]} />
        <meshStandardMaterial color="#e8e2d6" roughness={0.9} />
      </mesh>
      <mesh position={[3.8, 10, -2.2]} castShadow>
        <boxGeometry args={[2.6, 1, 2.6]} />
        <meshStandardMaterial color="#2f3b4a" roughness={0.6} />
      </mesh>
      <mesh position={[-2.6, 6.2, 1]} castShadow>
        <boxGeometry args={[8.8, 0.3, 10.4]} />
        <meshStandardMaterial color="#e8e2d6" roughness={0.9} />
      </mesh>
      <mesh position={[-2.6, 1.6, 6.2]} castShadow>
        <boxGeometry args={[3.4, 3.2, 0.3]} />
        <meshStandardMaterial color="#3a2f27" roughness={0.6} />
      </mesh>
      <mesh position={[-2.6, 4.4, 6.6]}>
        <boxGeometry args={[4.4, 0.8, 0.2]} />
        <meshStandardMaterial color="#ffcf8a" emissive="#ffcf8a" emissiveIntensity={lit * 0.8 + 0.1} />
      </mesh>
    </group>
  );
}

function DataCenter() {
  const lit = useNightIntensity();
  const facade = useFacade({ cols: 8, rows: 2, wall: '#7d8794', glass: '#b9c6d6', lit: '#cfe4ff', litRatio: 0.7 });
  return (
    <group>
      <Plinth w={18} d={12} />
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[17, 4.6, 11]} />
        <meshStandardMaterial map={facade.map} emissiveMap={facade.emissiveMap} emissive="#ffffff" emissiveIntensity={lit * 0.7} roughness={0.6} metalness={0.35} />
      </mesh>
      {[-6.4, -3.2, 0, 3.2, 6.4].map((x) => (
        <mesh key={x} position={[x, 2.6, 5.7]} castShadow>
          <boxGeometry args={[1.5, 3.6, 0.4]} />
          <meshStandardMaterial color="#5f6875" roughness={0.7} metalness={0.4} />
        </mesh>
      ))}
      {[-4.4, 0, 4.4].map((x) => (
        <group key={x} position={[x, 5.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 0.9, 3.2]} />
            <meshStandardMaterial color="#9aa4b1" roughness={0.6} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 0.24, 18]} />
            <meshStandardMaterial color="#3b434f" roughness={0.7} metalness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Cafe() {
  const lit = useNightIntensity();
  return (
    <group>
      <Plinth w={11} d={11} color="#d8cbb4" />
      <mesh position={[0, 2.2, -1]} castShadow receiveShadow>
        <boxGeometry args={[8.6, 4, 7.4]} />
        <meshStandardMaterial color="#e4d5bb" roughness={0.85} />
      </mesh>
      <mesh position={[0, 4.5, -1]} castShadow>
        <boxGeometry args={[9.2, 0.4, 8]} />
        <meshStandardMaterial color="#7a5c43" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.4, 2.9]}>
        <boxGeometry args={[6.4, 2.4, 0.2]} />
        <meshStandardMaterial color="#f2e6d1" emissive="#ffd8a0" emissiveIntensity={lit * 0.9 + 0.05} roughness={0.4} />
      </mesh>
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[i * 2.1, 3.1, 3.4]} rotation={[0.24, 0, 0]} castShadow>
          <boxGeometry args={[2, 0.14, 1.8]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#c25b4a' : '#f3e9d6'} roughness={0.9} />
        </mesh>
      ))}
      {[-3.6, 3.6].map((x) => (
        <group key={x} position={[x, 0, 5.4]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.7, 0.7, 0.1, 16]} />
            <meshStandardMaterial color="#f1eadd" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.56, 8]} />
            <meshStandardMaterial color="#3b3630" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[1.4, 1.4, 0.12, 18]} />
            <meshStandardMaterial color="#c25b4a" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function House() {
  const lit = useNightIntensity();
  return (
    <group>
      <Plinth w={13} d={13} color="#cfcfc0" />
      <mesh position={[-1, 1.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.2, 3.4, 6.4]} />
        <meshStandardMaterial color="#f0ebe0" roughness={0.9} />
      </mesh>
      <mesh position={[-1, 4.3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[5.4, 5.4, 6.8]} />
        <meshStandardMaterial color="#7c4a3c" roughness={0.9} />
      </mesh>
      <mesh position={[-1, 1.5, 3.3]}>
        <boxGeometry args={[1.6, 2.4, 0.2]} />
        <meshStandardMaterial color="#4a4038" roughness={0.7} />
      </mesh>
      {[-3.2, 1.2].map((x) => (
        <mesh key={x} position={[x, 2.2, 3.3]}>
          <boxGeometry args={[1.2, 1.1, 0.16]} />
          <meshStandardMaterial color="#ffe6b0" emissive="#ffdb9a" emissiveIntensity={lit * 0.9 + 0.05} roughness={0.4} />
        </mesh>
      ))}
      {[-4.2, 4.2].map((z) => (
        <mesh key={z} position={[0, 0.9, z]} castShadow>
          <boxGeometry args={[12, 1.4, 0.16]} />
          <meshStandardMaterial color="#e2ded2" roughness={0.9} />
        </mesh>
      ))}
      <group position={[3.6, 0, 3.2]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.2, 1.8, 8]} />
          <meshStandardMaterial color="#6a5136" roughness={0.95} />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow>
          <sphereGeometry args={[1.15, 14, 10]} />
          <meshStandardMaterial color="#5f8a52" roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

function ContactCenter() {
  const lit = useNightIntensity();
  return (
    <group>
      <Plinth w={11} d={11} />
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 4, 7]} />
        <meshStandardMaterial color="#4a5a6d" roughness={0.6} metalness={0.25} />
      </mesh>
      <mesh position={[0, 2.6, 3.55]}>
        <boxGeometry args={[5.6, 2.4, 0.2]} />
        <meshStandardMaterial color="#2b3a4c" emissive="#7ee787" emissiveIntensity={lit * 0.6 + 0.35} roughness={0.3} />
      </mesh>
      <mesh position={[2.2, 6.5, -2]} castShadow>
        <boxGeometry args={[0.5, 9, 0.5]} />
        <meshStandardMaterial color="#8d99a8" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[2.2, 11.2, -2]}>
        <boxGeometry args={[3.6, 1.6, 0.24]} />
        <meshStandardMaterial color="#7ee787" emissive="#7ee787" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

export default function Buildings() {
  return (
    <>
      <Selectable id="headquarters" position={[0, 0, 0]} size={12}>
        <Headquarters />
      </Selectable>
      <Selectable id="devlab" position={[30, 0, -30]} size={9}>
        <DevLab />
      </Selectable>
      <Selectable id="studio" position={[-30, 0, -30]} size={9}>
        <CreativeStudio />
      </Selectable>
      <Selectable id="datacenter" position={[-30, 0, 30]} size={10}>
        <DataCenter />
      </Selectable>
      <Selectable id="cafe" position={[30, 0, 30]} size={7}>
        <Cafe />
      </Selectable>
      <Selectable id="house" position={[52, 0, 0]} size={7}>
        <House />
      </Selectable>
      <Selectable id="contact" position={[-52, 0, 0]} size={7}>
        <ContactCenter />
      </Selectable>
      <Selectable id="park" position={[-16, 0, -52]} size={13}>
        <Park />
      </Selectable>
    </>
  );
}
