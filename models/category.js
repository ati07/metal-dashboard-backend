import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    addedBy: { type: mongoose.Types.ObjectId },
    name: { type: String },
    isDelete:{ type: Boolean, default: false },
    isActive:{ type: Boolean, default: true }, 

},{timestamps:true});

const Category = mongoose.model("Category",CategorySchema);
export default Category;