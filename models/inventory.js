import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    addedBy: { type: mongoose.Types.ObjectId },
    vendorId: { type: mongoose.Types.ObjectId },
    categoryId: { type: mongoose.Types.ObjectId },
    sku: { type: String },
    component: { type: String },
    measurementType: { type: String},
    amountOnStock: { type: String },
    location: { type: String },
    purchasePrice: { type: String },
    lastUpdatedPrice: { type: String },
    isDelete:{ type: Boolean, default: false },
    isActive:{ type: Boolean, default: true }, 

},{timestamps:true});

const Inventory = mongoose.model("Inventory",InventorySchema);
export default Inventory