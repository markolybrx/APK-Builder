"use client";

import { useState, useMemo } from "react";
import { 
  Plus, Link2, Smartphone, Zap, 
  MousePointer2, Share2, Move, FileCode 
} from "lucide-react";

export default function LogicMapView({ projectFiles, triggerHaptic, onLogicUpdate }) {
  
  // --- REAL-TIME PARSER ---
  // We use useMemo to derive nodes directly from the VFS
  const dynamicNodes = useMemo(() => {
    return projectFiles
      .filter(f => f.name.endsWith('.xml') || f.name.endsWith('.kt'))
      .map((file, idx) => {
        // Extract IDs from XML files to show real buttons as ports
        const idMatches = file.content.match(/android:id="\@\+id\/([^"]+)"/g) || [];
        const elements = idMatches.map(m => m.split('/').pop().replace('"', ''));

        return {
          id: file.name,
          x: 50 + (idx * 280), // Auto-layout based on file index
          y: 100 + (idx % 2 * 150),
          title: file.name,
          type: file.name.endsWith('.xml') ? 'Layout' : 'Logic',
          elements: elements.length > 0 ? elements : ['No interactive IDs'],
          active: false
        };
      });
  }, [projectFiles]);

  const handleConnect = (nodeId) => {
    triggerHaptic();
    // In a real scenario, this would generate a Navigation Intent between two nodes
    const intent = ``;
    onLogicUpdate(intent);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020617] overflow-hidden relative">
      
      {/* 1. PINNED HEADER */}
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

      {/* 2. LIVE CANVAS */}
      <div className="flex-1 relative overflow-auto custom-scrollbar p-10 bg-[#020617]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative w-[2000px] h-[1000px]">
          {dynamicNodes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <FileCode className="w-12 h-12 mb-4" />
              <p className="font-mono text-sm uppercase">Waiting for project files...</p>
            </div>
          ) : (
            dynamicNodes.map(node => (
              <div 
                key={node.id}
                style={{ left: node.x, top: node.y }}
                className="absolute w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden group transition-all"
              >
                {/* Node Header */}
                <div className="bg-slate-800/50 p-3 text-[9px] font-bold uppercase text-slate-400 flex justify-between items-center border-b border-slate-800">
                   <span className="flex items-center gap-2">
                      <Smartphone className={`w-3 h-3 ${node.type === 'Layout' ? 'text-orange-400' : 'text-blue-400'}`} /> 
                      {node.type} Component
                   </span>
                </div>

                <div className="p-4">
                  <h4 className="text-white font-bold text-xs mb-4 truncate">{node.title}</h4>
                  
                  {/* Real extracted IDs from your actual XML code */}
                  <div className="space-y-1.5">
                    {node.elements.map(el => (
                      <div 
                        key={el} 
                        onClick={() => handleConnect(node.id)}
                        className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 text-[10px] hover:border-blue-500 transition-all cursor-pointer group/item"
                      >
                        <span className="text-slate-400 font-mono group-hover/item:text-blue-400">@+id/{el}</span>
                        <div className="w-2 h-2 rounded-full bg-slate-700 group-hover/item:bg-blue-500" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-2.5 bg-slate-950/50 text-center text-[8px] text-slate-600 border-t border-slate-800 font-bold uppercase">
                   Tap an ID to wire logic
                </div>
              </div>
            ))
          )}

          {/* Connection Lines (SVG) - Now dynamically sized */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible">
             <path d="M 300 200 C 350 200, 350 150, 400 150" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeDasharray="6" className="opacity-10" />
          </svg>
        </div>
      </div>

      {/* 3. FLOATING ACTIONS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-4 bg-slate-900/95 backdrop-blur-2xl border border-white/5 p-2 rounded-[1.5rem] shadow-2xl">
            <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg"><MousePointer2 className="w-5 h-5" /></button>
            <div className="w-[1px] h-6 bg-slate-800" />
            <button onClick={() => triggerHaptic()} className="p-3 text-slate-400 hover:text-white transition-colors"><Plus className="w-5 h-5" /></button>
            <button className="p-3 text-slate-400 hover:text-white transition-colors"><Link2 className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}
