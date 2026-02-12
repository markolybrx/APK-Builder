"use client";

import { Settings, Download, Trash2, Save, Smartphone, Code2, Box, Cpu } from "lucide-react";

export default function SettingsView({ project, triggerHaptic }) {
  
  const handleExport = (type) => {
    triggerHaptic?.();
    // Simulation of a build process trigger
    alert(`[VISIONARY BUILDER] Initiating ${type} compilation sequence...`);
  };

  return (
    <div className="flex flex-col h-full bg-black text-zinc-300 font-sans border-l border-zinc-800 animate-in slide-in-from-right duration-300">
      
      {/* HEADER */}
      <div className="h-14 border-b border-zinc-800 flex items-center px-6 bg-zinc-900/20 shrink-0">
         <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-xs">
            <Settings className="w-4 h-4 text-zinc-500" />
            <span>Project Configuration</span>
         </div>
      </div>

      {/* SCROLLABLE SETTINGS FORM */}
      <div className="flex-1 p-8 w-full max-w-4xl mx-auto space-y-10 overflow-y-auto custom-scrollbar">
         
         {/* SECTION 1: METADATA */}
         <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-pink-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Box className="w-3 h-3" /> App Manifest
            </h3>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-6">
                <div className="grid gap-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Application Name</label>
                    <input 
                        type="text" 
                        defaultValue={project?.name || "Untitled Project"} 
                        className="bg-black border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-pink-500/50 outline-none transition-all placeholder:text-zinc-700" 
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Package ID (Unique)</label>
                    <input 
                        type="text" 
                        defaultValue={project?.packageName || "com.visionary.app"} 
                        className="bg-black border border-zinc-800 rounded-xl p-4 text-sm text-blue-400 font-mono focus:border-blue-500/50 outline-none transition-all" 
                    />
                </div>
            </div>
         </section>

         {/* SECTION 2: EXPORT PIPELINE */}
         <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Cpu className="w-3 h-3" /> Build Artifacts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                    onClick={() => handleExport('APK')} 
                    className="group bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Smartphone className="w-16 h-16 text-blue-500" />
                    </div>
                    <Smartphone className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-white text-sm">Generate Debug APK</h4>
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wide">Compile for Android Testing</p>
                </button>

                <button 
                    onClick={() => handleExport('Source')} 
                    className="group bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl hover:border-green-500/50 hover:bg-green-500/5 transition-all text-left relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Code2 className="w-16 h-16 text-green-500" />
                    </div>
                    <Code2 className="w-8 h-8 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-white text-sm">Export Source Code</h4>
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wide">Download Android Studio ZIP</p>
                </button>
            </div>
         </section>

         {/* SECTION 3: DANGER ZONE */}
         <section className="space-y-4 pt-8 border-t border-zinc-800/50">
            <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Trash2 className="w-3 h-3" /> Destructive Actions
            </h3>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="font-bold text-white text-sm">Delete Project Workspace</h4>
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wide">This action is irreversible and will wipe all VFS data.</p>
                </div>
                <button className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all border border-red-500/20 uppercase tracking-widest whitespace-nowrap">
                    Delete Permanently
                </button>
            </div>
         </section>

         <div className="h-10" /> {/* Spacer */}
      </div>
    </div>
  );
}
