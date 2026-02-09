"use client";

import { useState } from "react";
import { 
  Settings, Download, Trash2, Save, Package, 
  ShieldCheck, Globe, Cpu, Smartphone 
} from "lucide-react";

export default function SettingsView({ project, triggerHaptic }) {
  // --- LOCAL STATE FOR CONFIG ---
  const [appName, setAppName] = useState(project?.name || "Untitled App");
  const [packageName, setPackageName] = useState(project?.packageName || "com.visionary.app");

  const handleSave = () => {
    triggerHaptic();
    alert(`AI System: Refactoring project to ${packageName}... build scripts updated.`);
  };

  const startBuild = () => {
    triggerHaptic();
    alert("Build Engine Started: Generating signed debug APK...");
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300 font-sans overflow-hidden">

      {/* 1. PINNED HEADER (Shrink-0) */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white uppercase tracking-widest text-[10px]">Project Configuration</span>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Save className="w-3.5 h-3.5" /> Save Config
        </button>
      </div>

      {/* 2. SCROLLABLE SETTINGS ZONE */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-950/10">
        <div className="max-w-2xl mx-auto w-full space-y-8 pb-8">
          
          {/* Section 1: Identity */}
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Identity & Branding
              </h3>
              <div className="space-y-5 bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 shadow-xl">
                  <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 px-1">App Display Name</label>
                      <input 
                          type="text" 
                          value={appName} 
                          onChange={(e) => setAppName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:border-blue-500 outline-none transition-all text-sm"
                      />
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 px-1">Android Package ID</label>
                      <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-400 focus-within:border-blue-500 transition-all">
                          <Package className="w-4 h-4 text-blue-500/50" />
                          <input 
                              type="text" 
                              value={packageName} 
                              onChange={(e) => setPackageName(e.target.value)}
                              className="bg-transparent w-full outline-none text-white font-mono text-xs"
                          />
                      </div>
                  </div>
              </div>
          </section>

          {/* Section 2: Build */}
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Build & Distribution
              </h3>
              <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between shadow-xl">
                  <div className="pr-4">
                      <h4 className="font-bold text-white text-sm">Generate Debug APK</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Compile your current project state into an installable Android file.</p>
                  </div>
                  <button 
                      onClick={startBuild}
                      className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl font-bold text-[10px] border border-slate-700 uppercase tracking-widest transition-all active:scale-95"
                  >
                      Build .apk
                  </button>
              </div>
          </section>

          {/* Section 3: Danger Zone */}
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Danger Zone
              </h3>
              <div className="bg-red-900/5 p-6 rounded-[2rem] border border-red-900/20 flex items-center justify-between shadow-xl">
                  <div>
                      <h4 className="font-bold text-red-400 text-sm">Delete Project</h4>
                      <p className="text-[10px] text-red-900/60 mt-1 italic">Warning: This deletes all source code and history.</p>
                  </div>
                  <button 
                      onClick={() => { triggerHaptic(); }}
                      className="px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-[10px] border border-red-500/20 uppercase tracking-widest transition-all"
                  >
                      Wipe Project
                  </button>
              </div>
          </section>
        </div>
      </div>

      {/* 3. PINNED SYSTEM STATUS FOOTER (Shrink-0) */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-2 text-[9px] text-slate-600 font-bold uppercase tracking-tighter">
            <ShieldCheck className="w-3 h-3 text-green-500" />
            <span>AI Governance: Security Audit Passed</span>
         </div>
         <div className="flex items-center gap-2 text-[9px] text-slate-600 font-mono">
            <Cpu className="w-3 h-3" />
            <span>Target: API 34 (Android 14)</span>
         </div>
      </div>
    </div>
  );
}
