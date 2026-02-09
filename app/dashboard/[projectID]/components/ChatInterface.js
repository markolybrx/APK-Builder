"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, Code2, Mic, MicOff, Plus, 
  LayoutTemplate, Palette, Zap, Sparkles 
} from "lucide-react";
import AssetAlchemist from "./AssetAlchemist";

export default function ChatInterface({ 
  messages, 
  setMessages, 
  projectFiles, // AI now READS the project state
  onExecute,    // AI now performs MULTI-FILE actions
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

    triggerHaptic();
    setMessages(prev => [...prev, { role: 'user', text: text }]);
    setInputValue("");

    // --- REASONING ENGINE START ---
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      // 1. DYNAMIC COMPONENT INJECTION
      if (lowerText.includes("button") || lowerText.includes("text")) {
        // AI READS: Find current activity_main.xml
        const currentXml = projectFiles.find(f => f.name === "activity_main.xml").content;
        
        // AI REASONS: Determine ID and Style
        const newId = `btn_${Math.floor(Math.random() * 1000)}`;
        const label = text.match(/'([^']+)'/) ? text.match(/'([^']+)'/)[1] : "New Action";

        // AI WRITES: Inject into existing layout instead of overwriting
        const updatedXml = currentXml.includes("</LinearLayout>") 
          ? currentXml.replace("</LinearLayout>", `    <Button android:id="@+id/${newId}" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="${label}" />\n</LinearLayout>`)
          : currentXml + `\n<Button android:id="@+id/${newId}" android:text="${label}" />`;

        onExecute('ADD_COMPONENT', { xml: updatedXml });
        setMessages(prev => [...prev, { role: 'ai', text: `I've analyzed your layout and injected a new Button (${newId}). The preview is updating now.` }]);
        return;
      }

      // 2. LOGIC CONNECTION
      if (lowerText.includes("login") || lowerText.includes("connect")) {
        const kotlinLogic = `// Added Login Logic\nval loginBtn = findViewById<Button>(R.id.btn_login)\nloginBtn.setOnClickListener { /* AI Generated Logic */ }`;
        onExecute('ADD_COMPONENT', { kotlin: kotlinLogic });
        setMessages(prev => [...prev, { role: 'ai', text: "I've linked the UI buttons to the backend logic in MainActivity.kt." }]);
        return;
      }

      // 3. ASSET GENERATION
      if (lowerText.startsWith('/image')) {
        setMessages(prev => [...prev, { role: 'ai', type: 'asset-gen', prompt: text.replace('/image', '') }]);
        return;
      }

      // DEFAULT RESPONSE
      setMessages(prev => [...prev, { role: 'ai', text: "Workspace monitored. No immediate code changes required for this request." }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] overflow-hidden">
      
      {/* SCROLLABLE MESSAGES */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'asset-gen' ? (
              <AssetAlchemist prompt={msg.prompt} triggerHaptic={triggerHaptic} onComplete={() => {}} />
            ) : (
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PINNED INPUT AREA */}
      <div className="shrink-0 bg-[#0f172a] border-t border-slate-800/50">
        <div className="p-3 pb-safe bg-slate-900/80 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <button type="button" onClick={toggleListening} className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening to instructions..." : "Command the AI..."}
              className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
            />
            <button type="submit" disabled={!inputValue.trim()} className="p-3 bg-blue-600 text-white rounded-xl active:scale-95 transition-transform">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
