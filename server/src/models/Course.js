import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      default: 4,
    },
    semester: {
      type: Number,
      required: true,
    },
    instructor: {
      name: { type: String, required: true },
      email: { type: String },
      office: { type: String },
      avatar: { type: String },
    },
    schedule: [
      {
        day: { type: String, required: true }, // Monday, Tuesday, etc.
        time: { type: String, required: true }, // '09:00 AM - 10:30 AM'
        room: { type: String, required: true }, // 'Lab 304' or 'Hall A'
      },
    ],
    attendanceStats: {
      totalHeld: { type: Number, default: 28 },
      attended: { type: Number, default: 25 },
    },
    syllabus: [
      {
        week: Number,
        topic: String,
        status: { type: String, enum: ['completed', 'in_progress', 'upcoming'], default: 'upcoming' },
      },
    ],
    color: {
      type: String,
      default: 'from-blue-500/20 to-cyan-500/20',
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model('Course', courseSchema);
