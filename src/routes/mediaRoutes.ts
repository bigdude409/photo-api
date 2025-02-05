import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';
import { MediaController } from '../controllers/MediaController.js';

const router = express.Router();
const mediaController = new MediaController();

// GET /api/v1/user/media
router.get('/', authMiddleware, (req: AuthenticatedRequest, res) => {
  console.log('media call');
  mediaController.getUserMedia(req, res);
});

// POST /api/v1/user/media
router.post('/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
    mediaController.addMedia(req, res);
});

export { router as mediaRoutes };
