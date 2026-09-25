import { Announcement } from '../models/Announcement.js';
import { initialAnnouncements } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let demoAnnouncements = initialAnnouncements.map((a, idx) => ({
  ...a,
  _id: 'ann-' + (idx + 1),
  createdAt: new Date(Date.now() - idx * 3600000 * 24).toISOString(),
}));

export const getAnnouncements = async (req, res) => {
  try {
    const { priority } = req.query;
    if (getDBStatus()) {
      let q = {};
      if (priority && priority !== 'All') q.priority = priority;
      const announcements = await Announcement.find(q).sort({ pinned: -1, createdAt: -1 });
      if (announcements.length > 0) return res.json({ success: true, count: announcements.length, data: announcements });
    }
    let list = [...demoAnnouncements];
    if (priority && priority !== 'All') {
      list = list.filter((a) => a.priority.toLowerCase() === priority.toLowerCase());
    }
    list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const data = req.body;
    if (getDBStatus()) {
      const created = await Announcement.create(data);
      return res.status(201).json({ success: true, message: 'Campus broadcast issued!', data: created });
    }
    const created = {
      ...data,
      _id: 'ann-' + Date.now(),
      createdAt: new Date().toISOString(),
      author: {
        name: req.user?.name || 'CampusOS Administration',
        role: req.user?.role === 'admin' ? 'Campus Administrator' : 'Staff',
      },
    };
    demoAnnouncements.unshift(created);
    return res.status(201).json({ success: true, message: 'Campus broadcast issued (Demo Mode)!', data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      await Announcement.findByIdAndDelete(id);
    }
    demoAnnouncements = demoAnnouncements.filter((a) => a._id !== id);
    return res.json({ success: true, message: 'Announcement archived.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
