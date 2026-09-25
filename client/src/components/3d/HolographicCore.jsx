import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const HolographicCore = () => {
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const coreIcosaRef = useRef();
  const wireCubeRef = useRef();

  useFrame((state, delta) => {
    // Smooth multi-axis rotations
    if (coreIcosaRef.current) {
      coreIcosaRef.current.rotation.y += delta * 0.4;
      coreIcosaRef.current.rotation.x += delta * 0.2;
    }
    if (wireCubeRef.current) {
      wireCubeRef.current.rotation.y -= delta * 0.25;
      wireCubeRef.current.rotation.z += delta * 0.15;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.3;
      outerRingRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.35;
      innerRingRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.6) * 0.4;
    }
  });

  return (
    <group position={[0, 0.4, 0]}>
      {/* Central Glowing Icosahedron */}
      <mesh ref={coreIcosaRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Outer Crystalline Wireframe Cage */}
      <mesh ref={wireCubeRef}>
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#7c3aed"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Gyroscopic Energy Ring 1 */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.2, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>

      {/* Gyroscopic Energy Ring 2 */}
      <mesh ref={innerRingRef} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.0, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#818cf8"
          emissiveIntensity={1.0}
          roughness={0.1}
        />
      </mesh>

      {/* Core Point Light for Inner Glow */}
      <pointLight color="#38bdf8" intensity={3} distance={6} />
      <pointLight color="#a855f7" intensity={2} distance={8} position={[0, 1, 0]} />
    </group>
  );
};
