"use client";

import { useState, useMemo } from "react";
import { 
  Plus, Link2, Smartphone, Zap, 
  MousePointer2, Share2, Move, FileCode 
} from "lucide-react";

export default function LogicMapView({ projectFiles = [], triggerHaptic, onLogicUpdate }) {

  // --- CRASH-PROOF REAL-TIME PARSER ---
  // Memoization deriving nodes directly from the Virtual File System (VFS)
  const dynamicNodes = useMemo(() => {
    // Safety Guard: Immediate return if projectFiles is missing or malformed
    if (!projectFiles || !Array.isArray(projectFiles)) return []; 

    return projectFiles
      .filter(f => f && f.name && (f.name.endsWith('.xml') || f.name.endsWith('.kt')))
      .map((file, idx) => {
        // Guarded Regex: Prevent crash if file.content is null or undefined
        const content = file.content || "";
        const idMatches = content.match(/android:id="\@\+id\/([^"]+)"/g) || [];
        const elements = idMatches.map(m => m.split('/').pop().replace('"', ''));

        return {
          id: file.name,
          x: 50 + (idx * 280), // Spatial auto-layout
          y: 100 + (idx % 2 * 150),
          title: file.name,
          type: file.name.endsWith('.xml') ? 'Layout' : 'Logic',
          // Graceful fallback for components without interactive IDs
          elements: elements.length > 0 ? elements : ['No interactive IDs'],
          active: false
        };
      });
  }, [projectFiles]);

  const handleConnect = (nodeId) => {
    if (!nodeId) return;
    triggerHaptic();
    // Logic generation for Android Intent navigation
    const intent = ``;
    if (onLogicUpdate) onLogicUpdate(intent);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020617] overflow-hidden relative">

      {/* 1. PINNED CANVAS HEADER */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white uppercase tracking-widest text-[10px]">Logic Map</span>
          <div className="flex items-center gap-1.5 ml-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">VFS Tracking Active</span>
          </div>
        </div>
      </div>

      {/* 2. LIVE CANVAS (SCROLLABLE WORKSPACE) */}
      <div className="flex-1 relative overflow-auto custom-scrollbar p-10 bg-[#020617]">
        {/* Grid Visual Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative w-[2000px] h-[1000px]">
          {dynamicNodes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 transition-opacity">
              <FileCode className="w-12 h-12 mb-4 text-blue-500" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-white">Empty Workspace: Awaiting Source Files...</p>
            </div>
          ) : (
            dynamicNodes.map(node => (
              <div 
                key={node.id}
                style={{ left: node.x, top: node.y }}
                className="absolute w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden group transition-all duration-300 hover:border-blue-500/50 z-10"
              >
                {/* Visual Node Header */}
                <div className="bg-slate-800/30 p-3 text-[9px] font-bold uppercase text-slate-500 flex justify-between items-center border-b border-slate-800">
                   <span className="flex items-center gap-2">
                      <Smartphone className={`w-3.5 h-3.5 ${node.type === 'Layout' ? 'text-orange-400' : 'text-blue-400'}`} /> 
                      {node.type}
                   </span>
                   <Move className="w-3 h-3 opacity-20" />
                </div>

                <div className="p-4">
                  <h4 className="text-white font-bold text-xs mb-4 truncate tracking-tight">{node.title}</h4>

                  {/* Reactive IDs Scanned from Project Files */}
                  <div className="space-y-1.5">
                    {node.elements.map(el => (
                      <div 
                        key={`${node.id}-${el}`} 
                        onClick={() => handleConnect(node.id)}
                        className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 text-[10px] hover:border-blue-600 transition-all cursor-pointer group/item"
                      >
                        <span className="text-slate-400 font-mono group-hover/item:text-blue-400 transition-colors">
                          {el.startsWith('@+id/') ? el : `@+id/${el}`}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-slate-800 group-hover/item:bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-2.5 bg-slate-950/50 text-center text-[8px] text-slate-600 border-t border-slate-800 font-bold uppercase tracking-widest">
                   {node.type === 'Layout' ? 'Tap ID to bind logic' : 'Logic Node Active'}
                </div>
              </div>
            ))
          )}

          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible">
             <path d="M 310 210 C 360 210, 360 160, 410 160" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeDasharray="6" className="opacity-10 animate-pulse" />
          </svg>
        </div>
      </div>

      {/* 3. PINNED CANVAS TOOLBAR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-4 bg-slate-900/95 backdrop-blur-2xl border border-white/5 p-2 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 active:scale-90 transition-transform"><MousePointer2 className="w-5 h-5" /></button>
            <div className="w-[1px] h-6 bg-slate-800 mx-1" />
            <button onClick={() => triggerHaptic()} className="p-3 text-slate-500 hover:text-white transition-all"><Plus className="w-5 h-5" /></button>
            <button className="p-3 text-slate-500 hover:text-white transition-all"><Link2 className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}