import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type CharacterPose = 'walk' | 'run' | 'idle' | 'sit' | 'type' | 'talk';
export type HairStyle = 'short' | 'buzz' | 'bun' | 'long' | 'ponytail';

export interface CharacterProps {
  pose?: CharacterPose;
  shirt?: string;
  trousers?: string;
  skin?: string;
  hair?: string;
  shoes?: string;
  hairStyle?: HairStyle;
  scale?: number;
  speed?: number;
  /** Travelled distance in metres, shared with the walking code so feet never slide. */
  distanceRef?: { d: number };
  /** Offsets the idle cycle so co-workers never move in lockstep. */
  phase?: number;
}

const MATERIALS = new Map<string, THREE.MeshStandardMaterial>();

function materialFor(color: string, roughness: number, metalness = 0.04) {
  const key = color + '|' + roughness + '|' + metalness;
  const cached = MATERIALS.get(key);
  if (cached) return cached;
  const material = new THREE.MeshStandardMaterial({ color, roughness, metalness });
  MATERIALS.set(key, material);
  return material;
}

const HIP_HEIGHT = 0.92;
const STRIDE = 0.92;

export default function Character({
  pose = 'idle',
  shirt = '#3f6fd8',
  trousers = '#2c3646',
  skin = '#d8a87c',
  hair = '#241d18',
  shoes = '#1b1f26',
  hairStyle = 'short',
  scale = 1,
  speed = 1.3,
  distanceRef,
  phase = 0,
}: CharacterProps) {
  const hips = useRef<THREE.Group>(null);
  const spine = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const thighL = useRef<THREE.Group>(null);
  const thighR = useRef<THREE.Group>(null);
  const kneeL = useRef<THREE.Group>(null);
  const kneeR = useRef<THREE.Group>(null);
  const footL = useRef<THREE.Group>(null);
  const footR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const foreL = useRef<THREE.Group>(null);
  const foreR = useRef<THREE.Group>(null);
  const travelled = useRef(0);

  const shirtMat = useMemo(() => materialFor(shirt, 0.86), [shirt]);
  const trouserMat = useMemo(() => materialFor(trousers, 0.9), [trousers]);
  const skinMat = useMemo(() => materialFor(skin, 0.62), [skin]);
  const hairMat = useMemo(() => materialFor(hair, 0.92), [hair]);
  const shoeMat = useMemo(() => materialFor(shoes, 0.55, 0.12), [shoes]);
  const eyeMat = useMemo(() => materialFor('#1d1a19', 0.3), []);
  const lipMat = useMemo(() => materialFor('#a4614f', 0.55), []);

  const headGeometry = useMemo(() => {
    const skull = new THREE.SphereGeometry(0.116, 22, 16);
    skull.scale(0.93, 1.06, 0.99);
    const jaw = new THREE.SphereGeometry(0.09, 18, 12);
    jaw.scale(0.86, 0.72, 0.92);
    jaw.translate(0, -0.062, 0.014);
    const nose = new THREE.SphereGeometry(0.026, 10, 8);
    nose.scale(0.72, 1.18, 0.92);
    nose.translate(0, -0.016, 0.108);
    const ear = new THREE.SphereGeometry(0.033, 10, 8);
    ear.scale(0.4, 1, 0.78);
    ear.translate(-0.107, 0.002, 0.004);
    const ear2 = ear.clone();
    ear2.translate(0.214, 0, 0);
    return mergeGeometries([skull, jaw, nose, ear, ear2]) ?? skull;
  }, []);

  const torsoGeometry = useMemo(() => {
    const trunk = new THREE.CylinderGeometry(0.178, 0.148, 0.42, 20, 1);
    trunk.translate(0, 0.21, 0);
    const shoulders = new THREE.SphereGeometry(0.184, 20, 12);
    shoulders.scale(1.14, 0.74, 0.82);
    shoulders.translate(0, 0.41, 0);
    const hipsBlock = new THREE.CylinderGeometry(0.155, 0.145, 0.16, 18, 1);
    hipsBlock.translate(0, -0.02, 0);
    return mergeGeometries([trunk, shoulders]) ?? trunk;
  }, []);

  const hairGeometry = useMemo(() => {
    const cap = new THREE.SphereGeometry(0.123, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.58);
    if (hairStyle === 'buzz') {
      cap.scale(1.005, 0.86, 1.005);
      cap.translate(0, 0.006, 0);
      return cap;
    }
    cap.translate(0, 0.004, 0);
    if (hairStyle === 'bun') {
      const knot = new THREE.SphereGeometry(0.056, 14, 10);
      knot.translate(0, 0.055, -0.108);
      return mergeGeometries([cap, knot]) ?? cap;
    }
    if (hairStyle === 'ponytail') {
      const tail = new THREE.SphereGeometry(0.05, 14, 10);
      tail.scale(0.8, 1.5, 0.8);
      tail.translate(0, -0.06, -0.132);
      return mergeGeometries([cap, tail]) ?? cap;
    }
    if (hairStyle === 'long') {
      const mass = new THREE.SphereGeometry(0.118, 16, 12);
      mass.scale(1.02, 1.02, 0.72);
      mass.translate(0, -0.055, -0.038);
      return mergeGeometries([cap, mass]) ?? cap;
    }
    return cap;
  }, [hairStyle]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime + phase;
    let distance = 0;
    if (pose === 'walk' || pose === 'run') {
      if (distanceRef) distance = distanceRef.d;
      else {
        travelled.current += speed * delta;
        distance = travelled.current;
      }
    }

    const hipBase = pose === 'sit' || pose === 'type' ? HIP_HEIGHT - 0.44 : HIP_HEIGHT;
    const cycle = (distance / STRIDE) * Math.PI * 2;
    const amplitude = pose === 'run' ? 0.86 : 0.5;
    const swing = Math.sin(cycle);
    const other = Math.sin(cycle + Math.PI);

    if (hips.current) {
      hips.current.position.y = hipBase + (pose === 'walk' || pose === 'run' ? Math.abs(Math.cos(cycle)) * 0.024 - 0.012 : 0);
      hips.current.rotation.z = pose === 'walk' || pose === 'run' ? swing * 0.035 : 0;
    }

    if (pose === 'walk' || pose === 'run') {
      if (thighL.current) thighL.current.rotation.x = swing * amplitude;
      if (thighR.current) thighR.current.rotation.x = other * amplitude;
      if (kneeL.current) kneeL.current.rotation.x = Math.max(0, -Math.sin(cycle + 0.7)) * 1.25;
      if (kneeR.current) kneeR.current.rotation.x = Math.max(0, -Math.sin(cycle + 0.7 + Math.PI)) * 1.25;
      if (footL.current) footL.current.rotation.x = -thighL.current!.rotation.x * 0.45 - (kneeL.current?.rotation.x ?? 0) * 0.4;
      if (footR.current) footR.current.rotation.x = -thighR.current!.rotation.x * 0.45 - (kneeR.current?.rotation.x ?? 0) * 0.4;
      if (armL.current) {
        armL.current.rotation.x = other * 0.44;
        armL.current.rotation.z = 0.1;
      }
      if (armR.current) {
        armR.current.rotation.x = swing * 0.44;
        armR.current.rotation.z = -0.1;
      }
      if (foreL.current) foreL.current.rotation.x = 0.3 + Math.max(0, -other) * 0.42;
      if (foreR.current) foreR.current.rotation.x = 0.3 + Math.max(0, -swing) * 0.42;
      if (spine.current) {
        spine.current.rotation.x = pose === 'run' ? 0.12 : 0.03;
        spine.current.rotation.y = -swing * 0.08;
      }
      if (head.current) head.current.rotation.y = swing * 0.05;
      return;
    }

    if (spine.current) spine.current.rotation.y = 0;

    if (pose === 'sit' || pose === 'type') {
      const knee = pose === 'type' ? 1.5 : 1.42;
      if (thighL.current) thighL.current.rotation.x = -1.45;
      if (thighR.current) thighR.current.rotation.x = -1.45;
      if (kneeL.current) kneeL.current.rotation.x = knee;
      if (kneeR.current) kneeR.current.rotation.x = knee;
      if (footL.current) footL.current.rotation.x = -0.12;
      if (footR.current) footR.current.rotation.x = -0.12;
      if (spine.current) {
        spine.current.rotation.x = 0.05 + Math.sin(time * 1.3) * 0.008;
      }
      if (pose === 'type') {
        if (armL.current) {
          armL.current.rotation.x = -0.62 + Math.sin(time * 9) * 0.03;
          armL.current.rotation.z = 0.16;
        }
        if (armR.current) {
          armR.current.rotation.x = -0.62 + Math.sin(time * 9 + 2.2) * 0.03;
          armR.current.rotation.z = -0.16;
        }
        if (foreL.current) foreL.current.rotation.x = -1.02 + Math.sin(time * 11) * 0.07;
        if (foreR.current) foreR.current.rotation.x = -1.02 + Math.sin(time * 11 + 1.4) * 0.07;
        if (head.current) {
          head.current.rotation.x = 0.14 + Math.sin(time * 1.1) * 0.02;
          head.current.rotation.y = Math.sin(time * 0.45) * 0.08;
        }
      } else {
        if (armL.current) {
          armL.current.rotation.x = -0.2;
          armL.current.rotation.z = 0.12;
        }
        if (armR.current) {
          armR.current.rotation.x = -0.2;
          armR.current.rotation.z = -0.12;
        }
        if (foreL.current) foreL.current.rotation.x = -0.75;
        if (foreR.current) foreR.current.rotation.x = -0.75;
      }
      return;
    }

    if (pose === 'talk') {
      const gesture = Math.sin(time * 1.9);
      if (thighL.current) thighL.current.rotation.x = 0;
      if (thighR.current) thighR.current.rotation.x = 0;
      if (kneeL.current) kneeL.current.rotation.x = 0.05;
      if (kneeR.current) kneeR.current.rotation.x = 0.05;
      if (footL.current) footL.current.rotation.x = 0;
      if (footR.current) footR.current.rotation.x = 0;
      if (armL.current) {
        armL.current.rotation.x = -0.16 + gesture * 0.12;
        armL.current.rotation.z = 0.14;
      }
      if (armR.current) {
        armR.current.rotation.x = -0.42 + gesture * 0.34;
        armR.current.rotation.z = -0.26 - gesture * 0.12;
      }
      if (foreL.current) foreL.current.rotation.x = -0.32;
      if (foreR.current) foreR.current.rotation.x = -1.05 + gesture * 0.3;
      if (spine.current) spine.current.rotation.x = Math.sin(time * 1.6) * 0.02;
      if (head.current) {
        head.current.rotation.y = Math.sin(time * 0.8) * 0.18;
        head.current.rotation.x = Math.sin(time * 1.7) * 0.04;
      }
      return;
    }

    const breath = Math.sin(time * 1.5);
    if (thighL.current) thighL.current.rotation.x = 0;
    if (thighR.current) thighR.current.rotation.x = 0;
    if (kneeL.current) kneeL.current.rotation.x = 0.04;
    if (kneeR.current) kneeR.current.rotation.x = 0.04;
    if (footL.current) footL.current.rotation.x = 0;
    if (footR.current) footR.current.rotation.x = 0;
    if (armL.current) {
      armL.current.rotation.x = breath * 0.03;
      armL.current.rotation.z = 0.11;
    }
    if (armR.current) {
      armR.current.rotation.x = -breath * 0.03;
      armR.current.rotation.z = -0.11;
    }
    if (foreL.current) foreL.current.rotation.x = 0.18;
    if (foreR.current) foreR.current.rotation.x = 0.18;
    if (spine.current) spine.current.rotation.x = breath * 0.014;
    if (head.current) {
      head.current.rotation.y = Math.sin(time * 0.35) * 0.28;
      head.current.rotation.x = Math.sin(time * 0.55) * 0.03;
    }
  });

  return (
    <group scale={scale}>
      <group ref={hips} position={[0, HIP_HEIGHT, 0]}>
        <mesh position={[0, -0.03, 0]} castShadow material={trouserMat}>
          <capsuleGeometry args={[0.135, 0.13, 6, 14]} />
        </mesh>

        <group ref={spine} position={[0, 0.05, 0]}>
          <mesh geometry={torsoGeometry} castShadow material={shirtMat} />
          <mesh position={[0, 0.47, 0]} castShadow material={skinMat}>
            <cylinderGeometry args={[0.052, 0.062, 0.1, 12]} />
          </mesh>

          <group ref={head} position={[0, 0.59, 0.005]}>
            <mesh geometry={headGeometry} castShadow material={skinMat} />
            <mesh position={[-0.044, 0.026, 0.108]} material={eyeMat}>
              <sphereGeometry args={[0.0145, 10, 8]} />
            </mesh>
            <mesh position={[0.044, 0.026, 0.108]} material={eyeMat}>
              <sphereGeometry args={[0.0145, 10, 8]} />
            </mesh>
            <mesh position={[0, -0.062, 0.093]} material={lipMat}>
              <boxGeometry args={[0.05, 0.014, 0.014]} />
            </mesh>
            <mesh geometry={hairGeometry} castShadow material={hairMat} />
          </group>

          <group ref={armL} position={[-0.196, 0.4, 0]}>
            <mesh position={[0, -0.145, 0]} castShadow material={shirtMat}>
              <capsuleGeometry args={[0.052, 0.2, 5, 12]} />
            </mesh>
            <group ref={foreL} position={[0, -0.29, 0]}>
              <mesh position={[0, -0.125, 0]} castShadow material={shirtMat}>
                <capsuleGeometry args={[0.044, 0.17, 5, 12]} />
              </mesh>
              <mesh position={[0, -0.255, 0.012]} castShadow material={skinMat}>
                <boxGeometry args={[0.058, 0.11, 0.042]} />
              </mesh>
            </group>
          </group>

          <group ref={armR} position={[0.196, 0.4, 0]}>
            <mesh position={[0, -0.145, 0]} castShadow material={shirtMat}>
              <capsuleGeometry args={[0.052, 0.2, 5, 12]} />
            </mesh>
            <group ref={foreR} position={[0, -0.29, 0]}>
              <mesh position={[0, -0.125, 0]} castShadow material={shirtMat}>
                <capsuleGeometry args={[0.044, 0.17, 5, 12]} />
              </mesh>
              <mesh position={[0, -0.255, 0.012]} castShadow material={skinMat}>
                <boxGeometry args={[0.058, 0.11, 0.042]} />
              </mesh>
            </group>
          </group>
        </group>

        <group ref={thighL} position={[-0.093, -0.02, 0]}>
          <mesh position={[0, -0.225, 0]} castShadow material={trouserMat}>
            <capsuleGeometry args={[0.076, 0.34, 5, 12]} />
          </mesh>
          <group ref={kneeL} position={[0, -0.45, 0]}>
            <mesh position={[0, -0.195, 0]} castShadow material={trouserMat}>
              <capsuleGeometry args={[0.062, 0.3, 5, 12]} />
            </mesh>
            <group ref={footL} position={[0, -0.39, 0]}>
              <mesh position={[0, -0.045, 0.055]} castShadow material={shoeMat}>
                <boxGeometry args={[0.098, 0.062, 0.245]} />
              </mesh>
              <mesh position={[0, -0.045, 0.165]} castShadow material={shoeMat}>
                <sphereGeometry args={[0.049, 10, 8]} />
              </mesh>
            </group>
          </group>
        </group>

        <group ref={thighR} position={[0.093, -0.02, 0]}>
          <mesh position={[0, -0.225, 0]} castShadow material={trouserMat}>
            <capsuleGeometry args={[0.076, 0.34, 5, 12]} />
          </mesh>
          <group ref={kneeR} position={[0, -0.45, 0]}>
            <mesh position={[0, -0.195, 0]} castShadow material={trouserMat}>
              <capsuleGeometry args={[0.062, 0.3, 5, 12]} />
            </mesh>
            <group ref={footR} position={[0, -0.39, 0]}>
              <mesh position={[0, -0.045, 0.055]} castShadow material={shoeMat}>
                <boxGeometry args={[0.098, 0.062, 0.245]} />
              </mesh>
              <mesh position={[0, -0.045, 0.165]} castShadow material={shoeMat}>
                <sphereGeometry args={[0.049, 10, 8]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
