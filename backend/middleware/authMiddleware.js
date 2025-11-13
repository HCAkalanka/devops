import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role || 'renter';
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  const role = req.userRole;
  if (!role) return res.status(401).json({ message: 'Not authorized' });
  if (!roles.includes(role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};
