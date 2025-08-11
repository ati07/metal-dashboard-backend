// import FinancialRecord from '../models/financialRecord.js';

import FinancialRecord from "../models/financialRecord.js";

/**
 * Add a new financial record
 */
export const addFinancialRecord = async (req, res) => {
  try {
    const record = new FinancialRecord(req.body);
    await record.save();
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get all records (optionally filter by year or quarter)
 * Example: /api/financial-records?year=2023&quarter=1
 */
export const getFinancialRecords = async (req, res) => {
  try {
    const { year, quarter } = req.query;
    const filter = { isDelete: false };

    if (year) filter.year = parseInt(year);
    if (quarter) filter.quarter = parseInt(quarter);

    const records = await FinancialRecord.find(filter).sort({ monthNumber: 1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get records for chart (ready for Recharts)
 * Returns only the fields needed for chart plotting
 */
export const getChartData = async (req, res) => {
  try {
    const { year, quarter } = req.query;
    const filter = { isDelete: false };

    if (year) filter.year = parseInt(year);
    if (quarter) filter.quarter = parseInt(quarter);

    const data = await FinancialRecord.find(filter, {
      _id: 0,
      month: 1,
      adjustedEBITDA: 1,
      projectedEBITDA: 1,
      bankDeposits: 1,
      invoices: 1,
      cashPayments: 1,
      operationalCosts: 1,
      grossProfit: 1
    }).sort({ monthNumber: 1 });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update a financial record
 */
export const updateFinancialRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await FinancialRecord.findByIdAndUpdate(id, req.body, { new: true });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Soft delete a record
 */
export const deleteFinancialRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await FinancialRecord.findByIdAndUpdate(id, { isDelete: true }, { new: true });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
