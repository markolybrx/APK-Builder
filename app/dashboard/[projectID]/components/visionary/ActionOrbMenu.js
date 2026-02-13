"use client";

import { useState } from "react";
import { 
  X, Sparkles, Wand2, ScanLine, Layers, Activity, 
  MousePointerClick, ScanEye, Code2, GitBranch, 
  Globe, Rocket, Bug, Cpu, Palette, Zap
} from "lucide-react";

export default function ActionOrbMenu({ isOpen, onClose, onTriggerTool, triggerHaptic }) {
  const [activeCategory, setActiveCategory] = useState("design");

  if (!isOpen) return null;

  // --- 1. TOOL CATEGORIZATION ---
  const categories = [
    { id: "design", label: "Design", icon: Palette },
    { id: "logic", label: "Logic", icon: Code2 },
    { id: "audit", label: "Audit", icon: Bug },
    { id: "ship", label: "Ship", icon: Rocket },
  ];

  // --- 2. THE VISIONARY TOOLSET ---
  const tools = {
    design: [
      { id: "asset-alchemist", label: "Asset Alchemist", icon: Sparkles, desc: "Gen-AI Drawables" },
      { id: "clone-vision", label: "Clone Vision", icon: ScanLine, desc: "UI Reconstruction" },
      { id: "pixel-foundry", label: "Pixel Foundry", icon: Layers, desc: "Sprite Generator" },
      { id: "shader-forge", label: "Shader Forge", icon: Zap, desc: "VFX Graph" },
    ],
    logic: [
      { id: "behavior-recorder", label: "Behavior Bot", icon: MousePointerClick, desc: "Gesture-to-Code" },
      { id: "api-weaver", label: "API Weaver", icon: GitBranch, desc: "Data Binding" },
      { id: "sensor-bridge", label: "Sensor Bridge", icon: Activity, desc: "Hardware Link" },
      { id: "kinetic-sandbox", label: "Kinetic Box", icon: Cpu, desc: "Physics Engine" },
    ],
    audit: [
      { id: "design-critique", label: "Critique", icon: Wand2, desc: "UI/UX Audit" },
      { id: "contextual-lens", label: "Context Lens", icon: ScanEye, desc: "Code HUD" },
      { id: "profiler-x", label: "Profiler X", icon: Activity, desc: "Perf. Monitor" },
    ],
    ship: [
      { id: "lingua-link", label: "Lingua Link", icon: Globe, desc: "Auto-Localize" },
      { id: "launchpad", label: "Launchpad", icon: Rocket, desc: "Store Listing" },
      { id: "gradle-guru", label: "Gradle Guru", icon: Bug, desc: "Build Repair" },
    ]
  };

  const handleToolClick = (id) => {
    triggerHaptic?.();
    onTriggerTool(id);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">

      {/* AMBIENT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* MAIN COMMAND CENTER */}
      <div className="w-full max-w-2xl bg-[#09090b] border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh] ring-1 ring-white/5">

        {/* HEADER */}
        <div className="p-8 pb-4 flex items-center justify-between z-10">
            <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Visionary Hub</h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">Select a Neural Module to initialize.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-zinc-900/50 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all border border-zinc-800 hover:border-zinc-700"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* CATEGORY TABS (Floating Pills) */}
        <div className="px-8 pb-6 z-10">
            <div className="flex p-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => { setActiveCategory(cat.id); triggerHaptic?.(); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold transition-all uppercase tracking-wide
                            ${activeCategory === cat.id 
                                ? 'bg-zinc-800 text-white shadow-lg border border-white/5' 
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}
                        `}
                    >
                        <cat.icon className={`w-3.5 h-3.5 ${activeCategory === cat.id ? 'text-pink-500' : ''}`} />
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>

        {/* TOOL GRID */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 custom-scrollbar z-10">
            {tools[activeCategory].map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className="group relative flex flex-col items-start p-5 bg-zinc-900/30 border border-zinc-800/50 hover:border-pink-500/30 hover:bg-zinc-900/80 rounded-[1.5rem] transition-all text-left overflow-hidden active:scale-[0.98]"
                >
                    <div className="flex w-full items-start justify-between mb-3">
                        <div className="p-3 bg-zinc-800/80 group-hover:bg-pink-500/20 rounded-2xl transition-colors border border-zinc-700/50 group-hover:border-pink-500/20">
                            <tool.icon className="w-5 h-5 text-zinc-400 group-hover:text-pink-400 transition-colors" />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
                        </div>
                    </div>
                    
                    <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{tool.label}</span>
                    <span className="text-[10px] text-zinc-500 font-mono mt-1">{tool.desc}</span>

                    {/* Interactive Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </button>
            ))}
        </div>

        {/* FOOTER STATUS */}
        <div className="p-4 bg-black/20 border-t border-zinc-800 text-center select-none z-10 backdrop-blur-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">System Operational</span>
            </div>
        </div>
      </div>
    </div>
  );
}
