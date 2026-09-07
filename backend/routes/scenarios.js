import express from 'express';
import { runSimulation, getSavedScenarios } from '../controllers/scenariosController.js';

const router = express.Router();

router.post('/simulate', runSimulation);
router.get('/', getSavedScenarios);

export default router;
