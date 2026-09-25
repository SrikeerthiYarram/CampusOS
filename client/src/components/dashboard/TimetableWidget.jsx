import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight, User } from 'lucide-react';

export const TimetableWidget = ({ courses = [] }) => {
  // Extract today's schedule or mock Monday schedule
  const todayClasses = [
    {
      code: 'CS-401',
      title: 'Distributed Systems & Cloud Architecture',
      time: '09:00 AM - 10:30 AM',
      room: 'Cyber Hall Alpha',
      instructor: 'Dr. Aris Thorne',
      status: 'Live Now',
      color: 'border-cyan-400 bg-cyan-950/30',
    },
    {
      code: 'CS-320',
      title: 'Cyber Defense & Zero-Trust Cryptography',
      time: '01:00 PM - 02:30 PM',
      room: 'SecOps Lab 1',
      instructor: 'Cmdr. Vance Sterling',
      status: 'Upcoming',
      color: 'border-slate-700 bg-slate-900/40',
    },
    {
      code: 'CS-401 Lab',
      title: 'Distributed Systems Lab (Kafka & Raft)',
      time: '03:00 PM - 05:00 PM',
      room: 'Distributed Systems Lab 3',
      instructor: 'Teaching Fellow',
      status: 'Upcoming',
      color: 'border-slate-700 bg-slate-900/40',
    },
  ];

  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h4 className="font-heading font-semibold text-white text-sm">Today's Class Trajectory</h4>
            <p className="text-[11px] text-slate-400 font-mono">Academic Schedule Grid</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
            Monday Active
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {todayClasses.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${item.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300">{item.code}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    item.status === 'Live Now'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h5 className="text-xs font-semibold text-white mt-1 line-clamp-1">{item.title}</h5>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {item.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-purple-400" />
                  {item.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-800/80">
        <Link
          to="/academics"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between group transition-colors"
        >
          <span>View Weekly Timetable Matrix</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </GlassCard>
  );
};
