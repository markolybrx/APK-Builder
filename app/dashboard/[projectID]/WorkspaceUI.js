"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Menu, X, Play, Send, 
  Smartphone, Code2, Monitor, 
  Settings, Folder, FileCode, ChevronRight,
  Camera, Move, MousePointer2, Eraser, 
  Zap, Plus, LayoutTemplate, Palette
} from "lucide-react";

export default function WorkspaceUI({ project }) {
  // --- STATE ---
  const [leftOpen, setLeftOpen] = useState(false);  
  const [rightOpen, setRightOpen] = useState(false); 
  const [previewMode, setPreviewMode] = useState('live'); // 'live', 'design', 'ar'
  
  // Chat State
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm ready to build "${project?.name || 'your app'}". Sketch a feature on paper and use Ghost Mode, or just tell me what to build!` },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Quick Actions (Smart Action Bar)
  const quickActions = [
    { label: "Add Button", icon: Plus, prompt: "Add a button that says 'Click Me'" },
    { label: "Login Flow", icon: LayoutTemplate, prompt: "Create a login screen with email and password" },
    { label: "Change Colors", icon: Palette, prompt: "Make the primary color neon blue" },
    { label: "Fix Errors", icon: Zap, prompt: "Scan project for errors and fix them" },
  ];

  // --- HANDLERS ---
  const handleSendMessage = (e, text = inputValue) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: text }]);
    setInputValue("");
    
    // Simulate AI thinking and switching modes based on context
    setTimeout(() => {
      let response = "I'm on it. Updating the code...";
      if (text.includes("draw")) {
        response = "I see your drawing! It looks like a navigation bar. Converting to XML...";
        setPreviewMode('ar');
        setRightOpen(true);
      } else if (text.includes("move") || text.includes("resize")) {
        response = "I've enabled Design Mode. You can now drag and drop elements to adjust the layout.";
        setPreviewMode('design');
        setRightOpen(true);
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-300 font-sans overflow-hidden">

      {/* --- 1. HEADER --- */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-50">
        <button 
          onClick={() => setLeftOpen(!leftOpen)}
          className={`p-2 rounded-lg transition-colors ${leftOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          <span className="font-bold text-white text-sm max-w-[150px] truncate">
            {project?.name || "Untitled App"}
          </span>
          <span className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> 
            v0.1.0
          </span>
        </div>

        <button 
          onClick={() => setRightOpen(!rightOpen)}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${rightOpen ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/50'}`}
        >
          <span className="hidden md:inline text-xs font-bold">Preview</span>
          {rightOpen ? <X className="w-5 h-5"/> : <Play className="w-5 h-5 fill-current" />}
        </button>
      </header>


      {/* --- 2. MAIN BODY --- */}
      <div className="flex-1 flex overflow-hidden relative w-full">

        {/* LEFT SIDEBAR: FILES */}
        <aside 
          className={`
            absolute top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 shadow-2xl transition-transform duration-300
            ${leftOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Explorer</span>
            <button onClick={() => setLeftOpen(false)}><X className="w-5 h-5 text-slate-400"/></button>
          </div>
          <div className="p-2 overflow-y-auto h-full pb-20">
            <FileTree />
          </div>
        </aside>
        {leftOpen && <div className="absolute inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={() => setLeftOpen(false)} />}


        {/* CENTER: AI CHAT */}
        <main className="flex-1 flex flex-col bg-[#0f172a] relative z-0 w-full min-w-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4">
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

          {/* SMART ACTION BAR (Scrollable) */}
          <div className="h-12 border-t border-slate-800 bg-slate-900/50 flex items-center gap-2 px-2 overflow-x-auto no-scrollbar shrink-0">
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

          {/* CHAT INPUT */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0 pb-safe">
            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
              <button type="button" className="p-3 text-slate-400 bg-slate-800 rounded-xl hover:text-white transition-colors">
                <Code2 className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask AI or draw a feature..."
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


        {/* RIGHT SIDEBAR: PREVIEW + AR + DESIGN */}
        <aside 
          className={`
            absolute top-0 bottom-0 right-0 z-50 w-full md:w-[450px] bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 flex flex-col
            ${rightOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* Preview Toolbar */}
          <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0">
            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
              <button 
                onClick={() => setPreviewMode('live')}
                className={`p-1.5 rounded-md transition-all ${previewMode === 'live' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                title="Live Interaction"
              >
                <Play className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode('design')}
                className={`p-1.5 rounded-md transition-all ${previewMode === 'design' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                title="Touch to Tweak"
              >
                <MousePointer2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewMode('ar')}
                className={`p-1.5 rounded-md transition-all ${previewMode === 'ar' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                title="Ghost Mode (AR)"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => setRightOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg"><X className="w-5 h-5 text-slate-400"/></button>
          </div>

          <div className="flex-1 bg-slate-950 relative overflow-hidden">
            
            {/* MODE 1: LIVE PREVIEW */}
            {previewMode === 'live' && (
              <div className="h-full flex items-center justify-center p-4">
                 <div className="w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                    <div className="flex-1 bg-white pt-8 flex flex-col items-center justify-center p-4 text-center">
                       <h3 className="text-black font-bold text-xl">App Preview</h3>
                       <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full">Click Me</button>
                    </div>
                 </div>
              </div>
            )}

            {/* MODE 2: TOUCH TO TWEAK (DESIGN) */}
            {previewMode === 'design' && (
              <div className="h-full flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                 <div className="w-[300px] h-[600px] bg-white rounded-[3rem] border-4 border-blue-500/50 shadow-2xl relative overflow-hidden flex flex-col group">
                    {/* Mock Editable Element */}
                    <div className="absolute top-20 left-10 w-40 h-20 border-2 border-blue-500 bg-blue-100/50 flex items-center justify-center cursor-move">
                        <span className="text-blue-600 text-xs font-bold bg-white px-2 py-1 rounded shadow-sm">Button Component</span>
                        {/* Resize Handles */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-600 rounded-full" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-600 rounded-full" />
                    </div>
                    <div className="absolute bottom-10 left-0 right-0 text-center">
                      <span className="bg-slate-900 text-white text-xs px-3 py-1 rounded-full opacity-80">Design Mode Active</span>
                    </div>
                 </div>
              </div>
            )}

            {/* MODE 3: GHOST MODE (AR) */}
            {previewMode === 'ar' && (
               <div className="h-full w-full relative">
                  {/* Fake Camera Feed Background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-slate-600 flex flex-col items-center">
                       <Camera className="w-12 h-12 mb-2 opacity-50" />
                       Camera Feed Active
                    </span>
                  </div>
                  
                  {/* AR Overlay UI */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                     <div className="absolute top-1/4 left-1/4 w-1/2 h-1/4 border-2 border-dashed border-green-400 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded absolute -top-3 left-2">
                           Detected: Navigation Bar
                        </span>
                     </div>
                  </div>

                  {/* AR Toolbar */}
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20">
                     <button className="p-4 bg-white rounded-full shadow-xl text-black">
                        <Camera className="w-6 h-6" />
                     </button>
                     <button className="p-4 bg-slate-800/80 backdrop-blur rounded-full shadow-xl text-white">
                        <Eraser className="w-6 h-6" />
                     </button>
                  </div>
               </div>
            )}
            
          </div>
        </aside>

      </div>
    </div>
  );
}

// --- DUMMY FILE TREE ---
function FileTree() {
  return (
    <div className="space-y-1 font-mono text-sm">
      <FileItem name="app" type="folder" isOpen={true}>
        <FileItem name="src" type="folder" isOpen={true}>
            <FileItem name="MainActivity.kt" type="file" ext="kt" />
            <FileItem name="activity_main.xml" type="file" ext="xml" />
        </FileItem>
      </FileItem>
      <FileItem name="build.gradle" type="file" ext="gradle" />
    </div>
  );
}

function FileItem({ name, type, isOpen: defaultOpen, children, ext }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  let Icon = type === 'folder' ? Folder : FileCode;
  let color = ext === 'kt' ? "text-blue-400" : ext === 'xml' ? "text-orange-400" : "text-slate-500";
  return (
    <div>
      <div 
        className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-800 text-slate-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="truncate text-slate-300">{name}</span>
      </div>
      {isOpen && children && <div className="pl-4 border-l border-slate-800 ml-2">{children}</div>}
    </div>
  );
}