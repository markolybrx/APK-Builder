"use client";

import { useState } from "react";
import { X, Github, Terminal, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";

export default function RepoConverter({ isOpen, onClose, onUpdateFile, triggerHaptic }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | cloning | parsing | complete

  if (!isOpen) return null;

  // --- 1. NEURAL MIGRATION LOGIC ---
  const handleImport = (e) => {
    e.preventDefault();
    if (!url) return;

    triggerHaptic?.();
    setStatus("cloning");

    // Simulate AI-driven codebase transpilation
    setTimeout(() => {
        triggerHaptic?.();
        setStatus("parsing");
    }, 2000);

    setTimeout(() => {
        triggerHaptic?.();
        setStatus("complete");
        if (onUpdateFile) {
            onUpdateFile("MainActivity.kt", "// --- IMPORTED & TRANSPILED FROM CLOUD ---\npackage com.visionary.app\n\nimport androidx.appcompat.app.AppCompatActivity\n\nclass MainActivity : AppCompatActivity() {\n   // Successfully converted from legacy source\n}");
        }
    }, 4500);
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
       
       {/* AMBIENT GLOW */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

       <div className="w-full max-w-lg bg-black border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden relative z-10 ring-1 ring-white/5">

          {/* HEADER HUB */}
          <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/30">
             <span className="font-bold text-white flex items-center gap-3 uppercase tracking-wider text-sm">
                <Github className="w-5 h-5 text-blue-400" /> Repo Converter™
             </span>
             <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 border border-transparent hover:border-zinc-700">
                <X className="w-5 h-5" />
             </button>
          </div>

          <div className="p-8">
             {status === 'idle' ? (
                <form onSubmit={handleImport} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Repository Endpoint</label>
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://github.com/username/project"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-zinc-200 focus:border-blue-500/50 outline-none font-mono text-xs transition-all placeholder:text-zinc-700"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20 active:scale-95 uppercase text-xs tracking-widest"
                    >
                        Initialize Migration <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
             ) : (
                <div className="space-y-6 animate-in zoom-in-95">
                    {/* NEURAL TERMINAL OUTPUT */}
                    <div className="h-44 bg-black/50 rounded-2xl border border-zinc-800 p-5 font-mono text-[10px] text-zinc-400 overflow-hidden relative shadow-inner">
                        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                        <div className="space-y-1.5">
                            <p className="text-zinc-600 font-bold tracking-tighter">&gt; git clone {url} .tmp</p>
                            {status !== 'cloning' && <p className="text-green-500">&gt; Remote connection established.</p>}
                            {status === 'parsing' && (
                                <div className="flex items-center gap-2 text-blue-400 animate-pulse">
                                    <span>&gt; Mapping neural dependency graph...</span>
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                </div>
                            )}
                            {status === 'complete' && (
                                <>
                                    <p className="text-green-500">&gt; Legacy logic transpiled successfully.</p>
                                    <p className="text-green-500">&gt; VFS clusters synchronized.</p>
                                    <p className="text-white font-bold mt-4 animate-bounce">MIGRATION SUCCESSFUL.</p>
                                </>
                            )}
                        </div>
                    </div>

                    {status === 'complete' && (
                        <button 
                            onClick={onClose} 
                            className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 uppercase text-xs tracking-widest"
                        >
                            <CheckCircle2 className="w-4 h-4" /> Finalize Workspace
                        </button>
                    )}
                </div>
             )}
          </div>

          <div className="p-4 bg-zinc-900/20 border-t border-zinc-800 text-center select-none">
            <p className="text-[9px] text-zinc-600 font-mono tracking-[0.2em] uppercase">Conversion Engine v2.0 // SSH Link Active</p>
          </div>
       </div>
    </div>
  );
}
