"use client";

import { useState } from "react";
import { X, Upload, Image as ImageIcon, Loader2, ArrowRight, Zap } from "lucide-react";

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

  return (
    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg"><Zap className="w-5 h-5 text-purple-400" /></div>
              <div>
                  <h3 className="font-bold text-white text-sm">Clone Vision™</h3>
                  <p className="text-xs text-slate-500 font-mono">NEURAL UI RECONSTRUCTION</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Content */}
        <div className="p-10 min-h-[300px] flex flex-col items-center justify-center text-center">
            
            {step === 'upload' && (
                <div 
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer
                    ${dragActive ? 'border-purple-500 bg-purple-500/10 scale-[1.02]' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}`}
                    onClick={startSimulation}
                >
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center shadow-inner">
                        <Upload className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-slate-300 font-bold text-sm">Drag & Drop Screenshot</p>
                        <p className="text-slate-500 text-xs mt-1">Supports PNG, JPG, WEBP (Max 10MB)</p>
                    </div>
                </div>
            )}

            {step === 'scanning' && (
                <div className="space-y-6 animate-in zoom-in-95">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-ping" />
                        <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-purple-400" /></div>
                    </div>
                    <p className="text-purple-400 font-mono text-sm animate-pulse">ANALYZING PIXEL DATA...</p>
                </div>
            )}

            {step === 'processing' && (
                <div className="w-full max-w-md space-y-4">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                        <span>Reconstructing Layout</span>
                        <span>78%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[78%] animate-pulse" />
                    </div>
                    <div className="h-32 bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-[10px] text-green-400 text-left overflow-hidden opacity-80">
                        {`> Detect: RecyclerView (id: feed_list)\n> Detect: FloatingActionButton (id: fab_add)\n> Parse: ColorPalette(#1e293b, #3b82f6)\n> Generate: layout/activity_feed.xml...`}
                    </div>
                </div>
            )}

            {step === 'done' && (
                <div className="flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <Zap className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-xl">Reconstruction Complete</h3>
                        <p className="text-slate-400 text-sm mt-2">Generated 4 Layout Files and 2 Kotlin Classes.</p>
                    </div>
                    <button onClick={onClose} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all">
                        Merge into Project <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}