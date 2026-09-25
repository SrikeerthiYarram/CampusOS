import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import {
  FolderGit2,
  Download,
  FileText,
  Search,
  BookMarked,
  Sparkles,
  ExternalLink,
  Check,
} from 'lucide-react';

export const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const types = [
    { label: 'All Vault', value: 'All' },
    { label: 'Past Exam Papers', value: 'past_paper' },
    { label: 'Lecture Notes', value: 'lecture_notes' },
    { label: 'Lab Manuals', value: 'lab_manual' },
    { label: 'Cheatsheets', value: 'cheatsheet' },
  ];

  useEffect(() => {
    fetchResources();
  }, [typeFilter, search]);

  const fetchResources = async () => {
    try {
      const res = await resourceAPI.getResources({
        type: typeFilter,
        search,
      });
      if (res.data?.success) setResources(res.data.data);
    } catch (err) {
      console.warn('Resources fetch error:', err.message);
    }
  };

  const handleDownload = async (resource) => {
    setDownloadingId(resource._id);
    try {
      await resourceAPI.download(resource._id);
      // Increment local download count
      setResources((prev) =>
        prev.map((r) =>
          r._id === resource._id ? { ...r, downloads: (r.downloads || 0) + 1 } : r
        )
      );

      // Simulate file download trigger
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.target = '_blank';
      link.download = `${resource.courseCode}-${resource.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Download tracker fallback');
    } finally {
      setTimeout(() => setDownloadingId(null), 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
            <FolderGit2 className="w-7 h-7 text-cyan-400" />
            <span>Study Vault & Past Papers</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified midterm papers, instructor lecture slide decks, lab manuals, and zero-knowledge crypto notes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Faculty Verified Repositories</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                typeFilter === t.value
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyber-button'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subjects, codes (CS-401)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((res) => (
          <GlassCard key={res._id} className="flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      {res.courseCode}
                    </span>
                    <h3 className="text-base font-heading font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {res.title}
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap uppercase">
                  {res.type.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2 font-mono">
                {res.subject} • Semester {res.semester}
              </p>

              {/* Uploaded By & Details */}
              <div className="mt-4 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>By: {res.uploadedBy?.name || 'Department Faculty'}</span>
                <span className="text-slate-500">Year: {res.year || 2026}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {res.tags?.map((tag, idx) => (
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
              <span className="text-xs text-slate-400 font-mono">
                {res.fileSize || '3.4 MB'} • <span className="text-cyan-400 font-bold">{res.downloads} downloads</span>
              </span>

              <button
                onClick={() => handleDownload(res)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
              >
                {downloadingId === res._id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Indexing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
