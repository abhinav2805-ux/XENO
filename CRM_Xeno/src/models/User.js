import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String, // Only for credentials users
  name: String,
  image: String,
  emailVerified: Date,
});

export default mongoose.models.User || mongoose.model('User', userSchema);