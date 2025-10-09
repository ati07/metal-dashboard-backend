import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    addedBy: { type: mongoose.Types.ObjectId },
    vendorId: { type: mongoose.Types.ObjectId },
    categoryIds: [],
    sku: { type: String },
    component: { type: String },
    boxes: { type: String },
    unitsPerBox: { type: String },
    inch: { type: String },
    fraction: { type: String },
    measurementType: { type: String},
    amountOnStock: { type: String },
    location: { type: String },
    price: { type: String },
    unitaryPrice: { type: String },
    level: { type: String },
    lastUpdatedPrice: { type: String },
    isDelete:{ type: Boolean, default: false },
    isActive:{ type: Boolean, default: true }, 

},{timestamps:true});

const Inventory = mongoose.model("Inventory",InventorySchema);
export default Inventory