import express from 'express';
import { getPredictionData, createPrediction } from '../controllers/predictionsController.js';

const router = express.Router();

router.get('/', getPredictionData);
router.post('/', createPrediction);

export default router;
