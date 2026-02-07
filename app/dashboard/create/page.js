"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateApp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(""); // "creating_repo", "generating_code", "pushing"
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: ''
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Repository
      setStep("Creating GitHub Repository...");
      const repoRes = await fetch('/api/github/create-repo', {
        method: 'POST',
        body: JSON.stringify({ name: formData.name.replace(/\s+/g, '-').toLowerCase(), description: formData.description })
      });
      const repoData = await repoRes.json();
      if (!repoData.success) throw new Error(repoData.error);

      // 2. Save Project to DB
      setStep("Saving Project...");
      const projectRes = await fetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ 
          name: formData.name, 
          description: formData.description,
          repoName: repoData.repoName,
          repoUrl: repoData.repoUrl
        })
      });
      const projectData = await projectRes.json();
      
      // 3. AI Code Generation
      setStep("AI is writing your Android Code (This takes 30s)...");
      const genRes = await fetch('/api/generate/code', {
        method: 'POST',
        body: JSON.stringify({ prompt: formData.prompt })
      });
      const genData = await genRes.json();
      if (!genData.success) throw new Error("AI Failed to generate code");

      // 4. Commit to GitHub
      setStep("Pushing code to GitHub...");
      await fetch('/api/github/commit', {
        method: 'POST',
        body: JSON.stringify({
          repoName: repoData.repoName,
          files: genData.files,
          message: "Initial AI Generation"
        })
      });

      // Done! Redirect
      router.push(`/dashboard/${projectData.project._id}`);

    } catch (error) {
      alert("Error: " + error.message);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Create New App</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">App Name</label>
          <input 
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. My Pizza Shop"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Short Description</label>
          <input 
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
            placeholder="A simple app to order pizzas"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-blue-400">AI Prompt (The Magic)</label>
          <textarea 
            required
            rows={5}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your app in detail. E.g., 'Create a flashlight app with a big round button in the center that toggles the flash on and off. The background should be black.'"
            onChange={(e) => setFormData({...formData, prompt: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${loading ? 'bg-slate-700 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20'}`}
        >
          {loading ? step : "Generate App 🚀"}
        </button>
      </form>
    </div>
  );
}
