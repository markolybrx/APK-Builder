"use client";

import { useState, useRef, useEffect } from "react";
import { 
    Play, MousePointer2, PenTool, Camera, 
    Trash2, Zap, Smartphone, Undo, RefreshCw,
    Activity, Signal, MapPin, Circle, Sparkles 
} from "lucide-react";

// --- ADVANCED AI & HARDWARE LAYERS ---
import ContextualLens from "./ContextualLens"; // Swipe-to-Apply
import BehaviorRecorder from "./BehaviorRecorder"; // No-code logic
import SensorBridge from "./SensorBridge"; // Hardware Link
import DesignCritique from "./DesignCritique"; // Professional Audit

export default function PreviewPane({ 
  previewMode, 
  setPreviewMode, 
  pendingChange,   
  onResolveChange, 
  triggerHaptic 
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [isCritiqueOpen, setIsCritiqueOpen] = useState(false);

  // --- Drawing Logic (Sketch-to-Code) ---
  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

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
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath(); 
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    triggerHaptic();
  };

  useEffect(() => {
    if (previewMode === 'draw' && canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
  }, [previewMode]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300 relative overflow-hidden">

      {/* --- Mode Toolbar (Fixed Header) --- */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0 z-20">
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 overflow-x-auto no-scrollbar">
          <ModeBtn mode="live" current={previewMode} set={setPreviewMode} icon={Play} label="Live" />
          <ModeBtn mode="design" current={previewMode} set={setPreviewMode} icon={MousePointer2} label="Edit" />
          <ModeBtn mode="draw" current={previewMode} set={setPreviewMode} icon={PenTool} label="Draw" />
          <ModeBtn mode="ar" current={previewMode} set={setPreviewMode} icon={Camera} label="AR" />
          <ModeBtn mode="sensors" current={previewMode} set={setPreviewMode} icon={Activity} label="Sensors" />
        </div>

        <div className="flex items-center gap-1">
            {/* AI Design Critique Toggle */}
            <button 
                onClick={() => { setIsCritiqueOpen(!isCritiqueOpen); triggerHaptic(); }}
                className={`p-2 rounded-lg transition-all ${isCritiqueOpen ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white'}`}
                title="AI Design Review"
            >
                <Sparkles className="w-4 h-4" />
            </button>

            {/* Behavior Recorder Toggle */}
            <button 
                onClick={() => { setIsRecordingMode(!isRecordingMode); triggerHaptic(); }}
                className={`p-2 rounded-lg transition-all ${isRecordingMode ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-400 hover:text-white'}`}
                title="Record Behavior"
            >
                <Circle className="w-4 h-4" />
            </button>

            <button 
                onClick={() => { triggerHaptic(); window.location.reload(); }}
                className="p-2 text-slate-400 hover:text-white" 
                title="Restart Preview"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-950">

        {/* 1. LIVE PREVIEW & GHOST UI LAYERS */}
        {previewMode === 'live' && (
          <div className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 overflow-hidden">
             <div className="w-full max-w-[300px] aspect-[9/19] bg-black rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-slate-700">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-xl z-20"></div>

                <div className="flex-1 bg-white pt-8 flex flex-col items-center justify-center p-4 text-center">
                   <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                      <Smartphone className="w-8 h-8" />
                   </div>
                   <h3 className="text-black font-bold text-xl mb-2 leading-tight">Native Preview</h3>
                   <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Running Android 14 Emulation</p>
                </div>

                {/* Contextual Lens Overlay (Swipe-to-Apply Code) */}
                {pendingChange && (
                  <ContextualLens 
                    onAccept={() => { triggerHaptic(); onResolveChange(); }}
                    onReject={() => { triggerHaptic(); onResolveChange(); }}
                    triggerHaptic={triggerHaptic}
                  />
                )}

                {/* Behavior Recorder Layer */}
                {isRecordingMode && (
                  <BehaviorRecorder 
                    triggerHaptic={triggerHaptic}
                    onRecordComplete={(logic) => {
                       setIsRecordingMode(false);
                       onResolveChange(logic); 
                    }}
                  />
                )}
             </div>
          </div>
        )}

        {/* 2. DESIGN MODE (Visual Editing) */}
        {previewMode === 'design' && (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-900/50">
             <div className="w-full max-w-[300px] aspect-[9/19] bg-white rounded-[2.5rem] border-4 border-blue-500/30 shadow-2xl relative overflow-hidden flex flex-col group">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-12 pointer-events-none opacity-10">
                    {[...Array(72)].map((_, i) => <div key={i} className="border border-blue-500"></div>)}
                </div>
                <div className="absolute top-1/4 left-8 right-8 h-32 border-2 border-blue-500 bg-blue-500/10 flex items-center justify-center cursor-move">
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded absolute -top-3 left-2 font-bold">hero_layout.xml</span>
                </div>
             </div>
          </div>
        )}

        {/* 3. DRAW MODE (Sketching) */}
        {previewMode === 'draw' && (
          <div className="flex-1 flex flex-col bg-[#1e293b] relative">
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                  <div className="flex gap-2 pointer-events-auto bg-slate-800/90 p-1.5 rounded-lg border border-slate-700 shadow-lg">
                      <button onClick={clearCanvas} className="p-2 hover:bg-slate-700 rounded text-slate-300"><Trash2 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-slate-700 rounded text-slate-300"><Undo className="w-4 h-4" /></button>
                  </div>
                  <button onClick={triggerHaptic} className="pointer-events-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg flex items-center gap-2">
                    <Zap className="w-3 h-3 fill-current" /> Convert to XML
                  </button>
              </div>
              <canvas 
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="flex-1 cursor-crosshair touch-none w-full h-full"
              />
          </div>
        )}

        {/* 4. AR VISION */}
        {previewMode === 'ar' && (
           <div className="flex-1 flex flex-col items-center justify-center relative bg-black">
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853')] bg-cover bg-center" />
              <Camera className="w-16 h-16 text-slate-500 mb-4 opacity-50" />
              <p className="text-slate-400 font-mono text-xs relative z-10 px-8 text-center uppercase tracking-widest">AR Ghost Layer Enabled</p>
           </div>
        )}

        {/* 5. SENSOR BRIDGE (Hardware Integration) */}
        {previewMode === 'sensors' && (
           <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto custom-scrollbar">
              <SensorBridge triggerHaptic={triggerHaptic} />
           </div>
        )}

        {/* --- GLOBAL AI OVERLAYS --- */}

        {/* Design Critique Audit */}
        {isCritiqueOpen && (
          <DesignCritique 
            triggerHaptic={triggerHaptic}
            onAutoFix={() => {
              setIsCritiqueOpen(false);
              onResolveChange("Applying professional Material Design 3 spacing and color corrections.");
            }}
          />
        )}

      </div>
    </div>
  );
}

// --- TOOLBAR BUTTON HELPERS ---

function ModeBtn({ mode, current, set, icon: Icon, label }) {
  const active = current === mode;
  return (
    <button 
      onClick={() => set(mode)} 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all shrink-0
        ${active ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}
