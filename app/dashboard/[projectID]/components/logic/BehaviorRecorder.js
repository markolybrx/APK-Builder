"use client";

import { useState, useEffect } from "react";
import { Circle, Square, Fingerprint, X, Activity, MousePointerClick } from "lucide-react";

export default function BehaviorRecorder({ isOpen, onClose, onUpdateFile, triggerHaptic }) {
  const [isRecording, setIsRecording] = useState(false);
  const [events, setEvents] = useState([]);
  const [processing, setProcessing] = useState(false);

  // --- 1. STATE RESET ON OPEN ---
  useEffect(() => {
    if (isOpen) {
        setEvents([]);
        setIsRecording(false);
        setProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- 2. GESTURE SIMULATION ENGINE ---
  const toggleRecording = () => {
    triggerHaptic?.();
    if (!isRecording) {
      setEvents([]);
      setIsRecording(true);

      // Simulate capturing stream of user inputs
      simulateGestures();
    } else {
      setIsRecording(false);
      finishRecording();
    }
  };

  const simulateGestures = () => {
    const mockEvents = [
        { type: 'touch_down', target: 'root_view', coords: 'x:45, y:230', time: '0.1s' },
        { type: 'tap', target: 'btn_login', id: '@+id/btn_login', time: '0.5s' },
        { type: 'ime_input', target: 'et_email', value: 'visionary@user.com', time: '1.2s' },
        { type: 'swipe', dir: 'vertical', target: 'scroll_container', velocity: '800dp/s', time: '2.4s' },
        { type: 'tap', target: 'btn_confirm', id: '@+id/btn_confirm', time: '3.1s' }
    ];

    let current = 0;
    const interval = setInterval(() => {
        if (current >= mockEvents.length) {
            clearInterval(interval);
            return;
        }
        setEvents(prev => [...prev, mockEvents[current]]);
        current++;
    }, 800);
  };

  // --- 3. LOGIC COMPILER ---
  const finishRecording = () => {
    setProcessing(true);
    triggerHaptic?.();
    
    setTimeout(() => {
        // Pseudo-Compiler: Gesture -> Kotlin
        const logicCode = `
// [BEHAVIOR RECORDER] Generated Interaction Logic
val btnLogin = findViewById<Button>(R.id.btn_login)
btnLogin.setOnClickListener {
    // Navigate to Dashboard
    val intent = Intent(this, DashboardActivity::class.java)
    startActivity(intent)
}`;
        
        // Push to Workspace (Simulated Append)
        if (onUpdateFile) {
             onUpdateFile("MainActivity.kt", logicCode); 
        }

        setProcessing(false);
        onClose();
    }, 2000);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-[100] flex justify-center pb-8 pointer-events-none">

      {/* FLOATING RECORDER ISLAND (Pointer Events Active) */}
      <div className="bg-black/90 backdrop-blur-xl border border-zinc-800 p-1.5 rounded-[2.5rem] shadow-2xl w-full max-w-lg pointer-events-auto animate-in slide-in-from-bottom-10 relative overflow-hidden ring-1 ring-white/5">

        {/* Recording Indicator Border */}
        {isRecording && (
            <div className="absolute inset-0 rounded-[2.5rem] border-2 border-red-500/50 animate-pulse pointer-events-none" />
        )}

        <div className="bg-zinc-900/80 rounded-[2.2rem] p-5 border border-zinc-800/50 relative overflow-hidden">
            
            {/* Header HUD */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)]' : 'bg-zinc-800'}`}>
                        {isRecording ? (
                            <Activity className="w-5 h-5 text-white animate-pulse" /> 
                        ) : (
                            <Fingerprint className="w-6 h-6 text-zinc-400" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-wide uppercase">
                            {isRecording ? <span className="text-red-500 animate-pulse">Recording Input...</span> : "Behavior Recorder"}
                        </h4>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                            {isRecording ? "Capturing Touch Stream" : "Gesture-to-Code Engine"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                     {!isRecording && (
                        <button onClick={onClose} className="p-2.5 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-zinc-700">
                            <X className="w-5 h-5" />
                        </button>
                     )}
                </div>
            </div>

            {/* Live Event Stream */}
            {(isRecording || events.length > 0) && (
                <div className="mb-4 h-36 bg-black rounded-xl border border-zinc-800 p-4 overflow-y-auto custom-scrollbar font-mono text-[10px] shadow-inner relative">
                     {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
                    
                    {events.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-zinc-700 italic uppercase tracking-widest">
                            Waiting for touch events...
                        </div>
                    ) : (
                        events.map((ev, i) => (
                            <div key={i} className="flex gap-3 mb-2 animate-in slide-in-from-left-4 items-center">
                                <span className="text-zinc-600 min-w-[30px]">[{ev.time}]</span>
                                <span className="text-pink-500 font-bold uppercase min-w-[60px]">{ev.type}</span>
                                <span className="text-zinc-400 truncate flex-1">➜ {ev.target} <span className="text-zinc-600">{ev.coords}</span></span>
                            </div>
                        ))
                    )}
                    {processing && (
                        <div className="text-green-400 font-bold animate-pulse mt-2 flex items-center gap-2">
                            <MousePointerClick className="w-3 h-3" />
                            &gt; Transpiling to Kotlin...
                        </div>
                    )}
                </div>
            )}

            {/* Action Controller */}
            <button 
                onClick={toggleRecording}
                disabled={processing}
                className={`
                    w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all
                    ${isRecording 
                        ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700' 
                        : 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.25)] hover:scale-[1.02]'
                    }
                `}
            >
                {processing ? (
                    "Processing Logic..."
                ) : isRecording ? (
                    <>
                        <Square className="w-3 h-3 fill-current" /> Stop & Generate Logic
                    </>
                ) : (
                    <>
                        <Circle className="w-3 h-3 fill-current" /> Init Recording
                    </>
                )}
            </button>

        </div>
      </div>
    </div>
  );
}
