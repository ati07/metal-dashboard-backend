import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    addedBy: { type: mongoose.Types.ObjectId },
    companyName: { type: String },
    categoryId: { type: mongoose.Types.ObjectId },    
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    location: { type: String },
    comments: { type: String },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });   
const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;