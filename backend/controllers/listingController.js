import Listing from '../models/Listing.js';

export const createListing = async (req, res) => {
  try {
    const owner = req.userId;
    if (!owner) return res.status(401).json({ message: 'Not authorized' });
    const body = req.body || {};

    // Normalize incoming payload to match schema
    const normalizeTransmission = (t) => {
      if (!t) return undefined;
      const v = String(t).toLowerCase();
      if (v.startsWith('semi')) return 'Semi-Automatic';
      if (v.startsWith('man')) return 'Manual';
      if (v.startsWith('auto')) return 'Automatic';
      return t; // let Mongoose validate
    };
    const normalizeFuel = (f) => {
      if (!f) return undefined;
      const v = String(f).toLowerCase();
      if (v.includes('pet')) return 'Petrol';
      if (v.includes('die')) return 'Diesel';
      if (v.includes('hyb')) return 'Hybrid';
      if (v.includes('ele')) return 'Electric';
      return f;
    };

    const images = Array.isArray(body.images)
      ? body.images.map((img) => (typeof img === 'string' ? { url: img } : img))
      : [];

    const vehicle = body.vehicle || {};
    // Sanitize location, strip invalid geo coordinates to avoid 2dsphere errors
    const location = body.location || {};
    if (location.coordinates) {
      const cc = location.coordinates;
      const arr = Array.isArray(cc?.coordinates) ? cc.coordinates : null;
      const valid = Array.isArray(arr) && arr.length === 2 && arr.every((n) => typeof n === 'number' && !Number.isNaN(n));
      if (!valid) {
        delete location.coordinates;
      }
    }

    const payload = {
      owner,
      title: body.title,
      vehicle: {
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        seats: vehicle.seats,
        transmission: normalizeTransmission(vehicle.transmission),
        fuel: normalizeFuel(vehicle.fuel),
        features: vehicle.features,
      },
      location,
      pricing: body.pricing,
      description: body.description,
      images,
      status: body.status || 'draft',
    };

    const listing = await Listing.create(payload);
    res.status(201).json(listing);
  } catch (err) {
    console.error('createListing error', err);
    if (err && err.name === 'ValidationError') {
      const errors = Object.keys(err.errors || {}).reduce((acc, k) => {
        acc[k] = err.errors[k]?.message || 'Invalid value';
        return acc;
      }, {});
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    if (err && err.code === 16755) {
      // Mongo 2dsphere index geo extraction error
      return res.status(400).json({ message: 'Invalid geo coordinates. Provide [lng, lat] or remove the map pin.' });
    }
    res.status(500).json({ message: 'Failed to create listing' });
  }
};

export const listListings = async (req, res) => {
  try {
    const { q, type, province, district, city, minPrice, maxPrice, seats, transmission, fuel, page = 1, limit = 20, sort = 'new' } = req.query;
    const filter = { status: 'active' };
    if (type) filter['vehicle.type'] = type;
    if (province) filter['location.province'] = province;
    if (district) filter['location.district'] = district;
    if (city) filter['location.city'] = city;
    if (seats) filter['vehicle.seats'] = Number(seats);
    if (transmission) filter['vehicle.transmission'] = transmission;
    if (fuel) filter['vehicle.fuel'] = fuel;
    if (minPrice || maxPrice) filter['pricing.pricePerDay'] = {};
    if (minPrice) filter['pricing.pricePerDay'].$gte = Number(minPrice);
    if (maxPrice) filter['pricing.pricePerDay'].$lte = Number(maxPrice);
    if (q) filter.$text = { $search: q };
    const sortMap = { new: { createdAt: -1 }, price_asc: { 'pricing.pricePerDay': 1 }, price_desc: { 'pricing.pricePerDay': -1 } };
    const items = await Listing.find(filter)
      .sort(sortMap[sort] || sortMap.new)
      .skip((Number(page)-1) * Number(limit))
      .limit(Number(limit));
    res.json(items);
  } catch (err) {
    console.error('listListings error', err);
    res.status(500).json({ message: 'Failed to load listings' });
  }
};

export const getListingById = async (req, res) => {
  try {
    const doc = await Listing.findById(req.params.id).populate('owner', 'name email role');
    if (!doc) return res.status(404).json({ message: 'Listing not found' });
    res.json(doc);
  } catch (err) {
    console.error('getListingById error', err);
    res.status(500).json({ message: 'Failed to load listing' });
  }
};

export const updateListing = async (req, res) => {
  try {
    const owner = req.userId;
    const id = req.params.id;
    const doc = await Listing.findById(id);
    if (!doc) return res.status(404).json({ message: 'Listing not found' });
    if (String(doc.owner) !== String(owner)) return res.status(403).json({ message: 'Forbidden' });
    const body = req.body || {};
    // Normalize updates similar to create
    const normalizeTransmission = (t) => {
      if (!t) return undefined;
      const v = String(t).toLowerCase();
      if (v.startsWith('semi')) return 'Semi-Automatic';
      if (v.startsWith('man')) return 'Manual';
      if (v.startsWith('auto')) return 'Automatic';
      return t;
    };
    const normalizeFuel = (f) => {
      if (!f) return undefined;
      const v = String(f).toLowerCase();
      if (v.includes('pet')) return 'Petrol';
      if (v.includes('die')) return 'Diesel';
      if (v.includes('hyb')) return 'Hybrid';
      if (v.includes('ele')) return 'Electric';
      return f;
    };
    if (Array.isArray(body.images)) {
      body.images = body.images.map((img) => (typeof img === 'string' ? { url: img } : img));
    }
    if (body.vehicle) {
      body.vehicle = {
        ...doc.vehicle?.toObject?.() || doc.vehicle || {},
        ...body.vehicle,
      };
      if ('transmission' in body.vehicle) body.vehicle.transmission = normalizeTransmission(body.vehicle.transmission);
      if ('fuel' in body.vehicle) body.vehicle.fuel = normalizeFuel(body.vehicle.fuel);
    }
    if (body.location && body.location.coordinates) {
      const cc = body.location.coordinates;
      const arr = Array.isArray(cc?.coordinates) ? cc.coordinates : null;
      const valid = Array.isArray(arr) && arr.length === 2 && arr.every((n) => typeof n === 'number' && !Number.isNaN(n));
      if (!valid) delete body.location.coordinates;
    }
    Object.assign(doc, body);
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error('updateListing error', err);
    res.status(500).json({ message: 'Failed to update listing' });
  }
};

export const removeListing = async (req, res) => {
  try {
    const owner = req.userId;
    const id = req.params.id;
    const doc = await Listing.findById(id);
    if (!doc) return res.status(404).json({ message: 'Listing not found' });
    if (String(doc.owner) !== String(owner)) return res.status(403).json({ message: 'Forbidden' });
    await doc.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error('removeListing error', err);
    res.status(500).json({ message: 'Failed to delete listing' });
  }
};

export const publishListing = async (req, res) => {
  try {
    const owner = req.userId;
    const id = req.params.id;
    const doc = await Listing.findById(id);
    if (!doc) return res.status(404).json({ message: 'Listing not found' });
    if (String(doc.owner) !== String(owner)) return res.status(403).json({ message: 'Forbidden' });
    doc.status = 'active';
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error('publishListing error', err);
    res.status(500).json({ message: 'Failed to publish listing' });
  }
};

export const pauseListing = async (req, res) => {
  try {
    const owner = req.userId;
    const id = req.params.id;
    const doc = await Listing.findById(id);
    if (!doc) return res.status(404).json({ message: 'Listing not found' });
    if (String(doc.owner) !== String(owner)) return res.status(403).json({ message: 'Forbidden' });
    doc.status = 'paused';
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error('pauseListing error', err);
    res.status(500).json({ message: 'Failed to pause listing' });
  }
};

export const myListings = async (req, res) => {
  try {
    const owner = req.userId;
    const items = await Listing.find({ owner }).sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('myListings error', err);
    res.status(500).json({ message: 'Failed to load my listings' });
  }
};
