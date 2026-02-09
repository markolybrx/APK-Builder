import { useState, useEffect } from "react";
import { 
  Plus, Link2, Smartphone, Zap, 
  MousePointer2, Share2, Move, X 
} from "lucide-react";

export default function LogicMapView({ triggerHaptic, onLogicUpdate }) {
  // Mock Nodes (Pages) with interactivity
  const [nodes, setNodes] = useState([
    { id: 'login', x: 50, y: 150, title: 'Login Screen', elements: ['UsernameField', 'LoginBtn'], active: false },
    { id: 'home', x: 300, y: 50, title: 'Home Dashboard', elements: ['ProductList', 'ProfileIcon'], active: false },
    { id: 'profile', x: 300, y: 250, title: 'User Profile', elements: ['EditBtn', 'LogoutBtn'], active: false },
  ]);

  // ACTIVATE REAL SYNC: Update "Code" based on visual interaction
  const handleNodeClick = (id) => {
    triggerHaptic();
    setNodes(prev => prev.map(n => n.id === id ? { ...n, active: !n.active } : n));

    // Generate real Android Intent code for navigation
    const generatedIntent = `
        <activity android:name=".${id.charAt(0).toUpperCase() + id.slice(1)}Activity">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
            </intent-filter>
        </activity>
    `;

    // Push the logic to the Global File State
    if (onLogicUpdate) {
      onLogicUpdate(generatedIntent);
    }
  };

  return (
    <div className="flex-1 bg-[#020617] relative overflow-hidden flex flex-col h-full">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* Canvas Header */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white uppercase tracking-tighter text-[10px]">Logic Canvas</span>
          <span className="text-[9px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-600/30 font-bold">SYNC ACTIVE</span>
        </div>
        <button 
          onClick={() => { triggerHaptic(); }}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold shadow-lg shadow-blue-500/20"
        >
          <Zap className="w-3 h-3 fill-current" /> Auto-Sync Code
        </button>
      </div>

      {/* The Map Canvas */}
      <div className="flex-1 relative cursor-grab active:cursor-grabbing p-10">
        {nodes.map(node => (
          <div 
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            style={{ left: node.x, top: node.y }}
            className={`absolute w-52 bg-slate-900 border ${node.active ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-slate-800'} rounded-2xl shadow-2xl overflow-hidden group transition-all duration-300`}
          >
            <div className="bg-slate-800/50 p-2 text-[9px] font-bold uppercase text-slate-500 flex justify-between items-center border-b border-slate-800">
               <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> Screen Component</span>
               <Move className="w-3 h-3 opacity-20" />
            </div>
            <div className="p-4">
              <h4 className="text-white font-bold text-sm mb-3 tracking-tight">{node.title}</h4>
              <div className="space-y-1.5">
                {node.elements.map(el => (
                  <div key={el} className="flex items-center justify-between bg-slate-950/50 p-2 rounded-lg border border-slate-800/50 text-[9px] hover:border-blue-900 transition-colors">
                    <span className="text-slate-400 font-mono italic">{el}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${node.active ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="py-2.5 bg-blue-600/5 text-center text-[9px] text-blue-400/70 border-t border-slate-800 font-bold tracking-widest">
               {node.active ? 'MAPPED TO CODE' : 'TAP TO MAP FLOW'}
            </div>
          </div>
        ))}

        {/* Visual Navigation Logic Lines */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
           <path d="M 250 200 C 275 200, 275 100, 300 100" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="4" className="animate-[dash_20s_linear_infinite] opacity-30" />
           <path d="M 250 210 C 275 210, 275 300, 300 300" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="4" className="opacity-30" />
        </svg>
      </div>

      {/* Floating Canvas Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 backdrop-blur-2xl border border-slate-700/50 p-2.5 rounded-[1.5rem] shadow-2xl">
          <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20"><MousePointer2 className="w-5 h-5" /></button>
          <button className="p-3 text-slate-500 hover:text-white transition-colors"><Plus className="w-5 h-5" /></button>
          <button className="p-3 text-slate-500 hover:text-white transition-colors"><Link2 className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
