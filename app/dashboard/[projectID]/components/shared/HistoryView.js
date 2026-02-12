"use client";

import { useState } from "react";
import { GitCommit, Clock, User, RotateCcw, Zap, Users, ArrowRight } from "lucide-react";

export default function HistoryView({ triggerHaptic }) {
  const [activeTab, setActiveTab] = useState("timeline"); // timeline | sync

  // --- 1. LOCAL AUDIT LOGS ---
  const localHistory = [
    { id: "v1.0.4", msg: "Added Contextual Lens overlay", time: "Just now", author: "You", type: "user" },
    { id: "v1.0.3", msg: "Refactored MainActivity.kt", time: "12 mins ago", author: "Visionary AI", type: "ai" },
    { id: "v1.0.2", msg: "Integrated SensorBridge telemetry", time: "45 mins ago", author: "You", type: "user" },
  ];

  // --- 2. MULTIPLAYER NEURAL SYNC LOGS ---
  const neuralSyncHistory = [
    { id: "sync_01", msg: "Updated primary button colors", time: "5 mins ago", author: "Architect_Z", color: "text-pink-500" },
    { id: "sync_02", msg: "Modified SensorBridge logic", time: "15 mins ago", author: "NeonDev_99", color: "text-blue-500" },
    { id: "sync_03", msg: "Injected Splash Screen drawable", time: "1 hour ago", author: "Visionary AI", color: "text-purple-500" },
  ];

  return (
    <div className="flex flex-col h-full bg-black text-zinc-400 font-sans border-l border-zinc-800 animate-in slide-in-from-right duration-300">

      {/* HEADER & TABS */}
      <div className="flex flex-col bg-zinc-900/20 border-b border-zinc-800 shrink-0">
         <div className="h-14 flex items-center justify-between px-4">
            <div className="flex items-center gap-2 font-bold text-white uppercase tracking-tighter text-xs">
                <Clock className="w-4 h-4 text-pink-500" />
                <span>Neural Logs</span>
            </div>
            <div className="text-[9px] font-mono text-zinc-600 border border-zinc-800 px-1.5 rounded bg-black">v2.0.4-SYNC</div>
         </div>

         {/* TAB SWITCHER */}
         <div className="flex px-4 gap-4">
            <button 
                onClick={() => { triggerHaptic?.(); setActiveTab('timeline'); }}
                className={`flex items-center gap-2 pb-2 text-[10px] font-bold transition-all border-b-2 uppercase tracking-wide
                ${activeTab === 'timeline' ? 'border-pink-500 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
            >
                <GitCommit className="w-3 h-3" /> Timeline
            </button>
            <button 
                onClick={() => { triggerHaptic?.(); setActiveTab('sync'); }}
                className={`flex items-center gap-2 pb-2 text-[10px] font-bold transition-all border-b-2 uppercase tracking-wide
                ${activeTab === 'sync' ? 'border-blue-500 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
            >
                <Users className="w-3 h-3" /> Neural Sync
            </button>
         </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

         {activeTab === 'timeline' ? (
            // PERSONAL TIMELINE RENDERER
            <div className="relative border-l border-zinc-800 ml-3 space-y-6">
                {localHistory.map((item) => (
                    <div key={item.id} className="relative pl-6 group">
                        {/* Connector Dot */}
                        <div className={`absolute top-1 -left-[5px] w-2.5 h-2.5 rounded-full border-2 border-black ${item.type === 'ai' ? 'bg-pink-500' : 'bg-blue-500'} z-10`} />
                        
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-3 hover:border-zinc-700 transition-all group-hover:bg-zinc-900/50">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${item.type === 'ai' ? 'text-pink-400' : 'text-blue-400'}`}>
                                    {item.author}
                                </span>
                                <span className="text-[9px] text-zinc-600 font-mono">{item.time}</span>
                            </div>
                            <h4 className="font-bold text-zinc-200 text-xs leading-snug">{item.msg}</h4>
                            
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-800/50">
                                <span className="text-[9px] text-zinc-600 font-mono">{item.id}</span>
                                <button className="text-[9px] font-bold text-zinc-500 hover:text-white flex items-center gap-1 transition-colors uppercase tracking-tight">
                                    <RotateCcw className="w-3 h-3" /> Revert
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         ) : (
            // MULTIPLAYER SYNC RENDERER
            <div className="space-y-3">
                {neuralSyncHistory.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-zinc-900/20 border border-zinc-800 rounded-xl animate-in slide-in-from-bottom-2 hover:border-zinc-700 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-black border border-zinc-800 flex items-center justify-center shrink-0">
                            <User className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${item.color}`}>{item.author}</span>
                                <span className="text-[9px] text-zinc-600 font-mono">{item.time}</span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-tight mb-2 truncate">{item.msg}</p>
                            <div className="flex gap-2">
                                <button className="text-[9px] font-bold px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors border border-transparent hover:border-zinc-600">View Diff</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         )}

         {activeTab === 'sync' && neuralSyncHistory.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                 <Zap className="w-8 h-8 mb-2 text-zinc-600" />
                 <p className="text-[10px] font-mono uppercase tracking-widest">Awaiting Neural Pulse...</p>
             </div>
         )}
      </div>
    </div>
  );
}
