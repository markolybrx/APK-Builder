"use client";

import { useState, useRef, useEffect } from "react";
import { 
    Play, MousePointer2, PenTool, Camera, 
    Trash2, Zap, Smartphone, Undo, RefreshCw,
    Activity, Signal, MapPin
} from "lucide-react";
import ContextualLens from "./ContextualLens"; //

export default function PreviewPane({ 
  previewMode, 
  setPreviewMode, 
  pendingChange,   // Receives code change data from Chat
  onResolveChange, // Clears the change after swipe
  triggerHaptic 
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // --- Drawing Logic ---
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
    ctx.strokeStyle = "#3b82f6"; // Blue Line
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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    triggerHaptic();
  };

  // Resize canvas on load
  useEffect(() => {
    if (previewMode === 'draw' && canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
  }, [previewMode]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300">

      {/* --- Mode Toolbar --- */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0">
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 overflow-x-auto no-scrollbar">
          <ModeBtn mode="live" current={previewMode} set={setPreviewMode} icon={Play} label="Live" />
          <ModeBtn mode="design" current={previewMode} set={setPreviewMode} icon={MousePointer2} label="Edit" />
          <ModeBtn mode="draw" current={previewMode} set={setPreviewMode} icon={PenTool} label="Draw" />
          <ModeBtn mode="ar" current={previewMode} set={setPreviewMode} icon={Camera} label="AR" />
          <ModeBtn mode="sensors" current={previewMode} set={setPreviewMode} icon={Activity} label="Sensors" />
        </div>

        <button 
          onClick={() => { triggerHaptic(); window.location.reload(); }}
          className="p-2 text-slate-400 hover:text-white" 
          title="Restart Preview"
        >
            <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-950">

        {/* 1. LIVE PREVIEW & CONTEXTUAL LENS */}
        {previewMode === 'live' && (
          <div className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
             <div className="w-full max-w-[320px] aspect-[9/19] bg-black rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-slate-700">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-xl z-20"></div>

                {/* Simulated App Screen */}
                <div className="flex-1 bg-white pt-8 flex flex-col items-center justify-center p-4 text-center">
                   <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                      <Smartphone className="w-8 h-8" />
                   </div>
                   <h3 className="text-black font-bold text-xl mb-2">Hello World</h3>
                   <p className="text-gray-500 text-sm mb-6">Build something amazing with AI.</p>
                </div>

                {/* THE GHOST UI OVERLAY (Contextual Lens) */}
                {pendingChange && (
                  <ContextualLens 
                    onAccept={() => { triggerHaptic(); onResolveChange(); }}
                    onReject={() => { triggerHaptic(); onResolveChange(); }}
                    triggerHaptic={triggerHaptic}
                  />
                )}
             </div>
          </div>
        )}

        {/* 2. DESIGN MODE (Touch-to-Tweak) */}
        {previewMode === 'design' && (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-900/50">
             <div className="w-full max-w-[320px] aspect-[9/19] bg-white rounded-[2.5rem] border-4 border-blue-500/30 shadow-2xl relative overflow-hidden flex flex-col group">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-12 pointer-events-none opacity-10">
                    {[...Array(72)].map((_, i) => <div key={i} className="border border-blue-500"></div>)}
                </div>
                <div className="absolute top-1/4 left-8 right-8 h-32 border-2 border-blue-500 bg-blue-500/10 flex items-center justify-center cursor-move">
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded absolute -top-3 left-2 font-bold">ElementEditor</span>
                </div>
                <div className="mt-auto p-4 bg-slate-100 text-center text-slate-500 text-xs font-mono">
                    DESIGN MODE: Drag to adjust layout
                </div>
             </div>
          </div>
        )}

        {/* 3. DRAW MODE (Sketch-to-Code) */}
        {previewMode === 'draw' && (
          <div className="flex-1 flex flex-col bg-[#1e293b] relative">
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                  <div className="flex gap-2 pointer-events-auto bg-slate-800/90 p-1.5 rounded-lg border border-slate-700 shadow-lg">
                      <button onClick={clearCanvas} className="p-2 hover:bg-slate-700 rounded text-slate-300"><Trash2 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-slate-700 rounded text-slate-300"><Undo className="w-4 h-4" /></button>
                  </div>
                  <button onClick={triggerHaptic} className="pointer-events-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg flex items-center gap-2 active:scale-95 transition-transform">
                    <Zap className="w-3 h-3 fill-current" /> Generate XML
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

        {/* 4. AR MODE (Ghost Mode) */}
        {previewMode === 'ar' && (
           <div className="flex-1 flex flex-col items-center justify-center relative bg-black">
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853')] bg-cover bg-center" />
              <Camera className="w-16 h-16 text-slate-500 mb-4 opacity-50" />
              <p className="text-slate-400 font-mono text-xs relative z-10 px-8 text-center uppercase tracking-widest">AR Ghost Mode Enabled</p>
           </div>
        )}

        {/* 5. SENSOR BRIDGE (Hardware Link) */}
        {previewMode === 'sensors' && (
           <div className="flex-1 flex flex-col bg-slate-950 p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <Signal className="w-4 h-4 text-green-500" /> Sensor Bridge
              </h3>
              <div className="grid grid-cols-1 gap-4">
                 <SensorCard icon={MapPin} label="GPS Location" value="37.7749° N, 122.4194° W" status="Active" />
                 <SensorCard icon={Activity} label="Accelerometer" value="X: 0.12, Y: 9.81, Z: -0.05" status="Tracking" />
                 <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-500 leading-relaxed italic">
                    Real-time hardware bridge connected. Move your phone to see data change in the preview.
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ModeBtn({ mode, current, set, icon: Icon, label }) {
  const active = current === mode;
  return (
    <button 
      onClick={() => set(mode)} 
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-md transition-all shrink-0
        ${active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}
      `}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}

function SensorCard({ icon: Icon, label, value, status }) {
    return (
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-blue-400"><Icon className="w-5 h-5" /></div>
                <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{label}</div>
                    <div className="text-sm text-white font-mono">{value}</div>
                </div>
            </div>
            <div className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20 font-bold">
                {status}
            </div>
        </div>
    )
}