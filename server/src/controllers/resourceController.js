import { Resource } from '../models/Resource.js';
import { initialResources } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let demoResources = initialResources.map((r, idx) => ({
  ...r,
  _id: 'res-' + (idx + 1),
}));

export const getResources = async (req, res) => {
  try {
    const { type, search } = req.query;
    if (getDBStatus()) {
      let q = {};
      if (type && type !== 'All') q.type = type;
      if (search) q.title = { $regex: search, $options: 'i' };
      const resources = await Resource.find(q);
      if (resources.length > 0) return res.json({ success: true, count: resources.length, data: resources });
    }
    let list = [...demoResources];
    if (type && type !== 'All') {
      list = list.filter((r) => r.type.toLowerCase() === type.toLowerCase());
    }
    if (search) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.subject.toLowerCase().includes(search.toLowerCase()) ||
          r.courseCode.toLowerCase().includes(search.toLowerCase())
      );
    }
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createResource = async (req, res) => {
  try {
    const data = req.body;
    if (getDBStatus()) {
      const created = await Resource.create(data);
      return res.status(201).json({ success: true, message: 'Resource indexed into Campus repository!', data: created });
    }
    const created = {
      ...data,
      _id: 'res-' + Date.now(),
      downloads: 1,
      uploadedBy: {
        name: req.user?.name || 'Department Faculty',
        role: req.user?.role || 'Staff',
      },
    };
    demoResources.unshift(created);
    return res.status(201).json({ success: true, message: 'Resource indexed (Demo Mode)!', data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const trackDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const resItem = demoResources.find((r) => r._id === id);
    if (resItem) {
      resItem.downloads += 1;
      return res.json({ success: true, downloads: resItem.downloads });
    }
    return res.status(404).json({ success: false, message: 'Resource not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
