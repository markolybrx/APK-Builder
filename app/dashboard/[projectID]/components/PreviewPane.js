"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { 
    Play, MousePointer2, PenTool, Camera, 
    Trash2, Zap, Smartphone, Undo, RefreshCw,
    Activity, Circle, Sparkles, Type, Square
} from "lucide-react";

// --- ADVANCED AI & HARDWARE LAYERS ---
import ContextualLens from "./ContextualLens";
import BehaviorRecorder from "./BehaviorRecorder";
import SensorBridge from "./SensorBridge";
import DesignCritique from "./DesignCritique";

export default function PreviewPane({ 
  projectFiles = [], // Guarded default
  previewMode, 
  setPreviewMode, 
  pendingChange,   
  onResolveChange, 
  triggerHaptic 
}) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null); 
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [isCritiqueOpen, setIsCritiqueOpen] = useState(false);

  // --- 1. CRASH-PROOF VIRTUAL XML RENDERER ---
  // Transforms raw XML state into interactive UI elements
  const renderedUI = useMemo(() => {
    // Safety check: Prevents .find() on undefined projectFiles
    if (!projectFiles || !Array.isArray(projectFiles)) return [];

    const mainFile = projectFiles.find(f => f.name === "activity_main.xml");
    const mainXml = mainFile?.content || ""; // Optional chaining prevents null access

    const elements = [];
    
    // Scans XML for real components created by the AI
    const buttonMatches = [...mainXml.matchAll(/<Button[^>]*android:text="([^"]*)"[^>]*\/>/g)];
    const textMatches = [...mainXml.matchAll(/<TextView[^>]*android:text="([^"]*)"[^>]*\/>/g)];

    buttonMatches.forEach((m, i) => elements.push({ type: 'button', text: m[1], id: `btn-${i}` }));
    textMatches.forEach((m, i) => elements.push({ type: 'text', text: m[1], id: `txt-${i}` }));

    return elements;
  }, [projectFiles]);

  // --- 2. HARDWARE STABILIZATION (AR Mode) ---
  useEffect(() => {
    let stream = null;
    async function startCamera() {
      if (previewMode === 'ar') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) { 
          console.error("Hardware Permission Blocked:", err); 
        }
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [previewMode]);

  return (
    <div className="flex flex-col h-full w-full bg-[#020617] text-slate-300 relative overflow-hidden">

      {/* 1. PINNED TOOLBAR */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0 z-20">
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 overflow-x-auto no-scrollbar">
          <ModeBtn mode="live" current={previewMode} set={setPreviewMode} icon={Play} label="Live" />
          <ModeBtn mode="design" current={previewMode} set={setPreviewMode} icon={MousePointer2} label="Edit" />
          <ModeBtn mode="draw" current={previewMode} set={setPreviewMode} icon={PenTool} label="Draw" />
          <ModeBtn mode="ar" current={previewMode} set={setPreviewMode} icon={Camera} label="AR" />
          <ModeBtn mode="sensors" current={previewMode} set={setPreviewMode} icon={Activity} label="Sensors" />
        </div>
      </div>

      <div className="flex-1 relative overflow-y-auto bg-slate-950 custom-scrollbar">

        {/* 2. DYNAMIC LIVE RENDERER */}
        {previewMode === 'live' && (
          <div className="min-h-full flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-[#020617]">
             <div className="w-full max-w-[280px] aspect-[9/19] bg-white rounded-[2.5rem] border-[10px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col ring-1 ring-white/5">

                {/* Android Status Bar */}
                <div className="h-10 bg-slate-100 flex items-end justify-center pb-2 px-6 shrink-0">
                    <div className="w-16 h-4 bg-slate-800 rounded-full" />
                </div>

                {/* LIVE VFS CONTENT AREA */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-white custom-scrollbar">
                   {renderedUI.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-slate-300 transition-opacity">
                        <Smartphone className="w-10 h-10 mb-3 opacity-10" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Void Layout</p>
                     </div>
                   ) : (
                     renderedUI.map((el) => (
                       <div key={el.id} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                         {el.type === 'button' ? (
                           <button 
                             onClick={() => triggerHaptic()}
                             className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                           >
                             {el.text}
                           </button>
                         ) : (
                           <p className="text-slate-800 text-center text-sm font-semibold tracking-tight">{el.text}</p>
                         )}
                       </div>
                     ))
                   )}
                </div>

                {/* BEHAVIOR RECORDER LAYER */}
                {isRecordingMode && (
                  <div className="absolute inset-0 bg-red-500/5 backdrop-blur-[1px] z-30 pointer-events-none border-4 border-red-500/20 rounded-[2rem]" />
                )}
             </div>
          </div>
        )}

        {/* HARDWARE VIEWPORTS */}
        {previewMode === 'sensors' && <div className="p-6"><SensorBridge triggerHaptic={triggerHaptic} /></div>}
        
        {previewMode === 'ar' && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
            <div className="absolute w-64 h-64 border-2 border-dashed border-blue-500/40 rounded-3xl animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

function ModeBtn({ mode, current, set, icon: Icon, label }) {
  const active = current === mode;
  return (
    <button 
      onClick={() => set(mode)} 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all shrink-0
        ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="text-[9px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}