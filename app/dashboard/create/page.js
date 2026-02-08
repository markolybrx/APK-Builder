"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Only importing what we definitely need
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
        throw new Error(data.error || data.details || "Failed to create project");
      }
      
      // Success
      router.push(`/dashboard/${data.projectId}`);
      
    } catch (err) {
      console.error(err);
      setError(err.message); // Show the specific error on screen
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-matte-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-matte-800 p-8 rounded-2xl border border-matte-border shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">New Project</h2>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-slate-400 mb-1">App Name</label>
            <input
              type="text"
              required
              className="w-full bg-matte-900 border border-matte-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
              placeholder="My App"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">Description</label>
            <textarea
              className="w-full bg-matte-900 border border-matte-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/dashboard" className="flex-1 py-3 text-center text-slate-400 hover:text-white transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-neon-blue text-black font-bold rounded-lg py-3 hover:bg-neon-blue/90 disabled:opacity-50 flex justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
