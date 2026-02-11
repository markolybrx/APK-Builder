"use client";

import { 
  MessageSquare, Folder, Terminal, 
  Clock, Settings, LogOut, Share2,
  Bug, Play, Wand2, Activity, MousePointerClick, ScanEye 
} from "lucide-react";

export default function NavigationRail({ 
  activeView, 
  setActiveView, 
  onExit, 
  triggerHaptic,
  // Feature Triggers
  onOpenDesignCritique,
  onOpenSensorBridge,
  onOpenBehaviorRecorder,
  onOpenContextualLens
}) {

  // --- 1. MAIN VIEWS ---
  const navItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'files', icon: Folder, label: 'Files' },
    { id: 'preview', icon: Play, label: 'Preview' },
    { id: 'logic', icon: Share2, label: 'Logic' },
    { id: 'debug', icon: Bug, label: 'Debug' }, 
    { id: 'terminal', icon: Terminal, label: 'Term' },
  ];

  // --- 2. VISIONARY TOOLS (Actions) ---
  const toolItems = [
    { id: 'critique', icon: Wand2, label: 'Audit', action: onOpenDesignCritique, color: 'group-hover:text-purple-400' },
    { id: 'sensors', icon: Activity, label: 'Sensors', action: onOpenSensorBridge, color: 'group-hover:text-green-400' },
    { id: 'behavior', icon: MousePointerClick, label: 'Record', action: onOpenBehaviorRecorder, color: 'group-hover:text-orange-400' },
    { id: 'lens', icon: ScanEye, label: 'Lens', action: onOpenContextualLens, color: 'group-hover:text-cyan-400' },
  ];

  // --- 3. SYSTEM ---
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

  const NavItem = ({ item, isAction = false }) => {
    const isActive = !isAction && activeView === item.id;
    
    return (
      <button
        onClick={() => {
            if (isAction) {
                triggerHaptic?.();
                item.action?.();
            } else {
                handleNavClick(item.id);
            }
        }}
        className={`
          group relative flex flex-col items-center justify-center w-full aspect-square rounded-xl transition-all duration-300
          ${isActive ? 'bg-zinc-900' : 'hover:bg-zinc-900/50'}
          mb-1
        `}
        title={item.label}
      >
        {/* NEON ACTIVE INDICATOR (Vertical Bar) */}
        {isActive && (
          <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-pink-500 to-blue-500 shadow-[0_0_8px_rgba(236,72,153,0.6)] animate-in fade-in duration-300" />
        )}

        {/* ICON */}
        <item.icon 
          className={`w-5 h-5 transition-all duration-300
            ${isActive 
              ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] scale-105' 
              : `text-zinc-600 ${item.color || 'group-hover:text-zinc-300'} group-hover:scale-110`
            }
          `} 
        />

        {/* LABEL */}
        <span className={`text-[8px] font-bold mt-1.5 uppercase tracking-wider transition-colors
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
      <div className="flex-1 flex flex-col w-full px-2 overflow-y-auto no-scrollbar gap-1">
        {navItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}

        {/* Divider */}
        <div className="my-2 h-px bg-zinc-800 w-3/4 mx-auto" />
        
        {/* Visionary Tools */}
        {toolItems.map((item) => (
           <NavItem key={item.id} item={item} isAction />
        ))}
      </div>

      {/* 2. BOTTOM ACTIONS */}
      <div className="mt-auto w-full px-2 pt-4 border-t border-zinc-900 flex flex-col gap-1">
         {bottomItems.map((item) => (
            <NavItem key={item.id} item={item} />
         ))}

         {/* EXIT BUTTON */}
         <button 
            onClick={() => { triggerHaptic?.(); onExit?.(); }}
            className="w-full flex flex-col items-center justify-center p-2 mt-2 rounded-xl text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all aspect-square group active:scale-95"
            title="Exit Workspace"
         >
            <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
         </button>
      </div>
    </nav>
  );
}