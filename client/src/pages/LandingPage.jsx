import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CampusCanvas } from '../components/3d/CampusCanvas';
import { GlassCard } from '../components/common/GlassCard';
import {
  Cpu,
  GraduationCap,
  Flame,
  Briefcase,
  Users2,
  FolderGit2,
  Shield,
  ArrowRight,
  Terminal,
  Zap,
  Globe2,
  Sparkles,
} from 'lucide-react';

const NODE_INFO = {
  academics: {
    title: 'Academics & Spatial Timetable',
    badge: 'Real-Time Sync',
    desc: 'Automated attendance check-in, real-time timetable tracking, syllabus progress charts, and decentralized GPA calculation.',
    path: '/academics',
  },
  hackathons: {
    title: 'Hackathons & Squad Assembly',
    badge: 'Over $40k in Bounties',
    desc: 'Assemble interdisciplinary squads, register project repositories, and participate in collegiate AI and decentralization hackathons.',
    path: '/hackathons',
  },
  events: {
    title: 'Campus Events & CTF Tournaments',
    badge: 'Instant QR Pass',
    desc: 'RSVP to robotics symposiums, capture-the-flag competitions, and creative tech galas with cryptographically verified passes.',
    path: '/events',
  },
  internships: {
    title: 'Career Hub & Research Fellowships',
    badge: 'Top Tier Grants',
    desc: 'Access verified remote & campus research roles in autonomous systems, distributed infrastructure, and deep generative AI.',
    path: '/internships',
  },
  clubs: {
    title: 'Student AI Labs & Societies',
    badge: 'Peer Network',
    desc: 'Join high-impact societies including NeuroTech, ZeroDay Cybersecurity Guild, and the Spatial Computing & XR Foundry.',
    path: '/clubs',
  },
};

export const LandingPage = () => {
  const { isAuthenticated, loginAsStudent, loginAsAdmin } = useAuth();
  const [selectedNode, setSelectedNode] = useState('academics');
  const navigate = useNavigate();

  const handleDemoStudent = async () => {
    await loginAsStudent();
    navigate('/dashboard');
  };

  const handleDemoAdmin = async () => {
    await loginAsAdmin();
    navigate('/admin');
  };

  const activeInfo = NODE_INFO[selectedNode] || NODE_INFO.academics;

  return (
    <div className="relative min-h-screen bg-[#070913] text-slate-100 overflow-hidden">
      {/* Background Radial Glow Meshes */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>CAMPUS KERNEL 2026 • SPATIAL 3D ARCHITECTURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white leading-tight">
            The Operating System for{' '}
            <span className="cyber-gradient-text">Next-Gen Campuses</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Unifying academic workflows, hackathon squad recruitment, high-performance computing allocations, verified student societies, and career intelligence into a single glassmorphic cockpit.
          </p>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyber-button hover:shadow-glass-glow transition-all flex items-center gap-2"
              >
                <span>Enter CampusOS Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <button
                  onClick={handleDemoStudent}
                  className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyber-button hover:shadow-glass-glow transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Launch Student Demo</span>
                </button>

                <button
                  onClick={handleDemoAdmin}
                  className="px-5 py-3 rounded-xl font-semibold text-sm bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/40 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Launch Admin Demo</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3D Interactive Three.js Experience Section */}
        <div className="mt-8 relative rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/50 via-[#070913]/80 to-[#070913] p-2 sm:p-4 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Top Bar for 3D Viewport */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-slate-400 ml-2">spatial_campus_core.glsl</span>
            </div>
            <div className="flex items-center gap-3 text-cyan-400">
              <span className="hidden sm:inline">RENDERER: WEBGL 2.0 / R3F</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                60 FPS LOCKED
              </span>
            </div>
          </div>

          {/* 3D Canvas */}
          <CampusCanvas activeNode={selectedNode} onSelectNode={setSelectedNode} />

          {/* Dynamic 3D Node Inspection Card */}
          <div className="p-4 sm:p-6 bg-slate-900/80 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  Active Orbital Node:
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {activeInfo.badge}
                </span>
              </div>
              <h3 className="text-lg font-heading font-bold text-white mt-0.5">
                {activeInfo.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {activeInfo.desc}
              </p>
            </div>

            <Link
              to={activeInfo.path}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-2 whitespace-nowrap self-stretch sm:self-auto justify-center"
            >
              <span>Explore Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Campus Telemetry Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="text-center py-4" hoverEffect={false}>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-white">14,800+</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Verified Students</p>
          </GlassCard>
          <GlassCard className="text-center py-4" hoverEffect={false}>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-cyan-400">99.98%</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Mesh Grid Uptime</p>
          </GlassCard>
          <GlassCard className="text-center py-4" hoverEffect={false}>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-purple-400">$65,000</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Active Prize Pools</p>
          </GlassCard>
          <GlassCard className="text-center py-4" hoverEffect={false}>
            <p className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-400">32x H100</p>
            <p className="text-xs text-slate-400 font-mono mt-1">SLURM GPU Compute</p>
          </GlassCard>
        </div>

        {/* Feature Grid */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
              Engineered for the Modern Campus
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Every subsystem crafted with glassmorphic depth, sub-second latency, and intuitive modular control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard>
              <div className="p-3 w-fit rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white">Academics & Attendance</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Live timetable trajectories, syllabus progression tracking, and an interactive attendance threshold monitor that alerts you before dipping below 75%.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="p-3 w-fit rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white">Hackathons & Squad Match</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Form multi-disciplinary squads, match with developers and UI designers, register repositories, and compete for grants and cloud allocations.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="p-3 w-fit rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white">Career Hub & Internships</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Direct access to high-paying internships, research fellowships, and verified tech company roles with instant single-click profile applications.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4">
                <Users2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white">Clubs & AI Guilds</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Explore student organizations from NeuroTech AI to ZeroDay Cybersecurity. One-click membership joins, meeting syncs, and discord links.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="p-3 w-fit rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-4">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white">Past Papers & Study Vault</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Decentralized repository of verified midterm examination solutions, lecture slides, lab manuals, and GPU shader boilerplate cheatsheets.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="p-3 w-fit rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-heading font-bold text-white">Role-Based Admin Command</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Granular administrative oversight: system telemetry, campus-wide broadcast composer, user role governance, and event verification.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
};
