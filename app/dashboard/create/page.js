"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
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
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create project");
      }
      
      // Success! Go to dashboard or workspace
      router.push(`/dashboard/${data.projectId}`);
      router.refresh(); // Refresh to show new project in list
      
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-matte-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">New Project</h2>
          <p className="mt-2 text-slate-400">What are we building today?</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">App Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 bg-matte-800 border border-matte-border rounded-xl text-white focus:border-neon-blue outline-none"
                placeholder="My Awesome App"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <textarea
                rows={3}
                className="mt-1 block w-full px-4 py-3 bg-matte-800 border border-matte-border rounded-xl text-white focus:border-neon-blue outline-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard" className="w-full py-3 px-4 text-center border border-matte-border rounded-xl text-slate-300 hover:bg-matte-800">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 bg-neon-blue text-black font-bold rounded-xl hover:bg-neon-blue/90 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
