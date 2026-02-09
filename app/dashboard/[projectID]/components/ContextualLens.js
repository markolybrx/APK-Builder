import { Check, X, Sparkles } from "lucide-react";

export default function ContextualLens({ onAccept, onReject, triggerHaptic }) {
  return (
    <div className="absolute inset-x-4 bottom-4 z-[100] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-blue-600/90 backdrop-blur-xl border border-blue-400/30 p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(59,130,246,0.5)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase">Ghost UI Layer</h4>
            <p className="text-blue-100 text-[10px]">Swipe to merge this AI suggestion.</p>
          </div>
        </div>

        <div className="flex gap-2">
           <button onClick={() => { triggerHaptic(); onReject(); }} className="w-10 h-10 bg-red-500/20 hover:bg-red-500 text-white rounded-full flex items-center justify-center border border-red-500/30 transition-all">
             <X className="w-5 h-5" />
           </button>
           <button onClick={() => { triggerHaptic(); onAccept(); }} className="w-10 h-10 bg-green-500/20 hover:bg-green-500 text-white rounded-full flex items-center justify-center border border-green-500/30 transition-all">
             <Check className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  );
}