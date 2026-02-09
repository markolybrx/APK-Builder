export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { clientPromise } from "@/lib/db"; 
// import { redirect } from "next/navigation"; // Commented out for Dev Mode
import { Plus, Smartphone, Package, ShieldAlert } from 'lucide-react';

async function getProjects(userId) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const projects = await db.collection("projects")
      .find({ userId: userId })
      .sort({ updatedAt: -1 })
      .toArray();

    // SANITIZATION: Convert EVERYTHING to pure JSON strings to prevent crashes
    const safeProjects = projects.map(p => ({
      _id: p._id.toString(),
      userId: p.userId.toString(),
      name: p.name || "Untitled",
      description: p.description || "",
      packageName: p.packageName || "com.app.draft",
      buildStatus: p.buildStatus || "draft",
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
    }));

    return JSON.parse(JSON.stringify(safeProjects));

  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // --- DEV MODE: SECURITY DISABLED ---
  // The redirect is commented out so the "Bypass Auth" button works
  // if (!session) {
  //   redirect('/api/auth/signin');
  // }
  // -----------------------------------

  // If no session exists, use a fake ID so the database query doesn't crash
  const userId = session?.user?.id || "dev-mode-user";
  const projects = await getProjects(userId);

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Dev Mode Warning Banner (Only shows if bypassed) */}
        {!session && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-3 rounded-xl flex items-center gap-3">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-sm font-medium">
              You are in <strong>Dev Mode</strong> (Logged out). Projects you create here will not be saved to a real account.
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your Android apps.</p>
          </div>
          <div className="flex items-center gap-3">
             <Link 
              href="/dashboard/create" 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>New App</span>
            </Link>
          </div>
        </div>

        {/* List */}
        {projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white">No apps yet</h3>
            <p className="text-slate-400 mb-6">Create your first project to get started.</p>
            <Link href="/dashboard/create" className="text-blue-400 hover:text-blue-300 font-medium">Create Project &rarr;</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project._id} href={`/dashboard/${project._id}`} className="block p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
                <div className="flex justify-between items-start mb-4">
                   <h3 className="text-xl font-bold text-white truncate group-hover:text-blue-400 transition-colors">{project.name}</h3>
                   <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                     {new Date(project.updatedAt).toLocaleDateString()}
                   </span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Smartphone className="w-3 h-3" />
                  <span>{project.packageName}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}