import express from 'express';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import { createBooking, listBookings, checkAvailability, cancelBooking, ownerBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/check-availability', checkAvailability);
router.get('/', protect, listBookings);
router.post('/', protect, createBooking);
router.patch('/:id/cancel', protect, cancelBooking);
router.get('/owner', protect, requireRole('owner','admin'), ownerBookings);

export default router;
