import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema({
  country: { type: String, default: 'LK', index: true },
  province: { type: String, required: true, index: true },
  district: { type: String, required: true, index: true },
  city: { type: String, required: true, index: true },
  slug: { type: String, index: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [80.7718, 7.8731] }, // [lng,lat]
  },
}, { timestamps: true });

CitySchema.index({ location: '2dsphere' });
CitySchema.index({ country: 1, province: 1, district: 1, city: 1 }, { unique: true });

export default mongoose.model('City', CitySchema);
