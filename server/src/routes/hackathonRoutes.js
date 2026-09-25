import express from 'express';
import { getHackathons, createHackathon, joinOrCreateTeam } from '../controllers/hackathonController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getHackathons);
router.post('/', protect, isAdmin, createHackathon);
router.post('/:id/team', protect, joinOrCreateTeam);

export default router;
