"use client";

import { 
  Bug, DownloadCloud, Code2, User, 
  ScanLine, Share2, Box, ChevronRight,
  CheckCircle2, RefreshCw, Zap
} from "lucide-react";
import Link from "next/link";

export default function Header({ 
  project, 
  saveStatus = 'saved', // idle | saving | saved | error
  triggerHaptic,
  onImportClick,   
  onCloneClick,    
  onShareClick,    
  onProfileClick   
}) {

  // --- 1. DEFENSIVE DATA RESOLUTION ---
  const safeProjectName = project?.name || "Initializing Neural Link...";
  const safeProjectType = project?.type || "Android Native";

  return (
    <header className="h-14 bg-black border-b border-zinc-800 flex items-center justify-between px-4 shrink-0 z-[100] select-none relative">

      {/* LEFT: IDENTITY & HOME */}
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
            <span className="text-[9px] text-zinc-600 bg-zinc-900 px-1 rounded border border-zinc-800">v2.5</span>
          </div>
        </div>
      </div>

      {/* CENTER: SYSTEM STATUS INDICATOR */}
      <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm truncate max-w-[150px] tracking-tight">
            {safeProjectName}
          </span>
        </div>

        {/* Dynamic Save Status Visualization */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 
            ${saveStatus === 'saved' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
              saveStatus === 'saving' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse' : 
              'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}
          />
          <span className={`text-[9px] font-bold uppercase tracking-tighter transition-colors duration-300
            ${saveStatus === 'saved' ? 'text-green-500' : 
              saveStatus === 'saving' ? 'text-yellow-500' : 
              'text-zinc-500'}`}
          >
            {saveStatus === 'saved' ? 'Cloud Sync Active' : 
             saveStatus === 'saving' ? 'Writing to VFS...' : 
             'Offline Mode'}
          </span>
        </div>
      </div>

      {/* RIGHT: UTILITY BELT */}
      <div className="flex items-center gap-1">
        {/* Project Context Badge */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg mr-2">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">{safeProjectType}</span>
        </div>

        {/* Quick Actions (Mapped to Props) */}
        <div className="flex items-center bg-zinc-900/50 rounded-lg border border-zinc-800/50 p-0.5">
            {[
            { icon: ScanLine, fn: onCloneClick, title: "Clone Vision (Screenshot to Code)", color: "hover:text-pink-400" },
            { icon: DownloadCloud, fn: onImportClick, title: "Import Repo", color: "hover:text-purple-400" },
            { icon: Share2, fn: onShareClick, title: "Live Share (QR)", color: "hover:text-blue-400" },
            ].map((btn, i) => (
            <button 
                key={i} 
                onClick={() => { triggerHaptic?.(); btn.fn?.(); }} 
                className={`p-2 text-zinc-500 ${btn.color} hover:bg-zinc-800 rounded-md transition-all active:scale-90`} 
                title={btn.title}
            >
                <btn.icon className="w-4 h-4" />
            </button>
            ))}
        </div>

        <div className="w-px h-5 bg-zinc-800 mx-2"></div>

        {/* User Profile Trigger */}
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
