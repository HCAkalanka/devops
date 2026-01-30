import Car from '../models/Car.js';

export const listCars = async (req, res) => {
  try {
    const { q, location, category } = req.query;
    const filter = {};
    if (location) filter.location = location;
    if (category) filter.category = category;
    if (q) filter.$or = [
      { brand: new RegExp(q, 'i') },
      { model: new RegExp(q, 'i') },
    ];
    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    console.error('listCars error', err);
    res.status(500).json({ error: 'Failed to load cars' });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    console.error('getCarById error', err);
    res.status(500).json({ error: 'Failed to load car' });
  }
};

export const seedCarsIfEmpty = async () => {
  const count = await Car.countDocuments();
  if (count > 0) return;
  const seed = [
    {
      brand: 'BMW', model: 'X5', year: 2006, category: 'SUV',
      transmission: 'Semi-Automatic', fuel_type: 'Hybrid', seating_capacity: 4,
      pricePerDay: 300, location: 'New York',
      description: 'BMW X5 mid-size luxury SUV.',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80',
    },
    {
      brand: 'Toyota', model: 'Corolla', year: 2021, category: 'Sedan',
      transmission: 'Manual', fuel_type: 'Diesel', seating_capacity: 4,
      pricePerDay: 130, location: 'Chicago',
      description: 'Toyota Corolla sedan.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    },
    {
      brand: 'Jeep', model: 'Wrangler', year: 2023, category: 'SUV',
      transmission: 'Automatic', fuel_type: 'Hybrid', seating_capacity: 4,
      pricePerDay: 200, location: 'Los Angeles',
      description: 'Jeep Wrangler SUV.',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    },
    {
      brand: 'Ford', model: 'Neo 6', year: 2022, category: 'Sedan',
      transmission: 'Semi-Automatic', fuel_type: 'Diesel', seating_capacity: 2,
      pricePerDay: 209, location: 'Houston',
      description: 'Ford Neo 6 sedan.',
      image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80',
    },
  ];
  await Car.insertMany(seed);
  console.log(`Seeded ${seed.length} cars`);
};
