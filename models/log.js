// models/Log.js
import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId },
  action: String,
  route: String,
  method: String,
  metadata: Object,
  timestamp: { type: Date, default: Date.now },
},{ timestamps: true });

let Log = mongoose.model('Log', LogSchema);
export default Log
