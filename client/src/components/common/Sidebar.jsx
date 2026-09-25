import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  Flame,
  Briefcase,
  Users2,
  Megaphone,
  FolderGit2,
  ShieldAlert,
  X,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/academics', label: 'Academics & Timetable', icon: GraduationCap },
  { path: '/events', label: 'Campus Events', icon: CalendarDays },
  { path: '/hackathons', label: 'Hackathons & Squads', icon: Flame },
  { path: '/internships', label: 'Career Hub & Jobs', icon: Briefcase },
  { path: '/clubs', label: 'Clubs & AI Labs', icon: Users2 },
  { path: '/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/resources', label: 'Study Vault & Papers', icon: FolderGit2 },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 glass-panel border-r border-cyan-500/15 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-800">
            <span className="text-xs font-mono text-cyan-400">NAVIGATION MATRIX</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-cyan-400' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

            {/* Admin Command Link (Only for Admins) */}
            {isAdmin && (
              <div className="pt-2 mt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400/80 px-3.5">
                  Administration
                </span>
                <NavLink
                  to="/admin"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group mt-1 ${
                      isActive
                        ? 'bg-purple-950/40 text-purple-300 border border-purple-500/40'
                        : 'text-purple-400/80 hover:text-purple-200 hover:bg-purple-950/20'
                    }`
                  }
                >
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  <span>Admin Dashboard</span>
                  <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    RBAC
                  </span>
                </NavLink>
              </div>
            )}
          </nav>
        </div>

        {/* User Card / Campus Status Footer */}
        {user && (
          <div className="mt-auto pt-4 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/15">
              <div className="flex items-center space-x-2.5">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}
                  alt={user.name}
                  className="w-9 h-9 rounded-lg object-cover ring-1 ring-cyan-500/40"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{user.studentId || 'ID Verified'}</p>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Current CGPA:</span>
                <span className="text-emerald-400 font-bold">{user.cgpa || '3.89'} / 4.0</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
