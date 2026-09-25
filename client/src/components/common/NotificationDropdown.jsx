import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleItemClick = (notif) => {
    markAsRead(notif._id);
    if (notif.actionLink) {
      navigate(notif.actionLink);
      onClose();
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl border border-cyan-500/25 shadow-2xl p-4 z-50">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h4 className="font-heading font-semibold text-white text-sm">Campus Transmissions</h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark read
          </button>
        )}
      </div>

      {/* List */}
      <div className="mt-2 divide-y divide-slate-800/80 max-h-80 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-mono">
            No active campus transmissions
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleItemClick(notif)}
              className={`p-3 transition-colors rounded-xl cursor-pointer hover:bg-slate-800/60 my-1 ${
                !notif.isRead ? 'bg-cyan-950/20 border-l-2 border-cyan-400' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-slate-200 line-clamp-1">
                  {notif.title}
                </span>
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-1" />
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {notif.message}
              </p>
              <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Recent
                </span>
                <span className="text-cyan-400 flex items-center gap-0.5 hover:underline">
                  View <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
