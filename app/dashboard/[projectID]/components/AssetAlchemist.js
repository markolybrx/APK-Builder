import { Sparkles, Download, CheckCircle, Loader2 } from "lucide-react";

export default function AssetAlchemist({ prompt, onComplete, triggerHaptic }) {
  return (
    <div className="my-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-4 overflow-hidden relative">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
        <span className="text-xs font-bold text-purple-200 uppercase tracking-widest">Asset Alchemist</span>
      </div>
      
      <div className="flex gap-4">
        {/* Mock Generated Image */}
        <div className="w-24 h-24 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden relative group">
           <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:opacity-100 transition-opacity">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
           </div>
           {/* In real app, this would be the generated <img> */}
           <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=100&auto=format&fit=crop')] bg-cover" />
        </div>

        <div className="flex-1 flex flex-col justify-between py-1">
           <p className="text-[10px] text-slate-400 italic">"Generating {prompt}..."</p>
           <div className="flex gap-2">
              <button onClick={() => { triggerHaptic(); onComplete(); }} 
                className="flex-1 py-2 bg-purple-600 text-white text-[10px] font-bold rounded-lg hover:bg-purple-500 transition-all flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3" /> Add to Drawable
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}