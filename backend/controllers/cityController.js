import City from '../models/City.js';

export const listCities = async (req, res) => {
  try {
    const { q, province, district, limit = 50 } = req.query;
    const filter = { country: 'LK' };
    if (province) filter.province = province;
    if (district) filter.district = district;
    if (q) {
      const re = new RegExp(q, 'i');
      filter.$or = [{ city: re }, { district: re }, { province: re }];
    }
    const items = await City.find(filter).limit(Number(limit));
    res.json(items);
  } catch (err) {
    console.error('listCities error', err);
    res.status(500).json({ message: 'Failed to load cities' });
  }
};

export const seedCitiesIfEmpty = async () => {
  const count = await City.countDocuments({ country: 'LK' });
  if (count > 0) return;
  const cities = [
    { province: 'Western', district: 'Colombo', city: 'Colombo', location: { type: 'Point', coordinates: [79.8612, 6.9271] } },
    { province: 'Western', district: 'Gampaha', city: 'Gampaha', location: { type: 'Point', coordinates: [79.9925, 7.0897] } },
    { province: 'Western', district: 'Gampaha', city: 'Negombo', location: { type: 'Point', coordinates: [79.8380, 7.2008] } },
    { province: 'Central', district: 'Kandy', city: 'Kandy', location: { type: 'Point', coordinates: [80.6350, 7.2906] } },
    { province: 'Southern', district: 'Galle', city: 'Galle', location: { type: 'Point', coordinates: [80.2150, 6.0535] } },
    { province: 'Southern', district: 'Matara', city: 'Matara', location: { type: 'Point', coordinates: [80.5469, 5.9549] } },
    { province: 'Sabaragamuwa', district: 'Ratnapura', city: 'Ratnapura', location: { type: 'Point', coordinates: [80.4020, 6.7050] } },
    { province: 'Uva', district: 'Badulla', city: 'Badulla', location: { type: 'Point', coordinates: [81.0544, 6.9934] } },
    { province: 'Northern', district: 'Jaffna', city: 'Jaffna', location: { type: 'Point', coordinates: [80.0144, 9.6615] } },
    { province: 'North Western', district: 'Kurunegala', city: 'Kurunegala', location: { type: 'Point', coordinates: [80.3667, 7.4833] } },
    { province: 'Eastern', district: 'Batticaloa', city: 'Batticaloa', location: { type: 'Point', coordinates: [81.6951, 7.7102] } },
    { province: 'Eastern', district: 'Trincomalee', city: 'Trincomalee', location: { type: 'Point', coordinates: [81.2330, 8.5711] } },
    { province: 'North Central', district: 'Anuradhapura', city: 'Anuradhapura', location: { type: 'Point', coordinates: [80.4029, 8.3114] } },
    { province: 'North Central', district: 'Polonnaruwa', city: 'Polonnaruwa', location: { type: 'Point', coordinates: [81.0023, 7.9403] } },
    { province: 'Central', district: 'Nuwara Eliya', city: 'Nuwara Eliya', location: { type: 'Point', coordinates: [80.7829, 6.9497] } },
    { province: 'North Western', district: 'Puttalam', city: 'Puttalam', location: { type: 'Point', coordinates: [79.8283, 8.0362] } },
    { province: 'Northern', district: 'Vavuniya', city: 'Vavuniya', location: { type: 'Point', coordinates: [80.4994, 8.7514] } },
    { province: 'Eastern', district: 'Ampara', city: 'Ampara', location: { type: 'Point', coordinates: [81.6747, 7.3018] } },
    { province: 'Uva', district: 'Monaragala', city: 'Monaragala', location: { type: 'Point', coordinates: [81.3487, 6.8734] } },
    { province: 'North Western', district: 'Mannar', city: 'Mannar', location: { type: 'Point', coordinates: [79.9160, 8.9771] } },
  ];
  await City.insertMany(cities);
  console.log(`Seeded ${cities.length} LK cities`);
};
