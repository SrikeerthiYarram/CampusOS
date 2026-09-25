import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, announcementAPI } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/dashboard/StatCard';
import { Modal } from '../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  Users,
  Database,
  Server,
  Activity,
  UserCheck,
  UserX,
  Shield,
  PlusCircle,
  Sparkles,
  Lock,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user, isAdmin, loginAsAdmin } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    content: '',
    priority: 'high',
    category: 'Administrative',
  });

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      const [mRes, uRes] = await Promise.all([
        adminAPI.getMetrics(),
        adminAPI.getUsers(),
      ]);
      if (mRes.data?.success) setMetrics(mRes.data.metrics);
      if (uRes.data?.success) setUsers(uRes.data.data);
    } catch (err) {
      console.warn('Admin data fetch error:', err.message);
    }
  };

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'student' : 'admin';
    try {
      const res = await adminAPI.updateUserRole(targetUser._id, { role: newRole });
      if (res.data?.success) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#a855f7', '#38bdf8'],
        });
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      alert(err.message || 'Role update error');
    }
  };

  const handleStatusToggle = async (targetUser) => {
    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await adminAPI.updateUserRole(targetUser._id, { status: newStatus });
      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err) {
      alert(err.message || 'Status update error');
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      await announcementAPI.createAnnouncement(broadcastForm);
      confetti({ particleCount: 70, spread: 60 });
      setShowBroadcastModal(false);
      setBroadcastForm({ title: '', content: '', priority: 'high', category: 'Administrative' });
      alert('📢 Official broadcast transmitted across all student consoles!');
    } catch (err) {
      alert(err.message || 'Broadcast dispatch failed');
    }
  };

  // If not logged in as Admin, show RBAC Guard
  if (!isAdmin) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-heading font-extrabold text-white">
          Admin Clearance Required
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Your current session [{user?.name || 'Guest'}] holds Student clearance. Administrative command center requires Level-4 RBAC privileges.
        </p>
        <button
          onClick={loginAsAdmin}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-purple-500 hover:bg-purple-600 text-white shadow-purple-glow transition-all"
        >
          Switch to Admin Identity (Dr. Sarah Connor)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <GlassCard className="border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-[#070913]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-purple-glow">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-heading font-extrabold text-white">
                  Admin Command Console
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ROOT PRIVILEGES
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                CampusOS Governance • RBAC Authority • Network Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 text-white shadow-purple-glow transition-all flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Broadcast Notice
          </button>
        </div>
      </GlassCard>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Students"
          value={metrics?.totalStudents || '14'}
          change="Real-time ledger"
          icon={Users}
          color="cyan"
          subtext="Total Registered"
        />
        <StatCard
          title="Campus Database"
          value={metrics?.databaseConnected ? 'Atlas Connected' : 'Demo / Standby'}
          change={metrics?.databaseConnected ? 'Mongoose v8' : 'Ready for .env'}
          icon={Database}
          color={metrics?.databaseConnected ? 'emerald' : 'amber'}
          subtext="MongoDB Atlas Driver"
        />
        <StatCard
          title="System Latency"
          value={`${metrics?.serverLatencyMs || 18} ms`}
          change="99.98% Uptime"
          icon={Activity}
          color="purple"
          subtext="Regional Edge Node"
        />
        <StatCard
          title="Active Sockets"
          value={metrics?.activeSessions || '342 Sessions'}
          change="Full mesh bandwidth"
          icon={Server}
          color="cyan"
          subtext="Campus Intranet"
        />
      </div>

      {/* User Governance & RBAC Table */}
      <GlassCard>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-white text-lg">
              User Identity & RBAC Matrix
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Manage student privileges, promote administrators, and oversee enrollment status.
            </p>
          </div>
          <span className="text-xs font-mono text-purple-400 font-semibold">
            {users.length} Identities Managed
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-3">Identity</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-3">
                    <div>
                      <span className="font-semibold text-white block">{u.name}</span>
                      <span className="text-[11px] text-slate-400">{u.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-cyan-300 font-bold">{u.studentId || 'N/A'}</td>
                  <td className="py-3 px-3 text-slate-300">{u.department}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                        u.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleRoleToggle(u)}
                        title="Toggle Admin / Student Role"
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                      >
                        {u.role === 'admin' ? 'Demote' : 'Promote Admin'}
                      </button>
                      <button
                        onClick={() => handleStatusToggle(u)}
                        title="Toggle Active / Suspended"
                        className={`p-1 rounded-lg border transition-colors ${
                          u.status === 'active'
                            ? 'text-rose-400 hover:bg-rose-950/40 border-slate-700'
                            : 'text-emerald-400 hover:bg-emerald-950/40 border-slate-700'
                        }`}
                      >
                        {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Broadcast Composer Modal */}
      <Modal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        title="Issue Official Administrative Notice"
      >
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Notice Title
            </label>
            <input
              type="text"
              required
              value={broadcastForm.title}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
              placeholder="e.g. SLURM H100 Maintenance Scheduled"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Urgency Level
            </label>
            <select
              value={broadcastForm.priority}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, priority: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
            >
              <option value="urgent">Urgent (Red Alert)</option>
              <option value="high">High Priority</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">
              Notice Message
            </label>
            <textarea
              rows={4}
              required
              value={broadcastForm.content}
              onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
              placeholder="Type message to broadcast to all student terminals..."
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-xs tracking-wide bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 text-white shadow-cyber-button transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Transmit Bulletin</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};
