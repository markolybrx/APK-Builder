import { useState } from "react";
import { ShieldAlert, CheckCircle, Sparkles, Ruler, Type, Palette } from "lucide-react";

export default function DesignCritique({ onAutoFix, triggerHaptic }) {
  const [isScanning, setIsScanning] = useState(false);

  const issues = [
    { id: 1, type: 'Accessibility', msg: 'Button text contrast is too low.', icon: Type },
    { id: 2, type: 'Spacing', msg: 'Hero image needs 16dp margin.', icon: Ruler },
    { id: 3, type: 'Colors', msg: 'Primary blue is not in Material 3 palette.', icon: Palette },
  ];

  return (
    <div className="absolute top-20 left-4 right-4 z-50 animate-in slide-in-from-top-4">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-blue-500/30 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-blue-600/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">AI Design Review</h3>
          </div>
          <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">
            BETA
          </span>
        </div>

        <div className="p-4 space-y-3">
          {issues.map((issue) => (
            <div key={issue.id} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-800">
              <issue.icon className="w-5 h-5 text-slate-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase">{issue.type}</p>
                <p className="text-xs text-slate-200">{issue.msg}</p>
              </div>
              <ShieldAlert className="w-4 h-4 text-yellow-500 opacity-50" />
            </div>
          ))}
        </div>

        <button 
          onClick={() => { triggerHaptic(); onAutoFix(); }}
          className="w-full py-4 bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Apply Auto-Fixes
        </button>
      </div>
    </div>
  );
}
