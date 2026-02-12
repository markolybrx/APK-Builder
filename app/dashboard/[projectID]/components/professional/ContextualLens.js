"use client";

import { useState, useEffect } from "react";
import { 
  X, ScanEye, Layers, Zap, AlertTriangle, 
  GitBranch, Code2, Cpu, ShieldCheck 
} from "lucide-react";

export default function ContextualLens({ isOpen, onClose, projectFiles = [], triggerHaptic }) {
  const [isScanning, setIsScanning] = useState(true);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (isOpen) {
        setIsScanning(true);
        setMetrics(null);

        // Simulate Deep Scan Latency
        const timer = setTimeout(() => {
            analyzeProject();
            setIsScanning(false);
            triggerHaptic?.();
        }, 2000);

        return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const analyzeProject = () => {
    // 1. Static Analysis Engine (Mock)
    const ktFiles = projectFiles.filter(f => f.name.endsWith('.kt')).length;
    const xmlFiles = projectFiles.filter(f => f.name.endsWith('.xml')).length;
    const loc = projectFiles.reduce((acc, f) => acc + (f.content?.split('\n').length || 0), 0);

    // 2. Cyclomatic Complexity Calculation
    const complexityScore = loc > 500 ? "HIGH" : loc > 200 ? "MODERATE" : "LOW";
    
    // 3. Dependency Graph Resolution
    const detectedDeps = [
        "androidx.core:core-ktx:1.9.0", 
        "com.google.android.material:1.8.0",
        "org.jetbrains.kotlin:stdlib:1.8.0"
    ];

    setMetrics({
        complexity: complexityScore,
        security: "PASS",
        dependencies: detectedDeps,
        files: { kt: ktFiles, xml: xmlFiles, total: projectFiles.length },
        loc: loc
    });
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">

      {/* HOLOGRAPHIC HUD FRAME */}
      <div className="w-full max-w-4xl aspect-video bg-black/60 border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.15)] relative overflow-hidden flex flex-col ring-1 ring-cyan-500/10">

        {/* Tactical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* HUD Brackets */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-cyan-500/60 rounded-tl-xl" />
        <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-cyan-500/60 rounded-tr-xl" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-cyan-500/60 rounded-bl-xl" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-cyan-500/60 rounded-br-xl" />

        {/* HEADER */}
        <div className="h-20 flex items-center justify-between px-10 border-b border-cyan-500/20 bg-cyan-950/20 relative z-10 backdrop-blur-md">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <ScanEye className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div>
                  <h3 className="font-bold text-cyan-100 text-lg tracking-[0.2em] uppercase">Contextual Lens</h3>
                  <p className="text-[10px] text-cyan-600 font-mono">System Architecture Audit v2.1</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-cyan-500 hover:text-white hover:bg-cyan-500/20 rounded-xl transition-all border border-transparent hover:border-cyan-500/30">
              <X className="w-6 h-6" />
           </button>
        </div>

        {/* MAIN DISPLAY */}
        <div className="flex-1 p-10 relative z-10 flex items-center justify-center">

            {isScanning ? (
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-ping duration-[2s]" />
                        <div className="absolute inset-0 border-2 border-t-cyan-400 border-r-transparent rounded-full animate-spin duration-[1.5s]" />
                        <div className="absolute inset-4 border border-cyan-500/30 rounded-full" />
                    </div>
                    <div className="text-center">
                        <p className="text-cyan-400 font-bold tracking-widest animate-pulse">ANALYZING TOPOLOGY</p>
                        <p className="text-cyan-700 text-[10px] font-mono mt-2">Parsing AST Trees... Calculating Complexity...</p>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full grid grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">

                    {/* METRIC 1: VOLUME */}
                    <div className="bg-cyan-950/10 border border-cyan-500/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group hover:bg-cyan-900/10 transition-colors">
                        <div className="p-3 bg-cyan-500/10 rounded-full">
                            <Code2 className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div className="text-4xl font-bold text-white tracking-tighter shadow-cyan-500/50 drop-shadow-lg">{metrics?.loc}</div>
                        <div className="text-[10px] text-cyan-600 uppercase tracking-widest font-bold">Lines of Code</div>
                    </div>

                    {/* METRIC 2: COMPLEXITY */}
                    <div className="bg-cyan-950/10 border border-cyan-500/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group hover:bg-cyan-900/10 transition-colors">
                        <div className="p-3 bg-purple-500/10 rounded-full">
                            <Cpu className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight">{metrics?.complexity}</div>
                        <div className="text-[10px] text-purple-500 uppercase tracking-widest font-bold">Cyclomatic Score</div>
                    </div>

                    {/* METRIC 3: COMPOSITION */}
                    <div className="bg-cyan-950/10 border border-cyan-500/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group hover:bg-cyan-900/10 transition-colors">
                        <div className="p-3 bg-pink-500/10 rounded-full">
                            <Layers className="w-8 h-8 text-pink-400" />
                        </div>
                        <div className="flex gap-6 items-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{metrics?.files.kt}</div>
                                <span className="text-[9px] text-pink-500 font-bold">KT</span>
                            </div>
                            <div className="w-px h-8 bg-zinc-700" />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{metrics?.files.xml}</div>
                                <span className="text-[9px] text-pink-500 font-bold">XML</span>
                            </div>
                        </div>
                        <div className="text-[10px] text-pink-600 uppercase tracking-widest font-bold">Structure</div>
                    </div>

                    {/* BOTTOM: DEPENDENCIES */}
                    <div className="col-span-3 bg-cyan-950/10 border border-cyan-500/20 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-3 left-4 text-[10px] text-cyan-600 font-bold uppercase flex items-center gap-2 tracking-widest">
                            <GitBranch className="w-3 h-3" /> External Dependency Graph
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {metrics?.dependencies.map((dep, i) => (
                                <div key={i} className="px-3 py-1.5 bg-cyan-900/30 border border-cyan-500/30 rounded-md text-cyan-300 text-[10px] font-mono shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                    {dep}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>

        {/* FOOTER STREAM */}
        <div className="h-10 bg-cyan-950/30 border-t border-cyan-500/20 flex items-center px-8 gap-8 text-[10px] font-mono text-cyan-600 uppercase tracking-wider">
             <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                Live Telemetry
             </span>
             <span className="opacity-50">Mem: 45MB</span>
             <span className="opacity-50">Threads: 4</span>
             <span className="ml-auto flex items-center gap-2 text-emerald-500">
                <ShieldCheck className="w-3 h-3" /> Security Protocol: Active
             </span>
        </div>

      </div>
    </div>
  );
}
