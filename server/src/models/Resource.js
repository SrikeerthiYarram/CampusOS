import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
    },
    semester: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['past_paper', 'lecture_notes', 'lab_manual', 'cheatsheet', 'reference_book'],
      default: 'lecture_notes',
    },
    year: {
      type: Number,
      default: 2026,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      default: '3.4 MB',
    },
    format: {
      type: String,
      default: 'PDF',
    },
    uploadedBy: {
      name: { type: String, default: 'Department Faculty' },
      role: { type: String, default: 'Professor' },
    },
    downloads: {
      type: Number,
      default: 18,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

export const Resource = mongoose.model('Resource', resourceSchema);
