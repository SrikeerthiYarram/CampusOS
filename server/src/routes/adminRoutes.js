import express from 'express';
import { getAdminMetrics, getAllUsers, updateUserRole } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

router.get('/metrics', protect, isAdmin, getAdminMetrics);
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);

export default router;
