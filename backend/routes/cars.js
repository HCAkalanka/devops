import express from 'express';
import { listCars, getCarById } from '../controllers/carController.js';

const router = express.Router();

router.get('/', listCars);
router.get('/:id', getCarById);

export default router;
