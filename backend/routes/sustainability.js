import express from 'express';
import {
  getAllSustainabilityRecords,
  createSustainabilityRecord,
  updateSustainabilityRecord,
  deleteSustainabilityRecord
} from '../controllers/sustainabilityController.js';

const router = express.Router();

router.get('/', getAllSustainabilityRecords);
router.post('/', createSustainabilityRecord);
router.put('/:id', updateSustainabilityRecord);
router.delete('/:id', deleteSustainabilityRecord);

export default router;
