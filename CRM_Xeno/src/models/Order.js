import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  orderDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  items: [{ type: String }],
  status: { type: String, default: 'PLACED' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);