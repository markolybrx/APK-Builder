"use client";

import { 
  MessageSquare, Folder, Terminal, 
  Clock, Settings, LogOut, Share2,
  Bug, Play, Zap 
} from "lucide-react";

export default function NavigationRail({ 
  activeView, 
  setActiveView, 
  onExit, 
  triggerHaptic,
  onOpenOrb // NEW: Centralized launcher trigger
}) {

  // --- 1. CORE UTILITIES (THE "BIG 5") ---
  const navItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'files', icon: Folder, label: 'Files' },
    { id: 'preview', icon: Play, label: 'Preview' },
    { id: 'logic', icon: Share2, label: 'Logic' },
    { id: 'debug', icon: Bug, label: 'Debug' }, 
  ];

  // --- 2. SYSTEM UTILITIES ---
  const bottomItems = [
    { id: 'history', icon: Clock, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Config' },
  ];

  const handleNavClick = (viewId) => {
    if (viewId) {
      triggerHaptic?.();
      setActiveView(viewId);
    }
  };

  const NavItem = ({ item }) => {
    const isActive = activeView === item.id;

    return (
      <button
        onClick={() => handleNavClick(item.id)}
        className={`
          group relative flex flex-col items-center justify-center w-full aspect-square rounded-xl transition-all duration-300
          ${isActive ? 'bg-zinc-900' : 'hover:bg-zinc-900/50'}
          mb-1
        `}
        title={item.label}
      >
        {isActive && (
          <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-pink-500 to-blue-500 shadow-[0_0_8px_rgba(236,72,153,0.6)] animate-in fade-in" />
        )}

        <item.icon 
          className={`w-5 h-5 transition-all
            ${isActive ? 'text-white scale-105' : 'text-zinc-600 group-hover:text-zinc-300 group-hover:scale-110'}
          `} 
        />

        <span className={`text-[8px] font-bold mt-1.5 uppercase tracking-wider
           ${isActive ? 'text-zinc-300' : 'text-zinc-700 group-hover:text-zinc-500'}
        `}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <nav className="w-16 bg-black border-r border-zinc-800 flex flex-col items-center py-4 shrink-0 z-40 select-none">

      {/* 1. PRIMARY TOOLS */}
      <div className="flex-1 flex flex-col w-full px-2 gap-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
        
        {/* Terminal shortcut stays in core for quick build checks */}
        <button 
          onClick={() => handleNavClick('terminal')}
          className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all ${activeView === 'terminal' ? 'bg-zinc-900' : 'hover:bg-zinc-900/50'}`}
        >
          <Terminal className={`w-5 h-5 ${activeView === 'terminal' ? 'text-white' : 'text-zinc-600'}`} />
          <span className="text-[7px] font-bold mt-1 text-zinc-700">TERM</span>
        </button>
      </div>

      {/* 2. THE ACTION ORB (Launcher for 30+ Visionary Tools) */}
      <div className="px-2 my-4">
          <button 
            onClick={() => { triggerHaptic?.(); onOpenOrb(); }}
            className="w-full aspect-square rounded-2xl bg-gradient-to-br from-pink-600 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-110 active:scale-95 transition-all group relative animate-[pulse_4s_infinite]"
          >
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className="w-6 h-6 text-white fill-current" />
          </button>
      </div>

      {/* 3. BOTTOM ACTIONS */}
      <div className="w-full px-2 pt-4 border-t border-zinc-900 flex flex-col gap-1">
         {bottomItems.map((item) => (
            <NavItem key={item.id} item={item} />
         ))}

         <button 
            onClick={() => { triggerHaptic?.(); onExit?.(); }}
            className="w-full flex flex-col items-center justify-center p-2 mt-2 rounded-xl text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all aspect-square group active:scale-95"
         >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
         </button>
      </div>
    </nav>
  );
}
