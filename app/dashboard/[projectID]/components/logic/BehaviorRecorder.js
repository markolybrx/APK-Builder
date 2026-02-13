"use client";

import { useState, useEffect, useRef } from "react";
import { Circle, Square, Fingerprint, X, Activity, MousePointerClick, Zap } from "lucide-react";

export default function BehaviorRecorder({ isOpen, onClose, onUpdateFile, triggerHaptic }) {
  const [isRecording, setIsRecording] = useState(false);
  const [events, setEvents] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll the event log
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  if (!isOpen) return null;

  // --- GESTURE SIMULATION ---
  const handleToggle = () => {
    triggerHaptic?.();
    
    if (isRecording) {
        // Stop & Process
        setIsRecording(false);
        finishRecording();
    } else {
        // Start Recording
        setEvents([]);
        setIsRecording(true);
        simulateGestures();
    }
  };

  const simulateGestures = () => {
    const mockEvents = [
        { type: 'TOUCH_DOWN', target: 'root_view', coords: 'x:45, y:230', time: '0.1s' },
        { type: 'TAP', target: 'btn_login', id: '@+id/btn_login', time: '0.5s' },
        { type: 'IME_INPUT', target: 'et_email', value: 'visionary@user.com', time: '1.2s' },
        { type: 'SWIPE', dir: 'vertical', target: 'scroll_container', velocity: '800dp/s', time: '2.4s' },
        { type: 'TAP', target: 'btn_confirm', id: '@+id/btn_confirm', time: '3.1s' }
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

  const finishRecording = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
        const logicCode = `
// [BEHAVIOR RECORDER] Generated Interaction Logic
val btnLogin = findViewById<Button>(R.id.btn_login)
btnLogin.setOnClickListener {
    // Navigate to Dashboard
    val intent = Intent(this, DashboardActivity::class.java)
    startActivity(intent)
}`;
        if (onUpdateFile) onUpdateFile("MainActivity.kt", logicCode);
        setIsProcessing(false);
        onClose();
    }, 2000);
  };

  return (
    <div className="absolute inset-x-0 bottom-24 z-[100] flex justify-center pointer-events-none px-4">

      {/* FLOATING HUD CAPSULE */}
      <div className="bg-[#09090b]/90 backdrop-blur-2xl border border-zinc-800 p-1.5 rounded-[2.5rem] shadow-2xl w-full max-w-md pointer-events-auto animate-in slide-in-from-bottom-10 relative overflow-hidden ring-1 ring-white/5">

        {/* Recording Glow Pulse */}
        {isRecording && (
            <div className="absolute inset-0 rounded-[2.5rem] border-2 border-red-500/20 animate-pulse pointer-events-none z-20" />
        )}

        <div className="bg-zinc-900/50 rounded-[2.2rem] p-5 border border-zinc-800/50 relative overflow-hidden flex flex-col gap-4">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 
                        ${isRecording 
                            ? 'bg-red-500/20 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                            : 'bg-zinc-800 border border-zinc-700'
                        }`}
                    >
                        {isRecording ? (
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        ) : (
                            <Fingerprint className="w-5 h-5 text-zinc-400" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs tracking-wide uppercase flex items-center gap-2">
                            {isRecording ? <span className="text-red-400 animate-pulse">Recording Input</span> : "Behavior Recorder"}
                            {isRecording && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />}
                        </h4>
                        <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
                            {isRecording ? "Capturing Touch Stream..." : "Gesture-to-Code Engine"}
                        </p>
                    </div>
                </div>

                {!isRecording && (
                    <button onClick={onClose} className="p-2 bg-zinc-800/50 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors border border-zinc-700/50">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* TERMINAL STREAM */}
            <div 
                ref={scrollRef}
                className={`
                    transition-all duration-500 ease-in-out bg-black/50 rounded-xl border border-zinc-800/50 overflow-hidden relative
                    ${(isRecording || events.length > 0) ? 'h-40 p-4' : 'h-0 border-0'}
                `}
            >
                {/* Scanline Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20 z-10" />
                
                <div className="font-mono text-[9px] space-y-2 relative z-0">
                    {events.map((ev, i) => (
                        <div key={i} className="flex gap-3 animate-in slide-in-from-left-2 items-center text-zinc-400">
                            <span className="text-zinc-600 w-8 text-right opacity-50">{ev.time}</span>
                            <span className="text-pink-400 font-bold uppercase w-16">{ev.type}</span>
                            <span className="truncate flex-1 text-zinc-300">➜ {ev.target}</span>
                        </div>
                    ))}
                    {isProcessing && (
                         <div className="flex items-center gap-2 text-green-400 animate-pulse font-bold mt-2">
                            <Zap className="w-3 h-3" />
                            <span>Transpiling to Kotlin...</span>
                         </div>
                    )}
                </div>
            </div>

            {/* ACTION BUTTON */}
            <button 
                onClick={handleToggle}
                disabled={isProcessing}
                className={`
                    w-full py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all
                    ${isRecording 
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700' 
                        : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                    }
                `}
            >
                {isProcessing ? (
                    "Processing..."
                ) : isRecording ? (
                    <>
                        <Square className="w-3 h-3 fill-current" /> Stop & Compile
                    </>
                ) : (
                    <>
                        <Circle className="w-3 h-3 fill-current text-red-500" /> Start Capture
                    </>
                )}
            </button>

        </div>
      </div>
    </div>
  );
}