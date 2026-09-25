import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AttendanceRing = ({
  percentage = 91.2,
  attended = 78,
  total = 84,
  onCheckIn,
}) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isSafe = percentage >= 75;

  return (
    <GlassCard className="flex flex-col justify-between h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h4 className="font-heading font-semibold text-white text-sm">Attendance Clearance</h4>
          <p className="text-[11px] text-slate-400 font-mono">Minimum 75% Requirement</p>
        </div>
        <span
          className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border ${
            isSafe
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {isSafe ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          {isSafe ? 'Cleared' : 'Warning'}
        </span>
      </div>

      <div className="flex items-center justify-center py-4 relative">
        <svg className="w-36 h-36 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800"
            fill="transparent"
          />
          {/* Foreground progress circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="url(#attendanceGradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-heading font-extrabold text-white">
            {percentage}%
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Overall Ratio</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-3">
          <span>Sessions:</span>
          <span className="text-white font-semibold">{attended} / {total} attended</span>
        </div>

        <button
          onClick={onCheckIn}
          className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Mark Session Attendance
        </button>
      </div>
    </GlassCard>
  );
};
