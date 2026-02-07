import Link from 'next/link';
import { headers } from 'next/headers';

async function getProjects() {
  // We fetch from our own API
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/projects`, {
    cache: 'no-store',
    headers: headers(),
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.projects;
}

export default async function Dashboard() {
  const projects = await getProjects();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Apps</h1>
        <Link 
          href="/dashboard/create" 
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          + Create New App
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
          <p className="text-slate-400 mb-4">You haven't built any apps yet.</p>
          <Link href="/dashboard/create" className="text-blue-400 hover:underline">Start your first project</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project._id} href={`/dashboard/${project._id}`}>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center text-2xl">
                    📱
                  </div>
                  <StatusBadge status={project.buildStatus} />
                </div>
                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    success: "bg-green-900/50 text-green-400",
    failed: "bg-red-900/50 text-red-400",
    building: "bg-yellow-900/50 text-yellow-400",
    default: "bg-slate-700 text-slate-300"
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wide font-bold ${styles[status] || styles.default}`}>
      {status}
    </span>
  );
}
