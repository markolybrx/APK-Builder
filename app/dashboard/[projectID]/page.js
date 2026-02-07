import Link from 'next/link';
import connectDB from '@/lib/db';
import Project from '@/models/Project';

// Need to force dynamic to see status updates on refresh
export const dynamic = 'force-dynamic';

async function getProject(id) {
  await connectDB();
  return Project.findById(id);
}

export default async function ProjectDetails({ params }) {
  const project = await getProject(params.projectId);

  if (!project) return <div>Project not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/dashboard" className="text-slate-400 hover:text-white mb-6 inline-block">← Back to Dashboard</Link>
      
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
            <p className="text-slate-400">{project.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500 mb-1">STATUS</div>
            <div className="text-xl font-bold uppercase tracking-wider text-blue-400">{project.buildStatus}</div>
          </div>
        </div>

        <hr className="my-8 border-slate-700" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Action Box */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            
            {project.buildStatus === 'success' ? (
              <a 
                href={project.latestApkUrl} 
                target="_blank"
                className="block w-full text-center bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold mb-3 transition-colors"
              >
                Download APK ⬇️
              </a>
            ) : (
              <button disabled className="block w-full bg-slate-700 text-slate-400 py-3 rounded-lg font-bold mb-3 cursor-not-allowed">
                {project.buildStatus === 'failed' ? 'Build Failed' : 'Building...'}
              </button>
            )}

            <a 
              href={project.githubUrl} 
              target="_blank"
              className="block w-full text-center border border-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg transition-colors"
            >
              View Source Code ↗
            </a>
          </div>

          {/* Info Box */}
          <div className="space-y-4 text-slate-300">
            <div>
              <span className="text-slate-500 block text-xs uppercase">Repository</span>
              <span className="font-mono text-sm">{project.githubRepo}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs uppercase">Created</span>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="bg-blue-900/20 p-4 rounded-lg text-sm text-blue-200">
              💡 <strong>Tip:</strong> If the status is "Building", refresh this page in 2-3 minutes. GitHub is compiling your app in the background.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
