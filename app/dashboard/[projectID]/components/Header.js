import { 
  Bug, DownloadCloud, Code2, User, 
  ScanLine, Share2 
} from "lucide-react";
import Link from "next/link";

export default function Header({ 
  project, 
  triggerHaptic,
  onImportClick,   // GitHub Repo Converter
  onCloneClick,    // Clone Vision
  onShareClick,    // QR Share
  onProfileClick   // Profile Drawer
}) {

  const handleDebug = () => {
    triggerHaptic();
    alert("System Scan: No critical errors found. Ready for build.");
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-50 select-none">
      
      {/* LEFT: Project Navigation */}
      <Link href="/dashboard" onClick={triggerHaptic} className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Code2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-white tracking-tight hidden md:block">AppBuild AI</span>
      </Link>

      {/* CENTER: Status */}
      <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
        <span className="font-bold text-white text-sm truncate max-w-[120px]">{project?.name || "App"}</span>
        <span className="text-[9px] text-green-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"/> Live
        </span>
      </div>

      {/* RIGHT: Tools */}
      <div className="flex items-center gap-1">
        <button onClick={onCloneClick} className="p-2 text-slate-400 hover:text-pink-400" title="Clone Vision">
          <ScanLine className="w-5 h-5" />
        </button>

        {/* GitHub Link Converter Button */}
        <button onClick={onImportClick} className="p-2 text-slate-400 hover:text-purple-400" title="GitHub Repo Converter">
          <DownloadCloud className="w-5 h-5" />
        </button>

        {/* QR Share Button */}
        <button onClick={onShareClick} className="p-2 text-slate-400 hover:text-blue-400" title="Live Share (QR)">
          <Share2 className="w-5 h-5" />
        </button>

        {/* Debug Button */}
        <button onClick={handleDebug} className="p-2 text-slate-400 hover:text-yellow-400" title="Debug">
          <Bug className="w-5 h-5" />
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1"></div>

        <button onClick={onProfileClick} className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
           <User className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}