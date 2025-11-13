import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { becomeOwner } from '../controllers/userController.js';

const router = express.Router();

router.post('/me/upgrade-owner', protect, becomeOwner);

export default router;
