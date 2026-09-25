import express from 'express';
import { getEvents, getEventById, createEvent, rsvpEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, isAdmin, createEvent);
router.post('/:id/rsvp', protect, rsvpEvent);

export default router;
