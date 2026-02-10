"use client";

import { Scan, Hash, Maximize, Zap } from "lucide-react";

export default function ContextualLens({ elements = [], mode = 'live' }) {
  
  // --- AR HUD MODE ---
  if (mode === 'ar') {
    return (
      <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center">
        {/* Reticle */}
        <div className="relative w-64 h-64 border border-blue-500/30 rounded-lg flex items-center justify-center">
           <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500" />
           <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500" />
           <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500" />
           <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500" />
           
           <Scan className="w-12 h-12 text-blue-500/50 animate-pulse" />
        </div>
        
        {/* Data Stream */}
        <div className="mt-8 font-mono text-[9px] text-blue-400 space-y-1 text-center">
            <p>SURFACE: DETECTED</p>
            <p>LIGHTING: 84% (OPTIMAL)</p>
            <p>ANCHOR: LOCKED</p>
        </div>
      </div>
    );
  }

  // --- UI INSPECTION MODE (Live) ---
  return (
    <div className="absolute inset-0 z-40 pointer-events-none p-6 space-y-4">
      {/* We map over the same elements the PreviewPane is rendering to create an overlay */}
      {elements.map((el, i) => (
        <div 
          key={`lens-${i}`}
          className="relative group border border-dashed border-purple-500/30 hover:border-purple-500/80 bg-purple-500/5 rounded-xl transition-all duration-300"
        >
            {/* The "Tag" that appears floating next to the element */}
            <div className="absolute -right-2 -top-2 bg-purple-600 text-white text-[8px] font-mono px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1 scale-0 group-hover:scale-100 transition-transform origin-bottom-left">
                <Hash className="w-2 h-2" />
                {el.id}
            </div>
            
            {/* Invisible spacer to match the height of the actual element below it */}
            <div className="h-10 w-full" /> 
            
            <div className="absolute bottom-1 left-2 text-[8px] text-purple-400 font-mono opacity-0 group-hover:opacity-100">
               {el.type.toUpperCase()} NODE
            </div>
        </div>
      ))}
      
      {/* Global Stats */}
      <div className="absolute top-2 right-2 flex flex-col items-end pointer-events-none">
         <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-purple-500/30">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-[9px] font-bold text-white">{elements.length} NODES RENDERED</span>
         </div>
      </div>
    </div>
  );
}