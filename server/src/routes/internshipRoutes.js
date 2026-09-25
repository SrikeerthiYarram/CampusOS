import express from 'express';
import { getInternships, createInternship, applyInternship } from '../controllers/internshipController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getInternships);
router.post('/', protect, isAdmin, createInternship);
router.post('/:id/apply', protect, applyInternship);

export default router;
