"use client";

import { useState } from "react";
import { 
  Menu, X, Play, Send, 
  Smartphone, Code2, Monitor, 
  Settings, Folder, FileCode, ChevronRight 
} from "lucide-react";

export default function WorkspaceUI({ project }) {
  // --- STATE ---
  const [leftOpen, setLeftOpen] = useState(false);  // File Explorer
  const [rightOpen, setRightOpen] = useState(false); // Preview Window
  
  // Mock Chat History
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm ready to build "${project?.name || 'your app'}". What feature should we add first?` },
  ]);
  const [inputValue, setInputValue] = useState("");

  // --- HANDLERS ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: inputValue }]);
    setInputValue("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm working on that. Check the preview!" }]);
      setRightOpen(true); 
    }, 1000);
  };

  return (
    // FIX 1: z-[100] forces this ON TOP of your global header (Log In button).
    // FIX 2: h-[100dvh] ensures it fits perfectly on mobile screens (ignoring URL bar).
    <div className="fixed inset-0 z-[100] flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-300 font-sans overflow-hidden">

      {/* --- 1. HEADER (Fixed) --- */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-50">
        
        {/* LEFT: File Menu Toggle */}
        <button 
          onClick={() => setLeftOpen(!leftOpen)}
          className={`p-2 rounded-lg transition-colors ${leftOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* CENTER: Project Title */}
        <div className="flex flex-col items-center">
          <span className="font-bold text-white text-sm max-w-[150px] truncate">
            {project?.name || "Untitled App"}
          </span>
          <span className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> 
            Online
          </span>
        </div>

        {/* RIGHT: Preview Toggle */}
        <button 
          onClick={() => setRightOpen(!rightOpen)}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${rightOpen ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/50'}`}
        >
          <span className="hidden md:inline text-xs font-bold">Preview</span>
          <Play className="w-5 h-5 fill-current" />
        </button>
      </header>


      {/* --- 2. MAIN BODY --- */}
      <div className="flex-1 flex overflow-hidden relative w-full">

        {/* LEFT SIDEBAR: FILE EXPLORER */}
        <aside 
          className={`
            absolute top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 shadow-2xl transition-transform duration-300
            ${leftOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Files</span>
            <button onClick={() => setLeftOpen(false)}><X className="w-5 h-5 text-slate-400"/></button>
          </div>
          <div className="p-2 overflow-y-auto h-full pb-20">
            <FileTree />
          </div>
        </aside>

        {/* CLICK OUTSIDE OVERLAY */}
        {leftOpen && (
          <div className="absolute inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={() => setLeftOpen(false)} />
        )}


        {/* CENTER: AI CHAT */}
        <main className="flex-1 flex flex-col bg-[#0f172a] relative z-0 w-full min-w-0">
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input - Fixed to Bottom */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0 pb-safe">
            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
              <button type="button" className="p-3 text-slate-400 bg-slate-800 rounded-xl">
                <Code2 className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type instructions..."
                className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-sm"
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </main>


        {/* RIGHT SIDEBAR: PREVIEW */}
        <aside 
          className={`
            absolute top-0 bottom-0 right-0 z-50 w-full md:w-[400px] bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 flex flex-col
            ${rightOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase">Preview</span>
            <button onClick={() => setRightOpen(false)}><X className="w-5 h-5 text-slate-400"/></button>
          </div>

          <div className="flex-1 bg-slate-950 p-4 flex items-center justify-center overflow-y-auto">
             {/* Phone Frame */}
            <div className="w-[280px] h-[550px] bg-black rounded-[2.5rem] border-4 border-slate-800 relative overflow-hidden flex flex-col shadow-2xl">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-lg z-20"></div>
               <div className="flex-1 bg-white pt-8 flex flex-col items-center justify-center p-4 text-center">
                  <Smartphone className="w-12 h-12 text-blue-500 mb-4" />
                  <h3 className="text-black font-bold text-lg">App Preview</h3>
                  <p className="text-gray-500 text-xs mt-2">Your generated changes will appear here live.</p>
               </div>
            </div>
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