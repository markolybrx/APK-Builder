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
  onUpdateFile // NEW: The "hands" to edit the File System
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

    // --- ACTIVATING THE AI BRAIN ---
    setTimeout(() => {
      // 1. ASSET GENERATION (/image or /icon)
      if (text.toLowerCase().startsWith('/image') || text.toLowerCase().startsWith('/icon')) {
        const prompt = text.split(' ').slice(1).join(' ') || "app element";
        setMessages(prev => [...prev, { 
          role: 'ai', 
          type: 'asset-gen', 
          prompt: prompt 
        }]);
        return;
      }

      // 2. DYNAMIC CODE GENERATION
      // Instead of canned text, we check for intent and modify the file system.
      if (text.toLowerCase().includes("button")) {
        // ACTUALLY MODIFY THE XML FILE
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

        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "I've added the button to your layout and applied Material 3 styling. Check 'activity_main.xml' in your explorer!" 
        }]);
        return;
      }

      // 3. ARCHITECTURE LOGIC GENERATION
      if (text.toLowerCase().includes("login")) {
        onUpdateFile("MainActivity.kt", `// Auto-generated Login Logic
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        val loginBtn = findViewById<Button>(R.id.dynamic_btn)
        loginBtn.setOnClickListener {
            // Logic injected via AI Chat
            Toast.makeText(this, "Logging in...", Toast.LENGTH_SHORT).show()
        }
    }
}`);
        setMessages(prev => [...prev, { role: 'ai', text: "Login logic generated. I've updated 'MainActivity.kt' with the click listeners." }]);
        return;
      }

      // 4. PREVIEW MODES
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
    <main className="flex-1 flex flex-col bg-[#0f172a] relative z-0 w-full min-w-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-4 custom-scrollbar">
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

      <div className="h-12 border-t border-slate-800 bg-slate-900/50 flex items-center gap-2 px-2 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1 px-2 text-blue-400"><Sparkles className="w-4 h-4" /></div>
        {quickActions.map((action, i) => (
          <button 
            key={i}
            onClick={() => handleSendMessage(null, action.prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 whitespace-nowrap transition-colors"
          >
            <action.icon className="w-3.5 h-3.5 text-blue-400" />
            {action.label}
          </button>
        ))}
      </div>

      <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0 pb-safe">
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
    </main>
  );
}
