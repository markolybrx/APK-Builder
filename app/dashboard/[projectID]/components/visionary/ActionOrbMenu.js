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

  // --- 2. THE VISIONARY TOOLSET (30+ Visionary Intent) ---
  const tools = {
    design: [
      { id: "asset-alchemist", label: "Asset Alchemist", icon: Sparkles, desc: "AI Drawables" },
      { id: "clone-vision", label: "Clone Vision", icon: ScanLine, desc: "UI Reconstruction" },
      { id: "pixel-foundry", label: "Pixel Foundry", icon: Layers, desc: "Game Sprites" },
      { id: "shader-forge", label: "Shader Forge", icon: Zap, desc: "Visual Effects" },
    ],
    logic: [
      { id: "behavior-recorder", label: "Behavior Bot", icon: MousePointerClick, desc: "Gesture to Code" },
      { id: "api-weaver", label: "API Weaver", icon: GitBranch, desc: "Data Connections" },
      { id: "sensor-bridge", label: "Sensor Bridge", icon: Activity, desc: "Hardware Link" },
      { id: "kinetic-sandbox", label: "Kinetic Box", icon: Cpu, desc: "Physics Sim" },
    ],
    audit: [
      { id: "design-critique", label: "Critique", icon: Wand2, desc: "UI/UX Audit" },
      { id: "contextual-lens", label: "Lens", icon: ScanEye, desc: "Code HUD" },
      { id: "profiler-x", label: "Profiler X", icon: Activity, desc: "Performance" },
    ],
    ship: [
      { id: "lingua-link", label: "Lingua Link", icon: Globe, desc: "Translation" },
      { id: "launchpad", label: "Launchpad", icon: Rocket, desc: "Store Listing" },
      { id: "gradle-guru", label: "Gradle Guru", icon: Bug, desc: "Build Fixer" },
    ]
  };

  const handleToolClick = (id) => {
    triggerHaptic?.();
    onTriggerTool(id);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300 overflow-hidden">

      {/* 3. NEURAL GLOW EFFECT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg bg-black border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[80vh] ring-1 ring-white/5">

        {/* HEADER HUD */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/20">
            <div>
                <h3 className="text-xl font-bold text-white tracking-tight uppercase">Visionary Hub</h3>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">Ready for Neural Initialization</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-90 border border-zinc-800"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* CATEGORY SELECTOR */}
        <div className="flex p-2 gap-1 bg-zinc-900/30 border-b border-zinc-800">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); triggerHaptic?.(); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold transition-all uppercase tracking-tighter
                        ${activeCategory === cat.id 
                            ? 'bg-zinc-800 text-white shadow-lg border border-white/5' 
                            : 'text-zinc-500 hover:text-zinc-300'}
                    `}
                >
                    <cat.icon className={`w-3.5 h-3.5 ${activeCategory === cat.id ? 'text-pink-500' : ''}`} />
                    {cat.label}
                </button>
            ))}
        </div>

        {/* GRID OF POWER */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4 custom-scrollbar">
            {tools[activeCategory].map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className="group flex flex-col items-start p-4 bg-zinc-900/40 border border-zinc-800 hover:border-pink-500/50 hover:bg-pink-500/5 rounded-3xl transition-all text-left relative overflow-hidden active:scale-95"
                >
                    <div className="p-3 bg-zinc-800 group-hover:bg-pink-500/20 rounded-2xl mb-3 transition-colors border border-zinc-700/50">
                        <tool.icon className="w-5 h-5 text-zinc-400 group-hover:text-pink-400 transition-colors" />
                    </div>
                    <span className="text-sm font-bold text-white mb-1 group-hover:text-pink-100 transition-colors">{tool.label}</span>
                    <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-tight">{tool.desc}</span>

                    {/* DYNAMIC SHIMMER */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            ))}
        </div>

        {/* STATUS BAR */}
        <div className="p-4 bg-zinc-900/40 border-t border-zinc-800 text-center select-none">
            <p className="text-[9px] text-zinc-600 font-mono tracking-[0.2em]">NEURAL LINK v2.5.0 // CLUSTER SYNC: STABLE</p>
        </div>
      </div>
    </div>
  );
}
