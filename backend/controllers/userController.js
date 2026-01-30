import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const becomeOwner = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) return res.status(401).json({ message: 'Not authorized' });
    const user = await User.findByIdAndUpdate(id, { $set: { role: 'owner' } }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('becomeOwner error', err);
    res.status(500).json({ message: 'Failed to upgrade role' });
  }
};
