import React, { useState, useEffect } from 'react';
import { academicAPI } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  User,
  Sparkles,
} from 'lucide-react';

export const AcademicsPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [checkedInCode, setCheckedInCode] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await academicAPI.getCourses();
        if (res.data?.success) setCourses(res.data.data);
      } catch (err) {
        console.warn('Academics fetch error:', err.message);
      }
    };
    fetchCourses();
  }, []);

  const handleAttendanceCheckIn = async (code) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#818cf8', '#34d399'],
    });

    setCheckedInCode(code);
    setCourses((prev) =>
      prev.map((c) =>
        c.code === code
          ? {
              ...c,
              attendanceStats: {
                ...c.attendanceStats,
                attended: (c.attendanceStats?.attended || 20) + 1,
                totalHeld: (c.attendanceStats?.totalHeld || 22) + 1,
              },
            }
          : c
      )
    );
    setTimeout(() => setCheckedInCode(null), 3000);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Filter schedules matching the active day
  const daySchedule = [];
  courses.forEach((course) => {
    course.schedule?.forEach((s) => {
      if (s.day.toLowerCase() === selectedDay.toLowerCase()) {
        daySchedule.push({
          courseCode: course.code,
          courseTitle: course.title,
          time: s.time,
          room: s.room,
          instructor: course.instructor?.name,
        });
      }
    });
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-cyan-400" />
            <span>Academic Command & Timetable</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enrolled curriculum, reactive attendance ledger, and weekly spatial timetable matrix.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Semester 5 • 14 Credits Enrolled</span>
        </div>
      </div>

      {/* Timetable Interactive Grid */}
      <GlassCard>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-white text-base">Weekly Class Matrix</h3>
          </div>

          {/* Day Selector Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedDay === day
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Day's Classes Cards */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {daySchedule.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs font-mono text-slate-400">
              No lecture sessions scheduled for {selectedDay}. Study or lab access open.
            </div>
          ) : (
            daySchedule.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300">{item.courseCode}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                    Lecture
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mt-1 line-clamp-1">{item.courseTitle}</h4>
                <div className="mt-3 space-y-1.5 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>{item.room}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.instructor}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Courses List & Attendance Tracking */}
      <div>
        <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
          <span>Enrolled Modules & Syllabus Ledger</span>
          <span className="text-xs font-mono font-normal text-slate-400">({courses.length} courses)</span>
        </h3>

        <div className="space-y-4">
          {courses.map((course) => {
            const attended = course.attendanceStats?.attended || 22;
            const total = course.attendanceStats?.totalHeld || 24;
            const percentage = Math.round((attended / total) * 100);
            const isExpanded = expandedCourse === course.code;

            return (
              <GlassCard key={course.code} className="transition-all">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Course Info */}
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {course.code}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {course.credits} Credits • {course.department}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-heading font-bold text-white">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Attendance & Actions */}
                  <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                    {/* Attendance Bar */}
                    <div className="text-right">
                      <div className="text-xs font-mono text-slate-300">
                        Attendance:{' '}
                        <span className={`font-bold ${percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {percentage}%
                        </span>{' '}
                        <span className="text-slate-500 text-[10px]">({attended}/{total})</span>
                      </div>
                      <div className="w-36 h-2 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            percentage >= 75 ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : 'bg-rose-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Check-in Trigger */}
                      <button
                        onClick={() => handleAttendanceCheckIn(course.code)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          checkedInCode === course.code
                            ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                            : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {checkedInCode === course.code ? 'Marked!' : 'Check In'}
                      </button>

                      {/* Expand Syllabus */}
                      <button
                        onClick={() => setExpandedCourse(isExpanded ? null : course.code)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Syllabus Accordion */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      Syllabus Tracking & Milestones
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {course.syllabus?.map((syl, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span>Week {syl.week}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded capitalize ${
                                syl.status === 'completed'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : syl.status === 'in_progress'
                                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {syl.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-slate-200 line-clamp-1">{syl.topic}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
