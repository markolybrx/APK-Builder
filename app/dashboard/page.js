export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getServerSession } from "next-auth";
// Import from the file we just fixed above
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { clientPromise } from "@/lib/db"; 
import { redirect } from "next/navigation";
import { Plus, Search, Terminal, Smartphone, Calendar, Package } from 'lucide-react';

async function getProjects(userId) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Safely find projects
    const projects = await db.collection("projects")
      .find({ userId: userId })
      .sort({ updatedAt: -1 })
      .toArray();

    // Serialize data to prevent React hydration errors
    return projects.map(p => ({
      ...p,
      _id: p._id.toString(),
      userId: p.userId.toString(),
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
    }));

  } catch (error) {
    console.error("Database Error:", error);
    // Return empty array instead of crashing
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
    <div className="min-h-screen w-full bg-matte-900 text-white p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your Android apps.</p>
          </div>
          <div className="flex items-center gap-3">
             <Link 
              href="/dashboard/create" 
              className="flex items-center gap-2 bg-gradient-to-r from-neon-blue to-neon-purple text-black px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" />
              <span>New App</span>
            </Link>
          </div>
        </div>

        {/* List */}
        {projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-matte-border rounded-3xl bg-matte-800/30">
            <h3 className="text-xl font-bold text-white">No apps yet</h3>
            <p className="text-slate-400 mb-6">Create your first project to get started.</p>
            <Link href="/dashboard/create" className="text-neon-blue hover:underline">Create Project</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project._id} href={`/dashboard/${project._id}`} className="block p-6 bg-matte-800 border border-matte-border rounded-2xl hover:border-neon-blue/50 transition-colors">
                <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                <p className="text-slate-400 text-sm">{project.description}</p>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
