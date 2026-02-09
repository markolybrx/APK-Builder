import { 
  Bug, DownloadCloud, Code2, User, 
  LogOut, Settings, CreditCard, HelpCircle 
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header({ 
  project, 
  triggerHaptic,
  onImportClick,
  onProfileClick
}) {
  
  const handleDebug = () => {
    triggerHaptic();
    alert("Debugging... No critical errors found.");
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-50 select-none">
      
      {/* --- LEFT: LOGO (Home Link) --- */}
      <Link 
        href="/dashboard" 
        onClick={triggerHaptic}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Code2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-white tracking-tight hidden md:block">
            AppBuild AI
        </span>
      </Link>

      {/* --- CENTER: PROJECT NAME --- */}
      <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
        <span className="font-bold text-white text-sm max-w-[150px] truncate">
          {project?.name || "Untitled App"}
        </span>
        <span className="text-[10px] text-green-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> 
          v0.2.3
        </span>
      </div>

      {/* --- RIGHT: ACTIONS --- */}
      <div className="flex items-center gap-2">
        
        {/* Import Button */}
        <button 
          onClick={onImportClick}
          className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
          title="Import Repo"
        >
          <DownloadCloud className="w-5 h-5" />
        </button>

        {/* Debug Button */}
        <button 
          onClick={handleDebug}
          className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
          title="Debug"
        >
          <Bug className="w-5 h-5" />
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1"></div>

        {/* PROFILE BUTTON */}
        <button 
          onClick={onProfileClick}
          className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all overflow-hidden"
        >
           {/* Placeholder for User Image */}
           <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}