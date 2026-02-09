import { useState } from "react";
import { Send, Code2, Mic, MicOff, Plus, LayoutTemplate, Palette, Zap } from "lucide-react";

export default function ChatInterface({ messages, setMessages, setPreviewMode, setRightOpen, triggerHaptic }) {
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Quick Actions Config
  const quickActions = [
    { label: "Add Button", icon: Plus, prompt: "Add a button that says 'Click Me'" },
    { label: "Login Flow", icon: LayoutTemplate, prompt: "Create a login screen with email and password" },
    { label: "Change Colors", icon: Palette, prompt: "Make the primary color neon blue" },
    { label: "Fix Errors", icon: Zap, prompt: "Scan project for errors and fix them" },
  ];

  // Voice Logic
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
      
      recognition.onend = () => {
        setIsListening(false);
        triggerHaptic();
      };

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
    
    // Simulate AI Response
    setTimeout(() => {
      let response = "I'm on it. Updating the code...";
      if (text.toLowerCase().includes("draw")) {
        response = "I see your drawing! Converting to XML...";
        setPreviewMode('ar');
        setRightOpen(true);
      } else if (text.toLowerCase().includes("move")) {
        response = "Design Mode enabled. Drag elements to rearrange.";
        setPreviewMode('design');
        setRightOpen(true);
      }
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      triggerHaptic();
    }, 1000);
  };

  return (
    <main className="flex-1 flex flex-col bg-[#0f172a] relative z-0 w-full min-w-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm animate-in fade-in slide-in-from-bottom-2
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-sm' 
                : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Smart Actions */}
      <div className="h-12 border-t border-slate-800 bg-slate-900/50 flex items-center gap-2 px-2 overflow-x-auto no-scrollbar shrink-0">
        {quickActions.map((action, i) => (
          <button 
            key={i}
            onClick={() => handleSendMessage(null, action.prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 whitespace-nowrap transition-colors active:scale-95"
          >
            <action.icon className="w-3.5 h-3.5 text-blue-400" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
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
            placeholder={isListening ? "Listening..." : "Type or speak..."}
            className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-sm"
          />
          
          <button 
            type="submit" 
            disabled={!inputValue.trim()}
            className="p-3 bg-blue-600 text-white rounded-xl disabled:opacity-50 transition-transform active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}
