import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Link } from 'react-router-dom';
import { AlertCircle, ChevronRight, Pin } from 'lucide-react';

export const UrgentAnnouncements = ({ announcements = [] }) => {
  const urgentItems = announcements.filter(
    (a) => a.priority === 'urgent' || a.priority === 'high' || a.pinned
  ).slice(0, 3);

  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-heading font-semibold text-white text-sm">Campus Transmissions</h4>
              <p className="text-[11px] text-slate-400 font-mono">Priority & Administrative Bulletins</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/40 text-rose-300 border border-rose-500/30 animate-pulse">
            HIGH CLEARANCE
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {urgentItems.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 font-mono">No critical campus alerts.</p>
          ) : (
            urgentItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {item.pinned && <Pin className="w-3 h-3 text-cyan-400 transform rotate-45 flex-shrink-0" />}
                    <h5 className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {item.title}
                    </h5>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase flex-shrink-0 ${
                      item.priority === 'urgent'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-800/80">
        <Link
          to="/announcements"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between group transition-colors"
        >
          <span>View All Announcements</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </GlassCard>
  );
};
