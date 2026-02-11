"use client";

import { useState } from "react";
import { ArrowRight, X, Sparkles, Box, Layout, Smartphone } from "lucide-react";

export default function WelcomeTour({ onComplete, triggerHaptic }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Visionary",
      desc: "You are now in the Architect Workspace. This is where AI meets native mobile engineering.",
      icon: Sparkles,
      color: "text-blue-400"
    },
    {
      title: "The Neural Chat",
      desc: "On the left is your AI partner. Command it to 'Add a login button' or 'Create a profile page' to generate real code.",
      icon: Box,
      color: "text-purple-400"
    },
    {
      title: "Live Preview Engine",
      desc: "On the right is the Pixel-Perfect Renderer. Switch between 'Live', 'Design', and 'AR' modes to test your app instantly.",
      icon: Smartphone,
      color: "text-green-400"
    },
    {
      title: "Logic & VFS",
      desc: "Use the Logic Map to visualize navigation flows, or dive into the File Explorer to edit the raw Kotlin & XML.",
      icon: Layout,
      color: "text-orange-400"
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
    <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
       <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
          
          {/* Progress Bar */}
          <div className="h-1 bg-slate-800 w-full">
            <div 
                className="h-full bg-blue-500 transition-all duration-500 ease-out" 
                style={{ width: `${((step + 1) / steps.length) * 100}%` }} 
            />
          </div>

          <div className="p-8 flex flex-col items-center text-center min-h-[320px]">
             {/* Icon Animation */}
             <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800 shadow-xl mb-8 relative">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
                <CurrentIcon className={`w-10 h-10 ${steps[step].color} transition-all duration-300 transform scale-100`} />
             </div>

             <h2 className="text-2xl font-bold text-white mb-3 animate-in slide-in-from-bottom-2 fade-in fill-mode-both delay-100">
                {steps[step].title}
             </h2>
             
             <p className="text-slate-400 leading-relaxed text-sm animate-in slide-in-from-bottom-3 fade-in fill-mode-both delay-200">
                {steps[step].desc}
             </p>
          </div>

          <div className="p-6 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center">
             <button onClick={onComplete} className="text-slate-500 text-xs font-bold hover:text-white px-4">SKIP TOUR</button>
             
             <button 
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
             >
                {step === steps.length - 1 ? 'Get Started' : 'Next Step'} <ArrowRight className="w-4 h-4" />
             </button>
          </div>

       </div>
    </div>
  );
}
