import React from 'react';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
        hoverEffect ? 'glass-card-hover' : ''
      } ${glow ? 'shadow-glass-glow border-cyan-500/30' : ''} ${className}`}
    >
      {/* Subtle top sheen border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      {children}
    </div>
  );
};
