// models/FinancialRecord.js
import mongoose from 'mongoose';

const FinancialRecordSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: String, required: true }, // Jan, Feb, etc.
  ebitda: { type: Number, default: 0 },
  adjustedEbitda: { type: Number, default: 0 },
  bankDeposits: { type: Number, default: 0 },
  invoices: { type: Number, default: 0 },
  cashPayments: { type: Number, default: 0 },
  operationalCost: { type: Number, default: 0 },
  grossIncome: { type: Number, default: 0 },
  currentGrossProfit: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('FinancialRecord', FinancialRecordSchema);
