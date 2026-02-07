import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  
  // GitHub Integration
  githubRepo: { 
    type: String, 
    required: true 
  }, // e.g., "username/pizza-app"
  
  githubUrl: { 
    type: String 
  }, // e.g., "https://github.com/username/pizza-app"
  
  // Build Tracking
  buildStatus: { 
    type: String, 
    enum: ['idle', 'generating', 'pushing', 'building', 'success', 'failed'], 
    default: 'idle' 
  },
  
  latestApkUrl: { 
    type: String 
  }, // URL to download the APK
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// This check prevents Mongoose from recompiling the model during hot reloads
export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
