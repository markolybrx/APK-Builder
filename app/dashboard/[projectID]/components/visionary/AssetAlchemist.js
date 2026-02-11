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

  // Mock Generation Logic (Replace with Real API later)
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    triggerHaptic?.();
    setIsGenerating(true);
    setGeneratedImage(null);

    // Simulate AI Latency
    setTimeout(() => {
        // We use a dynamic Unsplash URL to simulate a generated result based on keywords
        const keywords = prompt.split(" ").join(",");
        const mockUrl = `https://source.unsplash.com/random/400x400/?${keywords}`;
        // Fallback for demo stability if unsplash source is flaky
        const safeUrl = `https://picsum.photos/seed/${prompt}/400/400`;
        
        setGeneratedImage(safeUrl);
        setIsGenerating(false);
    }, 2500);
  };

  const handleSave = () => {
    triggerHaptic?.();
    const fileName = `asset_${Date.now()}.xml`; // In a real app, this would be a PNG/WEBP
    
    // We create a mock XML drawable to represent the image in the project
    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>\n\n<bitmap xmlns:android="http://schemas.android.com/apk/res/android"\n    android:src="@drawable/mock_asset"\n    android:tint="#FFFFFF" />`;
    
    onUpdateFile(fileName, xmlContent);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-black border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10">

        {/* HEADER */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/30">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/20">
                  <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                  <h3 className="font-bold text-white text-sm tracking-wide">Asset Alchemist™</h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Generative UI Assets</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-col md:flex-row h-[500px]">
            
            {/* LEFT: CONTROLS */}
            <div className="w-full md:w-1/2 p-6 border-r border-zinc-800 flex flex-col gap-6">
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase">Describe Asset</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. A futuristic neon home icon, flat vector style, blue and pink gradient..."
                        className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-all resize-none text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase">Style Preset</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Vector', '3D Render', 'Pixel Art', 'Realistic'].map((style) => (
                            <button
                                key={style}
                                onClick={() => { triggerHaptic?.(); setStylePreset(style.toLowerCase()); }}
                                className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all
                                ${stylePreset === style.toLowerCase() 
                                    ? 'bg-purple-500/20 border-purple-500 text-purple-300' 
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}
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
                    className="mt-auto w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
                >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isGenerating ? 'Synthesizing...' : 'Generate Asset'}
                </button>
            </div>

            {/* RIGHT: PREVIEW */}
            <div className="w-full md:w-1/2 p-6 bg-black flex items-center justify-center relative">
                {/* Checkerboard Pattern for Transparency */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#18181b_25%,transparent_25%,transparent_75%,#18181b_75%,#18181b),linear-gradient(45deg,#18181b_25%,transparent_25%,transparent_75%,#18181b_75%,#18181b)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] opacity-20 pointer-events-none" />

                {generatedImage ? (
                    <div className="relative group w-64 h-64">
                        <img 
                            src={generatedImage} 
                            alt="Generated Asset" 
                            className="w-full h-full object-contain drop-shadow-2xl animate-in zoom-in-90 duration-300" 
                        />
                        <div className="absolute -bottom-16 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <button 
                                onClick={handleSave}
                                className="px-6 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                             >
                                <Download className="w-4 h-4" /> Save to /res
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center opacity-50">
                        <div className="w-24 h-24 mx-auto mb-4 border-2 border-dashed border-zinc-700 rounded-2xl flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-zinc-700" />
                        </div>
                        <p className="text-zinc-500 text-xs font-mono">WAITING FOR INPUT...</p>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}
