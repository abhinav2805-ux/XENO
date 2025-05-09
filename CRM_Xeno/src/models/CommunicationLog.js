import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['SENT', 'FAILED'], required: true },
  message: String,
  sentAt: Date,
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.CommunicationLog || mongoose.model('CommunicationLog', logSchema);