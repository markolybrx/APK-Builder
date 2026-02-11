"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, LayoutGrid, AlertCircle } from "lucide-react";

// ERROR FIX: Removed useRouter entirely. 
// We will use standard browser navigation to avoid the crash.

export default function CreateProject() {
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

      // NUCLEAR FIX: using window.location instead of router.push
      // This forces a hard reload, which clears memory and prevents crashes.
      window.location.href = `/dashboard/${json.projectId}`;

    } catch (err) {
      console.error(err);
      setError(err.message); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[80px] -z-10" />

      <div className="max-w-md w-full bg-black p-8 rounded-3xl border border-zinc-800 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Initialize Project</h2>
            <p className="text-zinc-500 text-sm mt-1">Configure your neural workspace</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">App Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              placeholder="e.g. Quantum Fitness Tracker"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Description</label>
            <textarea
              name="description"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              rows={4}
              placeholder="Describe the core features and logic..."
            />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-blue-600 hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(236,72,153,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Zap className="w-4 h-4 animate-pulse" /> Initializing...
                </>
              ) : (
                "Launch Workspace"
              )}
            </button>
            
            <Link 
              href="/dashboard" 
              className="w-full py-3 text-center text-zinc-500 hover:text-white font-bold text-sm transition-colors"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
