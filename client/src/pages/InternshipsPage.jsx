import React, { useState, useEffect } from 'react';
import { internshipAPI } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { Modal } from '../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Building,
  Send,
  Search,
  Sparkles,
} from 'lucide-react';

export const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [workplaceFilter, setWorkplaceFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [statement, setStatement] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [workplaceFilter, search]);

  const fetchJobs = async () => {
    try {
      const res = await internshipAPI.getInternships({
        workplaceType: workplaceFilter,
        search,
      });
      if (res.data?.success) setInternships(res.data.data);
    } catch (err) {
      console.warn('Internships fetch error:', err.message);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      const res = await internshipAPI.apply(selectedJob._id, { statement });
      if (res.data?.success) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#38bdf8', '#818cf8'],
        });

        setAppliedIds((prev) => new Set([...prev, selectedJob._id]));
        setApplySuccess(true);
        setTimeout(() => {
          setSelectedJob(null);
          setApplySuccess(false);
          setStatement('');
        }, 2200);
      }
    } catch (err) {
      alert(err.message || 'Application failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-emerald-400" />
            <span>Career Hub & Fellowships</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Top-tier industry internships, autonomous engineering fellowships, and verified tech company roles.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Stipend Tier Verified</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {['All', 'Remote', 'On-site', 'Hybrid'].map((type) => (
            <button
              key={type}
              onClick={() => setWorkplaceFilter(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                workplaceFilter === type
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles, skills, companies..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {internships.map((job) => {
          const isApplied = appliedIds.has(job._id);

          return (
            <GlassCard key={job._id} className="flex flex-col justify-between group">
              <div>
                {/* Company Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={job.logoUrl}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 p-0.5 bg-slate-900"
                    />
                    <div>
                      <h3 className="text-base sm:text-lg font-heading font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-cyan-400" />
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                    {job.workplaceType}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Details (Stipend, Location, Deadline) */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-400">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">COMPENSATION</span>
                    <span className="text-emerald-400 font-bold">{job.stipend}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">LOCATION</span>
                    <span className="text-slate-200 truncate block">{job.location}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">DEADLINE</span>
                    <span className="text-rose-400">{job.deadline}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Applicants: <span className="text-white font-semibold">{job.applicantsCount || 18}</span>
                </span>

                <button
                  disabled={isApplied}
                  onClick={() => setSelectedJob(job)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isApplied
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {isApplied ? 'Application Submitted' : 'Quick Apply'}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Quick Apply Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={`Apply for ${selectedJob?.title || 'Position'}`}
      >
        {applySuccess ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-heading font-bold text-white">Application Dispatched!</h4>
            <p className="text-xs text-slate-300 font-mono">
              Your CampusOS verified profile, transcript, and credentials have been forwarded to {selectedJob?.company}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1">
              <p className="text-slate-400">Position: <span className="text-white font-bold">{selectedJob?.title}</span></p>
              <p className="text-slate-400">Company: <span className="text-cyan-400 font-bold">{selectedJob?.company}</span></p>
              <p className="text-slate-400">Stipend: <span className="text-emerald-400 font-bold">{selectedJob?.stipend}</span></p>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                Candidate Note / Key Strengths
              </label>
              <textarea
                rows={4}
                required
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="Highlight relevant past projects, GitHub repos, or coursework..."
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-xs tracking-wide bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Verified Application</span>
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
