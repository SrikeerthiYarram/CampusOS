import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Hackathon', 'Tech Talk', 'Cultural', 'Workshop', 'Sports', 'Symposium', 'Networking'],
      default: 'Tech Talk',
    },
    date: {
      type: String, // e.g. "2026-10-15"
      required: true,
    },
    time: {
      type: String, // e.g. "14:00 - 17:00"
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
    },
    capacity: {
      type: Number,
      default: 200,
    },
    rsvps: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        ticketCode: String,
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model('Event', eventSchema);
