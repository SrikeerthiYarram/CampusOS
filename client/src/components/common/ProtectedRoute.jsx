import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Cpu, ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px] animate-spin">
            <div className="w-full h-full bg-[#070913] rounded-[14px] flex items-center justify-center">
              <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
          </div>
        </div>
        <p className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
          Verifying CampusOS Kernel Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
