import { Event } from '../models/Event.js';
import { initialEvents } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let demoEvents = initialEvents.map((e, idx) => ({
  ...e,
  _id: 'event-' + (idx + 1),
  rsvps: [],
}));

export const getEvents = async (req, res) => {
  try {
    const { category, search } = req.query;
    if (getDBStatus()) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (search) query.title = { $regex: search, $options: 'i' };
      const events = await Event.find(query).sort({ date: 1 });
      if (events.length > 0) return res.json({ success: true, count: events.length, data: events });
    }

    let filtered = [...demoEvents];
    if (category && category !== 'All') {
      filtered = filtered.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const event = await Event.findById(id);
      if (event) return res.json({ success: true, data: event });
    }
    const event = demoEvents.find((e) => e._id === id);
    if (event) return res.json({ success: true, data: event });
    return res.status(404).json({ success: false, message: 'Event not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    if (getDBStatus()) {
      const newEvent = await Event.create(eventData);
      return res.status(201).json({ success: true, message: 'Event created successfully', data: newEvent });
    }
    const newEvent = {
      ...eventData,
      _id: 'event-' + Date.now(),
      rsvps: [],
      capacity: eventData.capacity || 200,
      status: 'upcoming',
    };
    demoEvents.unshift(newEvent);
    return res.status(201).json({ success: true, message: 'Event created (Demo Mode)', data: newEvent });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rsvpEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || 'demo-user';
    const userName = req.user?.name || 'Student';
    const ticketCode = `TK-${Math.floor(100000 + Math.random() * 900000)}`;

    if (getDBStatus()) {
      const event = await Event.findById(id);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
      const alreadyRsvp = event.rsvps.some((r) => r.user?.toString() === userId.toString());
      if (alreadyRsvp) {
        return res.status(400).json({ success: false, message: 'You have already secured a ticket for this event!' });
      }
      event.rsvps.push({ user: userId, ticketCode, registeredAt: new Date() });
      await event.save();
      return res.json({
        success: true,
        message: `Ticket Confirmed! See you at ${event.title}`,
        ticketCode,
      });
    }

    const event = demoEvents.find((e) => e._id === id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    const already = event.rsvps.some((r) => r.userId === userId);
    if (already) {
      return res.status(400).json({ success: false, message: 'You have already RSVPed for this event!' });
    }
    event.rsvps.push({ userId, userName, ticketCode, registeredAt: new Date() });
    return res.json({
      success: true,
      message: `Pass Secured! See you at ${event.title}`,
      ticketCode,
      eventTitle: event.title,
      venue: event.venue,
      date: event.date,
      time: event.time,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
