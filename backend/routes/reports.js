import express from 'express';
import { getComprehensiveReport } from '../controllers/reportsController.js';

const router = express.Router();

router.get('/', getComprehensiveReport);

export default router;
