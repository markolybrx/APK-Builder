"use client";

import { useState } from "react";
import { 
  Menu, X, Play, Send, 
  Smartphone, Code2, Monitor, 
  Settings, Folder, FileCode, ChevronRight 
} from "lucide-react";
import Link from "next/link";

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
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: inputValue }]);
    setInputValue("");
    
    // Fake AI Response (Simulated delay)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm working on that. I've updated the Main Activity to include those buttons." }]);
      // Auto-open preview to show "work"
      setRightOpen(true); 
    }, 1000);
  };

  return (
    // ROOT CONTAINER - Fixed Height, No Window Scroll
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-300 overflow-hidden font-sans fixed inset-0">

      {/* --- 1. HEADER (Fixed) --- */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50 shrink-0">
        
        {/* LEFT: File Menu Toggle */}
        <button 
          onClick={() => setLeftOpen(!leftOpen)}
          className={`p-2 rounded-lg transition-colors ${leftOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* CENTER: Project Title */}
        <div className="flex flex-col items-center">
          <span className="font-bold text-white text-sm">{project?.name || "Untitled App"}</span>
          <span className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> 
            Online
          </span>
        </div>

        {/* RIGHT: Preview Toggle (Play Button) */}
        <button 
          onClick={() => setRightOpen(!rightOpen)}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${rightOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white bg-slate-800/50'}`}
        >
          <span className="hidden md:inline text-xs font-bold">Preview</span>
          <Play className="w-5 h-5 fill-current" />
        </button>
      </header>


      {/* --- 2. MAIN BODY (Flex Row) --- */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* === LEFT SIDEBAR: FILE EXPLORER === */}
        {/* Mobile: Slides over. Desktop: Pushes content? Let's keep it overlay for maximum Chat space on mobile. */}
        <aside 
          className={`
            absolute top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out
            ${leftOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Project Files</span>
            <button onClick={() => setLeftOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5"/>
            </button>
          </div>
          <div className="p-2 overflow-y-auto h-full pb-20">
            <FileTree />
          </div>
        </aside>

        {/* CLICK OUTSIDE TO CLOSE LEFT SIDEBAR (Mobile Overlay) */}
        {leftOpen && (
          <div className="absolute inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={() => setLeftOpen(false)} />
        )}


        {/* === CENTER: AI CHAT (Always Visible) === */}
        <main className="flex-1 flex flex-col bg-[#0f172a] relative z-0 w-full">
          
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
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
            {/* Invisible div to scroll to bottom */}
            <div className="h-4" /> 
          </div>

          {/* Chat Input Area (Fixed Bottom) */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
              <button type="button" className="p-3 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors">
                <Code2 className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your app..."
                className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </main>


        {/* === RIGHT SIDEBAR: PREVIEW (Toggled by Play Btn) === */}
        {/* Slides in from the right */}
        <aside 
          className={`
            absolute top-0 bottom-0 right-0 z-50 w-full md:w-[400px] bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col
            ${rightOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* Preview Header */}
          <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0">
            <div className="flex items-center gap-2">
               <span className="flex h-2 w-2 rounded-full bg-red-500" />
               <span className="flex h-2 w-2 rounded-full bg-yellow-500" />
               <span className="flex h-2 w-2 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Device Preview</span>
            <button onClick={() => setRightOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1 rounded-md">
              <X className="w-5 h-5"/>
            </button>
          </div>

          {/* Preview Content (The Phone) */}
          <div className="flex-1 bg-slate-950 p-6 flex items-center justify-center overflow-y-auto">
            <div className="w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
              
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
              
              {/* Phone Screen (Iframe or Mock UI) */}
              <div className="flex-1 bg-white flex flex-col relative z-10 w-full h-full pt-8">
                 {/* This is where the generated app shows up */}
                 <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                       <Smartphone className="w-8 h-8" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-xl mb-2">Hello World</h3>
                    <p className="text-slate-500 text-sm">
                      This is a live preview of your generated Android layout.
                    </p>
                    <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg w-full">
                       Click Me
                    </button>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Toolbar for Preview */}
          <div className="h-12 border-t border-slate-800 bg-slate-900 flex items-center justify-around text-slate-400">
             <button className="hover:text-white"><Monitor className="w-5 h-5"/></button>
             <button className="hover:text-white"><Code2 className="w-5 h-5"/></button>
             <button className="hover:text-white"><Settings className="w-5 h-5"/></button>
          </div>
        </aside>

      </div>
    </div>
  );
}

// --- DUMMY FILE TREE COMPONENT ---
function FileTree() {
  return (
    <div className="space-y-1 font-mono text-sm">
      <FileItem name="app" type="folder" isOpen={true}>
        <FileItem name="src" type="folder" isOpen={true}>
          <FileItem name="main" type="folder" isOpen={true}>
            <FileItem name="java" type="folder">
              <FileItem name="MainActivity.kt" type="file" ext="kt" />
            </FileItem>
            <FileItem name="res" type="folder">
              <FileItem name="layout" type="folder">
                <FileItem name="activity_main.xml" type="file" ext="xml" />
              </FileItem>
            </FileItem>
          </FileItem>
        </FileItem>
      </FileItem>
      <FileItem name="build.gradle" type="file" ext="gradle" />
    </div>
  );
}

function FileItem({ name, type, isOpen: defaultOpen, children, ext }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Icon Logic
  let Icon = Folder;
  let color = "text-slate-500";
  if (type === 'file') {
    Icon = FileCode;
    if (ext === 'kt') color = "text-blue-400";
    if (ext === 'xml') color = "text-orange-400";
    if (ext === 'gradle') color = "text-slate-400";
  }

  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors ${type === 'folder' ? 'text-slate-300' : 'text-slate-400'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="opacity-50 w-4 flex justify-center">
          {type === 'folder' && <ChevronRight className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />}
        </span>
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="truncate">{name}</span>
      </div>
      {isOpen && children && (
        <div className="pl-4 border-l border-slate-800 ml-2.5">
          {children}
        </div>
      )}
    </div>
  );
}