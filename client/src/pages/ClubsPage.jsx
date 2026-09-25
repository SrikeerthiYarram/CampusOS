import React, { useState, useEffect } from 'react';
import { clubAPI } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { Modal } from '../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  Users2,
  Calendar,
  MessageSquare,
  Github,
  PlusCircle,
  UserCheck,
  UserPlus,
  Sparkles,
  Search,
} from 'lucide-react';

export const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [proposeForm, setProposeForm] = useState({
    name: '',
    category: 'Technical',
    tagline: '',
    description: '',
  });

  const categories = ['All', 'Technical', 'Robotics & AI', 'Cybersecurity', 'Arts & Design'];

  useEffect(() => {
    fetchClubs();
  }, [activeCategory]);

  const fetchClubs = async () => {
    try {
      const res = await clubAPI.getClubs({ category: activeCategory });
      if (res.data?.success) setClubs(res.data.data);
    } catch (err) {
      console.warn('Clubs fetch error:', err.message);
    }
  };

  const handleToggleJoin = async (club) => {
    try {
      const res = await clubAPI.toggleJoin(club._id);
      if (res.data?.success) {
        if (res.data.isMember) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#38bdf8', '#818cf8', '#a855f7'],
          });
        }
        setClubs((prev) =>
          prev.map((c) =>
            c._id === club._id
              ? {
                  ...c,
                  isMember: res.data.isMember,
                  membersCount: res.data.membersCount,
                }
              : c
          )
        );
      }
    } catch (err) {
      alert(err.message || 'Error updating membership');
    }
  };

  const handleProposeClub = async (e) => {
    e.preventDefault();
    try {
      const res = await clubAPI.createClub({
        ...proposeForm,
        lead: { name: 'Student Proposer', email: 'proposer@campusos.edu' },
      });
      if (res.data?.success) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
        fetchClubs();
        setShowProposeModal(false);
        setProposeForm({ name: '', category: 'Technical', tagline: '', description: '' });
      }
    } catch (err) {
      alert(err.message || 'Club proposal failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
            <Users2 className="w-7 h-7 text-purple-400" />
            <span>Clubs & AI Guilds Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Student societies, autonomous flight labs, ethical hacking guilds, and spatial interfaces collective.
          </p>
        </div>

        <button
          onClick={() => setShowProposeModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Propose Society
        </button>
      </div>

      {/* Categories */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clubs.map((club) => (
          <GlassCard key={club._id} className="flex flex-col justify-between group overflow-hidden">
            <div>
              {/* Header with Logo and Banner */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={club.logoUrl}
                    alt={club.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-purple-500/40 p-0.5 bg-slate-900"
                  />
                  <div>
                    <h3 className="text-base sm:text-lg font-heading font-bold text-white group-hover:text-purple-300 transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-[11px] text-cyan-400 font-mono">{club.tagline}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 whitespace-nowrap">
                  {club.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                {club.description}
              </p>

              {/* Meeting Schedule */}
              <div className="mt-4 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  {club.meetingsSchedule}
                </span>
                <span className="text-white font-bold">{club.membersCount} Members</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {club.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              {/* Social Links */}
              <div className="flex items-center space-x-2">
                {club.socialLinks?.discord && (
                  <a
                    href={club.socialLinks.discord}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                )}
                {club.socialLinks?.github && (
                  <a
                    href={club.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>

              <button
                onClick={() => handleToggleJoin(club)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  club.isMember
                    ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-500/40'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                }`}
              >
                {club.isMember ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Member (Leave)</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Join Society</span>
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Propose Society Modal */}
      <Modal
        isOpen={showProposeModal}
        onClose={() => setShowProposeModal(false)}
        title="Propose New Student Society"
      >
        <form onSubmit={handleProposeClub} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Society / Club Name
            </label>
            <input
              type="text"
              required
              value={proposeForm.name}
              onChange={(e) => setProposeForm({ ...proposeForm, name: e.target.value })}
              placeholder="e.g. Quantum Computing Guild"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Category
            </label>
            <select
              value={proposeForm.category}
              onChange={(e) => setProposeForm({ ...proposeForm, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
            >
              <option value="Technical">Technical</option>
              <option value="Robotics & AI">Robotics & AI</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Arts & Design">Arts & Design</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Tagline
            </label>
            <input
              type="text"
              required
              value={proposeForm.tagline}
              onChange={(e) => setProposeForm({ ...proposeForm, tagline: e.target.value })}
              placeholder="Exploring Qubits and Quantum Entanglement"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Mission & Activities
            </label>
            <textarea
              rows={3}
              required
              value={proposeForm.description}
              onChange={(e) => setProposeForm({ ...proposeForm, description: e.target.value })}
              placeholder="Describe upcoming workshops, target audience, and lab requirements..."
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-xs tracking-wide bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-cyber-button transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Submit Proposal for Admin Review</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};
