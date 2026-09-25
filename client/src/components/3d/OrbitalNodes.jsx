import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const NODES_DATA = [
  { id: 'academics', label: 'Academics & Timetable', color: '#38bdf8', radius: 3.2, speed: 0.5, yOffset: 0.4, icon: '🎓' },
  { id: 'hackathons', label: 'Hackathons & Squads', color: '#a855f7', radius: 3.8, speed: -0.4, yOffset: -0.3, icon: '⚡' },
  { id: 'events', label: 'Campus Events & CTF', color: '#f43f5e', radius: 4.4, speed: 0.35, yOffset: 0.6, icon: '🎉' },
  { id: 'internships', label: 'Career Hub & Internships', color: '#10b981', radius: 3.5, speed: -0.6, yOffset: -0.5, icon: '💼' },
  { id: 'clubs', label: 'Student Societies & AI Labs', color: '#fbbf24', radius: 4.8, speed: 0.3, yOffset: 0.2, icon: '🛡️' },
];

const NodeItem = ({ node, activeNode, onSelect }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * node.speed;
    const x = Math.cos(t) * node.radius;
    const z = Math.sin(t) * node.radius;
    const y = node.yOffset + Math.sin(t * 2) * 0.2;

    if (meshRef.current) {
      meshRef.current.position.set(x, y, z);
    }
  });

  const isSelected = activeNode === node.id;

  return (
    <group ref={meshRef}>
      {/* Node Sphere */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        scale={hovered || isSelected ? 1.4 : 1.0}
      >
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered || isSelected ? 2.0 : 0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Orbit Ring Trail */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.35, 32]} />
        <meshBasicMaterial
          color={node.color}
          transparent
          opacity={hovered ? 0.8 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* HTML Tag / Pill on Hover or Selection */}
      {(hovered || isSelected) && (
        <Html distanceFactor={10} position={[0, 0.5, 0]} center>
          <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-400/40 text-white text-xs px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap flex items-center space-x-1.5 pointer-events-none transition-all scale-100">
            <span>{node.icon}</span>
            <span className="font-semibold">{node.label}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

export const OrbitalNodes = ({ activeNode, onSelectNode }) => {
  return (
    <group>
      {NODES_DATA.map((node) => (
        <NodeItem
          key={node.id}
          node={node}
          activeNode={activeNode}
          onSelect={onSelectNode}
        />
      ))}
    </group>
  );
};
