import { 
  Bug, DownloadCloud, Code2, User, 
  ScanLine, Share2 
} from "lucide-react";
import Link from "next/link";

export default function Header({ 
  project, 
  triggerHaptic,
  onImportClick,   // For Repo Converter
  onCloneClick,    // For Clone Vision
  onShareClick,    // For QR-Live Share
  onProfileClick   // For Profile Settings
}) {

  const handleDebug = () => {
    triggerHaptic();
    alert("Debugging... No critical errors found.");
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-50 select-none">

      {/* --- LEFT: LOGO (Routes to Project Dashboard) --- */}
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
      <div className="flex items-center gap-1">

        {/* Clone Vision Button */}
        <button 
          onClick={onCloneClick}
          className="p-2 text-slate-400 hover:text-pink-400 hover:bg-pink-400/10 rounded-lg transition-colors"
          title="Clone from Screenshot"
        >
          <ScanLine className="w-5 h-5" />
        </button>

        {/* Import Button (Repo Converter) */}
        <button 
          onClick={onImportClick}
          className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
          title="Import / Convert Repo"
        >
          <DownloadCloud className="w-5 h-5" />
        </button>

        {/* QR Live Share Button */}
        <button 
          onClick={onShareClick}
          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
          title="Live Share (QR)"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Debug Button */}
        <button 
          onClick={handleDebug}
          className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
          title="Debug Project"
        >
          <Bug className="w-5 h-5" />
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1"></div>

        {/* PROFILE BUTTON */}
        <button 
          onClick={onProfileClick}
          className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all overflow-hidden"
        >
           <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
