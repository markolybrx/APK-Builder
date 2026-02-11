"use client";

import { useState, useEffect } from "react";
import { Circle, Square, Play, Wand2, History, Fingerprint, X, ArrowRight } from "lucide-react";

export default function BehaviorRecorder({ isOpen, onClose, onUpdateFile, triggerHaptic }) {
  const [isRecording, setIsRecording] = useState(false);
  const [events, setEvents] = useState([]);
  const [processing, setProcessing] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
        setEvents([]);
        setIsRecording(false);
        setProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleRecording = () => {
    triggerHaptic?.();
    if (!isRecording) {
      setEvents([]);
      setIsRecording(true);
      
      // Simulate capturing gestures
      simulateGestures();
    } else {
      setIsRecording(false);
      finishRecording();
    }
  };

  const simulateGestures = () => {
    const mockEvents = [
        { type: 'tap', target: 'btn_login', time: '0.5s' },
        { type: 'input', target: 'et_email', value: 'user@test.com', time: '1.2s' },
        { type: 'swipe', dir: 'up', target: 'scroll_view', time: '2.4s' },
        { type: 'tap', target: 'btn_submit', time: '3.1s' }
    ];

    let current = 0;
    const interval = setInterval(() => {
        if (current >= mockEvents.length) {
            clearInterval(interval);
            return;
        }
        setEvents(prev => [...prev, mockEvents[current]]);
        current++;
    }, 1000);
  };

  const finishRecording = () => {
    setProcessing(true);
    setTimeout(() => {
        // Convert events to Pseudo-Kotlin
        const logicCode = `
// GENERATED BEHAVIOR LOGIC
val btnLogin = findViewById<Button>(R.id.btn_login)
btnLogin.setOnClickListener {
    // Navigate to Home
    startActivity(Intent(this, HomeActivity::class.java))
}`;
        // In a real app, this would append to the actual Activity file
        // For now, we simulate an update notification
        alert("Logic Generated: Added onClickListener to MainActivity.kt");
        setProcessing(false);
        onClose();
    }, 1500);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-[100] flex justify-center pb-8 pointer-events-none">
      
      {/* Main Recorder UI (Pointer Events Enabled) */}
      <div className="bg-black/90 backdrop-blur-xl border border-zinc-800 p-1 rounded-[2rem] shadow-2xl w-full max-w-lg pointer-events-auto animate-in slide-in-from-bottom-10 relative overflow-hidden">
        
        {/* Neon Active Border */}
        {isRecording && (
            <div className="absolute inset-0 rounded-[2rem] border-2 border-red-500/50 animate-pulse pointer-events-none" />
        )}

        {/* Content Container */}
        <div className="bg-zinc-900/50 rounded-[1.8rem] p-4 border border-zinc-800/50">
            
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-zinc-800'}`}>
                        {isRecording ? (
                            <div className="w-3 h-3 bg-white rounded-sm animate-spin" /> 
                        ) : (
                            <Fingerprint className="w-5 h-5 text-zinc-400" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
                            {isRecording ? <span className="text-red-500">RECORDING...</span> : "Behavior Recorder"}
                        </h4>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase">
                            {isRecording ? "Capturing Touch Events" : "Map Logic via Gestures"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                     {!isRecording && (
                        <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                     )}
                </div>
            </div>

            {/* Event Log Window */}
            {(isRecording || events.length > 0) && (
                <div className="mb-4 h-32 bg-black rounded-xl border border-zinc-800 p-3 overflow-y-auto custom-scrollbar font-mono text-[10px]">
                    {events.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-zinc-700 italic">
                            Waiting for input...
                        </div>
                    ) : (
                        events.map((ev, i) => (
                            <div key={i} className="flex gap-2 mb-1 animate-in slide-in-from-left-2">
                                <span className="text-zinc-600">[{ev.time}]</span>
                                <span className="text-pink-500 font-bold uppercase">{ev.type}</span>
                                <span className="text-zinc-400">➜ {ev.target}</span>
                            </div>
                        ))
                    )}
                    {processing && (
                        <div className="text-green-400 font-bold animate-pulse mt-2">
                            &gt; Compiling to Kotlin Syntax...
                        </div>
                    )}
                </div>
            )}

            {/* Controls */}
            <button 
                onClick={toggleRecording}
                disabled={processing}
                className={`
                    w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                    ${isRecording 
                        ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700' 
                        : 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-[1.02]'
                    }
                `}
            >
                {processing ? (
                    "Processing..."
                ) : isRecording ? (
                    <>
                        <Square className="w-4 h-4 fill-current" /> Stop & Generate Logic
                    </>
                ) : (
                    <>
                        <Circle className="w-4 h-4 fill-current" /> Start Recording
                    </>
                )}
            </button>

        </div>
      </div>
    </div>
  );
}
