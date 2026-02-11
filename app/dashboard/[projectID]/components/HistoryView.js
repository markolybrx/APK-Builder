"use client";

import { useState } from "react";
import { GitCommit, Clock, User, RotateCcw, Zap, Users } from "lucide-react";

export default function HistoryView({ triggerHaptic }) {
  const [activeTab, setActiveTab] = useState("timeline"); // timeline | sync

  // Personal/System versions
  const localHistory = [
    { id: "v1.0.4", msg: "Added Contextual Lens overlay", time: "Just now", author: "You", type: "user" },
    { id: "v1.0.3", msg: "Refactored MainActivity.kt", time: "12 mins ago", author: "Visionary AI", type: "ai" },
  ];

  // Multiplayer changes (Neural Sync)
  const neuralSyncHistory = [
    { id: "sync_01", msg: "Updated primary button colors", time: "5 mins ago", author: "Architect_Z", color: "text-pink-500" },
    { id: "sync_02", msg: "Modified SensorBridge logic", time: "15 mins ago", author: "NeonDev_99", color: "text-blue-500" },
    { id: "sync_03", msg: "Injected Splash Screen drawable", time: "1 hour ago", author: "Visionary AI", color: "text-purple-500" },
  ];

  return (
    <div className="flex flex-col h-full bg-black text-zinc-400 font-sans border-l border-zinc-800 animate-in slide-in-from-right duration-300">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col bg-zinc-900/20 border-b border-zinc-800">
         <div className="h-14 flex items-center justify-between px-6">
            <div className="flex items-center gap-2 font-bold text-white uppercase tracking-tighter text-sm">
                <Clock className="w-4 h-4 text-pink-500" />
                <span>Neural Logs</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-600">v2.0.4-SYNC</div>
         </div>

         {/* TAB SWITCHER */}
         <div className="flex px-4 pb-2 gap-4">
            <button 
                onClick={() => { triggerHaptic?.(); setActiveTab('timeline'); }}
                className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all border-b-2 
                ${activeTab === 'timeline' ? 'border-pink-500 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
            >
                <Clock className="w-3 h-3" /> Timeline
            </button>
            <button 
                onClick={() => { triggerHaptic?.(); setActiveTab('sync'); }}
                className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all border-b-2 
                ${activeTab === 'sync' ? 'border-blue-500 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
            >
                <Users className="w-3 h-3" /> Neural Sync
            </button>
         </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
         
         {activeTab === 'timeline' ? (
            // PERSONAL TIMELINE VIEW
            localHistory.map((item, i) => (
                <div key={item.id} className="relative pl-8 group">
                    <div className="absolute top-3 left-[11px] w-[1px] h-full bg-zinc-800 group-hover:bg-pink-500/20 transition-colors" />
                    <div className="absolute top-1 left-0 w-6 h-6 rounded-full border-4 border-black bg-zinc-900 flex items-center justify-center z-10">
                        <GitCommit className={`w-3 h-3 ${item.type === 'ai' ? 'text-pink-500' : 'text-blue-500'}`} />
                    </div>
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-all">
                        <h4 className="font-bold text-white text-sm">{item.msg}</h4>
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-[10px] text-zinc-500 font-mono">{item.id} • {item.time}</span>
                            <button className="text-[10px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
                                <RotateCcw className="w-3 h-3" /> Rollback
                            </button>
                        </div>
                    </div>
                </div>
            ))
         ) : (
            // MULTIPLAYER NEURAL SYNC VIEW
            neuralSyncHistory.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl animate-in slide-in-from-bottom-2">
                    <div className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center shrink-0">
                        <User className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>{item.author}</span>
                            <span className="text-[10px] text-zinc-600 font-mono">{item.time}</span>
                        </div>
                        <p className="text-sm text-zinc-300 leading-tight mb-2">{item.msg}</p>
                        <div className="flex gap-2">
                             <button className="text-[9px] font-bold px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors">Compare Diffs</button>
                             <button className="text-[9px] font-bold px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded transition-colors">Inspect Node</button>
                        </div>
                    </div>
                </div>
            ))
         )}

         {activeTab === 'sync' && neuralSyncHistory.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                 <Zap className="w-8 h-8 mb-2" />
                 <p className="text-xs font-mono uppercase">Waiting for Neural Sync Pulse...</p>
             </div>
         )}
      </div>
    </div>
  );
}
