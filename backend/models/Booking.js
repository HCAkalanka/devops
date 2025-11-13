import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  dateRange: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }, // exclusive
  },
  contact: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  pricingSnapshot: {
    pricePerDay: { type: Number, required: true },
    days: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    taxes: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  status: { type: String, enum: ['pending','confirmed','cancelled','completed','expired'], default: 'confirmed', index: true },
}, { timestamps: true });

BookingSchema.index({ 'dateRange.start': 1, 'dateRange.end': 1, listing: 1 });

export default mongoose.model('Booking', BookingSchema);
