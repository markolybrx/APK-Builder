"use client";

import { 
  MessageSquare, Folder, Smartphone, Terminal, 
  Clock, Settings, ArrowLeftFromLine, Share2,
  Bug 
} from "lucide-react";

export default function NavigationRail({ activeView, setActiveView, onExit, triggerHaptic }) {

  // --- NAVIGATION CONFIG ---
  const navItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'files', icon: Folder, label: 'Files' },
    { id: 'preview', icon: Smartphone, label: 'Preview' },
    { id: 'logic', icon: Share2, label: 'Logic' },
    { id: 'debug', icon: Bug, label: 'Debug' }, 
    { id: 'terminal', icon: Terminal, label: 'Console' },
    { id: 'history', icon: Clock, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Config' },
  ];

  const handleNavClick = (viewId) => {
    // GUARDRAIL: Only trigger haptics and change view if viewId exists
    if (viewId) {
      triggerHaptic?.();
      setActiveView(viewId);
    }
  };

  return (
    <nav className="w-16 bg-[#020617] border-r border-slate-800 flex flex-col items-center py-4 shrink-0 z-40 select-none">
      
      {/* 1. PRIMARY TOOLS (SCROLLABLE IF NEEDED) */}
      <div className="flex-1 flex flex-col gap-1 w-full px-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all w-full aspect-square relative group
                ${isActive 
                  ? 'bg-blue-600/10 text-white' 
                  : 'text-slate-600 hover:text-slate-300 hover:bg-slate-900/50'}
              `}
              title={item.label}
            >
              {/* NEON ACTIVE INDICATOR */}
              {isActive && (
                <>
                  <div className="absolute left-[-8px] top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <div className="absolute inset-0 border border-blue-500/20 rounded-xl" />
                </>
              )}

              <item.icon className={`w-5 h-5 transition-transform duration-300 
                ${isActive ? 'text-blue-400 scale-105' : 'group-hover:scale-110 group-active:scale-95'}
              `} />
              
              <span className={`text-[8px] font-bold mt-1.5 text-center leading-tight uppercase tracking-tighter transition-colors
                ${isActive ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}
              `}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. EXIT ACTION (PINNED BOTTOM) */}
      <div className="mt-4 w-full px-2 pt-4 border-t border-slate-800/50 shrink-0">
         <button 
            onClick={() => { triggerHaptic?.(); onExit?.(); }}
            className="w-full flex flex-col items-center justify-center p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all aspect-square group active:scale-90"
         >
            <ArrowLeftFromLine className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[8px] font-bold mt-1.5 text-center uppercase tracking-tighter">Exit</span>
         </button>
      </div>
    </nav>
  );
}
