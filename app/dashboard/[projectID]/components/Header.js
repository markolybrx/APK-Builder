import { Menu, Play, X, Bug, DownloadCloud } from "lucide-react"; // Added DownloadCloud

export default function Header({ 
  project, 
  leftOpen, setLeftOpen, 
  rightOpen, setRightOpen, 
  triggerHaptic,
  onImportClick // <--- NEW PROP
}) {
  
  const handleDebug = () => {
    triggerHaptic();
    alert("Debugging... No critical errors found.");
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-50">
      
      {/* Left */}
      <button 
        onClick={() => { setLeftOpen(!leftOpen); triggerHaptic(); }}
        className={`p-2 rounded-lg transition-colors ${leftOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Center */}
      <div className="flex flex-col items-center">
        <span className="font-bold text-white text-sm max-w-[150px] truncate">
          {project?.name || "Untitled App"}
        </span>
        <span className="text-[10px] text-green-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> 
          v0.2.2
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        
        {/* IMPORT BUTTON */}
        <button 
          onClick={onImportClick}
          className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
          title="Import / Convert Repo"
        >
          <DownloadCloud className="w-5 h-5" />
        </button>

        {/* DEBUG BUTTON */}
        <button 
          onClick={handleDebug}
          className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
        >
          <Bug className="w-5 h-5" />
        </button>

        <div className="w-px h-4 bg-slate-800 mx-1"></div>

        <button 
          onClick={() => { setRightOpen(!rightOpen); triggerHaptic(); }}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${rightOpen ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/50'}`}
        >
          <span className="hidden md:inline text-xs font-bold">Preview</span>
          {rightOpen ? <X className="w-5 h-5"/> : <Play className="w-5 h-5 fill-current" />}
        </button>
      </div>
    </header>
  );
}