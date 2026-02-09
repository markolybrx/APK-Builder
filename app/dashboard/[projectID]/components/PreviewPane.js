"use client";

import { useState, useRef, useEffect } from "react";
import { 
    Play, MousePointer2, PenTool, Camera, 
    Trash2, Zap, Smartphone, Undo, RefreshCw,
    Activity, Signal, MapPin, Circle, Sparkles 
} from "lucide-react";

// --- ADVANCED AI & HARDWARE LAYERS ---
import ContextualLens from "./ContextualLens";
import BehaviorRecorder from "./BehaviorRecorder";
import SensorBridge from "./SensorBridge";
import DesignCritique from "./DesignCritique";

export default function PreviewPane({ 
  previewMode, 
  setPreviewMode, 
  pendingChange,   
  onResolveChange, 
  triggerHaptic 
}) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null); 
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [isCritiqueOpen, setIsCritiqueOpen] = useState(false);

  // --- 1. ACTIVATING REAL CAMERA (AR Mode) ---
  useEffect(() => {
    let stream = null;
    async function startCamera() {
      if (previewMode === 'ar') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" }, 
            audio: false 
          });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Camera error:", err);
        }
      }
    }
    startCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [previewMode]);

  // --- 2. DRAWING LOGIC (Sketch-to-Code) ---
  const startDrawing = (e) => { setIsDrawing(true); draw(e); };
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    }
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#3b82f6"; 
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const stopDrawing = () => {
    setIsDrawing(false);
    if (!canvasRef.current) return;
    canvasRef.current.getContext("2d").beginPath(); 
  };
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    triggerHaptic();
  };

  useEffect(() => {
    if (previewMode === 'draw' && canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
    }
  }, [previewMode]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300 relative overflow-hidden">

      {/* 1. PINNED MODE TOOLBAR (Shrink-0) */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0 z-20">
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 overflow-x-auto no-scrollbar">
          <ModeBtn mode="live" current={previewMode} set={setPreviewMode} icon={Play} label="Live" />
          <ModeBtn mode="design" current={previewMode} set={setPreviewMode} icon={MousePointer2} label="Edit" />
          <ModeBtn mode="draw" current={previewMode} set={setPreviewMode} icon={PenTool} label="Draw" />
          <ModeBtn mode="ar" current={previewMode} set={setPreviewMode} icon={Camera} label="AR" />
          <ModeBtn mode="sensors" current={previewMode} set={setPreviewMode} icon={Activity} label="Sensors" />
        </div>

        <div className="flex items-center gap-1">
            <button 
                onClick={() => { setIsCritiqueOpen(!isCritiqueOpen); triggerHaptic(); }}
                className={`p-2 rounded-lg transition-all ${isCritiqueOpen ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
                <Sparkles className="w-4 h-4" />
            </button>
            <button 
                onClick={() => { setIsRecordingMode(!isRecordingMode); triggerHaptic(); }}
                className={`p-2 rounded-lg transition-all ${isRecordingMode ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-400 hover:text-white'}`}
            >
                <Circle className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* 2. SCROLLABLE PREVIEW ZONE */}
      <div className="flex-1 relative overflow-y-auto bg-slate-950 custom-scrollbar">
        
        {/* Live Preview Container */}
        {previewMode === 'live' && (
          <div className="min-h-full flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
             <div className="w-full max-w-[300px] aspect-[9/19] bg-black rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-slate-700">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-xl z-20" />
                <div className="flex-1 bg-white pt-8 flex flex-col items-center justify-center p-4 text-center">
                   <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                      <Smartphone className="w-8 h-8" />
                   </div>
                   <h3 className="text-black font-bold text-xl mb-2">Native Preview</h3>
                   <p className="text-gray-500 text-[10px] uppercase font-bold">Connected to VFS</p>
                </div>
                {isRecordingMode && (
                  <BehaviorRecorder 
                    triggerHaptic={triggerHaptic}
                    onRecordComplete={(logic) => {
                       setIsRecordingMode(false);
                       onResolveChange(`// Behavior: ${logic}\nclass RecordedActivity : AppCompatActivity() {}`); 
                    }}
                  />
                )}
             </div>
          </div>
        )}

        {/* Design Mode Container */}
        {previewMode === 'design' && (
          <div className="min-h-full flex items-center justify-center p-6">
             <div className="w-full max-w-[300px] aspect-[9/19] bg-white rounded-[2.5rem] border-4 border-blue-500/30 shadow-2xl relative overflow-hidden" />
          </div>
        )}

        {/* Draw Mode Container (Uses absolute fill to track canvas correctly) */}
        {previewMode === 'draw' && (
          <div className="absolute inset-0 bg-[#1e293b] flex flex-col">
              <div className="p-4 flex justify-between items-center z-10">
                  <div className="flex gap-2 bg-slate-800/90 p-1 rounded-lg border border-slate-700">
                      <button onClick={clearCanvas} className="p-2 text-slate-300"><Trash2 className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-300"><Undo className="w-4 h-4" /></button>
                  </div>
                  <button onClick={triggerHaptic} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg flex items-center gap-2">
                    <Zap className="w-3 h-3 fill-current" /> Convert to Code
                  </button>
              </div>
              <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="flex-1 cursor-crosshair touch-none" />
          </div>
        )}

        {/* AR Camera Container */}
        {previewMode === 'ar' && (
           <div className="absolute inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-80" />
              <div className="relative z-10 w-64 h-64 border-2 border-dashed border-blue-500/50 rounded-3xl flex flex-col items-center justify-center backdrop-blur-[2px]">
                <Camera className="w-12 h-12 text-blue-500 mb-2 animate-pulse" />
                <p className="text-white font-mono text-[10px] uppercase tracking-widest">AR HARDWARE ACTIVE</p>
              </div>
           </div>
        )}

        {/* Sensor Bridge Container (Explicitly Scrollable) */}
        {previewMode === 'sensors' && (
           <div className="p-6">
              <SensorBridge triggerHaptic={triggerHaptic} />
           </div>
        )}

        {/* AI Critique Overlay */}
        {isCritiqueOpen && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm p-6 flex items-center justify-center">
             <DesignCritique triggerHaptic={triggerHaptic} onAutoFix={() => { setIsCritiqueOpen(false); onResolveChange("\n<LinearLayout />"); }} />
          </div>
        )}

      </div>
    </div>
  );
}

function ModeBtn({ mode, current, set, icon: Icon, label }) {
  const active = current === mode;
  return (
    <button onClick={() => set(mode)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all shrink-0 ${active ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}>
      <Icon className="w-4 h-4" />
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}
