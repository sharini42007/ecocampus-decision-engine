import express from 'express';
import { getAllRecommendations } from '../controllers/recommendationsController.js';

const router = express.Router();

router.get('/', getAllRecommendations);

export default router;
