import { useState } from "react";
import { Sparkles, Share2, ScanLine, Smartphone, ChevronRight, X } from "lucide-react";

export default function WelcomeTour({ onComplete, triggerHaptic }) {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "AI Command Center", desc: "Speak or type to build. Try '/image' for instant icons.", icon: Sparkles, color: "text-blue-400" },
    { title: "Clone Vision", desc: "Upload a screenshot to generate matching XML code instantly.", icon: ScanLine, color: "text-pink-400" },
    { title: "Visual Logic", desc: "Map your app flow with nodes instead of writing navigation code.", icon: Share2, color: "text-purple-400" }
  ];

  const current = steps[step];

  const handleNext = () => {
    triggerHaptic();
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-lg flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-6 shadow-xl">
           <current.icon className={`w-10 h-10 ${current.color}`} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{current.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-10">{current.desc}</p>
        <div className="flex gap-3">
          <button onClick={onComplete} className="flex-1 py-4 text-slate-500 font-bold">Skip</button>
          <button onClick={handleNext} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
            {step === steps.length - 1 ? "Start" : "Next"} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}