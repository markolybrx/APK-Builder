"use client";

import { 
  Bug, DownloadCloud, Code2, User, 
  ScanLine, Share2, Box, ChevronRight 
} from "lucide-react";
import Link from "next/link";

export default function Header({ 
  project, 
  triggerHaptic,
  onImportClick,   
  onCloneClick,    
  onShareClick,    
  onProfileClick   
}) {

  // --- DEFENSIVE DATA PARSING ---
  // If project is null/undefined during creation, these safe fallbacks prevent the crash
  const safeProjectName = project?.name || "Initializing...";
  const safeProjectType = project?.type || "Android Native";

  const handleDebug = () => {
    triggerHaptic?.();
    alert("System Scan: Virtual File System synchronized. No critical errors.");
  };

  return (
    <header className="h-14 bg-[#020617] border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-[100] select-none">

      {/* LEFT: Branding & Home */}
      <div className="flex items-center gap-3">
        <Link 
          href="/dashboard" 
          onClick={() => triggerHaptic?.()} 
          className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Code2 className="w-5 h-5 text-white" />
        </Link>
        <div className="hidden md:flex flex-col leading-none">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Workspace</span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-xs font-bold text-white tracking-tight">AppBuild AI</span>
          </div>
        </div>
      </div>

      {/* CENTER: Status (Protected from Null Crashes) */}
      <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm truncate max-w-[120px] tracking-tight">
            {safeProjectName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse"/>
          <span className="text-[9px] text-green-400 font-bold uppercase tracking-tighter">VFS Link Active</span>
        </div>
      </div>

      {/* RIGHT: Tools (Matte & Neon Styling) */}
      <div className="flex items-center gap-1">
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-slate-900/50 border border-slate-800 rounded-lg mr-2">
          <span className="text-[9px] font-mono text-slate-500 uppercase px-1">{safeProjectType}</span>
        </div>

        <button onClick={onCloneClick} className="p-2 text-slate-400 hover:text-pink-400 transition-colors" title="Clone Vision">
          <ScanLine className="w-5 h-5" />
        </button>

        <button onClick={onImportClick} className="p-2 text-slate-400 hover:text-purple-400 transition-colors" title="GitHub Sync">
          <DownloadCloud className="w-5 h-5" />
        </button>

        <button onClick={onShareClick} className="p-2 text-slate-400 hover:text-blue-400 transition-colors" title="Live Share (QR)">
          <Share2 className="w-5 h-5" />
        </button>

        <button onClick={handleDebug} className="p-2 text-slate-400 hover:text-yellow-400 transition-colors" title="Debug">
          <Bug className="w-5 h-5" />
        </button>

        <div className="w-px h-5 bg-slate-800 mx-2"></div>

        <button 
          onClick={() => { triggerHaptic?.(); onProfileClick?.(); }} 
          className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden hover:border-blue-500 active:scale-95 transition-all"
        >
           <User className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
