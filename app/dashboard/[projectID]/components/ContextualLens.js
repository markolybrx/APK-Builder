"use client";

import { useState, useEffect } from "react";
import { 
  X, ScanEye, Layers, Zap, AlertTriangle, 
  GitBranch, Code2, Cpu 
} from "lucide-react";

export default function ContextualLens({ isOpen, onClose, projectFiles = [], triggerHaptic }) {
  const [isScanning, setIsScanning] = useState(true);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (isOpen) {
        setIsScanning(true);
        setMetrics(null);
        
        // Simulate Deep Scan
        setTimeout(() => {
            analyzeProject();
            setIsScanning(false);
            triggerHaptic?.();
        }, 2500);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const analyzeProject = () => {
    // Mock Static Analysis
    const ktFiles = projectFiles.filter(f => f.name.endsWith('.kt')).length;
    const xmlFiles = projectFiles.filter(f => f.name.endsWith('.xml')).length;
    const loc = projectFiles.reduce((acc, f) => acc + f.content.split('\n').length, 0);
    
    setMetrics({
        complexity: ktFiles > 5 ? "HIGH" : "MODERATE",
        security: "PASS",
        dependencies: ["androidx.core", "com.google.material", "kotlin.stdlib"],
        files: { kt: ktFiles, xml: xmlFiles, total: projectFiles.length },
        loc: loc
    });
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      
      {/* HUD Frame */}
      <div className="w-full max-w-3xl aspect-video bg-black/50 border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden flex flex-col">
        
        {/* HUD Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500" />

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-cyan-500/20 bg-cyan-900/10 relative z-10">
           <div className="flex items-center gap-3">
              <ScanEye className="w-6 h-6 text-cyan-400 animate-pulse" />
              <h3 className="font-bold text-cyan-100 text-lg tracking-widest uppercase">Contextual Lens_v2.0</h3>
           </div>
           <button onClick={onClose} className="p-2 text-cyan-500 hover:text-white hover:bg-cyan-500/20 rounded-lg transition-colors"><X className="w-6 h-6" /></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 relative z-10 flex items-center justify-center">
            
            {isScanning ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin" />
                    </div>
                    <p className="text-cyan-400 font-mono animate-pulse">SCANNING PROJECT TOPOLOGY...</p>
                </div>
            ) : (
                <div className="w-full h-full grid grid-cols-3 gap-6 animate-in zoom-in-95">
                    
                    {/* Panel 1: Code Stats */}
                    <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                        <Code2 className="w-8 h-8 text-cyan-400" />
                        <div className="text-3xl font-bold text-white">{metrics?.loc}</div>
                        <div className="text-[10px] text-cyan-600 uppercase tracking-widest font-bold">Lines of Code</div>
                    </div>

                    {/* Panel 2: Complexity */}
                    <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                        <Cpu className="w-8 h-8 text-purple-400" />
                        <div className="text-2xl font-bold text-white">{metrics?.complexity}</div>
                        <div className="text-[10px] text-purple-600 uppercase tracking-widest font-bold">Cyclomatic Complexity</div>
                    </div>

                    {/* Panel 3: Components */}
                    <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                        <Layers className="w-8 h-8 text-pink-400" />
                        <div className="flex gap-4">
                            <div className="text-center">
                                <div className="text-xl font-bold text-white">{metrics?.files.kt}</div>
                                <span className="text-[8px] text-pink-500">KOTLIN</span>
                            </div>
                            <div className="w-px bg-zinc-700" />
                            <div className="text-center">
                                <div className="text-xl font-bold text-white">{metrics?.files.xml}</div>
                                <span className="text-[8px] text-pink-500">XML</span>
                            </div>
                        </div>
                        <div className="text-[10px] text-pink-600 uppercase tracking-widest font-bold">File Structure</div>
                    </div>

                    {/* Bottom: Dependency Graph */}
                    <div className="col-span-3 bg-black/60 border border-cyan-500/30 rounded-xl p-4 relative overflow-hidden">
                        <div className="absolute top-2 left-3 text-[10px] text-cyan-600 font-bold uppercase flex items-center gap-2">
                            <GitBranch className="w-3 h-3" /> Dependency Graph
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {metrics?.dependencies.map((dep, i) => (
                                <div key={i} className="px-3 py-1 bg-cyan-900/20 border border-cyan-500/30 rounded-full text-cyan-300 text-xs font-mono">
                                    {dep}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>

        {/* Footer Data Stream */}
        <div className="h-8 bg-cyan-950/30 border-t border-cyan-500/20 flex items-center px-4 gap-6 text-[10px] font-mono text-cyan-600">
             <span className="animate-pulse">● LIVE DATA FEED</span>
             <span>MEM: 45MB</span>
             <span>CPU: 12%</span>
             <span className="ml-auto">SECURE CONNECTION</span>
        </div>

      </div>
    </div>
  );
}
