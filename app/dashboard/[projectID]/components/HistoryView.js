"use client";

import { GitCommit, Clock, User, ChevronRight, RotateCcw } from "lucide-react";

export default function HistoryView({ triggerHaptic }) {
  // Mock Data: In a real app, this would come from your database
  const history = [
    { id: "v1.0.4", msg: "Added Contextual Lens overlay", time: "Just now", author: "Visionary AI", type: "ai" },
    { id: "v1.0.3", msg: "Refactored MainActivity.kt", time: "2 mins ago", author: "Visionary AI", type: "ai" },
    { id: "v1.0.2", msg: "Imported assets from GitHub", time: "10 mins ago", author: "User", type: "user" },
    { id: "v1.0.1", msg: "Project Initialized", time: "1 hour ago", author: "System", type: "system" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-slate-300 font-sans">
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]">
         <div className="flex items-center gap-2 font-bold text-white">
            <Clock className="w-5 h-5 text-orange-500" />
            <span>Version History</span>
         </div>
         <div className="text-[10px] font-mono text-slate-500">BRANCH: MAIN</div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
         {history.map((item, i) => (
            <div key={item.id} className="relative pl-8 group">
                {/* Timeline Line */}
                {i !== history.length - 1 && (
                    <div className="absolute top-3 left-[11px] w-[2px] h-full bg-slate-800 group-hover:bg-blue-900 transition-colors" />
                )}
                
                {/* Timeline Dot */}
                <div className={`absolute top-1 left-0 w-6 h-6 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center z-10
                    ${item.type === 'ai' ? 'bg-purple-500' : item.type === 'user' ? 'bg-blue-500' : 'bg-slate-600'}
                `}>
                    <GitCommit className="w-3 h-3 text-white" />
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-white text-sm">{item.msg}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{item.id}</span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <User className="w-3 h-3" /> {item.author}
                                </span>
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-500">{item.time}</span>
                    </div>
                    
                    <button 
                        onClick={() => triggerHaptic?.()}
                        className="mt-2 text-[10px] font-bold text-blue-400 flex items-center gap-1 hover:text-white transition-colors"
                    >
                        <RotateCcw className="w-3 h-3" /> Rollback to this version
                    </button>
                </div>
            </div>
         ))}
      </div>
    </div>
  );
}