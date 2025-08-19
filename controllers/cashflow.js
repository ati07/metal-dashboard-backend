
import tryCatch from './utils/tryCatch.js';
import Cashflow from "../models/cashflow.js";

// Upload bulk records (from Excel)
export const uploadCashFlow = tryCatch(async (req, res) => {
  const data = req.body.records; // Array from Excel parser
  await Cashflow.insertMany(data);
  res.status(201).json({ success: true, message: "Data uploaded successfully" });
});

// Get data for charts by year
export const getCashFlow = tryCatch(async (req, res) => {

  try {
    const { chart, year } = req.query;

    if (!chart || !year) {
      return res.status(400).json({
        success: false,
        message: "Both 'chart' and 'year' query params are required"
      });
    }

    // find single record for the year
    const record = await Cashflow.findOne({ year: parseInt(year) }).lean();

    if (!record || !record[chart]) {
      return res.status(404).json({
        success: false,
        message: `No data found for ${chart} in ${year}`
      });
    }

    return res.json({
      success: true,
      year,
      chart,
      data: record[chart]   // return only the requested chart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }





  // const { chart, year } = req.query;
  // if (!chart || !year) {
  //   return res.status(400).json({ success: false, message: "Chart and year are required" });
  // }

  // const record = await Cashflow.findOne({ year: Number(year) });
  // if (!record) {
  //   return res.status(404).json({ success: false, message: "No data found for this year" });
  // }

  // let chartData;

  // switch (chart) {
  //   case "costOfGoods":
  //     chartData = Object.entries(record.costOfGoods).map(([key, value]) => ({
  //       name: key,
  //       amount: value
  //     }));
  //     break;

  //   case "expenses":
  //     chartData = record.expenses.map(e => ({
  //       name: e.name,
  //       amount: e.amount
  //     }));
  //     break;

  //   case "otherIncome":
  //     chartData = Object.entries(record.otherIncome).map(([key, value]) => ({
  //       name: key,
  //       amount: value
  //     }));
  //     break;

  //   case "summary":
  //     chartData = Object.entries(record.summary).map(([key, value]) => ({
  //       name: key,
  //       amount: value
  //     }));
  //     break;

  //   default:
  //     return res.status(400).json({ success: false, message: "Invalid chart type" });
  // }

  // res.status(200).json({
  //   success: true,
  //   year: record.year,
  //   chart,
  //   data: chartData
  // });
});

// Basic CRUD
export const createCashFlow = tryCatch(async (req, res) => {
  const record = new Cashflow(req.body);
  await record.save();
  res.status(201).json({ success: true, message: "Record created", record });
});

export const updateCashFlow = tryCatch(async (req, res) => {
  const { id } = req.params;
  const updated = await Cashflow.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ success: true, message: "Record updated", updated });
});

export const deleteCashFlow = tryCatch(async (req, res) => {
  const { id } = req.params;
  await Cashflow.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "Record deleted" });
});
