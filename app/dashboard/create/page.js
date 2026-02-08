"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Smartphone, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateProject() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Create project in DB only (No GitHub yet)
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create project");

      const data = await res.json();
      
      // 2. Redirect to the new Workspace
      router.push(`/dashboard/${data.projectId}`);
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-matte-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-xl flex items-center justify-center shadow-lg shadow-neon-blue/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">Create New App</h2>
          <p className="mt-2 text-sm text-slate-400">
            Describe your idea, and we'll set up the environment.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-2xl bg-matte-800 border border-matte-border p-6 shadow-xl space-y-4">
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                App Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 bg-matte-900 border border-matte-border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent transition-all"
                placeholder="e.g. Fitness Tracker"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full px-4 py-3 bg-matte-900 border border-matte-border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent transition-all"
                placeholder="What does this app do?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

          </div>

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="w-full flex justify-center py-3 px-4 border border-matte-border rounded-xl shadow-sm text-sm font-medium text-slate-300 bg-matte-800 hover:bg-matte-700 focus:outline-none transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-neon-blue/20 text-sm font-bold text-black bg-gradient-to-r from-neon-blue to-neon-purple hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Create Workspace"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
