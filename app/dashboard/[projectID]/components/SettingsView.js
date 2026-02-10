"use client";

import { Settings, Download, Trash2, Save, Smartphone, Code2 } from "lucide-react";

export default function SettingsView({ project, triggerHaptic }) {
  
  const handleExport = (type) => {
    triggerHaptic?.();
    alert(`Exporting ${type} package... (Simulation)`);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-slate-300">
      <div className="h-14 border-b border-slate-800 flex items-center px-6 bg-[#0f172a]">
         <div className="flex items-center gap-2 font-bold text-white">
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Project Settings</span>
         </div>
      </div>

      <div className="p-8 max-w-3xl mx-auto w-full space-y-8 overflow-y-auto custom-scrollbar">
         
         {/* General Info */}
         <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">General</h3>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="grid gap-2">
                    <label className="text-xs font-bold text-white">Project Name</label>
                    <input type="text" defaultValue={project?.name || "Untitled App"} className="bg-black border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:border-blue-500 outline-none" />
                </div>
                <div className="grid gap-2">
                    <label className="text-xs font-bold text-white">Package Name</label>
                    <input type="text" defaultValue="com.visionary.app" className="bg-black border border-slate-800 rounded-lg p-3 text-sm text-slate-300 font-mono focus:border-blue-500 outline-none" />
                </div>
            </div>
         </section>

         {/* Export Options */}
         <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Build & Export</h3>
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleExport('APK')} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all group text-left">
                    <Smartphone className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-white">Export APK</h4>
                    <p className="text-xs text-slate-500 mt-1">Compiled Android binary for testing.</p>
                </button>
                <button onClick={() => handleExport('Source')} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-green-500 hover:bg-green-500/5 transition-all group text-left">
                    <Code2 className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-white">Download Source</h4>
                    <p className="text-xs text-slate-500 mt-1">Full Android Studio project (ZIP).</p>
                </button>
            </div>
         </section>

         {/* Danger Zone */}
         <section className="space-y-4 pt-8 border-t border-slate-800">
            <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest">Danger Zone</h3>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-white">Delete Project</h4>
                    <p className="text-xs text-slate-500 mt-1">This action cannot be undone.</p>
                </div>
                <button className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all border border-red-500/20">
                    Delete Permanently
                </button>
            </div>
         </section>

      </div>
    </div>
  );
}
