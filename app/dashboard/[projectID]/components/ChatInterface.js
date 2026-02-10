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
                 // We pass the EXACT filename and content from AI to the Workspace
                 // This handles both NEW files and UPDATES to existing ones
                 onExecute('UPDATE_FILE', { 
                    name: file.name, 
                    content: file.content 
                 });
            });
            
            // Force the Preview to switch to 'Live' mode so you see the changes immediately
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
    <div className="flex flex-col h-full w-full bg-[#020617] overflow-hidden">
      
      {/* MESSAGES AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm 
                ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-none'
                }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* LOADING INDICATOR */}
        {isLoading && (
            <div className="flex justify-start animate-in fade-in">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-xs text-slate-400 font-mono animate-pulse">Visionary AI is coding...</span>
                </div>
            </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="shrink-0 bg-[#020617] border-t border-slate-800/50 p-3 pb-safe">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            {isLoading ? <Sparkles className="w-4 h-4 animate-pulse text-blue-500" /> : <Mic className="w-4 h-4" />}
          </div>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Generating logic..." : "Describe a feature (e.g. 'Add a Login Screen')..."}
            className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
          />
          
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading} 
            className="p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}