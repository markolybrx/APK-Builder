"use client";

import { useState } from "react";
import { X, Upload, Image as ImageIcon, Loader2, ArrowRight, ScanLine, CheckCircle2 } from "lucide-react";

export default function CloneVision({ isOpen, onClose, triggerHaptic }) {
  const [step, setStep] = useState('upload'); // upload | scanning | processing | done
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

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

  const startSimulation = () => {
    setStep('scanning');
    setTimeout(() => setStep('processing'), 2000);
    setTimeout(() => setStep('done'), 4500);
  };

  const resetAndClose = () => {
    setStep('upload');
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      
      {/* GLOW EFFECT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-black border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10">

        {/* Header */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/30">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-lg border border-pink-500/20">
                  <ScanLine className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                  <h3 className="font-bold text-white text-sm tracking-wide">Clone Vision™</h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Neural UI Reconstruction</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"><X className="w-5 h-5" /></button>
        </div>

        {/* Content Area */}
        <div className="p-10 min-h-[400px] flex flex-col items-center justify-center text-center relative">

            {/* STEP 1: UPLOAD */}
            {step === 'upload' && (
                <div 
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload').click()}
                    className={`w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer relative overflow-hidden group
                    ${dragActive 
                        ? 'border-pink-500 bg-pink-500/5 scale-[1.02] shadow-[0_0_30px_rgba(236,72,153,0.1)]' 
                        : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50'}`}
                >
                    <input type="file" id="file-upload" className="hidden" onChange={startSimulation} accept="image/*" />
                    
                    <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg z-10">
                        <Upload className="w-8 h-8 text-zinc-400 group-hover:text-pink-400 transition-colors" />
                    </div>
                    <div className="z-10">
                        <p className="text-zinc-300 font-bold text-lg group-hover:text-white transition-colors">Drag & Drop Screenshot</p>
                        <p className="text-zinc-500 text-xs mt-2 font-mono">PNG, JPG, WEBP (Max 10MB)</p>
                    </div>

                    {/* Grid Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                </div>
            )}

            {/* STEP 2: SCANNING */}
            {step === 'scanning' && (
                <div className="space-y-8 animate-in zoom-in-95 flex flex-col items-center">
                    <div className="relative w-32 h-32">
                        {/* Scanning Radar Effect */}
                        <div className="absolute inset-0 border-2 border-pink-500/30 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                        <div className="absolute inset-0 border-2 border-t-pink-500 border-r-blue-500 rounded-full animate-spin" />
                        <div className="absolute inset-2 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                            <ImageIcon className="w-10 h-10 text-zinc-500 animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg">Analyzing Pixel Data</h4>
                        <p className="text-pink-500 font-mono text-xs mt-2 animate-pulse uppercase tracking-widest">Identifying UI Components...</p>
                    </div>
                </div>
            )}

            {/* STEP 3: PROCESSING */}
            {step === 'processing' && (
                <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        <span>Reconstructing Layout</span>
                        <span className="text-white">78%</span>
                    </div>
                    
                    {/* Neon Progress Bar */}
                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-blue-500 w-[78%] animate-[loading_1s_ease-in-out_infinite] shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                    </div>

                    {/* Terminal Output */}
                    <div className="h-40 bg-black rounded-xl border border-zinc-800 p-4 font-mono text-[10px] text-left overflow-hidden relative shadow-inner">
                        <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
                        <div className="space-y-1">
                            <p className="text-zinc-500">{`> Initiating CloneVision v2.5...`}</p>
                            <p className="text-green-400">{`> Detect: RecyclerView (id: feed_list) [98% confidence]`}</p>
                            <p className="text-green-400">{`> Detect: FloatingActionButton (id: fab_add) [95% confidence]`}</p>
                            <p className="text-blue-400">{`> Parse: ColorPalette(#000000, #ec4899)`}</p>
                            <p className="text-pink-400 animate-pulse">{`> Generate: layout/activity_feed.xml...`}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: DONE */}
            {step === 'done' && (
                <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 flex items-center justify-center border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-2xl">Reconstruction Complete</h3>
                        <p className="text-zinc-400 text-sm mt-2 max-w-xs mx-auto">AI has generated 4 Layout Files and 2 Kotlin Classes based on your screenshot.</p>
                    </div>
                    <button 
                        onClick={resetAndClose} 
                        className="px-8 py-4 bg-gradient-to-r from-pink-600 to-blue-600 hover:opacity-90 text-white font-bold rounded-xl flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all hover:scale-105"
                    >
                        Merge into Project <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}
