import express from 'express';
import { getAllDepartments, getDepartmentById } from '../controllers/departmentsController.js';

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);

export default router;
