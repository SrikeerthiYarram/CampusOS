import express from 'express';
import { getResources, createResource, trackDownload } from '../controllers/resourceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getResources);
router.post('/', protect, createResource);
router.post('/:id/download', trackDownload);

export default router;
