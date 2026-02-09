import { 
  MessageSquare, Folder, Smartphone, Terminal, 
  Clock, Settings, ArrowLeftFromLine 
} from "lucide-react";

export default function NavigationRail({ activeView, setActiveView, onExit, triggerHaptic }) {
  
  const navItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'files', icon: Folder, label: 'Files' },
    { id: 'preview', icon: Smartphone, label: 'Preview' },
    { id: 'terminal', icon: Terminal, label: 'Console' },
    { id: 'history', icon: Clock, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 shrink-0 z-50">
      
      {/* Top Icons */}
      <div className="flex-1 flex flex-col gap-4 w-full px-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); triggerHaptic(); }}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all w-full aspect-square
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}
              `}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[9px] font-bold mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto w-full px-2">
         <button 
            onClick={onExit}
            className="w-full flex flex-col items-center justify-center p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors aspect-square"
            title="Exit Project"
         >
            <ArrowLeftFromLine className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1">Exit</span>
         </button>
      </div>
    </nav>
  );
}