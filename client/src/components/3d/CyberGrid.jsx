import React from 'react';
import { Sparkles } from '@react-three/drei';

export const CyberGrid = () => {
  return (
    <group position={[0, -2, 0]}>
      {/* Dynamic Cyber Grid Floor */}
      <gridHelper
        args={[30, 30, '#38bdf8', '#1e293b']}
        position={[0, 0, 0]}
      />

      {/* Floating Holographic Ambient Sparks / Data Particles */}
      <Sparkles
        count={80}
        scale={[12, 6, 12]}
        size={2.5}
        speed={0.4}
        color="#38bdf8"
      />
      <Sparkles
        count={50}
        scale={[10, 5, 10]}
        size={2.0}
        speed={0.3}
        color="#a855f7"
      />
    </group>
  );
};
