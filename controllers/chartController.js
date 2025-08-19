// controllers/chartController.js
import FinancialRecord from '../models/financialRecord.js';
import tryCatch from './utils/tryCatch.js';

// Upload bulk records (from Excel)
export const uploadFinancialData = tryCatch(async (req, res) => {
  const data = req.body.records; // Array from Excel parser
  await FinancialRecord.insertMany(data);
  res.status(201).json({ success: true, message: "Data uploaded successfully" });
});

// Get data for charts (monthly + quarterly)
export const getChartData = tryCatch(async (req, res) => {
  const { chart, year } = req.query;
  if (!chart || !year) {
    return res.status(400).json({ success: false, message: "Chart and year are required" });
  }

  const records = await FinancialRecord.find({ year: Number(year) }).sort({ _id: 1 });

  const monthly = records.map(r => ({
    month: r.month,
    ...(chart === "ebitda" && { estimatedNetProfit: r.estimatedNetProfit, ebitda: r.ebitda }),
    ...(chart === "bankDeposits" && { bankDeposits: r.bankDeposits, cashPayments: r.cashPayments }),
    ...(chart === "adjustedNetProfit" && { adjustedNetProfit: r.adjustedNetProfit, ebitda: r.ebitda }),
    ...(chart === "grossIncome" && { grossIncome: r.grossIncome, operationalCost: r.operationalCost })
  }));

  const quarters = {
    Q1: monthly.slice(0, 3),
    Q2: monthly.slice(3, 6),
    Q3: monthly.slice(6, 9),
    Q4: monthly.slice(9, 12)
  };

  const quarterly = Object.keys(quarters).map(q => ({
    quarter: q,
    months: quarters[q]
  }));

  res.status(200).json({
    year: Number(year),
    monthly,
    quarterly
  });
});

// Basic CRUD
export const createRecord = tryCatch(async (req, res) => {
  const record = new FinancialRecord(req.body);
  await record.save();
  res.status(201).json({ success: true, message: "Record created", record });
});

export const updateRecord = tryCatch(async (req, res) => {
  const { id } = req.params;
  const updated = await FinancialRecord.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ success: true, message: "Record updated", updated });
});

export const deleteRecord = tryCatch(async (req, res) => {
  const { id } = req.params;
  await FinancialRecord.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "Record deleted" });
});
