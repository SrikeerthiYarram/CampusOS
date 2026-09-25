import express from 'express';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.post('/', protect, isAdmin, createAnnouncement);
router.delete('/:id', protect, isAdmin, deleteAnnouncement);

export default router;
