"use client";

import { 
  Bug, DownloadCloud, Code2, User, 
  ScanLine, Share2, Box, ChevronRight,
  CheckCircle2, RefreshCw
} from "lucide-react";
import Link from "next/link";

export default function Header({ 
  project, 
  saveStatus = 'saved', // Default to saved if undefined
  triggerHaptic,
  onImportClick,   
  onCloneClick,    
  onShareClick,    
  onProfileClick   
}) {

  // --- DEFENSIVE DATA PARSING ---
  const safeProjectName = project?.name || "Initializing...";
  const safeProjectType = project?.type || "Android Native";

  return (
    <header className="h-14 bg-black border-b border-zinc-800 flex items-center justify-between px-4 shrink-0 z-[100] select-none">

      {/* LEFT: Branding & Home */}
      <div className="flex items-center gap-3">
        <Link 
          href="/dashboard" 
          onClick={() => triggerHaptic?.()} 
          className="w-8 h-8 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.4)] active:scale-95 transition-all group"
        >
          <Code2 className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
        </Link>
        <div className="hidden md:flex flex-col leading-none">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Workspace</span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-xs font-bold text-white tracking-tight">AppBuild AI</span>
          </div>
        </div>
      </div>

      {/* CENTER: Project Status & Auto-Save Indicator */}
      <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm truncate max-w-[150px] tracking-tight">
            {safeProjectName}
          </span>
        </div>
        
        {/* Neon Sync Status */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 
            ${saveStatus === 'saved' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
              saveStatus === 'saving' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse' : 
              'bg-zinc-600'}`}
          />
          <span className={`text-[9px] font-bold uppercase tracking-tighter transition-colors duration-300
            ${saveStatus === 'saved' ? 'text-green-500' : 
              saveStatus === 'saving' ? 'text-yellow-500' : 
              'text-zinc-500'}`}
          >
            {saveStatus === 'saved' ? 'All Systems Synced' : 
             saveStatus === 'saving' ? 'Syncing via Neural Link...' : 
             'Offline'}
          </span>
        </div>
      </div>

      {/* RIGHT: Tools (Matte & Neon Styling) */}
      <div className="flex items-center gap-1">
        {/* Project Type Badge */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg mr-2">
          <span className="text-[9px] font-mono text-zinc-500 uppercase px-1">{safeProjectType}</span>
        </div>

        {/* Action Buttons */}
        {[
          { icon: ScanLine, fn: onCloneClick, title: "Clone Vision (Screenshot to Code)", color: "hover:text-pink-400" },
          { icon: DownloadCloud, fn: onImportClick, title: "Import Repo", color: "hover:text-purple-400" },
          { icon: Share2, fn: onShareClick, title: "Live Share (QR)", color: "hover:text-blue-400" },
        ].map((btn, i) => (
          <button 
            key={i} 
            onClick={() => { triggerHaptic?.(); btn.fn?.(); }} 
            className={`p-2 text-zinc-400 ${btn.color} hover:bg-zinc-900 rounded-lg transition-all active:scale-90`} 
            title={btn.title}
          >
            <btn.icon className="w-5 h-5" />
          </button>
        ))}

        <div className="w-px h-5 bg-zinc-800 mx-2"></div>

        {/* Profile Button */}
        <button 
          onClick={() => { triggerHaptic?.(); onProfileClick?.(); }} 
          className="w-9 h-9 rounded-full bg-black border border-zinc-800 flex items-center justify-center overflow-hidden hover:border-pink-500/50 shadow-sm active:scale-95 transition-all group"
        >
           <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center group-hover:from-pink-900/20 group-hover:to-blue-900/20 transition-colors">
              <User className="w-4 h-4 text-zinc-400 group-hover:text-white" />
           </div>
        </button>
      </div>
    </header>
  );
}
