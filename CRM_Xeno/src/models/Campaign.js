import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sentAt: { type: Date },
  message: String,
  filters: mongoose.Schema.Types.Mixed,
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }], // store selected customers
  csvImportId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);