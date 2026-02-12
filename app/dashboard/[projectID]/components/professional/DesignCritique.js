"use client";

import { useState, useEffect } from "react";
import { 
  X, AlertTriangle, Wand2, ScanLine, CheckCircle2, 
  Palette, Ruler, Type, MousePointerClick, RefreshCw 
} from "lucide-react";

export default function DesignCritique({ isOpen, onClose, projectFiles, onUpdateFile, triggerHaptic }) {
  const [status, setStatus] = useState('scanning'); // scanning | report | fixing | done
  const [score, setScore] = useState(0);
  const [issues, setIssues] = useState([]);

  // --- 1. AUDIT SIMULATION ENGINE ---
  useEffect(() => {
    if (isOpen) {
        setStatus('scanning');
        setScore(0);
        setIssues([]);

        // Staged Analysis Sequence
        setTimeout(() => setScore(35), 600);
        setTimeout(() => setScore(62), 1400);
        setTimeout(() => {
            setScore(85);
            setIssues([
                { type: 'contrast', severity: 'high', title: 'Low Text Contrast', desc: 'TextView #welcome_text has a contrast ratio of 3.1:1. Minimum required is 4.5:1.' },
                { type: 'spacing', severity: 'medium', title: 'Touch Target Size', desc: 'Button #btn_primary height is 38dp. Minimum recommended is 48dp.' },
                { type: 'typography', severity: 'low', title: 'Inconsistent Scale', desc: 'Heading size (22sp) does not match Material 3 scale.' }
            ]);
            setStatus('report');
            triggerHaptic?.();
        }, 2200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- 2. AUTO-REFACTOR LOGIC ---
  const handleFix = () => {
    triggerHaptic?.();
    setStatus('fixing');

    // MOCK XML PAYLOAD (SIMULATING A REFACTOR)
    const improvedXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:background="#121212"
    android:padding="24dp">

    <TextView
        android:id="@+id/welcome_text"
        android:text="Visionary App"
        android:textSize="32sp"
        android:textColor="#FFFFFF"
        android:fontFamily="sans-serif-medium"
        android:layout_marginBottom="48dp"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

    <Button
        android:id="@+id/btn_primary"
        android:text="Get Started"
        android:backgroundTint="#EC4899"
        android:textColor="#FFFFFF"
        android:textAllCaps="true"
        android:layout_width="match_parent"
        android:layout_height="56dp" />
        
</LinearLayout>`;

    setTimeout(() => {
        if (onUpdateFile) {
            onUpdateFile("activity_main.xml", improvedXml);
        }
        setStatus('done');
        triggerHaptic?.();
    }, 1800);
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">

      {/* AMBIENT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-black border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 ring-1 ring-white/5">

        {/* HEADER HUB */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/30">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                  <Wand2 className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                  <h3 className="font-bold text-white text-sm tracking-wide uppercase">Design Critique™</h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">AI Audit & Refactor</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 border border-transparent hover:border-zinc-700">
              <X className="w-5 h-5" />
           </button>
        </div>

        {/* VIEWPORT AREA */}
        <div className="p-6 min-h-[360px] flex flex-col relative justify-center">

            {/* STATE 1: SCANNING */}
            {status === 'scanning' && (
                <div className="flex flex-col items-center justify-center gap-6 text-center animate-in zoom-in-95">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="#27272a" strokeWidth="8" fill="none" />
                            <circle 
                                cx="64" cy="64" r="56" 
                                stroke="#ec4899" strokeWidth="8" fill="none" 
                                strokeDasharray="351.8" 
                                strokeDashoffset={351.8 - (351.8 * score) / 100} 
                                className="transition-all duration-300 ease-out" 
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white font-mono">{score}%</span>
                            <span className="text-[9px] text-pink-500 font-bold uppercase tracking-wider">Health</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-white font-bold tracking-wide uppercase text-sm">Analyzing UX Patterns</p>
                        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest animate-pulse">Checking WCAG 2.1 Compliance...</p>
                    </div>
                </div>
            )}

            {/* STATE 2: REPORT */}
            {status === 'report' && (
                <div className="flex-1 flex flex-col gap-4 animate-in slide-in-from-bottom-4">
                    {/* Score Card */}
                    <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Health Score</span>
                            <span className="text-3xl font-bold text-white tracking-tight">{score}/100</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider bg-red-900/20 px-2 py-1 rounded">3 Critical Issues</span>
                            <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest">Action Required</p>
                        </div>
                    </div>

                    {/* Issues List */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {issues.map((issue, i) => (
                            <div key={i} className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex gap-3 hover:bg-red-500/10 transition-colors group">
                                <div className="mt-1 p-1.5 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                                    {issue.type === 'contrast' && <Palette className="w-3.5 h-3.5 text-red-400" />}
                                    {issue.type === 'spacing' && <Ruler className="w-3.5 h-3.5 text-orange-400" />}
                                    {issue.type === 'typography' && <Type className="w-3.5 h-3.5 text-yellow-400" />}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-xs uppercase tracking-wide">{issue.title}</h4>
                                    <p className="text-zinc-400 text-[10px] mt-0.5 leading-relaxed font-mono">{issue.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action */}
                    <button 
                        onClick={handleFix}
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.25)] flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-xs tracking-widest mt-auto"
                    >
                        <Wand2 className="w-4 h-4 fill-current" /> Auto-Fix Violations
                    </button>
                </div>
            )}

            {/* STATE 3: FIXING */}
            {status === 'fixing' && (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center animate-in zoom-in-95">
                    <div className="relative">
                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                             <RefreshCw className="w-8 h-8 text-pink-500 animate-spin" />
                        </div>
                        <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm">Refactoring Layout XML</h4>
                        <p className="text-zinc-500 text-[10px] mt-2 font-mono uppercase tracking-widest">Applying 12 accessibility patches...</p>
                    </div>
                </div>
            )}

            {/* STATE 4: DONE */}
            {status === 'done' && (
                <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                         <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xl tracking-tight">Optimization Complete</h4>
                        <p className="text-zinc-500 text-xs mt-3 max-w-xs mx-auto leading-relaxed font-mono uppercase tracking-wide">Layout is now compliant with Material Design 3 Guidelines.</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl border border-zinc-800 transition-all uppercase text-xs tracking-widest hover:border-zinc-600"
                    >
                        Return to Workspace
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}
