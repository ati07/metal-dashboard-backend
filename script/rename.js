import { MongoClient } from "mongodb";

const uri = "mongodb+srv://testUser:test123@cluster0.bq15jz4.mongodb.net/metal_dashboard?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("metal_dashboard");
    const collection = db.collection("financialrecords");

    // Step 1: rename ebitda → tmp
    await collection.updateMany({}, { $rename: { "ebitda": "tmp_estimatedNetProfit" } });

    // Step 2: rename others
    await collection.updateMany({}, {
      $rename: {
        "currentGrossProfit": "ebitda",
        "adjustedEbitda": "adjustedNetProfit"
      }
    });

    // Step 3: rename tmp → final
    await collection.updateMany({}, { $rename: { "tmp_estimatedNetProfit": "estimatedNetProfit" } });

    console.log("Renaming done!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
