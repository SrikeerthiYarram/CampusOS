import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Bell,
  Cpu,
  Layers,
  LogOut,
  Shield,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/15 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Mobile Sidebar Trigger */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center p-[1px] shadow-glass-glow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070913] rounded-[11px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
              </div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg tracking-wider text-white flex items-center gap-1">
                CAMPUS<span className="text-cyan-400">OS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  v2.4
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: System Status Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/50 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>CAMPUS GRID: OPERATIONAL</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400">NODE LATENCY: 16ms</span>
        </div>

        {/* Right: Actions / Auth Menu */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              {/* Notification Center */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700/60"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-cyan-500/30"
                  />
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-semibold text-slate-100 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-cyan-400 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400 font-mono">Signed in as</p>
                      <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isAdmin
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {isAdmin ? '🛡️ Admin Clearance' : '🎓 Student Identity'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800/70 rounded-xl transition-colors"
                      >
                        <Layers className="w-4 h-4 text-cyan-400" />
                        Student Console
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-purple-300 hover:bg-purple-950/30 rounded-xl transition-colors"
                        >
                          <Shield className="w-4 h-4 text-purple-400" />
                          Admin Command Center
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyber-button hover:shadow-glass-glow transition-all"
              >
                Launch Console
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
