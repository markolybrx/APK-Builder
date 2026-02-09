import { useState } from "react";
import { Sparkles, Share2, ScanLine, Smartphone, ChevronRight, Activity, Terminal as TerminalIcon } from "lucide-react";

export default function WelcomeTour({ onComplete, triggerHaptic }) {
  const [step, setStep] = useState(0);

  // --- UPDATED STEPS: Highlighting Functional Reality ---
  const steps = [
    { 
      title: "AI Brain Activated", 
      desc: "Chat is now connected to the File System. Ask me to 'add a button' and watch the Explorer update in real-time.", 
      icon: Sparkles, 
      color: "text-blue-400" 
    },
    { 
      title: "Real Hardware Bridge", 
      desc: "Tap 'Sensors' to link your phone's real GPS and Accelerometer directly to your app logic.", 
      icon: Activity, 
      color: "text-green-400" 
    },
    { 
      title: "Live Build Shell", 
      desc: "Run 'gradle build' in the terminal to simulate a real APK compilation and see your build logs.", 
      icon: TerminalIcon, 
      color: "text-purple-400" 
    }
  ];

  const current = steps[step];

  const handleNext = () => {
    triggerHaptic();
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-slate-700/50 w-full max-w-sm rounded-[3rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative text-center">
        
        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800'}`} />
            ))}
        </div>

        <div className="w-24 h-24 rounded-[2rem] bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-8 shadow-inner relative">
           <div className={`absolute inset-0 blur-2xl opacity-20 ${current.color.replace('text', 'bg')}`} />
           <current.icon className={`w-12 h-12 relative z-10 ${current.color}`} />
        </div>

        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{current.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-12 px-2">
          {current.desc}
        </p>

        <div className="flex gap-4 items-center">
          <button 
            onClick={onComplete} 
            className="flex-1 py-4 text-slate-500 font-bold hover:text-slate-300 transition-colors uppercase text-[10px] tracking-widest"
          >
            Skip Tour
          </button>
          <button 
            onClick={handleNext} 
            className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            {step === steps.length - 1 ? "Launch Workspace" : "Next Step"} 
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
