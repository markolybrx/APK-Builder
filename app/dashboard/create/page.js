"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Removed Lucide icons to prevent crashes

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

      if (!res.ok) throw new Error(json.error || "Failed to create");

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
        <h2 className="text-2xl font-bold text-white mb-6">New Project</h2>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 text-red-200 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-slate-400 mb-1">App Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
              placeholder="My App"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Description</label>
            <textarea
              name="description"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white"
              rows={4}
              placeholder="Describe your app..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link href="/dashboard" className="flex-1 py-3 text-center text-slate-400 border border-slate-800 rounded-lg">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white font-bold rounded-lg py-3"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}