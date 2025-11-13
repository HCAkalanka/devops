import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';

const dayMs = 24 * 60 * 60 * 1000;

export const checkAvailability = async (req, res) => {
  try {
    const { listingId, start, end } = req.body;
    if (!listingId || !start || !end) return res.status(400).json({ message: 'Missing listingId/start/end' });
    const s = new Date(start); const e = new Date(end);
    if (!(s < e)) return res.status(400).json({ message: 'Invalid date range' });
    const conflicts = await Booking.find({ listing: listingId, status: { $in: ['pending','confirmed'] }, 'dateRange.start': { $lt: e }, 'dateRange.end': { $gt: s } }).select('dateRange');
    res.json({ available: conflicts.length === 0, conflicts });
  } catch (err) {
    console.error('checkAvailability error', err);
    res.status(500).json({ message: 'Failed to check availability' });
  }
};

export const createBooking = async (req, res) => {
  try {
    const renter = req.userId;
    if (!renter) return res.status(401).json({ message: 'Not authorized' });
    const { listingId, start, end, contact } = req.body;
    if (!listingId || !start || !end || !contact?.name || !contact?.email || !contact?.phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    const s = new Date(start); const e = new Date(end);
    if (!(s < e)) return res.status(400).json({ message: 'Invalid date range' });
    const conflicts = await Booking.find({ listing: listingId, status: { $in: ['pending','confirmed'] }, 'dateRange.start': { $lt: e }, 'dateRange.end': { $gt: s } });
    if (conflicts.length) return res.status(409).json({ message: 'Dates not available', conflicts: conflicts.map(c => c.dateRange) });
    const days = Math.ceil((e - s) / dayMs);
    const pricePerDay = listing.pricing?.pricePerDay || 0;
    const subtotal = days * pricePerDay;
    const taxes = subtotal * 0.1;
    const total = subtotal + taxes;
    const booking = await Booking.create({
      listing: listing._id,
      owner: listing.owner,
      renter,
      dateRange: { start: s, end: e },
      contact,
      pricingSnapshot: { pricePerDay, days, subtotal, taxes, total },
      status: 'confirmed',
    });
    res.status(201).json(booking);
  } catch (err) {
    console.error('createBooking error', err);
    res.status(500).json({ message: 'Failed to create booking' });
  }
};

export const listBookings = async (req, res) => {
  try {
    const renter = req.userId;
    if (!renter) return res.status(401).json({ message: 'Not authorized' });
    const mine = await Booking.find({ renter }).populate('listing').sort({ createdAt: -1 });
    res.json(mine);
  } catch (err) {
    console.error('listBookings error', err);
    res.status(500).json({ message: 'Failed to load bookings' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const renter = req.userId;
    const id = req.params.id;
    const doc = await Booking.findById(id);
    if (!doc) return res.status(404).json({ message: 'Booking not found' });
    if (String(doc.renter) !== String(renter)) return res.status(403).json({ message: 'Forbidden' });
    if (doc.status !== 'confirmed') return res.status(400).json({ message: 'Cannot cancel booking in this state' });
    doc.status = 'cancelled';
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error('cancelBooking error', err);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
};

export const ownerBookings = async (req, res) => {
  try {
    const owner = req.userId;
    if (!owner) return res.status(401).json({ message: 'Not authorized' });
    // Find bookings for listings owned by this owner
    const mine = await Booking.find({ owner }).populate('listing').sort({ createdAt: -1 });
    res.json(mine);
  } catch (err) {
    console.error('ownerBookings error', err);
    res.status(500).json({ message: 'Failed to load owner bookings' });
  }
};
