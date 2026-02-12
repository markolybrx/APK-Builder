"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Box, Layout, Smartphone, CheckCircle2 } from "lucide-react";

export default function WelcomeTour({ onComplete, triggerHaptic }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Visionary Architect",
      desc: "Welcome to the Neural Workspace. Here, AI intent meets native mobile engineering. Build real Android apps via conversation.",
      icon: Sparkles,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20"
    },
    {
      title: "Neural Chat Engine",
      desc: "The Core Cluster (Left) is your command center. Instruct the AI to 'Add a Login Screen' or 'Refactor navigation' to generate Kotlin code.",
      icon: Box,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Live Preview Matrix",
      desc: "The Visualization Hub (Right) renders your XML layouts instantly. Toggle between 'Live', 'Design', and 'AR' modes to verify UI fidelity.",
      icon: Smartphone,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      title: "Logic & VFS",
      desc: "Use the Logic Map to visualize navigation flows, or dive into the File Explorer to edit raw Android manifest files directly.",
      icon: Layout,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    }
  ];

  const handleNext = () => {
    triggerHaptic?.();
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
       
       {/* AMBIENT GLOW */}
       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${steps[step].bg.replace('/10', '/5')}`} />

       <div className="w-full max-w-md bg-black border border-zinc-800 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-white/5">

          {/* PROGRESS BAR */}
          <div className="h-1 bg-zinc-900 w-full">
            <div 
                className="h-full bg-gradient-to-r from-pink-500 to-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(236,72,153,0.5)]" 
                style={{ width: `${((step + 1) / steps.length) * 100}%` }} 
            />
          </div>

          <div className="p-10 flex flex-col items-center text-center min-h-[380px] relative z-10">
             
             {/* ICON ANIMATION */}
             <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 border shadow-2xl relative group transition-all duration-500 ${steps[step].bg} ${steps[step].border}`}>
                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${steps[step].bg}`} />
                <CurrentIcon className={`w-10 h-10 ${steps[step].color} transition-all duration-300 transform scale-110 drop-shadow-lg`} />
             </div>

             <h2 className="text-2xl font-bold text-white mb-4 animate-in slide-in-from-bottom-2 fade-in fill-mode-both delay-100 tracking-tight">
                {steps[step].title}
             </h2>

             <p className="text-zinc-400 leading-relaxed text-sm animate-in slide-in-from-bottom-3 fade-in fill-mode-both delay-200 px-2 font-light">
                {steps[step].desc}
             </p>
          </div>

          {/* FOOTER CONTROLS */}
          <div className="p-6 bg-zinc-900/30 border-t border-zinc-800 flex justify-between items-center backdrop-blur-sm">
             <button 
                onClick={() => { triggerHaptic?.(); onComplete(); }} 
                className="text-zinc-500 text-[10px] font-bold hover:text-white px-4 uppercase tracking-widest transition-colors"
             >
                Skip Tour
             </button>

             <button 
                onClick={handleNext}
                className="px-8 py-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95 uppercase tracking-wide"
             >
                {step === steps.length - 1 ? 'Initialize Workspace' : 'Next Module'} <ArrowRight className="w-4 h-4" />
             </button>
          </div>

       </div>
    </div>
  );
}
