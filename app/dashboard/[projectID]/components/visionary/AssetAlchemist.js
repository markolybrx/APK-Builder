"use client";

import { useState } from "react";
import { 
  X, Sparkles, Image as ImageIcon, Download, 
  RefreshCw, Layers, Wand2 
} from "lucide-react";

export default function AssetAlchemist({ isOpen, onClose, onUpdateFile, triggerHaptic }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [stylePreset, setStylePreset] = useState("vector"); 

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    triggerHaptic?.();
    setIsGenerating(true);
    setGeneratedImage(null);

    // Simulate Neural Synthesis Latency
    setTimeout(() => {
        const safeUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/500/500`;
        setGeneratedImage(safeUrl);
        setIsGenerating(false);
    }, 2500);
  };

  const handleSave = () => {
    triggerHaptic?.();
    const timestamp = Date.now();
    const fileName = `asset_${stylePreset}_${timestamp}.xml`; 

    // Standard Android Vector Stub
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
    <div className="absolute inset-0 z-[210] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">

      {/* AMBIENT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-4xl bg-[#09090b] border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row h-[600px] ring-1 ring-white/5">

        {/* LEFT: CONTROL DECK */}
        <div className="w-full md:w-[40%] p-8 border-r border-zinc-800/50 bg-zinc-900/20 flex flex-col relative z-10">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm tracking-wide">Asset Alchemist</h3>
                        <p className="text-[10px] text-zinc-500 font-mono">Neural Asset Synthesis</p>
                    </div>
                </div>
                <button onClick={onClose} className="md:hidden p-2 bg-zinc-800 rounded-full text-zinc-400">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Input Field */}
            <div className="space-y-3 mb-6">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Wand2 className="w-3 h-3" />
                    Prompt Matrix
                </label>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the icon, UI element, or texture you need..."
                    className="w-full h-32 bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none text-sm font-sans leading-relaxed"
                />
            </div>

            {/* Style Selectors */}
            <div className="space-y-3 mb-auto">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-3 h-3" />
                    Style Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {['Vector', '3D Render', 'Pixel', 'Realistic'].map((style) => (
                        <button
                            key={style}
                            onClick={() => { triggerHaptic?.(); setStylePreset(style.toLowerCase()); }}
                            className={`px-3 py-3 rounded-xl text-[10px] font-bold border transition-all uppercase tracking-wide
                            ${stylePreset === style.toLowerCase() 
                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}
                            `}
                        >
                            {style}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <button 
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className="mt-6 w-full py-4 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 active:scale-95 group"
            >
                {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                    <Sparkles className="w-4 h-4 text-purple-600 group-hover:text-purple-700 transition-colors" />
                )}
                <span className="uppercase tracking-widest text-xs">{isGenerating ? 'Synthesizing...' : 'Generate Asset'}</span>
            </button>
        </div>

        {/* RIGHT: VIEWPORT */}
        <div className="w-full md:w-[60%] bg-black/50 relative flex items-center justify-center overflow-hidden">
            
            {/* Close Button (Desktop) */}
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-3 bg-black/40 hover:bg-zinc-800 backdrop-blur-md border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all z-20 hidden md:flex"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a),linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a)] bg-[length:24px_24px] bg-[position:0_0,12px:12px] opacity-20 pointer-events-none" />

            {/* Content Stage */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-10">
                {generatedImage ? (
                    <div className="relative group w-full max-w-sm aspect-square flex flex-col items-center justify-center">
                        {/* Image Container */}
                        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-black/20 backdrop-blur-sm group-hover:border-purple-500/30 transition-colors duration-500">
                             <img 
                                src={generatedImage} 
                                alt="Neural Output" 
                                className="w-full h-full object-contain p-8 animate-in zoom-in-95 duration-700" 
                            />
                        </div>

                        {/* Floating Save Action */}
                        <div className="absolute -bottom-16 opacity-0 group-hover:opacity-100 group-hover:-bottom-20 transition-all duration-300">
                             <button 
                                onClick={handleSave}
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center gap-3 transform hover:scale-105 transition-all uppercase text-xs tracking-wider"
                             >
                                <Download className="w-4 h-4" /> 
                                Import to Project
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center opacity-40">
                        <div className="w-24 h-24 mx-auto mb-6 border border-dashed border-zinc-700 rounded-3xl flex items-center justify-center bg-zinc-900/10">
                            <ImageIcon className="w-8 h-8 text-zinc-700" />
                        </div>
                        <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em]">Viewport Idle</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
