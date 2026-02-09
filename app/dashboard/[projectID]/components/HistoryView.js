import { Clock, RotateCcw, ScanLine, Circle, Zap, MousePointer2, GitCommit } from "lucide-react";

export default function HistoryView({ triggerHaptic }) {
  // --- AUDIT DATA ---
  const auditLogs = [
    { 
      id: 1, 
      tool: 'Clone Vision', 
      icon: ScanLine, 
      time: 'Just now', 
      desc: 'Generated activity_main.xml from screenshot', 
      color: 'text-pink-400',
      active: true 
    },
    { 
      id: 2, 
      tool: 'Behavior Recorder', 
      icon: Circle, 
      time: '12 mins ago', 
      desc: 'Injected onClick listeners into MainActivity.kt', 
      color: 'text-red-400',
      active: false 
    },
    { 
      id: 3, 
      tool: 'Logic Map', 
      icon: Zap, 
      time: '1 hour ago', 
      desc: 'Modified AndroidManifest.xml navigation flow', 
      color: 'text-blue-400',
      active: false 
    },
    { 
      id: 4, 
      tool: 'AI Chat', 
      icon: MousePointer2, 
      time: '2 hours ago', 
      desc: 'Refactored theme colors in colors.xml', 
      color: 'text-purple-400',
      active: false 
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300 font-sans overflow-hidden">

      {/* 1. PINNED HEADER (Shrink-0) */}
      <div className="h-14 border-b border-slate-800 flex items-center px-4 bg-slate-900 shrink-0 z-10">
        <Clock className="w-4 h-4 mr-2 text-blue-400" />
        <span className="font-bold text-white tracking-widest uppercase text-[10px]">AI Audit Log & History</span>
      </div>

      {/* 2. SCROLLABLE TIMELINE ZONE */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950/20">
        <div className="relative border-l border-slate-800 ml-4 space-y-8 pb-8">
            {auditLogs.map((log) => (
                <div key={log.id} className="relative pl-8 group animate-in fade-in slide-in-from-left-2 duration-300">

                    {/* Tool-Specific Indicator */}
                    <div className={`
                        absolute -left-[14px] top-1 w-7 h-7 rounded-lg border border-slate-800 flex items-center justify-center bg-[#0f172a]
                        ${log.active ? 'ring-2 ring-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : ''}
                    `}>
                        <log.icon className={`w-3.5 h-3.5 ${log.color}`} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-tight ${log.active ? 'text-white' : 'text-slate-500'}`}>
                                {log.tool}
                            </span>
                            {log.active && (
                                <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-bold uppercase">
                                    Current State
                                </span>
                            )}
                            <span className="text-[10px] text-slate-600 ml-auto font-mono uppercase tracking-tighter">{log.time}</span>
                        </div>

                        {/* Detailed Change Log Card */}
                        <div className={`
                            text-sm p-4 rounded-xl border transition-all duration-300
                            ${log.active ? 'bg-blue-600/5 border-blue-500/20 text-slate-200 shadow-lg' : 'bg-slate-900/50 border-slate-800 text-slate-400'}
                        `}>
                            <div className="flex items-center gap-2 mb-2">
                                <GitCommit className="w-3 h-3 opacity-30" />
                                <span className="font-mono text-[9px] opacity-40 uppercase">Commit: {Math.random().toString(16).slice(2, 8)}</span>
                            </div>
                            <p className="leading-relaxed text-xs md:text-sm">{log.desc}</p>
                        </div>

                        {!log.active && (
                            <button 
                                onClick={() => { triggerHaptic(); }}
                                className="self-start flex items-center gap-1.5 text-[9px] font-bold text-blue-400 hover:text-white mt-2 px-3 py-1.5 bg-slate-800/50 hover:bg-blue-600 rounded-lg border border-slate-700 transition-all active:scale-95"
                            >
                                <RotateCcw className="w-3 h-3" />
                                RESTORE VERSION
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 3. PINNED FOOTER DISCLAIMER (Shrink-0) */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
         <p className="text-[9px] text-slate-500 leading-relaxed italic text-center uppercase tracking-tighter">
            * All code changes are verified by the AI Design Critique before being committed to your project state.
         </p>
      </div>
    </div>
  );
}
