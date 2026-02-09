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
  setPreviewMode, 
  triggerHaptic,
  onAIChange,
  onUpdateFile 
}) {
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const quickActions = [
    { label: "Add Button", icon: Plus, prompt: "Add a button that says 'Click Me'" },
    { label: "Login Flow", icon: LayoutTemplate, prompt: "Create a login screen with email and password" },
    { label: "Change Colors", icon: Palette, prompt: "Make the primary color neon blue" },
    { label: "Fix Errors", icon: Zap, prompt: "Scan project for errors and fix them" },
  ];

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      triggerHaptic();
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => (prev + " " + transcript).trim());
      };
      recognition.onend = () => { setIsListening(false); triggerHaptic(); };
      recognition.start();
    }
  };

  const handleSendMessage = (e, textOverride = null) => {
    if (e) e.preventDefault();
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    triggerHaptic();
    setMessages(prev => [...prev, { role: 'user', text: text }]);
    setInputValue("");

    setTimeout(() => {
      if (text.toLowerCase().startsWith('/image') || text.toLowerCase().startsWith('/icon')) {
        const prompt = text.split(' ').slice(1).join(' ') || "app element";
        setMessages(prev => [...prev, { role: 'ai', type: 'asset-gen', prompt: prompt }]);
        return;
      }

      if (text.toLowerCase().includes("button")) {
        onUpdateFile("activity_main.xml", `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center">
    <Button
        android:id="@+id/dynamic_btn"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Click Me"
        android:backgroundTint="#3b82f6"/>
</LinearLayout>`);
        setMessages(prev => [...prev, { role: 'ai', text: "I've added the button to your layout and applied Material 3 styling. Check 'activity_main.xml' in your explorer!" }]);
        return;
      }

      if (text.toLowerCase().includes("login")) {
        onUpdateFile("MainActivity.kt", `// Auto-generated Login Logic
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        val loginBtn = findViewById<Button>(R.id.dynamic_btn)
        loginBtn.setOnClickListener {
            Toast.makeText(this, "Logging in...", Toast.LENGTH_SHORT).show()
        }
    }
}`);
        setMessages(prev => [...prev, { role: 'ai', text: "Login logic generated. I've updated 'MainActivity.kt' with the click listeners." }]);
        return;
      }

      let response = "Understood. I'm monitoring your workspace for changes.";
      if (text.toLowerCase().includes("draw")) {
        response = "Drawing Pad active. Sketch your idea and I'll convert it to XML.";
        setPreviewMode('draw');
      } else if (text.toLowerCase().includes("design")) {
        response = "Design Mode enabled. You can now tweak elements in the preview.";
        setPreviewMode('design');
      }

      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      triggerHaptic();
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] overflow-hidden">
      
      {/* 1. SCROLLABLE MESSAGES ZONE */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'asset-gen' ? (
              <AssetAlchemist 
                prompt={msg.prompt} 
                triggerHaptic={triggerHaptic}
                onComplete={() => {
                  setMessages(prev => [...prev, { role: 'ai', text: `Successfully added ${msg.prompt} to your project assets.` }]);
                }}
              />
            ) : (
              <div className={`
                max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm animate-in fade-in slide-in-from-bottom-2
                ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}
              `}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 2. PINNED BOTTOM INTERFACE (Non-scrollable) */}
      <div className="shrink-0 bg-[#0f172a] border-t border-slate-800/50">
        
        {/* Smart Actions Bar */}
        <div className="h-12 flex items-center gap-2 px-2 overflow-x-auto no-scrollbar bg-slate-900/30">
          <div className="flex items-center gap-1 px-2 text-blue-400"><Sparkles className="w-4 h-4" /></div>
          {quickActions.map((action, i) => (
            <button 
              key={i}
              onClick={() => handleSendMessage(null, action.prompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full text-[10px] font-bold text-slate-300 whitespace-nowrap transition-all active:scale-95"
            >
              <action.icon className="w-3 h-3 text-blue-400" />
              {action.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 pb-safe bg-slate-900/80 backdrop-blur-md">
          <form onSubmit={(e) => handleSendMessage(e)} className="relative flex items-center gap-2">
            <button 
              type="button" 
              onClick={toggleListening}
              className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening..." : "Tell me what to build..."}
              className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-sm"
              autoComplete="off"
            />
            <button type="submit" disabled={!inputValue.trim()} className="p-3 bg-blue-600 text-white rounded-xl disabled:opacity-50 transition-transform active:scale-95">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
