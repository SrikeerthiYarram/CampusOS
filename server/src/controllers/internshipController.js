import { Internship } from '../models/Internship.js';
import { initialInternships } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let demoInternships = initialInternships.map((job, idx) => ({
  ...job,
  _id: 'job-' + (idx + 1),
  applicantsCount: 14 + idx * 5,
  hasApplied: false,
}));

export const getInternships = async (req, res) => {
  try {
    const { workplaceType, search } = req.query;
    let list = [...demoInternships];

    if (getDBStatus()) {
      let q = { status: 'active' };
      if (workplaceType && workplaceType !== 'All') q.workplaceType = workplaceType;
      if (search) q.title = { $regex: search, $options: 'i' };
      const jobs = await Internship.find(q);
      if (jobs.length > 0) return res.json({ success: true, count: jobs.length, data: jobs });
    }

    if (workplaceType && workplaceType !== 'All') {
      list = list.filter((j) => j.workplaceType.toLowerCase() === workplaceType.toLowerCase());
    }
    if (search) {
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.company.toLowerCase().includes(search.toLowerCase()) ||
          j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createInternship = async (req, res) => {
  try {
    const jobData = req.body;
    if (getDBStatus()) {
      const created = await Internship.create(jobData);
      return res.status(201).json({ success: true, message: 'Internship role published!', data: created });
    }
    const created = {
      ...jobData,
      _id: 'job-' + Date.now(),
      applicantsCount: 0,
      skills: Array.isArray(jobData.skills) ? jobData.skills : (jobData.skills || '').split(',').map((s) => s.trim()),
    };
    demoInternships.unshift(created);
    return res.status(201).json({ success: true, message: 'Internship published (Demo Mode)', data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const applyInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { resumeLink, statement } = req.body;
    const userName = req.user?.name || 'Applicant';

    const job = demoInternships.find((j) => j._id === id);
    if (!job) return res.status(404).json({ success: false, message: 'Position not found' });

    job.hasApplied = true;
    job.applicantsCount += 1;

    return res.json({
      success: true,
      message: `Application submitted for ${job.title} at ${job.company}! Recruiter will review your profile.`,
      applicationDetails: {
        candidate: userName,
        appliedAt: new Date().toISOString(),
        status: 'Under Review',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
