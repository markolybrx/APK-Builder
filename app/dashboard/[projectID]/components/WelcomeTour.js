import { useState } from "react";
import { 
  Sparkles, Share2, ScanLine, 
  Terminal as TerminalIcon, 
  ChevronRight, X, Smartphone 
} from "lucide-react";

export default function WelcomeTour({ onComplete, triggerHaptic }) {
  const [step, setStep] = useState(0);

  const tourSteps = [
    {
      title: "Meet Your AI Partner",
      desc: "Use the Chat to build. Type '/image' to generate icons with the Asset Alchemist or just speak your ideas.",
      icon: Sparkles,
      color: "text-blue-400",
      highlight: "chat"
    },
    {
      title: "Clone Any App",
      desc: "See a UI you love? Tapping 'Clone Vision' lets you upload a screenshot and converts it to code instantly.",
      icon: ScanLine,
      color: "text-pink-400",
      highlight: "header-clone"
    },
    {
      title: "Map Your Logic",
      desc: "Non-coders, rejoice. Use the Logic Map to visually wire your screens together without touching a line of code.",
      icon: Share2,
      color: "text-purple-400",
      highlight: "rail-logic"
    },
    {
      title: "Live Share & Test",
      desc: "Tap the Share icon to get a QR code. Open your app on a second phone to feel the UX in real-time.",
      icon: Smartphone,
      color: "text-green-400",
      highlight: "header-share"
    }
  ];

  const current = tourSteps[step];

  const handleNext = () => {
    triggerHaptic();
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        
        {/* Progress Dots */}
        <div className="flex gap-1.5 justify-center mb-8">
          {tourSteps.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`} />
          ))}
        </div>

        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-xl`}>
            <current.icon className={`w-10 h-10 ${current.color}`} />
          </div>

          <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{current.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            {current.desc}
          </p>

          <div className="flex w-full gap-3">
            <button 
              onClick={onComplete}
              className="flex-1 py-4 text-slate-500 font-bold hover:text-white transition-colors"
            >
              Skip
            </button>
            <button 
              onClick={handleNext}
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {step === tourSteps.length - 1 ? "Start Building" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button 
          onClick={onComplete}
          className="absolute top-6 right-6 text-slate-600 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}