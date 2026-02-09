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
  projectFiles = [], // Default to empty array to prevent map/find crashes
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

    triggerHaptic();
    setMessages(prev => [...prev, { role: 'user', text: text }]);
    setInputValue("");

    // --- CRASH-PROOF REASONING ENGINE ---
    setTimeout(() => {
      const lowerText = text.toLowerCase();

      // Safety check: Does the VFS even have files?
      if (!projectFiles || projectFiles.length === 0) {
        setMessages(prev => [...prev, { role: 'ai', text: "System Error: VFS is not ready. Please wait a moment." }]);
        return;
      }

      // 1. COMPONENT INJECTION WITH NULL-SAFETY
      if (lowerText.includes("button") || lowerText.includes("text")) {
        const layoutFile = projectFiles.find(f => f.name === "activity_main.xml");
        
        if (!layoutFile) {
          setMessages(prev => [...prev, { role: 'ai', text: "Error: I can't find activity_main.xml to modify." }]);
          return;
        }

        const currentXml = layoutFile.content || "";
        const newId = `btn_${Math.floor(Math.random() * 1000)}`;
        const label = text.match(/'([^']+)'/) ? text.match(/'([^']+)'/)[1] : "New Action";

        // Defensive injection: Ensure we don't break the XML structure
        let updatedXml;
        if (currentXml.includes("</LinearLayout>")) {
          updatedXml = currentXml.replace("</LinearLayout>", `    <Button\n        android:id="@+id/${newId}"\n        android:layout_width="wrap_content"\n        android:layout_height="wrap_content"\n        android:text="${label}"\n        android:layout_gravity="center" />\n</LinearLayout>`);
        } else {
          updatedXml = currentXml + `\n<Button android:id="@+id/${newId}" android:text="${label}" />`;
        }

        onExecute('ADD_COMPONENT', { xml: updatedXml });
        setMessages(prev => [...prev, { role: 'ai', text: `Successfully injected '${label}' into your layout.` }]);
        return;
      }

      // 2. LOGIC INJECTION WITH NULL-SAFETY
      if (lowerText.includes("login") || lowerText.includes("connect")) {
        const mainActivity = projectFiles.find(f => f.name === "MainActivity.kt");
        
        if (!mainActivity) {
          setMessages(prev => [...prev, { role: 'ai', text: "Error: MainActivity.kt is missing from the workspace." }]);
          return;
        }

        const kotlinLogic = `// AI Generated Logic\nval loginBtn = findViewById<Button>(R.id.btn_login)\nloginBtn.setOnClickListener { println("Logging in...") }`;
        onExecute('ADD_COMPONENT', { kotlin: kotlinLogic });
        setMessages(prev => [...prev, { role: 'ai', text: "Business logic has been synchronized with your UI components." }]);
        return;
      }

      // 3. ASSET GENERATION
      if (lowerText.startsWith('/image')) {
        setMessages(prev => [...prev, { role: 'ai', type: 'asset-gen', prompt: text.replace('/image', '') }]);
        return;
      }

      setMessages(prev => [...prev, { role: 'ai', text: "Instruction received. VFS is stable." }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#020617] overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'asset-gen' ? (
              <AssetAlchemist prompt={msg.prompt} triggerHaptic={triggerHaptic} onComplete={() => {}} />
            ) : (
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900/80 text-slate-200 border border-slate-800'}`}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="shrink-0 bg-[#020617] border-t border-slate-800/50">
        <div className="p-3 pb-safe bg-slate-900/50 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <button type="button" onClick={toggleListening} className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening..." : "Give instructions..."}
              className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
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
