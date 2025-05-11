import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  customerId: { type: String, required: true },
  orderDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  items: [{ type: String }],
  uploadId: { type: String, required: true, index: true }, // <-- Add this line
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);