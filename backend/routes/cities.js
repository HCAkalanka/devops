import express from 'express';
import { listCities } from '../controllers/cityController.js';

const router = express.Router();

router.get('/', listCities);

export default router;
