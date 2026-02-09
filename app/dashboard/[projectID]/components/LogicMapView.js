import { useState } from "react";
import { Plus, Link2, Smartphone, Zap, MousePointer2 } from "lucide-react";

export default function LogicMapView({ triggerHaptic }) {
  // Mock Nodes representing the screens in the app
  const [nodes, setNodes] = useState([
    { id: 'login', x: 50, y: 150, title: 'Login Screen', elements: ['UsernameField', 'LoginBtn'] },
    { id: 'home', x: 300, y: 50, title: 'Home Dashboard', elements: ['ProductList', 'ProfileIcon'] },
    { id: 'profile', x: 300, y: 250, title: 'User Profile', elements: ['EditBtn', 'LogoutBtn'] },
  ]);

  return (
    <div className="flex-1 bg-[#020617] relative overflow-hidden flex flex-col">
      {/* Visual Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      {/* Logic Canvas Header */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase tracking-tighter text-xs">Logic Canvas</span>
          <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-600/30">PRO</span>
        </div>
        <button 
          onClick={() => triggerHaptic && triggerHaptic()}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20"
        >
          <Zap className="w-3.5 h-3.5 fill-current" /> Auto-Layout
        </button>
      </div>

      {/* Node-Based Mapping Area */}
      <div className="flex-1 relative cursor-grab active:cursor-grabbing">
        {nodes.map(node => (
          <div 
            key={node.id}
            style={{ left: node.x, top: node.y }}
            className="absolute w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden group hover:border-blue-500 transition-colors"
          >
            <div className="bg-slate-800 p-2 text-[10px] font-bold uppercase text-slate-400 flex justify-between items-center">
               <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> Screen</span>
               <Link2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-3">
              <h4 className="text-white font-bold text-sm mb-2">{node.title}</h4>
              <div className="space-y-1">
                {node.elements.map(el => (
                  <div key={el} className="flex items-center justify-between bg-slate-950/50 p-1.5 rounded border border-slate-800 text-[9px] hover:border-blue-900 transition-colors">
                    <span className="text-slate-400">{el}</span>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full py-2 bg-slate-800/50 text-[10px] font-bold text-slate-500 hover:text-white hover:bg-slate-800 border-t border-slate-800">
              + Add Interaction
            </button>
          </div>
        ))}

        {/* MOCK LOGIC WIRES (Visual Connections) */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
           <path d="M 250 200 C 275 200, 275 100, 300 100" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="4" />
           <path d="M 250 210 C 275 210, 275 300, 300 300" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="4" />
        </svg>
      </div>

      {/* Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-2 rounded-2xl shadow-2xl">
          <ToolBtn icon={MousePointer2} active />
          <ToolBtn icon={Plus} />
          <ToolBtn icon={Link2} />
      </div>
    </div>
  );
}

function ToolBtn({ icon: Icon, active }) {
  return (
    <button className={`p-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>
      <Icon className="w-5 h-5" />
    </button>
  );
}
