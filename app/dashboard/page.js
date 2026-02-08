export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { headers } from 'next/headers';
import { Plus, Search, Terminal, Smartphone, Calendar, Package } from 'lucide-react';

async function getProjects() {
  try {
    // Ensure NEXTAUTH_URL is set in your .env.local (e.g., http://localhost:3000)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/projects`, {
      cache: 'no-store',
      headers: headers(),
    });
    
    if (!res.ok) return [];
    const json = await res.json();
    return json.projects || [];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export default async function Dashboard() {
  const projects = await getProjects();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your Android apps and builds.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search Bar (Visual) */}
          <div className="relative hidden md:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="bg-slate-900 border border-slate-700 text-sm text-white pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all w-64"
            />
          </div>

          <Link 
            href="/dashboard/create" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
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
  );
}

// --- Components ---

function ProjectCard({ project }) {
  // Format Date (e.g., "Feb 14, 2024")
  const date = new Date(project.updatedAt || Date.now()).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  return (
    <Link href={`/dashboard/${project._id}`} className="group block h-full">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 h-full hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 relative overflow-hidden">
        
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 group-hover:border-blue-500/30 transition-colors">
            <Smartphone className="w-6 h-6 text-blue-400" />
          </div>
          <StatusBadge status={project.buildStatus || 'draft'} />
        </div>

        {/* Title & Desc */}
        <div className="relative z-10 mb-6">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
            {project.name}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 min-h-[40px]">
            {project.description || "No description provided."}
          </p>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 relative z-10 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            <span className="font-mono">{project.packageName || "com.app.draft"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
        </div>

      </div>
    </Link>
  );
}

function StatusBadge({ status }) {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
    building: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    draft: "bg-slate-700/30 text-slate-400 border-slate-600/30"
  };

  const labels = {
    success: "Ready",
    failed: "Failed",
    building: "Building",
    draft: "Draft"
  };

  return (
    <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold border ${styles[status] || styles.draft}`}>
      {labels[status] || status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
        <Terminal className="w-10 h-10 text-slate-600" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No apps created yet</h3>
      <p className="text-slate-400 max-w-sm text-center mb-8">
        Your dashboard is looking a bit empty. Start your first AI-powered Android project now.
      </p>
      <Link 
        href="/dashboard/create" 
        className="px-6 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-colors"
      >
        Create Project
      </Link>
    </div>
  );
}
