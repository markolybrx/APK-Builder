"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { 
    Play, MousePointer2, Camera, Smartphone, Activity 
} from "lucide-react";

// --- ALL EXTERNAL MODULES DISABLED ---
// import DesignCritique from "./DesignCritique"; 
// import ContextualLens from "./ContextualLens"; 
// import SensorBridge from "./SensorBridge"; 

export default function PreviewPane({ 
  projectFiles = [], 
  previewMode, 
  setPreviewMode, 
  triggerHaptic 
}) {
  const videoRef = useRef(null); 

  // --- VIRTUAL XML RENDERER ---
  const renderedUI = useMemo(() => {
    if (!projectFiles || !Array.isArray(projectFiles)) return [];
    const mainFile = projectFiles.find(f => f.name === "activity_main.xml");
    const mainXml = mainFile?.content || ""; 
    const elements = [];
    const buttonMatches = [...mainXml.matchAll(/<Button[^>]*android:text="([^"]*)"[^>]*\/>/g)];
    const textMatches = [...mainXml.matchAll(/<TextView[^>]*android:text="([^"]*)"[^>]*\/>/g)];
    buttonMatches.forEach((m, i) => elements.push({ type: 'button', text: m[1], id: `btn-${i}` }));
    textMatches.forEach((m, i) => elements.push({ type: 'text', text: m[1], id: `txt-${i}` }));
    return elements;
  }, [projectFiles]);

  useEffect(() => {
    let stream = null;
    async function startCamera() {
      if (previewMode === 'ar') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) { console.error("Hardware Permission Blocked:", err); }
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [previewMode]);

  return (
    <div className="flex flex-col h-full w-full bg-[#020617] text-slate-300 relative overflow-hidden">
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-[#020617] shrink-0 z-20 select-none">
        <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-800 overflow-x-auto no-scrollbar gap-1">
          <ModeBtn mode="live" current={previewMode} set={setPreviewMode} icon={Play} label="Live" />
          <ModeBtn mode="design" current={previewMode} set={setPreviewMode} icon={MousePointer2} label="Edit" />
          <ModeBtn mode="ar" current={previewMode} set={setPreviewMode} icon={Camera} label="AR" />
        </div>
      </div>

      <div className="flex-1 relative overflow-y-auto bg-[#020617] custom-scrollbar">
        {(previewMode === 'live' || previewMode === 'design') && (
          <div className="min-h-full flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]">
             <div className="w-full max-w-[280px] aspect-[9/19] bg-white rounded-[2.5rem] border-[10px] border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col ring-1 ring-white/5">
                <div className="h-8 bg-slate-100 flex items-end justify-center pb-2 px-6 shrink-0 z-10"><div className="w-16 h-4 bg-black rounded-full" /></div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-white custom-scrollbar relative">
                   {renderedUI.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-20"><Smartphone className="w-10 h-10 mb-3" /><p className="text-[9px] font-bold uppercase tracking-[0.2em]">Void Layout</p></div> : renderedUI.map((el) => (<div key={el.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">{el.type === 'button' ? <button className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg">{el.text}</button> : <p className="text-slate-800 text-center text-sm font-semibold">{el.text}</p>}</div>))}
                </div>
             </div>
          </div>
        )}

        {previewMode === 'ar' && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-white/20 m-20 rounded-3xl" />
          </div>
        )}
      </div>
    </div>
  );
}

function ModeBtn({ mode, current, set, icon: Icon, label }) {
  const active = current === mode;
  return <button onClick={() => set(mode)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all shrink-0 ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}><Icon className="w-3.5 h-3.5" /><span className="text-[9px] font-bold uppercase tracking-tight">{label}</span></button>;
}
