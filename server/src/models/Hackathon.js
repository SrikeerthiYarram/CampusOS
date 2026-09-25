import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    theme: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    prizePool: {
      type: String,
      default: '$10,000 + Cloud Grants',
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    registrationDeadline: {
      type: String,
      required: true,
    },
    teamSizeMax: {
      type: Number,
      default: 4,
    },
    teamSizeMin: {
      type: Number,
      default: 2,
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000',
    },
    location: {
      type: String,
      default: 'Campus Cyber Auditorium & Virtual Portal',
    },
    tracks: [String],
    rules: [String],
    teams: [
      {
        name: String,
        leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        projectTitle: String,
        repoUrl: String,
        techStack: [String],
      },
    ],
    status: {
      type: String,
      enum: ['registration_open', 'hacking_live', 'judging', 'completed'],
      default: 'registration_open',
    },
  },
  {
    timestamps: true,
  }
);

export const Hackathon = mongoose.model('Hackathon', hackathonSchema);
