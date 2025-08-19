import mongoose from "mongoose";
import xlsx from "xlsx";
import Cashflow from "../models/cashflow.js";

// Connect mongodb://127.0.0.1:27017/cashflowDB
mongoose.set("strictQuery", true); // fix warning
mongoose.connect("mongodb+srv://testUser:test123@cluster0.bq15jz4.mongodb.net/metal_dashboard?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load Excel
const workbook = xlsx.readFile("./cashflow.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// Helper to parse numbers
const toNum = (val) => {
  if (!val || typeof val !== "string") return Number(val) || 0;
  return Number(val.replace(/[$,]/g, "")) || 0;
};

async function parseAndSave() {
  try {
    const years = data[0].slice(1, 7).map((y) => Number(y)); // 2020–2025

    for (let i = 0; i < years.length; i++) {
      const year = years[i];

      // --- Summary (rows 3–6) ---
      const summary = {
        grossProfit: toNum(data[3]?.[i + 1]),
        constructionIncome: toNum(data[4]?.[i + 1]),
        totalOtherExpenses: toNum(data[5]?.[i + 1]),
        netOperatingIncome: toNum(data[6]?.[i + 1]),
      };

      // --- Expenses (rows 11–40) ---
      const expenses = [];
      for (let r = 11; r <= 40; r++) {
        if (data[r] && data[r][0]) {
          expenses.push({
            name: data[r][0],
            amount: toNum(data[r][i + 1]),
          });
        }
      }

      // --- Other Income (rows 43–46) ---
      const otherIncome = {
        returnIncome: toNum(data[43]?.[i + 1]),
        taxes: toNum(data[44]?.[i + 1]),
        netOtherIncome: toNum(data[45]?.[i + 1]),
      };

      // --- Cost of Goods (rows 50–56) ---
      const costOfGoods = {
        constructionMaterials: toNum(data[50]?.[i + 1]),
        equipmentRental: toNum(data[51]?.[i + 1]),
        jobMaterialsPurchased: toNum(data[52]?.[i + 1]),
        otherConstructionCosts: toNum(data[53]?.[i + 1]),
        subcontractors: toNum(data[54]?.[i + 1]),
        toolsAndEquipment: toNum(data[55]?.[i + 1]),
        workersCompInsurance: toNum(data[56]?.[i + 1]),
      };

      // Save to Mongo
      await Cashflow.findOneAndUpdate(
        { year },
        { year, summary, expenses, otherIncome, costOfGoods },
        { upsert: true, new: true }
      );

      console.log(`✔ Inserted/Updated year ${year}`);
    }

    mongoose.connection.close();
    console.log("✅ Import finished.");
  } catch (err) {
    console.error("❌ Error:", err);
    mongoose.connection.close();
  }
}

parseAndSave();
