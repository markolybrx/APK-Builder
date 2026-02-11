"use client";

import { useState } from "react";
import { X, Upload, Image as ImageIcon, Loader2, ArrowRight, ScanLine, CheckCircle2 } from "lucide-react";

export default function CloneVision({ isOpen, onClose, triggerHaptic }) {
  const [step, setStep] = useState('upload'); // upload | scanning | processing | done
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  // --- 1. GESTURE HANDLERS ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    triggerHaptic?.();
    startSimulation();
  };

  // --- 2. NEURAL RECONSTRUCTION SIMULATION ---
  const startSimulation = () => {
    setStep('scanning');
    // Simulate multi-stage AI pipeline
    setTimeout(() => {
        triggerHaptic?.();
        setStep('processing');
    }, 2000);
    setTimeout(() => {
        triggerHaptic?.();
        setStep('done');
    }, 4500);
  };

  const resetAndClose = () => {
    setStep('upload');
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">

      {/* AMBIENT NEURAL GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-black border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 ring-1 ring-white/5">

        {/* HEADER HUB */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/30">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-lg border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                  <ScanLine className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                  <h3 className="font-bold text-white text-sm tracking-wide uppercase">Clone Vision™</h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Neural UI Reconstruction</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 border border-transparent hover:border-zinc-700">
              <X className="w-5 h-5" />
           </button>
        </div>

        {/* VIEWPORT AREA */}
        <div className="p-10 min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">

            {/* STEP 1: UPLOAD PHASE */}
            {step === 'upload' && (
                <div 
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload').click()}
                    className={`w-full h-64 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all cursor-pointer relative overflow-hidden group
                    ${dragActive 
                        ? 'border-pink-500 bg-pink-500/5 scale-[1.01] shadow-[0_0_40px_rgba(236,72,153,0.1)]' 
                        : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40'}`}
                >
                    <input type="file" id="file-upload" className="hidden" onChange={startSimulation} accept="image/*" />

                    <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl z-10">
                        <Upload className="w-7 h-7 text-zinc-400 group-hover:text-pink-400 transition-colors" />
                    </div>
                    <div className="z-10">
                        <p className="text-zinc-200 font-bold text-lg group-hover:text-white transition-colors tracking-tight">Drop UI Screenshot</p>
                        <p className="text-zinc-500 text-[10px] mt-2 font-mono uppercase tracking-[0.2em]">Ready for Decomposition</p>
                    </div>

                    {/* Matrix Grid Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
                </div>
            )}

            {/* STEP 2: SCANNING PHASE */}
            {step === 'scanning' && (
                <div className="space-y-8 animate-in zoom-in-95 flex flex-col items-center">
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 border-2 border-pink-500/30 rounded-full animate-[ping_2.5s_infinite]" />
                        <div className="absolute inset-0 border-2 border-t-pink-500 border-r-blue-500 rounded-full animate-spin duration-[1.5s]" />
                        <div className="absolute inset-2 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 shadow-inner">
                            <ImageIcon className="w-9 h-9 text-zinc-600 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h4 className="text-white font-bold text-base uppercase tracking-widest">Analyzing Pixel Clusters</h4>
                        <p className="text-pink-500 font-mono text-[9px] mt-3 animate-pulse uppercase tracking-[0.3em]">Decoding Visual Hierarchy...</p>
                    </div>
                </div>
            )}

            {/* STEP 3: PROCESSING PHASE */}
            {step === 'processing' && (
                <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                        <span>Transpiling Layout</span>
                        <span className="text-pink-400">82%</span>
                    </div>

                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-blue-500 w-[82%] shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all duration-500" />
                    </div>

                    {/* Simulated Neural Terminal */}
                    <div className="h-36 bg-black/50 rounded-2xl border border-zinc-800 p-4 font-mono text-[9px] text-left overflow-hidden relative shadow-inner">
                        <div className="space-y-1.5 opacity-80">
                            <p className="text-zinc-600 font-bold">{`> Initiating CloneVision v2.5.2...`}</p>
                            <p className="text-green-500">{`> Detect: ConstraintLayout (id: main_container) [99%]`}</p>
                            <p className="text-green-500">{`> Detect: RecyclerView (id: product_feed) [96%]`}</p>
                            <p className="text-blue-400">{`> Extract: ColorPalette(#111111, #EC4899)`}</p>
                            <p className="text-pink-400 animate-pulse">{`> Writing: res/layout/activity_clone.xml...`}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: COMPLETION PHASE */}
            {step === 'done' && (
                <div className="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 flex items-center justify-center border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.15)]">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-white font-bold text-2xl tracking-tight">Reconstruction Ready</h3>
                        <p className="text-zinc-500 text-xs mt-3 max-w-xs mx-auto leading-relaxed uppercase font-mono tracking-tighter">AI generated 4 XML Layouts and 2 Activity Classes from image metadata.</p>
                    </div>
                    <button 
                        onClick={resetAndClose} 
                        className="px-10 py-4 bg-gradient-to-r from-pink-600 to-blue-600 hover:opacity-90 text-white font-bold rounded-2xl flex items-center gap-3 shadow-lg shadow-pink-500/20 transition-all hover:scale-105 active:scale-95 uppercase text-xs tracking-widest"
                    >
                        Commit to Project <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}