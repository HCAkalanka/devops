import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number },
  category: { type: String }, // SUV, Sedan, etc.
  transmission: { type: String },
  fuel_type: { type: String },
  seating_capacity: { type: Number },
  pricePerDay: { type: Number, required: true },
  location: { type: String },
  description: { type: String },
  image: { type: String },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Car', CarSchema);
