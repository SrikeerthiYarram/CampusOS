import { Notification } from '../models/Notification.js';
import { initialNotifications } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let demoNotifications = initialNotifications.map((n, idx) => ({
  ...n,
  _id: 'notif-' + (idx + 1),
  isRead: false,
  createdAt: new Date(Date.now() - idx * 1800000).toISOString(),
}));

export const getNotifications = async (req, res) => {
  try {
    return res.json({ success: true, count: demoNotifications.length, data: demoNotifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = demoNotifications.find((n) => n._id === id);
    if (notif) notif.isRead = true;
    return res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    demoNotifications.forEach((n) => {
      n.isRead = true;
    });
    return res.json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
