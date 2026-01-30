import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/auth.js";
import carsRoutes from "./routes/cars.js";
import bookingsRoutes from "./routes/bookings.js";
import listingsRoutes from "./routes/listings.js";
import citiesRoutes from "./routes/cities.js";
import { seedCitiesIfEmpty } from "./controllers/cityController.js";
import usersRoutes from "./routes/users.js";
import { seedCarsIfEmpty } from "./controllers/carController.js";
import uploadsRoutes from "./routes/uploads.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
// Static uploads dir
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));
app.use("/api/auth", authRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/uploads", uploadsRoutes);
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Quiet browser devtools probe 404s
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.type("application/json").status(200).send("{}\n");
});

const { PORT = 5000 } = process.env;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const start = async () => {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI/MONGO_URI is not set. Add it to your .env file.");
    console.error("Example: MONGODB_URI=mongodb://127.0.0.1:27017/car_rental");
    process.exit(1);
  }
  try {
    console.log("Connecting to MongoDB...");
    let connected = false;
    let attempts = 0;
    const maxAttempts = 10;
    while (!connected && attempts < maxAttempts) {
      try {
        await mongoose.connect(MONGODB_URI);
        connected = true;
      } catch (e) {
        attempts++;
        console.warn(`MongoDB connection failed (attempt ${attempts}/${maxAttempts}):`, e && (e.message || e));
        if (attempts >= maxAttempts) throw e;
        await delay(2000);
      }
    }
  console.log("MongoDB connected");
  // Seed initial data if needed
  await seedCarsIfEmpty();
  await seedCitiesIfEmpty();
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err && (err.stack || err.message || err));
    process.exit(1);
  }
};

start();
