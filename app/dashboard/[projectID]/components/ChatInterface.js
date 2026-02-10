"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff } from "lucide-react";

// --- REMOVED THE BROKEN IMPORT ---
// import AssetAlchemist from "./AssetAlchemist"; 

export default function ChatInterface({ 
  messages, 
  setMessages, 
  projectFiles = [], 
  onExecute,    
  setPreviewMode, 
  triggerHaptic 
}) {
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = (e, textOverride = null) => {
    if (e) e.preventDefault();
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    triggerHaptic?.();
    setMessages(prev => [...prev, { role: 'user', text: text }]);
    setInputValue("");

    // --- SIMPLE RESPONSE LOGIC ---
    setTimeout(() => {
      const lowerText = text.toLowerCase();

      // 1. DYNAMIC COMPONENT INJECTION
      if (lowerText.includes("button") || lowerText.includes("text")) {
        // AI Logic placeholder
        onExecute('ADD_COMPONENT', { xml: "" });
        setMessages(prev => [...prev, { role: 'ai', text: `I've updated the layout.` }]);
        return;
      }

      setMessages(prev => [...prev, { role: 'ai', text: "Command received. (AI Brain is in Safe Mode)" }]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020617] overflow-hidden">
      {/* SCROLLABLE MESSAGES */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="shrink-0 bg-[#020617] border-t border-slate-800/50 p-3 pb-safe">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Command the AI..."
            className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
          />
          <button type="submit" disabled={!inputValue.trim()} className="p-3 bg-blue-600 text-white rounded-xl">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}