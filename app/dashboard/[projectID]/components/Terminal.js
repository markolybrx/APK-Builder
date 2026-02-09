import { useState, useEffect, useRef } from "react";
import { 
  Terminal as TerminalIcon, 
  AlertCircle, 
  CheckCircle, 
  Play, 
  Trash2, 
  AlertTriangle,
  Info
} from "lucide-react";

export default function Terminal({ triggerHaptic }) {
  const scrollRef = useRef(null);
  
  // Initial Mock Logs
  const [logs, setLogs] = useState([
    { type: 'info', text: 'Initializing Gradle build...', time: '10:00:01' },
    { type: 'success', text: 'Project structure loaded successfully.', time: '10:00:02' },
    { type: 'warning', text: 'Deprecation: kotlin-android-extensions is deprecated.', time: '10:00:05' },
    { type: 'info', text: 'Fetching dependencies...', time: '10:00:08' },
  ]);

  // Simulate incoming logs (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
          { type: 'info', text: "Compiling src/main/java/MainActivity.kt..." },
          { type: 'info', text: "Merging resources..." },
          { type: 'error', text: "e: /app/src/main/res/layout/activity_main.xml: (23, 15) Attribute 'text' not found" },
          { type: 'success', text: "Build successful in 423ms" },
          { type: 'warning', text: "Warning: Parameter 'id' is never used" }
      ];
      // Randomly pick a message to simulate activity
      if (Math.random() > 0.7) {
        const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
        addLog(randomMsg.type, randomMsg.text);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type, text) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    setLogs(prev => [...prev, { type, text, time }]);
  };

  const clearLogs = () => {
    triggerHaptic();
    setLogs([]);
  };

  // Helper to count errors for the badge
  const errorCount = logs.filter(l => l.type === 'error').length;
  const warningCount = logs.filter(l => l.type === 'warning').length;

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300 font-mono text-xs md:text-sm">
      
      {/* --- HEADER --- */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0">
        
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
            <span className="font-bold text-white font-sans tracking-wide">Build Console</span>
            
            {/* Status Badges */}
            {errorCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
                    <AlertCircle className="w-3 h-3" /> {errorCount} Errors
                </span>
            )}
            {warningCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">
                    <AlertTriangle className="w-3 h-3" /> {warningCount} Warnings
                </span>
            )}
        </div>

        {/* Actions */}
        <button 
            onClick={clearLogs}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
            title="Clear Console"
        >
            <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* --- LOG OUTPUT --- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-[#020617]">
        {logs.length === 0 && (
            <div className="text-slate-600 text-center mt-10 italic">Console is empty</div>
        )}
        
        {logs.map((log, i) => (
            <div key={i} className="flex gap-3 group items-start hover:bg-white/5 p-1 rounded -mx-1 px-1 transition-colors">
                {/* Timestamp */}
                <span className="text-slate-600 shrink-0 select-none w-16 text-right">{log.time}</span>
                
                <div className="flex-1 break-all flex flex-col gap-1">
                    {/* Log Message */}
                    <span className={`
                        flex items-start gap-2
                        ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
                        ${log.type === 'success' ? 'text-green-400' : ''}
                        ${log.type === 'warning' ? 'text-yellow-400' : ''}
                        ${log.type === 'info' ? 'text-slate-300' : ''}
                    `}>
                        <span className="mt-0.5 shrink-0">
                            {log.type === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
                            {log.type === 'success' && <CheckCircle className="w-3.5 h-3.5" />}
                            {log.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5" />}
                            {log.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400" />}
                        </span>
                        {log.text}
                    </span>
                    
                    {/* AI AUTO-FIX BUTTON (Only for errors) */}
                    {log.type === 'error' && (
                        <button 
                            onClick={() => { triggerHaptic(); alert("AI is analyzing the error..."); }}
                            className="self-start flex items-center gap-1.5 px-3 py-1.5 mt-1 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer group-hover:opacity-100 opacity-80"
                        >
                            <Play className="w-3 h-3 fill-current" />
                            <span className="font-bold text-[10px] uppercase tracking-wide">Ask AI to Fix</span>
                        </button>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}