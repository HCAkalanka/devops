import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['draft', 'active', 'paused'], default: 'active' },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    vehicle: {
      type: { type: String, enum: ['car','suv','van','motorbike','bus','truck','threewheeler','tractor'], required: true },
      brand: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number },
      seats: { type: Number },
      transmission: { type: String, enum: ['Manual','Automatic','Semi-Automatic'], default: 'Automatic' },
      fuel: { type: String, enum: ['Petrol','Diesel','Hybrid','Electric'], default: 'Petrol' },
      features: [{ type: String }],
    },
    location: {
      country: { type: String, default: 'LK', index: true },
      province: { type: String, index: true },
      district: { type: String, index: true },
      city: { type: String, required: true, index: true },
      address: { type: String },
      coordinates: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number], default: undefined }, // [lng,lat]
      },
    },
    pricing: {
      pricePerDay: { type: Number, required: true, min: 0 },
      deposit: { type: Number, default: 0 },
    },
    description: { type: String, maxlength: 1200 },
    images: [{ url: String }],
    metrics: {
      views: { type: Number, default: 0 },
      favoritesCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

ListingSchema.index({ 'vehicle.brand': 1, 'vehicle.model': 1, 'location.city': 1 });
ListingSchema.index({ title: 'text', description: 'text', 'vehicle.brand': 'text', 'vehicle.model': 'text' });
ListingSchema.index({ 'location.coordinates': '2dsphere' });

// Strip invalid or partial geo coordinate objects before validation to avoid 2dsphere errors
ListingSchema.pre('validate', function (next) {
  try {
    const loc = this.location || {};
    const cc = loc.coordinates;
    const arr = Array.isArray(cc?.coordinates) ? cc.coordinates : null;
    const valid = Array.isArray(arr) && arr.length === 2 && arr.every((n) => typeof n === 'number' && !Number.isNaN(n));
    if (!valid) {
      this.set('location.coordinates', undefined);
    } else if (!cc.type) {
      this.set('location.coordinates.type', 'Point');
    }
  } catch {}
  next();
});

export default mongoose.model('Listing', ListingSchema);
