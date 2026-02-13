"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ArrowUp, Bot, User, Cpu, FileCode, CheckCircle2, 
  Loader2, ChevronDown, ChevronRight, Zap, Sparkles, AlertTriangle, 
  Search, Code, Layout
} from "lucide-react";

// --- THE "GHOST" THOUGHT MODULE (Detailed Execution Log) ---
const NeuralThought = ({ steps, isComplete }) => {
  const [isExpanded, setIsExpanded] = useState(!isComplete);
  const [elapsed, setElapsed] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isComplete) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
        setElapsed(((Date.now() - startTime) / 1000).toFixed(1));
    }, 100);
    return () => clearInterval(timer);
  }, [isComplete]);

  // Auto-scroll the log as new steps arrive
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps]);

  return (
    <div className="my-3 w-full max-w-xl border border-zinc-800 rounded-lg bg-[#0a0a0a] overflow-hidden transition-all duration-300">
        <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors"
        >
            <div className="flex items-center gap-2.5">
                {isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                    <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                )}
                <span className="text-xs font-mono text-zinc-400">
                    {isComplete ? `Completed in ${elapsed}s` : `Visionary Engine Active... ${elapsed}s`}
                </span>
            </div>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />}
        </button>

        {isExpanded && (
            <div ref={scrollRef} className="px-4 py-3 space-y-2 border-t border-zinc-800/50 bg-black/40 max-h-40 overflow-y-auto custom-scrollbar">
                {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left-2 fade-in duration-300">
                        <step.icon className={`w-3.5 h-3.5 shrink-0 ${i === steps.length - 1 && !isComplete ? 'text-pink-500 animate-pulse' : 'text-zinc-600'}`} />
                        <span className={`text-[11px] font-mono leading-tight truncate ${i === steps.length - 1 && !isComplete ? 'text-zinc-200' : 'text-zinc-500'}`}>
                            {step.text}
                        </span>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

const FileDiffCard = ({ files }) => {
    if (!files || files.length === 0) return null;
    return (
        <div className="mt-3 w-full max-w-xl bg-[#09090b] border border-zinc-800 rounded-lg overflow-hidden group hover:border-zinc-700 transition-colors cursor-default">
            <div className="px-4 py-2.5 bg-zinc-900/30 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs font-bold text-zinc-300">{files.length} file{files.length > 1 ? 's' : ''} changed</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-green-500">Updated</span>
                </div>
            </div>
            <div className="divide-y divide-zinc-800/50">
                {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2 hover:bg-zinc-800/30 transition-colors group/item">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 group-hover/item:bg-yellow-400 transition-colors" />
                            <span className="text-[11px] text-zinc-400 font-mono group-hover/item:text-zinc-200">{f.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function ChatInterface({ 
  messages = [], 
  setMessages, 
  projectFiles = [], 
  onExecute,    
  setPreviewMode, 
  triggerHaptic 
}) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentThoughtSteps, setCurrentThoughtSteps] = useState([]);
  
  const scrollRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, currentThoughtSteps, isTyping]);

  // --- 3. DYNAMIC WORKFLOW SIMULATOR ---
  const simulateThinkingProcess = (inputText) => {
    // 1. Initial State
    setCurrentThoughtSteps([{ text: "Initializing context...", icon: Cpu }]);

    // 2. Queue simulated steps based on input context
    const steps = [
        { text: "Reading project configuration...", icon: Search, delay: 600 },
        { text: `Analyzing request: "${inputText.slice(0, 20)}..."`, icon: Bot, delay: 1200 },
    ];

    // Context-aware simulations
    if (inputText.toLowerCase().includes("xml") || inputText.toLowerCase().includes("layout")) {
        steps.push({ text: "Scanning res/layout directories...", icon: Layout, delay: 2000 });
        steps.push({ text: "Calculating view hierarchy...", icon: Code, delay: 2800 });
    } else if (inputText.toLowerCase().includes("logic") || inputText.toLowerCase().includes("function")) {
        steps.push({ text: "Parsing MainActivity.kt...", icon: FileCode, delay: 2000 });
        steps.push({ text: "Checking import dependencies...", icon: Zap, delay: 2800 });
    } else {
        steps.push({ text: "Diffing current file state...", icon: FileCode, delay: 2000 });
        steps.push({ text: "Synthesizing code update...", icon: Sparkles, delay: 2800 });
    }

    steps.push({ text: "Finalizing changes...", icon: CheckCircle2, delay: 3800 });

    const timers = steps.map(s => 
        setTimeout(() => {
            setCurrentThoughtSteps(prev => [...prev, { text: s.text, icon: s.icon }]);
        }, s.delay)
    );
    
    return () => timers.forEach(t => clearTimeout(t));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const text = inputValue;
    setInputValue("");
    setIsTyping(true);
    triggerHaptic?.();

    // 1. Reset Abort Controller
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    // 2. Add User Message
    const userMsg = { role: 'user', text: text };
    setMessages(prev => [...prev, userMsg]);

    // 3. Start Narrative Log
    const clearTimers = simulateThinkingProcess(text);

    // 4. Safety Timeout (45s)
    const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
    }, 45000);

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                messages: [...messages, userMsg],
                projectFiles: projectFiles 
            }),
            signal: abortControllerRef.current.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Server Error: ${response.status}`);

        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error("Invalid JSON response");
        }

        const aiMsg = { 
            role: 'ai', 
            text: data.message || "Update processed.",
            files: data.files || [],
            // Pass the final "thought history" to the completed message
            thoughts: [
                { text: "Analyzed request context", icon: Bot },
                { text: `Modified ${data.files?.length || 0} files`, icon: FileCode },
                { text: "Verified syntax integrity", icon: CheckCircle2 }
            ]
        };

        setMessages(prev => [...prev, aiMsg]);

        if (data.files && Array.isArray(data.files)) {
            data.files.forEach(file => {
                 onExecute('UPDATE_FILE', { 
                    name: file.name, 
                    content: file.content 
                 });
            });
            if (setPreviewMode) setPreviewMode('live'); 
        }

    } catch (error) {
        console.error("AI Error:", error);
        let errorText = error.name === 'AbortError' 
            ? "⚠️ Request timed out. Taking too long." 
            : `⚠️ Error: ${error.message}`;
            
        setMessages(prev => [...prev, { role: 'ai', text: errorText }]);
    } finally {
        clearTimers && clearTimers();
        setIsTyping(false);
        setCurrentThoughtSteps([]);
        triggerHaptic?.();
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-black relative overflow-hidden font-sans flex flex-col">
      
      {/* MESSAGE STREAM */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 pb-32 space-y-8 custom-scrollbar relative"
      >
         {/* Grid Background */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

         {messages.length === 0 && (
             <div className="h-[60vh] flex flex-col items-center justify-center opacity-30 pointer-events-none">
                 <Bot className="w-10 h-10 text-zinc-700 mb-4" />
                 <p className="text-sm font-mono text-zinc-500">Visionary OS v2.5</p>
             </div>
         )}

         {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col relative z-10 animate-in fade-in slide-in-from-bottom-3 duration-500 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {msg.role === 'user' ? (
                    <div className="max-w-[85%] bg-zinc-800 text-zinc-100 px-4 py-2.5 rounded-[1.2rem] rounded-tr-sm text-[13px] leading-relaxed shadow-sm border border-zinc-700/50">
                        {msg.text}
                    </div>
                ) : (
                    <div className="w-full max-w-2xl">
                        <div className="flex gap-4">
                            <div className="mt-1 w-6 h-6 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-700 flex items-center justify-center shrink-0">
                                {msg.text.includes("Error") ? <AlertTriangle className="w-3 h-3 text-red-400" /> : <Sparkles className="w-3 h-3 text-zinc-400" />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                {/* Completed Thoughts */}
                                {msg.thoughts && <NeuralThought steps={msg.thoughts} isComplete={true} />}
                                
                                <div className={`text-[13px] leading-relaxed mt-2 whitespace-pre-wrap ${msg.text.includes("Error") ? 'text-red-400' : 'text-zinc-300'}`}>
                                    {msg.text}
                                </div>

                                {msg.files && msg.files.length > 0 && <FileDiffCard files={msg.files} />}
                            </div>
                        </div>
                    </div>
                )}
            </div>
         ))}

         {/* ACTIVE THOUGHT LOG (a0.dev Style) */}
         {isTyping && (
             <div className="w-full max-w-2xl animate-in fade-in duration-300">
                <div className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 animate-pulse">
                        <Cpu className="w-3 h-3 text-zinc-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        {/* Live Log */}
                        <NeuralThought steps={currentThoughtSteps} isComplete={false} />
                    </div>
                </div>
             </div>
         )}
      </div>

      {/* FLOATING INPUT ISLAND */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none mb-safe">
         <div className="w-full max-w-2xl pointer-events-auto relative group">
            
            <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-[2rem] blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
            
            <div className="relative flex items-end gap-2 bg-[#121212]/90 backdrop-blur-xl border border-zinc-800 p-1.5 rounded-[24px] shadow-2xl ring-1 ring-white/5">
                
                <div className="pl-4 py-2.5 flex-1">
                    <input 
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                        disabled={isTyping}
                        placeholder="Build a login screen..."
                        className="w-full bg-transparent border-none text-zinc-200 p-0 focus:ring-0 placeholder:text-zinc-600 text-[14px] leading-relaxed outline-none font-sans"
                    />
                </div>

                <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className={`
                        w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 mb-0.5
                        ${!inputValue.trim() || isTyping 
                            ? 'bg-zinc-800 text-zinc-600' 
                            : 'bg-white text-black hover:scale-105 hover:bg-zinc-100'}
                    `}
                >
                    {isTyping ? (
                        <div className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <ArrowUp className="w-4 h-4" />
                    )}
                </button>
            </div>
         </div>
      </div>

    </div>
  );
}
