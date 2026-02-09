import { useState } from "react";
import { Plus, Link2, Smartphone, Zap, MousePointer2, Move } from "lucide-react";

export default function LogicMapView({ triggerHaptic }) {
  // Logic Nodes (Screens)
  const [nodes, setNodes] = useState([
    { id: 'login', x: 40, y: 120, title: 'Login Screen', color: 'border-blue-500' },
    { id: 'home', x: 280, y: 40, title: 'Home Feed', color: 'border-green-500' },
    { id: 'profile', x: 280, y: 220, title: 'User Profile', color: 'border-purple-500' },
  ]);

  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex-1 bg-[#020617] relative overflow-hidden flex flex-col h-full">
      {/* Visual Canvas Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      {/* Logic Header */}
      <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white text-xs uppercase tracking-widest">Logic Flow</span>
        </div>
        <div className="flex gap-2">
            <span className="text-[9px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded border border-blue-600/30 font-bold">PRO</span>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 relative overflow-auto p-10 select-none">
        {nodes.map((node) => (
          <div 
            key={node.id}
            style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
            className={`absolute w-44 bg-slate-900 border-2 ${node.color} rounded-2xl shadow-2xl p-3 cursor-grab active:cursor-grabbing transition-colors group`}
          >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                    <Smartphone className="w-3 h-3" /> {node.id}
                </div>
                <Move className="w-3 h-3 text-slate-600 group-hover:text-slate-300" />
            </div>
            <h4 className="text-white font-bold text-sm truncate mb-3">{node.title}</h4>
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[9px] bg-slate-850 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400">On Click</span>
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                </div>
            </div>
          </div>
        ))}

        {/* Dynamic Connections (Wires) */}
        <svg className="absolute inset-0 pointer-events-none w-[1000px] h-[1000px]">
           <path d="M 215 170 C 240 170, 240 80, 280 80" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="4" />
           <path d="M 215 180 C 240 180, 240 260, 280 260" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="4" />
        </svg>
      </div>

      {/* Controls Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 border border-slate-700 p-1.5 rounded-2xl shadow-2xl backdrop-blur-xl">
          <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20"><MousePointer2 className="w-5 h-5" /></button>
          <button className="p-3 text-slate-400 hover:text-white"><Plus className="w-5 h-5" /></button>
          <button className="p-3 text-slate-400 hover:text-white"><Link2 className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
