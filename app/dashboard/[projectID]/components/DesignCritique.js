"use client";

import { useState, useEffect } from "react";
import { 
  X, CheckCircle2, AlertTriangle, 
  Wand2, ScanLine, Loader2 
} from "lucide-react";

export default function DesignCritique({ projectFiles, onClose, onAutoFix, triggerHaptic }) {
  const [status, setStatus] = useState('scanning'); // scanning | complete | fixing

  // Simulate AI Analysis Delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('complete');
      triggerHaptic?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFix = () => {
    triggerHaptic?.();
    setStatus('fixing');
    
    // THE AI "FIX": A cleaner, better-styled version of the XML
    const improvedXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:background="#0F172A"
    android:padding="24dp">

    <TextView
        android:id="@+id/welcome_text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Visionary App"
        android:textSize="24sp"
        android:textColor="#FFFFFF"
        android:textStyle="bold"
        android:layout_marginBottom="32dp" />

    <Button
        android:id="@+id/btn_primary"
        android:layout_width="match_parent"
        android:layout_height="60dp"
        android:text="Get Started"
        android:backgroundTint="#3B82F6"
        android:textColor="#FFFFFF"
        android:textSize="16sp" />
        
</LinearLayout>`;

    setTimeout(() => {
        onAutoFix(improvedXml);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
      
      {/* HEADER */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
            <ScanLine className={`w-4 h-4 ${status === 'scanning' ? 'text-blue-500 animate-pulse' : 'text-green-500'}`} />
            <span className="font-bold text-white text-xs uppercase tracking-widest">
                {status === 'scanning' ? 'AI Analyzing UI...' : 'Critique Report'}
            </span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
      </div>

      {/* BODY */}
      <div className="p-6 min-h-[200px] flex flex-col justify-center">
        
        {status === 'scanning' && (
            <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-slate-400 text-xs font-mono">Scanning layout hierarchy...</p>
            </div>
        )}

        {status === 'complete' && (
            <div className="space-y-4">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                    <div>
                        <h4 className="text-yellow-500 font-bold text-xs uppercase mb-1">Contrast Issue</h4>
                        <p className="text-slate-400 text-[10px] leading-relaxed">The default button color lacks sufficient contrast against the background. Recommended: Neon Blue (#3B82F6).</p>
                    </div>
                </div>

                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                        <h4 className="text-red-500 font-bold text-xs uppercase mb-1">Touch Target</h4>
                        <p className="text-slate-400 text-[10px] leading-relaxed">Standard buttons should have at least 16dp padding for mobile accessibility.</p>
                    </div>
                </div>
            </div>
        )}

        {status === 'fixing' && (
            <div className="flex flex-col items-center gap-4 text-center">
                <Wand2 className="w-8 h-8 text-purple-500 animate-bounce" />
                <p className="text-purple-400 text-xs font-mono">Refactoring XML Layout...</p>
            </div>
        )}

      </div>

      {/* FOOTER */}
      {status === 'complete' && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-white transition-colors">Dismiss</button>
            <button 
                onClick={handleFix}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
                <Wand2 className="w-3 h-3" /> Auto-Fix Issues
            </button>
          </div>
      )}
    </div>
  );
}