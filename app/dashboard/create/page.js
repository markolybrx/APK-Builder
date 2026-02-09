"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateProject() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      description: formData.get("description")
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || json.details || "Failed to create project");
      }

      // Success! Redirect to the new project dashboard
      router.push(`/dashboard/${json.projectId}`);

    } catch (err) {
      console.error(err);
      setError(err.message); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 pt-24">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Create New App</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-200 text-sm rounded-lg">
            Error: {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* App Name Input */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">App Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="e.g. My Fitness Tracker"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
            <textarea
              name="description"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
              rows={4}
              placeholder="Describe what your app should do..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Link 
              href="/dashboard" 
              className="flex-1 py-3 text-center text-slate-400 border border-slate-700 hover:bg-slate-800 rounded-lg transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create App"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
