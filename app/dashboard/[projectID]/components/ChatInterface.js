"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, Sparkles, Loader2, AlertCircle } from "lucide-react";

export default function ChatInterface({ 
  messages, 
  setMessages, 
  projectFiles = [], 
  onExecute,    
  setPreviewMode, 
  triggerHaptic 
}) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSendMessage = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const text = textOverride || inputValue;
    if (!text.trim() || isLoading) return;

    // 1. OPTIMISTIC UPDATE
    triggerHaptic?.();
    setMessages(prev => [...prev, { role: 'user', text: text }]);
    setInputValue("");
    setIsLoading(true);

    try {
        // 2. CONNECT TO GEMINI BACKEND
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                messages: [...messages, { role: 'user', text: text }],
                projectFiles: projectFiles 
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Neural Link Failed");

        // 3. PROCESS AI RESPONSE
        setMessages(prev => [...prev, { role: 'ai', text: data.message }]);

        // 4. APPLY CODE CHANGES (UNIVERSAL HANDLER)
        if (data.files && Array.isArray(data.files)) {
            data.files.forEach(file => {
                 onExecute('UPDATE_FILE', { 
                    name: file.name, 
                    content: file.content 
                 });
            });

            // Force the Preview to switch to 'Live' mode
            setPreviewMode('live'); 
        }

    } catch (error) {
        console.error("AI Error:", error);
        setMessages(prev => [...prev, { role: 'ai', text: "⚠️ Connection interrupted. Please check your API Key." }]);
    } finally {
        setIsLoading(false);
        triggerHaptic?.();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black overflow-hidden relative">

      {/* MESSAGES AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg
                ${msg.role === 'user' 
                    ? 'bg-gradient-to-br from-pink-600 to-blue-600 text-white rounded-br-none shadow-pink-500/10 border border-white/10' 
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-none'
                }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* LOADING INDICATOR */}
        {isLoading && (
            <div className="flex justify-start animate-in fade-in">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-3 shadow-lg">
                    <Loader2 className="w-4 h-4 text-pink-500 animate-spin" />
                    <span className="text-xs text-zinc-500 font-mono animate-pulse">Visionary AI is coding...</span>
                </div>
            </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="shrink-0 bg-black border-t border-zinc-800 p-3 pb-safe z-10">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
            {isLoading ? <Sparkles className="w-4 h-4 animate-pulse text-pink-500" /> : <Mic className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />}
          </div>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Generating logic..." : "Describe a feature (e.g. 'Add a Login Screen')..."}
            className="flex-1 bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 outline-none transition-all disabled:opacity-50 placeholder:text-zinc-600"
          />
          
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading} 
            className="p-3 bg-gradient-to-r from-pink-600 to-blue-600 hover:opacity-90 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white rounded-xl transition-all shadow-lg shadow-pink-500/20 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
