import express from 'express';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import { createListing, listListings, getListingById, updateListing, removeListing, publishListing, pauseListing, myListings } from '../controllers/listingController.js';

const router = express.Router();

router.get('/', listListings);
router.get('/owners/me/listings', protect, requireRole('owner','admin'), myListings);
router.get('/:id', getListingById);
router.post('/', protect, requireRole('owner','admin'), createListing);
router.patch('/:id', protect, requireRole('owner','admin'), updateListing);
router.delete('/:id', protect, requireRole('owner','admin'), removeListing);
router.post('/:id/publish', protect, requireRole('owner','admin'), publishListing);
router.patch('/:id/pause', protect, requireRole('owner','admin'), pauseListing);

export default router;
