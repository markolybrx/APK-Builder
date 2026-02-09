import { Clock, GitCommit, RotateCcw } from "lucide-react";

export default function HistoryView({ triggerHaptic }) {
  // Mock History Data
  const commits = [
    { id: 1, version: 'v0.2.1', time: 'Just now', desc: 'Auto-save: Updated WorkspaceUI layout', active: true },
    { id: 2, version: 'v0.2.0', time: '10 mins ago', desc: 'Added NavigationRail component', active: false },
    { id: 3, version: 'v0.1.5', time: '1 hour ago', desc: 'Implemented Voice Control', active: false },
    { id: 4, version: 'v0.1.0', time: 'Yesterday', desc: 'Project Initialized', active: false },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300">
      
      {/* Header */}
      <div className="h-14 border-b border-slate-800 flex items-center px-4 bg-slate-900 shrink-0">
        <span className="font-bold text-white tracking-wide">Version History</span>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="relative border-l border-slate-800 ml-4 space-y-8">
            {commits.map((commit) => (
                <div key={commit.id} className="relative pl-8">
                    {/* Dot on Timeline */}
                    <div className={`
                        absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f172a]
                        ${commit.active ? 'bg-green-500' : 'bg-slate-600'}
                    `} />
                    
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${commit.active ? 'text-green-400' : 'text-slate-200'}`}>
                                {commit.version}
                            </span>
                            {commit.active && (
                                <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">
                                    Current
                                </span>
                            )}
                            <span className="text-xs text-slate-500 ml-auto font-mono">{commit.time}</span>
                        </div>
                        
                        <p className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                            {commit.desc}
                        </p>

                        {!commit.active && (
                            <button 
                                onClick={() => { triggerHaptic(); alert(`Restored to ${commit.version}`); }}
                                className="self-start flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mt-1 px-2 py-1 hover:bg-slate-800 rounded transition-colors"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Restore this version
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}