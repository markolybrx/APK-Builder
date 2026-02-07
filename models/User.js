import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true }, // The email from GitHub
  image: { type: String }, // Their GitHub profile picture
  githubId: { type: String, unique: true }, // Important: Connects to GitHub API
  
  // Feature: Credits System (Optional - limits users to 3 apps for now)
  credits: { type: Number, default: 3 }, 
  
  createdAt: { type: Date, default: Date.now }
});

// This line prevents the "OverwriteModelError" when Next.js reloads
export default mongoose.models.User || mongoose.model('User', UserSchema);
