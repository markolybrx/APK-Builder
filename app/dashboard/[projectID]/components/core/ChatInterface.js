"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ArrowUp, Bot, FileCode, CheckCircle2, 
  Loader2, ChevronDown, ChevronRight, Sparkles, AlertTriangle,
  Send, Server, Database
} from "lucide-react";

// --- REAL-TIME STATUS MODULE ---
const NeuralThought = ({ isComplete, duration, statusMsg }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (isComplete) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
        setElapsed(((Date.now() - startTime) / 1000).toFixed(1));
    }, 100);
    return () => clearInterval(timer);
  }, [isComplete]);

  return (
    <div className="my-3 w-full max-w-xl border border-zinc-800 rounded-lg bg-[#0a0a0a] overflow-hidden transition-all duration-300">
        <div className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-900/40">
            <div className="flex items-center gap-2.5">
                {isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                    <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                )}
                <span className="text-xs font-mono text-zinc-400">
                    {isComplete ? `Finalized in ${duration}s` : `Executing: ${statusMsg}... ${elapsed}s`}
                </span>
            </div>
            <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />}
            </button>
        </div>

        {isExpanded && !isComplete && (
            <div className="px-4 py-3 border-t border-zinc-800/50 bg-black/40">
                <div className="flex items-center gap-3">
                    <Server className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                    <span className="text-[11px] font-mono text-zinc-300">{statusMsg}</span>
                </div>
            </div>
        )}
    </div>
  );
};

export default function ChatInterface({ 
  messages = [], 
  setMessages, 
  projectFiles = [], 
  onUpdateFiles,    
  setPreviewMode, 
  triggerHaptic 
}) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [statusMsg, setStatusMsg] = useState("Idle");
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const text = inputValue;
    const startTime = Date.now();
    setInputValue("");
    setIsTyping(true);
    setStatusMsg("Preparing Context");
    triggerHaptic?.();

    const userMsg = { role: 'user', text: text };
    setMessages(prev => [...prev, userMsg]);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s Hard Limit

    try {
        setStatusMsg("Awaiting Neural Response");
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                messages: [...messages, userMsg],
                projectFiles: projectFiles 
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Gateway Error: ${response.status}`);

        const data = await response.json();
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        // Applying Files directly to Workspace
        if (data.files && data.files.length > 0) {
            setStatusMsg(`Applying ${data.files.length} Changes`);
            onUpdateFiles(data.files); // Real file system injection
            if (setPreviewMode) setPreviewMode('live');
        }

        const aiMsg = { 
            role: 'ai', 
            text: data.message,
            files: data.files || [],
            duration: duration
        };

        setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
        let errorTxt = error.name === 'AbortError' ? "Request Timed Out (Check Connection)" : `System Error: ${error.message}`;
        setMessages(prev => [...prev, { role: 'ai', text: errorTxt }]);
    } finally {
        setIsTyping(false);
        setStatusMsg("Idle");
        triggerHaptic?.();
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-black relative overflow-hidden flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 pb-32 space-y-6">
         {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'ai' && msg.duration && <NeuralThought isComplete={true} duration={msg.duration} />}
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] ${msg.role === 'user' ? 'bg-zinc-800 text-white' : 'text-zinc-300'}`}>
                    {msg.text}
                </div>
            </div>
         ))}

         {isTyping && (
             <div className="w-full max-w-2xl">
                <NeuralThought isComplete={false} statusMsg={statusMsg} />
             </div>
         )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
         <div className="w-full max-w-2xl pointer-events-auto bg-[#121212]/90 backdrop-blur-xl border border-zinc-800 p-1.5 rounded-[24px] flex items-center gap-2 ring-1 ring-white/5">
            <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isTyping}
                placeholder="Ask Visionary to build something..."
                className="flex-1 bg-transparent border-none text-zinc-200 px-4 py-2 focus:ring-0 text-[14px] outline-none"
            />
            <button onClick={handleSendMessage} className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50">
                <ArrowUp className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
}
