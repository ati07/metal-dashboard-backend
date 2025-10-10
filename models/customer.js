import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    addedBy: { type: mongoose.Types.ObjectId },
    name: { type: String },  
    firstName: { type: String },  
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    city: { type: String },
    comments: { type: String },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });   
const Customer = mongoose.model('Customer', customerSchema);
export default Customer;