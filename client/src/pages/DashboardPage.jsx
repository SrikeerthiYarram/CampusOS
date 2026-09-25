import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { academicAPI, eventAPI, announcementAPI } from '../services/api';
import { StatCard } from '../components/dashboard/StatCard';
import { TimetableWidget } from '../components/dashboard/TimetableWidget';
import { AttendanceRing } from '../components/dashboard/AttendanceRing';
import { UrgentAnnouncements } from '../components/dashboard/UrgentAnnouncements';
import { GlassCard } from '../components/common/GlassCard';
import { Modal } from '../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Flame,
  Briefcase,
  QrCode,
  Sparkles,
  Server,
  CalendarCheck,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [attendancePercentage, setAttendancePercentage] = useState(91.2);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [cRes, aRes] = await Promise.all([
          academicAPI.getCourses(),
          announcementAPI.getAnnouncements({}),
        ]);
        if (cRes.data?.success) setCourses(cRes.data.data);
        if (aRes.data?.success) setAnnouncements(aRes.data.data);
      } catch (err) {
        console.warn('Dashboard fetch fallback:', err.message);
      }
    };
    loadDashboardData();
  }, []);

  const handleCheckIn = async () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#818cf8', '#34d399'],
    });
    setAttendancePercentage((prev) => Math.min(100, Number((prev + 0.5).toFixed(1))));
    setCheckInSuccess(true);
    setTimeout(() => setCheckInSuccess(false), 3500);
  };

  const handleSlurmRequest = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#a855f7', '#38bdf8'],
    });
    alert('⚡ SLURM Job Allocation granted: Node [Cluster-Delta-GPU-04] allocated 4x H100 for 12 hours.');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <GlassCard className="border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-[#0b1329]/80 to-[#120f2e]/90">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-400/50 shadow-glass-glow"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                  Welcome back, {user?.name || 'Alex Chen'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {user?.role === 'admin' ? '🛡️ Admin Clearance' : '🎓 Semester 5 Active'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-1">
                {user?.department || 'Computer Science & Engineering'} • {user?.studentId || 'CP-892144'}
              </p>
            </div>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={() => setShowQRModal(true)}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              Digital ID Pass
            </button>
            <button
              onClick={handleSlurmRequest}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
            >
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              SLURM Cluster
            </button>
          </div>
        </div>

        {checkInSuccess && (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-pulse">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Attendance cryptographic check-in verified! Attendance ratio recalculated.</span>
          </div>
        )}
      </GlassCard>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current CGPA"
          value={user?.cgpa ? `${user.cgpa} / 4.0` : '3.89 / 4.0'}
          change="+0.04 vs last term"
          icon={TrendingUp}
          color="cyan"
          subtext="Top 5% Cohort Ranking"
        />
        <StatCard
          title="Attendance Clearance"
          value={`${attendancePercentage}%`}
          change="Cleared for finals"
          icon={GraduationCap}
          color="emerald"
          subtext="78 / 84 Sessions"
        />
        <StatCard
          title="Registered Courses"
          value="4 Modules"
          change="14 Earned Credits"
          icon={CalendarCheck}
          color="purple"
          subtext="Fall 2026 Semester"
        />
        <StatCard
          title="Hackathons & Squads"
          value="2 Active"
          change="$40,000 in Bounties"
          icon={Flame}
          color="amber"
          subtext="Next: CampusOS Hack"
        />
      </div>

      {/* 3-Column Core Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Today's Timetable */}
        <div className="lg:col-span-1">
          <TimetableWidget courses={courses} />
        </div>

        {/* Column 2: Attendance Radial & Action */}
        <div className="lg:col-span-1">
          <AttendanceRing
            percentage={attendancePercentage}
            attended={78}
            total={84}
            onCheckIn={handleCheckIn}
          />
        </div>

        {/* Column 3: Urgent Transmissions */}
        <div className="lg:col-span-1">
          <UrgentAnnouncements announcements={announcements} />
        </div>
      </div>

      {/* Digital QR ID Pass Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="CampusOS Cryptographic Student ID"
      >
        <div className="text-center space-y-4 py-2">
          <div className="p-4 bg-white rounded-2xl w-fit mx-auto shadow-2xl ring-4 ring-cyan-500/30">
            {/* SVG Simulated QR Matrix */}
            <svg className="w-48 h-48" viewBox="0 0 100 100">
              <rect width="100" height="100" fill="white" />
              {/* Corner markers */}
              <rect x="5" y="5" width="25" height="25" fill="#070913" />
              <rect x="9" y="9" width="17" height="17" fill="white" />
              <rect x="13" y="13" width="9" height="9" fill="#070913" />

              <rect x="70" y="5" width="25" height="25" fill="#070913" />
              <rect x="74" y="9" width="17" height="17" fill="white" />
              <rect x="78" y="13" width="9" height="9" fill="#070913" />

              <rect x="5" y="70" width="25" height="25" fill="#070913" />
              <rect x="9" y="74" width="17" height="17" fill="white" />
              <rect x="13" y="78" width="9" height="9" fill="#070913" />

              {/* Data pattern bars */}
              <rect x="35" y="10" width="10" height="5" fill="#070913" />
              <rect x="50" y="10" width="15" height="5" fill="#070913" />
              <rect x="35" y="20" width="20" height="8" fill="#070913" />
              <rect x="60" y="22" width="5" height="12" fill="#070913" />
              <rect x="10" y="35" width="80" height="4" fill="#070913" />
              <rect x="35" y="45" width="30" height="10" fill="#070913" />
              <rect x="15" y="55" width="70" height="4" fill="#070913" />
              <rect x="35" y="70" width="15" height="8" fill="#070913" />
              <rect x="55" y="70" width="40" height="8" fill="#070913" />
              <rect x="40" y="85" width="30" height="5" fill="#070913" />
            </svg>
          </div>

          <div className="font-mono space-y-1">
            <p className="text-sm font-bold text-white tracking-widest">{user?.studentId || 'CP-892144'}</p>
            <p className="text-xs text-cyan-400 font-semibold">{user?.name || 'Alex Chen'}</p>
            <p className="text-[11px] text-slate-400">{user?.department || 'Computer Science'}</p>
            <p className="text-[10px] text-emerald-400 pt-1 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              NFC & RFID Active • Access Level 4
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
