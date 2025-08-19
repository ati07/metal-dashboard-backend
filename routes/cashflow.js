// routes/cashflowRoutes.js
import express from 'express';
import {
  uploadCashFlow,
  getCashFlow,
  createCashFlow,
  updateCashFlow,
  deleteCashFlow
} from '../controllers/cashflow.js';

const cashflowRouter = express.Router();

// Upload Excel data (bulk insert)
cashflowRouter.post('/upload', uploadCashFlow);

// Get chart data by year
cashflowRouter.get('/', getCashFlow);

// CRUD
cashflowRouter.post('/', createCashFlow);
cashflowRouter.put('/:id', updateCashFlow);
cashflowRouter.delete('/:id', deleteCashFlow);

export default cashflowRouter;
