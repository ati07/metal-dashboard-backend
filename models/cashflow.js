// models/cashflowModel.js
import  mongoose  from "mongoose"; // Ensure you have mongoose installed

const summarySchema = new mongoose.Schema({
  grossProfit: Number,
  constructionIncome: Number,
  totalOtherExpenses: Number,
  netOperatingIncome: Number
}, { _id: false });

const expensesSchema = new mongoose.Schema({
  name: String,
  amount: Number
}, { _id: false });

const otherIncomeSchema = new mongoose.Schema({
  returnIncome: Number,
  taxes: Number,
  netOtherIncome: Number
}, { _id: false });

const costOfGoodsSchema = new mongoose.Schema({
  constructionMaterials: Number,
  equipmentRental: Number,
  jobMaterialsPurchased: Number,
  otherConstructionCosts: Number,
  subcontractors: Number,
  toolsAndEquipment: Number,
  workersCompInsurance: Number
}, { _id: false });

const cashflowSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  summary: summarySchema,
  expenses: [expensesSchema],
  otherIncome: otherIncomeSchema,
  costOfGoods: costOfGoodsSchema,
  createdAt: { type: Date, default: Date.now }
});

// module.exports = mongoose.model("Cashflow", cashflowSchema);
const Cashflow = mongoose.model("Cashflow", cashflowSchema);

export default Cashflow;
