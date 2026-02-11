"use client";

import { useState, useEffect } from "react";
import { 
  X, AlertTriangle, Wand2, ScanLine, CheckCircle2, 
  Palette, Ruler, Type, MousePointerClick 
} from "lucide-react";

export default function DesignCritique({ isOpen, onClose, projectFiles, onUpdateFile, triggerHaptic }) {
  const [status, setStatus] = useState('scanning'); // scanning | report | fixing | done
  const [score, setScore] = useState(0);
  const [issues, setIssues] = useState([]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
        setStatus('scanning');
        setScore(0);
        setIssues([]);
        
        // Simulate Analysis Steps
        setTimeout(() => setScore(45), 500);
        setTimeout(() => setScore(72), 1200);
        setTimeout(() => {
            setScore(85);
            setIssues([
                { type: 'contrast', severity: 'high', title: 'Low Text Contrast', desc: 'TextView #welcome_text has a contrast ratio of 3.1:1. Minimum required is 4.5:1.' },
                { type: 'spacing', severity: 'medium', title: 'Touch Target Size', desc: 'Button #btn_primary height is 38dp. Minimum recommended is 48dp.' },
                { type: 'typography', severity: 'low', title: 'Inconsistent Scale', desc: 'Heading size (22sp) does not match Material 3 scale.' }
            ]);
            setStatus('report');
            triggerHaptic?.();
        }, 2000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFix = () => {
    triggerHaptic?.();
    setStatus('fixing');

    // The "Fixed" XML Payload (Mock Refactor)
    const improvedXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:background="#000000"
    android:padding="24dp">

    <TextView
        android:id="@+id/welcome_text"
        android:text="Visionary App"
        android:textSize="32sp"
        android:textColor="#FFFFFF"
        android:textStyle="bold"
        android:layout_marginBottom="48dp"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

    <Button
        android:id="@+id/btn_primary"
        android:text="Get Started"
        android:backgroundTint="#EC4899"
        android:textColor="#FFFFFF"
        android:textStyle="bold"
        android:layout_width="match_parent"
        android:layout_height="56dp" />
        
</LinearLayout>`;

    setTimeout(() => {
        onUpdateFile("activity_main.xml", improvedXml);
        setStatus('done');
        triggerHaptic?.();
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      
      {/* GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-black border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10">

        {/* Header */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/30">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/20">
                  <Wand2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                  <h3 className="font-bold text-white text-sm tracking-wide">Design Critique™</h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">AI Audit & Refactor</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"><X className="w-5 h-5" /></button>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[300px] flex flex-col relative">

            {status === 'scanning' && (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="#27272a" strokeWidth="8" fill="none" />
                            <circle cx="48" cy="48" r="40" stroke="#a855f7" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * score) / 100} className="transition-all duration-300 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white font-mono">
                            {score}%
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-white font-bold">Analyzing UX Patterns</p>
                        <p className="text-zinc-500 text-xs font-mono">Checking WCAG 2.1 Compliance...</p>
                    </div>
                </div>
            )}

            {status === 'report' && (
                <div className="flex-1 flex flex-col gap-4 animate-in slide-in-from-bottom-4">
                    
                    {/* Score Card */}
                    <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-500 uppercase">Health Score</span>
                            <span className="text-3xl font-bold text-white">{score}/100</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-red-400 uppercase">3 Issues Found</span>
                            <p className="text-[10px] text-zinc-500">Requires Attention</p>
                        </div>
                    </div>

                    {/* Issues List */}
                    <div className="flex-1 overflow-y-auto space-y-2 max-h-[240px] pr-1 custom-scrollbar">
                        {issues.map((issue, i) => (
                            <div key={i} className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex gap-3 hover:bg-red-500/10 transition-colors">
                                <div className="mt-1">
                                    {issue.type === 'contrast' && <Palette className="w-4 h-4 text-red-400" />}
                                    {issue.type === 'spacing' && <Ruler className="w-4 h-4 text-orange-400" />}
                                    {issue.type === 'typography' && <Type className="w-4 h-4 text-yellow-400" />}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-xs">{issue.title}</h4>
                                    <p className="text-zinc-400 text-[10px] mt-0.5 leading-relaxed">{issue.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Auto-Fix Button */}
                    <button 
                        onClick={handleFix}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        <Wand2 className="w-4 h-4" /> Auto-Fix All Issues
                    </button>
                </div>
            )}

            {status === 'fixing' && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                         <Wand2 className="w-8 h-8 text-purple-500 animate-[pulse_1s_infinite]" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold">Refactoring Layout XML...</h4>
                        <p className="text-zinc-500 text-xs mt-1 font-mono">Applying 12 accessibility patches.</p>
                    </div>
                </div>
            )}

            {status === 'done' && (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                         <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xl">Optimization Complete</h4>
                        <p className="text-zinc-400 text-sm mt-2 max-w-xs">Your layout is now fully compliant with Material Design 3 standards.</p>
                    </div>
                    <button onClick={onClose} className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl border border-zinc-800 transition-all">
                        Return to Workspace
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}
