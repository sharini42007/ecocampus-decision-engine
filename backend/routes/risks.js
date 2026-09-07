import express from 'express';
import { getAllRisks, refreshRisks } from '../controllers/risksController.js';

const router = express.Router();

router.get('/', getAllRisks);
router.post('/refresh', refreshRisks);

export default router;
