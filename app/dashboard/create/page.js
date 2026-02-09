"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; 
import Link from "next/link";

export default function CreateProject() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Send data to the API we just fixed
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // 2. Handle Errors
      if (!res.ok) {
        throw new Error(data.error || data.details || "Failed to create project");
      }

      // 3. Success - Redirect to the new project ID
      router.push(`/dashboard/${data.projectId}`);

    } catch (err) {
      console.error(err);
      setError(err.message); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Updated bg-matte to bg-slate-950 to ensure visibility
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 pt-24">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">New Project</h2>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center flex items-center justify-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-slate-400 mb-1">App Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="e.g. My Fitness Tracker"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Description</label>
            <textarea
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              rows={4}
              placeholder="Describe what your app should do..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href="/dashboard" className="flex-1 py-3 text-center text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-700 rounded-lg">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg py-3 hover:opacity-90 disabled:opacity-50 flex justify-center items-center shadow-lg shadow-blue-500/20"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}