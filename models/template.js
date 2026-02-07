import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  
  // The "Recipe"
  prompt: { type: String, required: true }, // The prompt used to generate this
  
  // Visuals
  iconUrl: { type: String },
  
  // Metadata
  authorName: { type: String },
  clones: { type: Number, default: 0 }, // How many people used this?
  isPublic: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Template || mongoose.model('Template', TemplateSchema);
