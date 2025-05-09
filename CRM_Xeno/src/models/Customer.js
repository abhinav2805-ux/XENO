import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  // Core fields that should always exist
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  campaignId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Campaign', 
    required: true,
    index: true
  },
  
  // Common fields with specific types, but not required
  email: { 
    type: String, 
    trim: true,
    lowercase: true,
    index: true
  },
  name: { type: String, trim: true },
  phone: { type: String, trim: true },
  
  // All other fields will be dynamically added thanks to strict: false
}, { 
  timestamps: true, 
  strict: false,
  
  // This adds virtual getters to JSON responses
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound unique index: email+campaignId
// This prevents duplicate emails within the same campaign 
// but allows the same email in different campaigns
customerSchema.index({ email: 1, campaignId: 1 }, { unique: true, sparse: true });

// Pre-save middleware to ensure email is lowercase
customerSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer;