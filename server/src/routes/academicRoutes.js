import express from 'express';
import { getCourses, getCourseById, createCourse, checkInAttendance } from '../controllers/academicController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.post('/courses', protect, isAdmin, createCourse);
router.post('/attendance/checkin', protect, checkInAttendance);

export default router;
