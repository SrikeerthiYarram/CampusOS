import { Hackathon } from '../models/Hackathon.js';
import { initialHackathons } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let demoHackathons = initialHackathons.map((h, idx) => ({
  ...h,
  _id: 'hack-' + (idx + 1),
  teams: [
    {
      name: 'CyberNomads',
      leaderName: 'Alex Chen',
      projectTitle: 'Autonomous Mesh Drone Dispatch',
      techStack: ['Rust', 'Three.js', 'PyTorch'],
    },
  ],
}));

export const getHackathons = async (req, res) => {
  try {
    if (getDBStatus()) {
      const hackathons = await Hackathon.find();
      if (hackathons.length > 0) return res.json({ success: true, count: hackathons.length, data: hackathons });
    }
    return res.json({ success: true, count: demoHackathons.length, data: demoHackathons });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createHackathon = async (req, res) => {
  try {
    const data = req.body;
    if (getDBStatus()) {
      const created = await Hackathon.create(data);
      return res.status(201).json({ success: true, message: 'Hackathon published!', data: created });
    }
    const created = { ...data, _id: 'hack-' + Date.now(), teams: [] };
    demoHackathons.unshift(created);
    return res.status(201).json({ success: true, message: 'Hackathon published (Demo Mode)', data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const joinOrCreateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamName, projectTitle, techStack } = req.body;
    const userName = req.user?.name || 'Hacker';

    const hackathon = demoHackathons.find((h) => h._id === id);
    if (!hackathon) return res.status(404).json({ success: false, message: 'Hackathon not found' });

    const newTeam = {
      name: teamName || `${userName}'s Squad`,
      leaderName: userName,
      projectTitle: projectTitle || 'Under Development',
      techStack: techStack ? techStack.split(',').map((s) => s.trim()) : ['React', 'Node.js', 'AI'],
    };

    hackathon.teams.push(newTeam);
    return res.json({
      success: true,
      message: `Team "${newTeam.name}" registered for ${hackathon.title}!`,
      team: newTeam,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
