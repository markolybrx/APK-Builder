export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route"; 
import { clientPromise } from "@/lib/db"; 
import { redirect } from "next/navigation";
import { Plus, Search, Terminal, Smartphone, Calendar, Package, ArrowRight } from 'lucide-react';

async function getProjects(userId) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const projects = await db.collection("projects")
      .find({ userId: userId })
      .sort({ updatedAt: -1 })
      .toArray();

    return projects.map(p => ({
      ...p,
      _id: p._id.toString(),
      userId: p.userId.toString(),
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
    }));

  } catch (error) {
    console.error("Failed to fetch projects from DB:", error);
    return [];
  }
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const projects = await getProjects(session.user.id);

  return (
    // FIX: 'pt-24' pushes content down so it's not hidden behind the fixed header
    // FIX: 'bg-matte-900' applies the deep black theme
    <div className="min-h-screen w-full bg-matte-900 text-white p-4 md:p-8 pt-24">
      
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your Android apps and builds.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue transition-colors" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="bg-matte-800 border border-matte-border text-sm text-white pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all w-64 placeholder:text-slate-600"
              />
            </div>

            {/* New App Button */}
            <Link 
              href="/dashboard/create" 
              className="flex items-center gap-2 bg-gradient-to-r from-neon-blue to-neon-purple text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-neon-blue/20 hover:shadow-neon-blue/30 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>New App</span>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Components ---

function ProjectCard({ project }) {
  const dateStr = project.updatedAt ? new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  }) : "Just now";

  return (
    <Link href={`/dashboard/${project._id}`} className="group block h-full">
      <div className="bg-matte-800 border border-matte-border rounded-2xl p-6 h-full hover:border-neon-blue/50 hover:bg-matte-700 transition-all duration-300 relative overflow-hidden group-hover:shadow-[0_0_25px_-5px_rgba(96,165,250,0.1)]">

        {/* Header */}
        <div className="flex justify-between items-start mb-5 relative z-10">
          <div className="w-12 h-12 bg-matte-900 rounded-xl flex items-center justify-center border border-matte-border group-hover:border-neon-blue/30 transition-colors">
            <Smartphone className="w-6 h-6 text-neon-blue" />
          </div>
          <StatusBadge status={project.buildStatus || 'draft'} />
        </div>

        {/* Title & Desc */}
        <div className="relative z-10 mb-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
            {project.name}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 h-10 leading-relaxed">
            {project.description || "No description provided."}
          </p>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-matte-border relative z-10 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            <span className="font-mono opacity-70">{project.packageName || "com.app.draft"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span className="opacity-70">{dateStr}</span>
          </div>
        </div>

      </div>
    </Link>
  );
}

function StatusBadge({ status }) {
  // Custom colors for the matte theme
  const styles = {
    success: "bg-emerald-950/50 text-emerald-400 border-emerald-500/20",
    failed: "bg-red-950/50 text-red-400 border-red-500/20",
    building: "bg-amber-950/50 text-amber-400 border-amber-500/20",
    draft: "bg-matte-700 text-slate-400 border-matte-border"
  };

  const labels = {
    success: "Ready",
    failed: "Failed",
    building: "Building",
    draft: "Draft"
  };

  return (
    <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold border ${styles[status] || styles.draft}`}>
      {labels[status] || status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-matte-800/30 rounded-3xl border border-dashed border-matte-border">
      <div className="w-20 h-20 bg-matte-900 rounded-full flex items-center justify-center mb-6 border border-matte-border shadow-lg">
        <Terminal className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No apps created yet</h3>
      <p className="text-slate-400 max-w-sm text-center mb-8">
        Your dashboard is looking a bit empty. Start your first AI-powered Android project now.
      </p>
      <Link 
        href="/dashboard/create" 
        className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-xl shadow-white/5"
      >
        Create Project
      </Link>
    </div>
  );
}