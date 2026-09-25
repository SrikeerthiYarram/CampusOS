import express from 'express';
import { getClubs, toggleClubMembership, createClub } from '../controllers/clubController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getClubs);
router.post('/', protect, createClub);
router.post('/:id/join', protect, toggleClubMembership);

export default router;
