import { Club } from '../models/Club.js';
import { initialClubs } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let demoClubs = initialClubs.map((c, idx) => ({
  ...c,
  _id: 'club-' + (idx + 1),
  isMember: idx === 0, // demo student belongs to first club
}));

export const getClubs = async (req, res) => {
  try {
    const { category } = req.query;
    if (getDBStatus()) {
      let q = {};
      if (category && category !== 'All') q.category = category;
      const clubs = await Club.find(q);
      if (clubs.length > 0) return res.json({ success: true, count: clubs.length, data: clubs });
    }
    let list = [...demoClubs];
    if (category && category !== 'All') {
      list = list.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleClubMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const club = demoClubs.find((c) => c._id === id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    club.isMember = !club.isMember;
    club.membersCount += club.isMember ? 1 : -1;

    return res.json({
      success: true,
      message: club.isMember ? `You joined ${club.name}!` : `You left ${club.name}.`,
      isMember: club.isMember,
      membersCount: club.membersCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createClub = async (req, res) => {
  try {
    const clubData = req.body;
    if (getDBStatus()) {
      const created = await Club.create(clubData);
      return res.status(201).json({ success: true, message: 'Club registered!', data: created });
    }
    const created = {
      ...clubData,
      _id: 'club-' + Date.now(),
      membersCount: 1,
      isMember: true,
      recruitmentOpen: true,
    };
    demoClubs.push(created);
    return res.status(201).json({ success: true, message: 'Club registered (Demo Mode)', data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
