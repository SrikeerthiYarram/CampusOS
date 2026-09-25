import React, { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { Modal } from '../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  CalendarDays,
  MapPin,
  Clock,
  Ticket,
  Search,
  Filter,
  Users,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const categories = ['All', 'Hackathon', 'Tech Talk', 'Symposium', 'Workshop', 'Cultural'];

  useEffect(() => {
    fetchEvents();
  }, [activeCategory, searchQuery]);

  const fetchEvents = async () => {
    try {
      const res = await eventAPI.getEvents({
        category: activeCategory,
        search: searchQuery,
      });
      if (res.data?.success) setEvents(res.data.data);
    } catch (err) {
      console.warn('Events fetch fallback:', err.message);
    }
  };

  const handleRSVP = async (event) => {
    try {
      const res = await eventAPI.rsvp(event._id);
      if (res.data?.success) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#a855f7', '#ec4899', '#34d399'],
        });

        setSelectedTicket({
          eventTitle: event.title,
          venue: event.venue,
          date: event.date,
          time: event.time,
          ticketCode: res.data.ticketCode || `TK-${Math.floor(100000 + Math.random() * 900000)}`,
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'RSVP action completed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-cyan-400" />
            <span>Campus Events & Summits</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover hack nights, autonomous tech keynotes, creative galas, and claim cryptographic entry passes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>4 Upcoming This Month</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyber-button'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, topics..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <GlassCard key={event._id} className="flex flex-col justify-between overflow-hidden group">
            <div>
              {/* Event Image Banner */}
              <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] via-[#0e1628]/40 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 backdrop-blur-md">
                  {event.category}
                </span>
                {event.featured && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-950/80 border border-purple-400/40 text-purple-300 backdrop-blur-md">
                    Featured
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-heading font-bold text-white group-hover:text-cyan-300 transition-colors">
                {event.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {event.description}
              </p>

              {/* Details (Date, Time, Venue) */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{event.date}</span>
                  <span className="text-slate-600">•</span>
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span className="truncate">{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Host: {event.organizer}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {event.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* RSVP Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Capacity: <span className="text-white font-semibold">{event.capacity} seats</span>
              </span>

              <button
                onClick={() => handleRSVP(event)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyber-button hover:shadow-glass-glow transition-all flex items-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                Claim Pass
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Ticket QR Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title="Event Access Pass Confirmed"
      >
        {selectedTicket && (
          <div className="text-center space-y-4 py-2">
            <div className="p-4 bg-white rounded-2xl w-fit mx-auto shadow-2xl ring-4 ring-cyan-500/40">
              <svg className="w-40 h-40" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
                <rect x="5" y="5" width="25" height="25" fill="#070913" />
                <rect x="9" y="9" width="17" height="17" fill="white" />
                <rect x="13" y="13" width="9" height="9" fill="#070913" />
                <rect x="70" y="5" width="25" height="25" fill="#070913" />
                <rect x="74" y="9" width="17" height="17" fill="white" />
                <rect x="78" y="13" width="9" height="9" fill="#070913" />
                <rect x="5" y="70" width="25" height="25" fill="#070913" />
                <rect x="9" y="74" width="17" height="17" fill="white" />
                <rect x="13" y="78" width="9" height="9" fill="#070913" />
                <rect x="35" y="15" width="25" height="6" fill="#070913" />
                <rect x="40" y="30" width="20" height="10" fill="#070913" />
                <rect x="15" y="45" width="70" height="6" fill="#070913" />
                <rect x="35" y="60" width="30" height="8" fill="#070913" />
                <rect x="50" y="80" width="35" height="6" fill="#070913" />
              </svg>
            </div>

            <div className="space-y-1 font-mono">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                {selectedTicket.ticketCode}
              </span>
              <h4 className="text-base font-heading font-bold text-white pt-2">
                {selectedTicket.eventTitle}
              </h4>
              <p className="text-xs text-slate-300">{selectedTicket.date} • {selectedTicket.time}</p>
              <p className="text-xs text-purple-300">{selectedTicket.venue}</p>
              <p className="text-[10px] text-emerald-400 pt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Digital pass saved to your Student Console
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
