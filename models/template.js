import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  
  // The "Recipe" for the AI
  prompt: { type: String, required: true },
  
  // Visuals
  iconUrl: { type: String },
  previewImages: [{ type: String }],
  
  // Usage stats
  clones: { type: Number, default: 0 },
  authorName: { type: String }, // e.g. "Community" or "User123"
  
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Template || mongoose.model('Template', TemplateSchema);
