import React from 'react';
import { GlassCard } from '../common/GlassCard';

export const StatCard = ({ title, value, change, icon: Icon, color = 'cyan', subtext }) => {
  const colorMap = {
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      shadow: 'shadow-[0_0_15px_rgba(56,189,248,0.2)]',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    },
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <GlassCard className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono tracking-wider uppercase text-slate-400">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1 group-hover:text-cyan-200 transition-colors">
            {value}
          </h3>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl border ${scheme.bg} ${scheme.border} ${scheme.shadow}`}>
          <Icon className={`w-5 h-5 ${scheme.text}`} />
        </div>
      </div>
      {change && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-medium">{change}</span>
          <span className="text-slate-500 font-mono text-[10px]">Real-Time Sync</span>
        </div>
      )}
    </GlassCard>
  );
};
