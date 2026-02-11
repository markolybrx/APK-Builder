"use client";

import { useState, useEffect } from "react";
import { 
  X, Sparkles, Image as ImageIcon, Download, 
  RefreshCw, CheckCircle2, PaintBucket, Layers 
} from "lucide-react";

export default function AssetAlchemist({ isOpen, onClose, onUpdateFile, triggerHaptic }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [stylePreset, setStylePreset] = useState("vector"); // vector, 3d, pixel, realistic

  if (!isOpen) return null;

  // --- 1. NEURAL SYNTHESIS SIMULATION ---
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    triggerHaptic?.();
    setIsGenerating(true);
    setGeneratedImage(null);

    // Simulate AI Latency for "Processing" feel
    setTimeout(() => {
        // High-fidelity fallback logic for asset simulation
        const safeUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/400/400`;
        setGeneratedImage(safeUrl);
        setIsGenerating(false);
    }, 2500);
  };

  // --- 2. VFS INJECTION ---
  const handleSave = () => {
    triggerHaptic?.();
    const timestamp = Date.now();
    const fileName = `alchemist_asset_${timestamp}.xml`; 

    // Creating a standard Android Vector Drawable stub for the VFS
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FF000000"
        android:pathData="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
</vector>`;

    onUpdateFile(fileName, xmlContent);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">

      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-black border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 ring-1 ring-white/5">

        {/* HEADER HUB */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/30">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/20">
                  <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                  <h3 className="font-bold text-white text-sm tracking-wide uppercase">Asset Alchemist™</h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Generative UI Constructor</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 border border-transparent hover:border-zinc-700">
              <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex flex-col md:flex-row h-[500px]">

            {/* LEFT: NEURAL PARAMETERS */}
            <div className="w-full md:w-1/2 p-6 border-r border-zinc-800 flex flex-col gap-6 bg-zinc-900/10">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Neural Prompt</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. A futuristic neon home icon, flat vector style..."
                        className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-purple-500/50 transition-all resize-none text-sm font-sans"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Style Cluster</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Vector', '3D Render', 'Pixel Art', 'Realistic'].map((style) => (
                            <button
                                key={style}
                                onClick={() => { triggerHaptic?.(); setStylePreset(style.toLowerCase()); }}
                                className={`px-3 py-2.5 rounded-xl text-[10px] font-bold border transition-all uppercase tracking-tighter
                                ${stylePreset === style.toLowerCase() 
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}
                                `}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={!prompt || isGenerating}
                    className="mt-auto w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 active:scale-95"
                >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span className="uppercase tracking-widest text-xs">{isGenerating ? 'Synthesizing...' : 'Transmute Asset'}</span>
                </button>
            </div>

            {/* RIGHT: VIRTUAL VIEWPORT */}
            <div className="w-full md:w-1/2 p-6 bg-black flex items-center justify-center relative overflow-hidden">
                {/* Visual Transparency Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111),linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111)] bg-[length:24px_24px] bg-[position:0_0,12px:12px] opacity-40 pointer-events-none" />

                {generatedImage ? (
                    <div className="relative group w-64 h-64 flex flex-col items-center">
                        <img 
                            src={generatedImage} 
                            alt="Neural Output" 
                            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.2)] animate-in zoom-in-95 duration-500" 
                        />
                        <div className="absolute -bottom-12 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <button 
                                onClick={handleSave}
                                className="px-6 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all uppercase text-[10px]"
                             >
                                <Download className="w-3.5 h-3.5" /> Commit to /res
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 border border-dashed border-zinc-800 rounded-3xl flex items-center justify-center bg-zinc-900/20">
                            <ImageIcon className="w-6 h-6 text-zinc-800" />
                        </div>
                        <p className="text-zinc-700 text-[10px] font-mono uppercase tracking-[0.3em]">Standby for Input</p>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}
