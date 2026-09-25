import React, { useState, useEffect } from 'react';
import { announcementAPI } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import {
  Megaphone,
  Pin,
  AlertTriangle,
  Clock,
  User,
  ExternalLink,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export const AnnouncementsPage = () => {
  const { isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
    category: 'Academic',
    pinned: false,
  });

  const priorities = ['All', 'urgent', 'high', 'normal'];

  useEffect(() => {
    fetchAnnouncements();
  }, [priorityFilter]);

  const fetchAnnouncements = async () => {
    try {
      const res = await announcementAPI.getAnnouncements({ priority: priorityFilter });
      if (res.data?.success) setAnnouncements(res.data.data);
    } catch (err) {
      console.warn('Announcements fetch error:', err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await announcementAPI.createAnnouncement(form);
      if (res.data?.success) {
        fetchAnnouncements();
        setShowCreateModal(false);
        setForm({ title: '', content: '', priority: 'normal', category: 'Academic', pinned: false });
      }
    } catch (err) {
      alert(err.message || 'Creation failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-cyan-400" />
            <span>Campus Transmissions & Bulletins</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official announcements, examination hall schedules, and administrative mesh alerts.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 text-white shadow-glass-glow transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Broadcast Notice
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {priorities.map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase whitespace-nowrap transition-all ${
              priorityFilter === p
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyber-button'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {announcements.map((item) => (
          <GlassCard
            key={item._id}
            className={`border-l-4 transition-all ${
              item.priority === 'urgent'
                ? 'border-l-rose-500 bg-rose-950/10'
                : item.priority === 'high'
                ? 'border-l-amber-500 bg-amber-950/10'
                : 'border-l-cyan-500'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {item.pinned && (
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                      <Pin className="w-3 h-3 transform rotate-45" /> PINNED
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      item.priority === 'urgent'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.priority === 'high'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Category: {item.category}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-heading font-bold text-white pt-1">
                  {item.title}
                </h3>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-400 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 flex-shrink-0">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-cyan-400" />
                  {item.author?.name || 'Administration'}
                </span>
                <span className="text-slate-500">{item.author?.role || 'Authority'}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              {item.content}
            </p>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-850 text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Broadcast Modal for Admins */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Broadcast Campus Announcement"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Notice Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Mid-Semester Slip Verification Required"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                Priority Clearance
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
              >
                <option value="Academic">Academic</option>
                <option value="Examination">Examination</option>
                <option value="Placement">Placement</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Announcement Body
            </label>
            <textarea
              rows={4}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Enter official statement, deadlines, and instructions..."
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinnedCheck"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-cyan-400 focus:ring-cyan-500"
            />
            <label htmlFor="pinnedCheck" className="text-xs text-slate-300 font-mono">
              Pin to Top of Stream
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-xs tracking-wide bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 text-white shadow-cyber-button transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Dispatch Broadcast Notice</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};
