// importExcel.js (ESM - Node)
import mongoose from "mongoose";
import XLSX from "xlsx";
import path from "path";
import dotenv from "dotenv";
import FinancialRecord from "../models/financialRecord.js"; // adjust path if needed

dotenv.config();

const EXCEL_FILE = "data.xlsx"; // file in same dir

// helper: parse currency strings like "$1,234.56", "(1,234.56)", "-1,234.56"
function parseCurrency(raw) {
  if (raw === null || raw === undefined) return 0;
  let s = String(raw).trim();
  if (s === "" || s.toLowerCase() === "n/a") return 0;

  // detect parentheses (negative)
  const isParen = /^\(.*\)$/.test(s);
  // remove anything except digits, dot and minus
  // but keep leading minus
  s = s.replace(/[^\d.\-()]/g, "");
  // remove parentheses if any
  s = s.replace(/[\(\)]/g, "");
  if (s === "" || s === "-" ) return 0;
  const val = parseFloat(s);
  if (isNaN(val)) return 0;
  return isParen ? -val : val;
}

// normalize month strings, return like 'Jan','Feb',...
function normalizeMonth(m) {
  if (!m) return "";
  const s = String(m).trim();
  if (s.length === 0) return "";
  const lower = s.toLowerCase();
  const map = {
    jan: "Jan", january: "Jan",
    feb: "Feb", february: "Feb",
    mar: "Mar", march: "Mar",
    apr: "Apr", april: "Apr",
    may: "May",
    jun: "Jun", june: "Jun",
    jul: "Jul", july: "Jul",
    aug: "Aug", august: "Aug",
    sep: "Sep", sept: "Sep", september: "Sep",
    oct: "Oct", october: "Oct",
    nov: "Nov", november: "Nov",
    dec: "Dec", december: "Dec"
  };
  const key = lower.slice(0,3);
  return map[key] || s;
}
// mongodb://localhost:27017/metal_dashboard
// "mongodb+srv://testUser:test123@cluster0.bq15jz4.mongodb.net/metal_dashboard?retryWrites=true&w=majority" || 
async function run() {
  try {
    await mongoose.connect("mongodb+srv://testUser:test123@cluster0.bq15jz4.mongodb.net/metal_dashboard?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    const wb = XLSX.readFile(EXCEL_FILE);
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }); // array of arrays

    // Find header row index: row that contains 'Month' (case-insensitive) and 'INVOICES' or 'BANK'
    let headerRowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i].map(c => String(c).trim().toLowerCase());
      if (r.some(c => c === "month") && (r.some(c => c.includes("invoice")) || r.some(c => c.includes("invoices")) || r.some(c => c.includes("bank")))) {
        headerRowIndex = i;
        break;
      }
    }
    if (headerRowIndex === -1) {
      console.error("Could not find header row (containing 'Month' & 'INVOICES'/'BANK'). Please check sheet.");
      process.exit(1);
    }
    const headerRow = rows[headerRowIndex];

    // Build mapping of column index -> field name by matching header labels
    const colMap = {}; // month, invoices, bankDeposits, cashPayments, grossIncome, operationalCost, projectedEbitda, ebitda
    headerRow.forEach((cell, idx) => {
      const h = String(cell).trim().toLowerCase();
      if (!h) return;
      if (h === "month") colMap.month = idx;
      else if (h.includes("invoice")) colMap.invoices = idx;
      else if (h.includes("bank deposit") || (h.includes("bank") && h.includes("deposit")) || (h.includes("bank") && h.includes("depos"))) colMap.bankDeposits = idx;
      else if (h.includes("cash") && h.includes("payment")) colMap.cashPayments = idx;
      else if (h.includes("gross income") || h.includes("total gross")) colMap.grossIncome = idx;
      else if (h.includes("operational")) colMap.operationalCost = idx;
      else if (h.includes("adjusted ebitda") || h.includes("adjusted")) colMap.adjustedEbitda = idx;
      else if (h.includes("estimated ebitda") || h.includes("estimated")) colMap.ebitda = idx;
      else if (h.includes("current gross profit") || h.includes("current profit")) colMap.currentGrossProfit = idx;
      // fallback heuristics
      else if (h.includes("bank") && !colMap.bankDeposits) colMap.bankDeposits = idx;
      else if (h.includes("cash") && !colMap.cashPayments) colMap.cashPayments = idx;
    });

    console.log("Detected header row index:", headerRowIndex);
    console.log("Column mapping:", colMap);

    // find the column index for YEAR if present (first column often)
    // We'll treat any row where first cell is 4-digit number as year marker
    let currentYear = null;
    const records = [];

    for (let r = headerRowIndex + 1; r < rows.length; r++) {
      const row = rows[r];

      // if row is too short, skip
      if (!row || row.length === 0) continue;

      // check if first column is a year marker
      const firstCell = String(row[0]).trim();
      if (/^\d{4}$/.test(firstCell)) {
        currentYear = parseInt(firstCell, 10);
        continue; // header for new year row; skip
      }

      // get month cell from mapped index, or try index 1
      const monthIdx = colMap.month ?? 1;
      let monthCell = row[monthIdx] ?? "";
      monthCell = String(monthCell).trim();

      // skip Q1/Q2/Q3/Q4/YTD rows or rows with no month
      if (!monthCell || /^q[1-4]$/i.test(monthCell) || /^ytd$/i.test(monthCell) || monthCell.toLowerCase() === "month") {
        continue;
      }

      // If currentYear is still null, try to find year somewhere on previous rows (defensive)
      if (!currentYear) {
        // try look back up to 5 rows for a year
        for (let k = r - 1; k >= Math.max(0, r - 6); k--) {
          const tryYear = String(rows[k][0] ?? "").trim();
          if (/^\d{4}$/.test(tryYear)) {
            currentYear = parseInt(tryYear, 10);
            break;
          }
        }
      }

      // Build record using colMap, parse currency
      const record = {
        year: currentYear,
        month: normalizeMonth(monthCell),
        invoices: colMap.invoices !== undefined ? parseCurrency(row[colMap.invoices]) : 0,
        bankDeposits: colMap.bankDeposits !== undefined ? parseCurrency(row[colMap.bankDeposits]) : 0,
        cashPayments: colMap.cashPayments !== undefined ? parseCurrency(row[colMap.cashPayments]) : 0,
        grossIncome: colMap.grossIncome !== undefined ? parseCurrency(row[colMap.grossIncome]) : 0,
        operationalCost: colMap.operationalCost !== undefined ? parseCurrency(row[colMap.operationalCost]) : 0,
        adjustedEbitda: colMap.adjustedEbitda !== undefined ? parseCurrency(row[colMap.adjustedEbitda]) : 0,
        ebitda: colMap.ebitda !== undefined ? parseCurrency(row[colMap.ebitda]) : 0,
        currentGrossProfit: colMap.currentGrossProfit !== undefined ? parseCurrency(row[colMap.currentGrossProfit]) : 0
      };

      // Basic sanity check: month must be one of expected strings
      if (!record.month) {
        console.warn(`Skipping row ${r} - invalid month cell:`, monthCell);
        continue;
      }
      records.push(record);
    }

    console.log("Sample parsed records (first 6):", records.slice(0, 6));
    console.log("Total parsed monthly records:", records.length);

    if (records.length === 0) {
      console.error("No records parsed — please check header detection and sheet structure.");
      process.exit(1);
    }

    // OPTIONAL: delete existing matching years to avoid duplicates
    // const years = [...new Set(records.map(r => r.year))];
    // await FinancialRecord.deleteMany({ year: { $in: years } });

    // Insert
    await FinancialRecord.insertMany(records);
    console.log("Inserted", records.length, "records");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Import error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

run();
