import { 
  MessageSquare, Folder, Smartphone, Terminal, 
  Clock, Settings, ArrowLeftFromLine, Share2,
  Bug // NEW: Added Bug icon for the AI Debugger view
} from "lucide-react";

export default function NavigationRail({ activeView, setActiveView, onExit, triggerHaptic }) {

  // --- UPDATED NAVIGATION CONFIG ---
  const navItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'files', icon: Folder, label: 'Files' },
    { id: 'preview', icon: Smartphone, label: 'Preview' },
    { id: 'logic', icon: Share2, label: 'Logic Map' },
    { id: 'debug', icon: Bug, label: 'Debug' }, // NEW: Dedicated Debugger Tab
    { id: 'terminal', icon: Terminal, label: 'Console' },
    { id: 'history', icon: Clock, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 shrink-0 z-40 overflow-y-auto no-scrollbar">
      {/* 1. TOP SECTION: PRIMARY TOOLS */}
      <div className="flex-1 flex flex-col gap-2 w-full px-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); triggerHaptic(); }}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all w-full aspect-square relative group
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'}
              `}
              title={item.label}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-[-8px] top-1/4 bottom-1/4 w-1 bg-blue-400 rounded-r-full" />
              )}
              
              <item.icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-[8px] font-bold mt-1.5 text-center leading-tight uppercase tracking-tighter">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. BOTTOM SECTION: EXIT ACTION */}
      <div className="mt-6 w-full px-2 pt-4 border-t border-slate-800/50">
         <button 
            onClick={onExit}
            className="w-full flex flex-col items-center justify-center p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors aspect-square group"
         >
            <ArrowLeftFromLine className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[8px] font-bold mt-1.5 text-center uppercase tracking-tighter">Exit</span>
         </button>
      </div>
    </nav>
  );
}
