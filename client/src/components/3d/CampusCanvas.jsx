import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { HolographicCore } from './HolographicCore';
import { OrbitalNodes } from './OrbitalNodes';
import { CyberGrid } from './CyberGrid';

const CanvasLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-[#070913]/80 backdrop-blur-sm z-10">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-cyan-300 font-mono text-xs tracking-widest uppercase animate-pulse">
        Initializing Spatial 3D Campus Core...
      </p>
    </div>
  </div>
);

export const CampusCanvas = ({ activeNode, onSelectNode }) => {
  return (
    <div className="relative w-full h-[540px] md:h-[640px] lg:h-[720px] select-none">
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          className="cursor-grab active:cursor-grabbing"
        >
          <PerspectiveCamera makeDefault position={[0, 1.4, 7.2]} fov={50} />

          {/* Lighting Rig */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-10, -5, -5]} intensity={0.8} color="#818cf8" />
          <pointLight position={[0, 3, 2]} intensity={2.5} color="#38bdf8" />

          {/* 3D Elements */}
          <HolographicCore />
          <OrbitalNodes activeNode={activeNode} onSelectNode={onSelectNode} />
          <CyberGrid />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minPolarAngle={Math.PI / 4}
            autoRotate
            autoRotateSpeed={0.6}
            dampingFactor={0.05}
          />
        </Canvas>
      </Suspense>

      {/* Interactive Helper Overlay */}
      <div className="absolute bottom-4 right-4 pointer-events-none text-right">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-slate-900/70 border border-slate-700/50 text-cyan-300/80 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          Drag to Rotate • Click Orbit Nodes
        </span>
      </div>
    </div>
  );
};
