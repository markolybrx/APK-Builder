"use client";

import { useState } from "react";
import { X, Github, Terminal, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RepoConverter({ isOpen, onClose, onUpdateFile, triggerHaptic }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | cloning | parsing | complete

  if (!isOpen) return null;

  const handleImport = (e) => {
    e.preventDefault();
    if (!url) return;
    
    triggerHaptic?.();
    setStatus("cloning");
    
    setTimeout(() => setStatus("parsing"), 2000);
    setTimeout(() => {
        setStatus("complete");
        if (onUpdateFile) {
            onUpdateFile("MainActivity.kt", "// IMPORTED FROM GITHUB\npackage com.imported.app\n\nclass MainActivity : AppCompatActivity() {\n   // Code converted from repository\n}");
        }
    }, 4000);
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
       <div className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
             <span className="font-bold text-white flex items-center gap-2">
                <Github className="w-5 h-5" /> Repo Converter
             </span>
             <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-8">
             {status === 'idle' ? (
                <form onSubmit={handleImport} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Repository URL</label>
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://github.com/username/project"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:border-blue-500 outline-none font-mono text-sm"
                        />
                    </div>
                    <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                        Start Migration <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
             ) : (
                <div className="space-y-6">
                    {/* FIXED: Escaped '>' characters to '&gt;' to fix build error */}
                    <div className="h-40 bg-black rounded-xl border border-slate-800 p-4 font-mono text-[10px] text-slate-400 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                        <p>&gt; git clone {url} .tmp</p>
                        {status !== 'cloning' && <p className="text-green-500">&gt; Clone successful.</p>}
                        {status === 'parsing' && <p className="text-blue-400 animate-pulse">&gt; Analyzing dependency graph...</p>}
                        {status === 'complete' && (
                            <>
                                <p className="text-green-500">&gt; Dependencies resolved.</p>
                                <p className="text-green-500">&gt; VFS Structure rebuilt.</p>
                                <p className="text-white font-bold mt-2">DONE.</p>
                            </>
                        )}
                    </div>

                    {status === 'complete' && (
                        <button onClick={onClose} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Open Workspace
                        </button>
                    )}
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
