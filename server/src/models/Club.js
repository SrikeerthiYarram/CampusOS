import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Technical', 'Robotics & AI', 'Arts & Design', 'Cybersecurity', 'Debate & Literature', 'Sports & Gaming', 'Social Impact'],
      default: 'Technical',
    },
    tagline: {
      type: String,
      default: 'Empowering future innovators',
    },
    description: {
      type: String,
      required: true,
    },
    lead: {
      name: { type: String, required: true },
      email: { type: String },
      avatar: { type: String },
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    membersCount: {
      type: Number,
      default: 42,
    },
    logoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=128',
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    },
    recruitmentOpen: {
      type: Boolean,
      default: true,
    },
    meetingsSchedule: {
      type: String,
      default: 'Every Thursday, 5:30 PM - Hub 4',
    },
    socialLinks: {
      discord: String,
      github: String,
      linkedin: String,
      instagram: String,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

export const Club = mongoose.model('Club', clubSchema);
