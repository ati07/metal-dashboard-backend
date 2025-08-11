import express from 'express';
import {
  addFinancialRecord,
  getFinancialRecords,
  getChartData,
  updateFinancialRecord,
  deleteFinancialRecord
} from '../controllers/financialRecord.js';

const FinancialRecordRouter = express.Router();

FinancialRecordRouter.post('/', addFinancialRecord);
FinancialRecordRouter.get('/', getFinancialRecords); // All records (optional year/quarter filter)
FinancialRecordRouter.get('/chart', getChartData);   // Optimized for Recharts
FinancialRecordRouter.put('/:id', updateFinancialRecord);
FinancialRecordRouter.patch('/:id', deleteFinancialRecord);

export default FinancialRecordRouter;
