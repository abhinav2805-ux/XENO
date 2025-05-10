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
  // Add all possible name variations that might come from CSV
  name: String,
  firstName: String,
  lastName: String,
  fullName: String,
  customer_name: String,
  email: String,
  phone: String,
}, { 
  strict: false,
  timestamps: true 
});

// Virtual getter for name that tries different name fields
customerSchema.virtual('displayName').get(function() {
  return this.name || 
         this.fullName || 
         (this.firstName && this.lastName ? `${this.firstName} ${this.lastName}` : null) ||
         this.customer_name ||
         'N/A';
});

// Include virtuals when converting to JSON
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

// Only index userId and csvImportId for better query performance
customerSchema.index({ userId: 1, csvImportId: 1 });

// Clear existing models to prevent OverwriteModelError
mongoose.models = {};

export default mongoose.model('Customer', customerSchema);