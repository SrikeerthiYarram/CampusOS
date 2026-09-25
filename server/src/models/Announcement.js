import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['urgent', 'high', 'normal', 'low'],
      default: 'normal',
    },
    category: {
      type: String,
      enum: ['Academic', 'Examination', 'Placement', 'Administrative', 'Hostel', 'Campus Life'],
      default: 'Academic',
    },
    author: {
      name: { type: String, default: 'CampusOS Administration' },
      role: { type: String, default: 'Dean of Student Affairs' },
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
