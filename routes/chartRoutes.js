// routes/chartRoutes.js
import express from 'express';
import {
  uploadFinancialData,
  getChartData,
  createRecord,
  updateRecord,
  deleteRecord
} from '../controllers/chartController.js';

const router = express.Router();

// Upload Excel data (bulk insert)
router.post('/upload', uploadFinancialData);

// Get chart data (monthly + quarterly)
router.get('/', getChartData);

// CRUD
router.post('/', createRecord);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export default router;
