import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    index: true 
  },
  csvImportId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    index: true 
  },
  campaignId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Campaign',
    required: false
  },
  name: String,
  email: String,
  phone: String,
}, { 
  strict: false,
  timestamps: true 
});

// Only index userId and csvImportId for better query performance
customerSchema.index({ userId: 1, csvImportId: 1 });

// Clear existing models to prevent OverwriteModelError
mongoose.models = {};

export default mongoose.model('Customer', customerSchema);