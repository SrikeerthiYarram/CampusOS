import React, { useState, useEffect } from 'react';
import { hackathonAPI } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { Modal } from '../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  Flame,
  Trophy,
  Users,
  Calendar,
  Code2,
  Terminal,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const HackathonsPage = () => {
  const [hackathons, setHackathons] = useState([]);
  const [activeHackathon, setActiveHackathon] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamForm, setTeamForm] = useState({
    teamName: '',
    projectTitle: '',
    techStack: 'React, Node.js, WebGL, AI',
  });
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const res = await hackathonAPI.getHackathons();
      if (res.data?.success) setHackathons(res.data.data);
    } catch (err) {
      console.warn('Hackathons fetch error:', err.message);
    }
  };

  const handleOpenTeamModal = (hackathon) => {
    setActiveHackathon(hackathon);
    setShowTeamModal(true);
    setRegisteredSuccess(false);
  };

  const handleRegisterTeam = async (e) => {
    e.preventDefault();
    if (!activeHackathon) return;

    try {
      const res = await hackathonAPI.joinTeam(activeHackathon._id, teamForm);
      if (res.data?.success) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#38bdf8', '#fbbf24', '#34d399'],
        });

        setRegisteredSuccess(true);
        // Refresh list
        fetchHackathons();
        setTimeout(() => {
          setShowTeamModal(false);
          setRegisteredSuccess(false);
        }, 2200);
      }
    } catch (err) {
      alert(err.message || 'Team registration failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
            <Flame className="w-7 h-7 text-amber-400" />
            <span>Hackathons & Squad Assembly</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build next-generation decentralized and AI applications. Compete for cloud compute bounties and grants.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-xs font-mono text-amber-300">
          <Trophy className="w-3.5 h-3.5" />
          <span>$40,000 Total Prize Pool Active</span>
        </div>
      </div>

      {/* Hackathons Showcase */}
      <div className="space-y-6">
        {hackathons.map((hackathon) => (
          <GlassCard key={hackathon._id} className="relative overflow-hidden group">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Image / Banner */}
              <div className="w-full lg:w-72 h-48 lg:h-auto rounded-xl overflow-hidden relative flex-shrink-0">
                <img
                  src={hackathon.bannerUrl}
                  alt={hackathon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] to-transparent lg:hidden" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-400/40 text-amber-300 backdrop-blur-md">
                  REGISTRATION OPEN
                </span>
              </div>

              {/* Center Content */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Theme: {hackathon.theme}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Squad Size: {hackathon.teamSizeMin}-{hackathon.teamSizeMax} Members
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                  {hackathon.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {hackathon.description}
                </p>

                {/* Key Info Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400 block text-[10px]">PRIZE POOL</span>
                    <span className="text-amber-400 font-bold">{hackathon.prizePool}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400 block text-[10px]">HACKING WINDOW</span>
                    <span className="text-cyan-300 font-bold">{hackathon.startDate}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-400 block text-[10px]">REGISTRATION DEADLINE</span>
                    <span className="text-rose-400 font-bold">{hackathon.registrationDeadline}</span>
                  </div>
                </div>

                {/* Challenge Tracks */}
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                    Challenge Tracks:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hackathon.tracks?.map((track, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/20 text-slate-300"
                      >
                        {track}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right CTA / Squad Stats */}
              <div className="w-full lg:w-56 flex flex-col justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-slate-400">REGISTERED SQUADS</span>
                  <div className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span>{hackathon.teams?.length || 1} Squads</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {hackathon.location}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenTeamModal(hackathon)}
                  className="w-full mt-4 py-2.5 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Assemble Squad
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Assemble Squad Modal */}
      <Modal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        title={`Assemble Squad: ${activeHackathon?.title || 'Hackathon'}`}
      >
        {registeredSuccess ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-heading font-bold text-white">Squad Successfully Registered!</h4>
            <p className="text-xs text-slate-300 font-mono">
              Team credentials and Discord channel invitation issued.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegisterTeam} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                Squad Name
              </label>
              <input
                type="text"
                required
                value={teamForm.teamName}
                onChange={(e) => setTeamForm({ ...teamForm, teamName: e.target.value })}
                placeholder="e.g. CyberNomads or NeuralVoxel"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                Proposed Project Concept
              </label>
              <input
                type="text"
                required
                value={teamForm.projectTitle}
                onChange={(e) => setTeamForm({ ...teamForm, projectTitle: e.target.value })}
                placeholder="e.g. Autonomous SLAM Quadruped Inspection System"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                Tech Stack (Comma Separated)
              </label>
              <input
                type="text"
                required
                value={teamForm.techStack}
                onChange={(e) => setTeamForm({ ...teamForm, techStack: e.target.value })}
                placeholder="PyTorch, Three.js, Rust, Docker"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-xs tracking-wide bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-cyber-button transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Confirm Squad Registration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
