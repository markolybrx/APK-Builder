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
  projectFiles, // NOW RECEIVING REAL CODE
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

  // --- 1. THE VIRTUAL XML RENDERER ---
  // This parses the raw XML string into visual UI elements
  const renderedUI = useMemo(() => {
  const mainFile = projectFiles?.find(f => f.name === "activity_main.xml");
  const mainXml = mainFile?.content || "";

    // Simple regex parser for demo-to-reality transition
    const elements = [];
    const buttonMatches = [...mainXml.matchAll(/<Button[^>]*android:text="([^"]*)"[^>]*\/>/g)];
    const textMatches = [...mainXml.matchAll(/<TextView[^>]*android:text="([^"]*)"[^>]*\/>/g)];

    buttonMatches.forEach((m, i) => elements.push({ type: 'button', text: m[1], id: i }));
    textMatches.forEach((m, i) => elements.push({ type: 'text', text: m[1], id: i }));

    return elements;
  }, [projectFiles]);

  // --- 2. HARDWARE RECOVERY (AR Mode) ---
  useEffect(() => {
    let stream = null;
    async function startCamera() {
      if (previewMode === 'ar') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) { console.error("Hardware block:", err); }
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [previewMode]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300 relative overflow-hidden">
      
      {/* TOOLBAR */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0 z-20">
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
          <ModeBtn mode="live" current={previewMode} set={setPreviewMode} icon={Play} label="Live" />
          <ModeBtn mode="design" current={previewMode} set={setPreviewMode} icon={MousePointer2} label="Edit" />
          <ModeBtn mode="draw" current={previewMode} set={setPreviewMode} icon={PenTool} label="Draw" />
          <ModeBtn mode="ar" current={previewMode} set={setPreviewMode} icon={Camera} label="AR" />
          <ModeBtn mode="sensors" current={previewMode} set={setPreviewMode} icon={Activity} label="Sensors" />
        </div>
      </div>

      <div className="flex-1 relative overflow-y-auto bg-slate-950 custom-scrollbar">
        
        {/* LIVE RENDERER */}
        {previewMode === 'live' && (
          <div className="min-h-full flex items-center justify-center p-6 bg-slate-900">
             <div className="w-full max-w-[300px] aspect-[9/19] bg-white rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-white/10">
                
                {/* Status Bar */}
                <div className="h-12 bg-slate-100 flex items-end justify-center pb-2 px-6">
                    <div className="w-20 h-4 bg-slate-800 rounded-full mb-1" />
                </div>

                {/* DYNAMIC CONTENT AREA */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-white">
                   {renderedUI.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-slate-300">
                        <Smartphone className="w-12 h-12 mb-2 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting XML Layout</p>
                     </div>
                   ) : (
                     renderedUI.map((el) => (
                       <div key={el.id} className="animate-in fade-in zoom-in-95 duration-300">
                         {el.type === 'button' ? (
                           <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all">
                             {el.text}
                           </button>
                         ) : (
                           <p className="text-slate-800 text-center font-medium">{el.text}</p>
                         )}
                       </div>
                     ))
                   )}
                </div>

                {isRecordingMode && <BehaviorRecorder onRecordComplete={(l) => onResolveChange("MainActivity.kt", l)} />}
             </div>
          </div>
        )}

        {/* Other modes remain consistent... */}
        {previewMode === 'sensors' && <div className="p-6"><SensorBridge /></div>}
        {previewMode === 'ar' && (
          <div className="absolute inset-0 bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-blue-500/30 m-20 rounded-3xl" />
          </div>
        )}
      </div>
    </div>
  );
}

function ModeBtn({ mode, current, set, icon: Icon, label }) {
  const active = current === mode;
  return (
    <button onClick={() => set(mode)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
      <Icon className="w-4 h-4" />
      <span className="text-[9px] font-bold uppercase">{label}</span>
    </button>
  );
}
