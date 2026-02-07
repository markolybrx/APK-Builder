import Link from 'next/link';
import { Card } from '../ui/Card';

export default function ProjectCard({ project }) {
  const statusColors = {
    success: "text-green-400 bg-green-400/10",
    failed: "text-red-400 bg-red-400/10",
    building: "text-yellow-400 bg-yellow-400/10",
    default: "text-slate-400 bg-slate-400/10"
  };

  const statusColor = statusColors[project.buildStatus] || statusColors.default;

  return (
    <Link href={`/dashboard/${project._id}`}>
      <Card className="hover:border-blue-500/50 transition-colors cursor-pointer h-full group">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-lg">
            📱
          </div>
          <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider ${statusColor}`}>
            {project.buildStatus}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {project.name}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2">
          {project.description}
        </p>
      </Card>
    </Link>
  );
}
