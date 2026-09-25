import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    },
    location: {
      type: String,
      required: true,
    },
    workplaceType: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      default: 'Remote',
    },
    type: {
      type: String,
      enum: ['Full-time', 'Summer Internship', 'Part-time', 'Research Fellowship'],
      default: 'Summer Internship',
    },
    stipend: {
      type: String,
      required: true, // e.g. "$45/hr" or "$3,000/mo"
    },
    deadline: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [String],
    skills: [String],
    applyUrl: String,
    applicants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        appliedAt: { type: Date, default: Date.now },
        resumeLink: String,
        status: { type: String, enum: ['Applied', 'Reviewing', 'Shortlisted', 'Interviewing'], default: 'Applied' },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Internship = mongoose.model('Internship', internshipSchema);
