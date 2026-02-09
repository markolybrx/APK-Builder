"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Menu, X, Play, Send, 
  Smartphone, Code2, Monitor, 
  Settings, Folder, FileCode, ChevronRight,
  Camera, MousePointer2, PenTool, Eraser, 
  Zap, Plus, LayoutTemplate, Palette, Undo, Trash2
} from "lucide-react";

export default function WorkspaceUI({ project }) {
  // --- STATE ---
  const [leftOpen, setLeftOpen] = useState(false);  
  const [rightOpen, setRightOpen] = useState(false); 
  const [previewMode, setPreviewMode] = useState('live'); // 'live', 'design', 'ar', 'draw'
  
  // Chat State
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm ready to build "${project?.name || 'your app'}". Sketch a feature on paper and use Ghost Mode, or just tell me what to build!` },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Drawing State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Quick Actions
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
    
    setTimeout(() => {
      let response = "I'm on it. Updating the code...";
      if (text.includes("icon")) {
        response = "I see your sketch! That looks like a 'Home' icon. I've generated the SVG code for it.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 1000);
  };

  // Canvas Logic
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Handle both mouse and touch
    const x = e.nativeEvent.offsetX || (e.touches && e.touches[0].clientX - canvas.getBoundingClientRect().left);
    const y = e.nativeEvent.offsetY || (e.touches && e.touches[0].clientY - canvas.getBoundingClientRect().top);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const x = e.nativeEvent.offsetX || (e.touches && e.touches[0].clientX - canvas.getBoundingClientRect().left);
    const y = e.nativeEvent.offsetY || (e.touches && e.touches[0].clientY - canvas.getBoundingClientRect().top);

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#3b82f6"; // Blue color
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current?.closePath();
    setIsDrawing(false);
  };

  // Handle "Generate from Sketch"
  const handleGenerateSketch = () => {
     // In a real app, we would convert canvas to Base64 and send to Vision API
     const canvas = canvasRef.current;
     const image = canvas.toDataURL(); // Get image data
     setMessages(prev => [...prev, { role: 'user', text: "[Uploaded Sketch]" }]);
     setInputValue("");
     
     setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: "Analyzing sketch... It looks like a User Profile card. Generating XML layout now." }]);
     }, 1000);
  };
  
  // Clear Canvas
  const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Initialize Canvas Context ref
  const ctxRef = useRef(null);
  useEffect(() => {
      if (previewMode === 'draw' && canvasRef.current) {
          const canvas = canvasRef.current;
          // Set explicit size to match display size for retina sharpness
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          const ctx = canvas.getContext("2d");
          ctxRef.current = ctx;
      }
  }, [previewMode, rightOpen]);


  return (
    <div className="fixed inset-0 z-[100] flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-300 font-sans overflow-hidden">

      {/* --- HEADER --- */}
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


      {/* --- BODY --- */}
      <div className="flex-1 flex overflow-hidden relative w-full">

        {/* LEFT: FILES */}
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


        {/* CENTER: CHAT */}
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

          <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0 pb-safe">
            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
              <button type="button" className="p-3 text-slate-400 bg-slate-800 rounded-xl hover:text-white transition-colors">
                <Code2 className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask AI or use Draw Mode..."
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


        {/* RIGHT: PREVIEW / DRAW / AR */}
        <aside 
          className={`
            absolute top-0 bottom-0 right-0 z-50 w-full md:w-[450px] bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 flex flex-col
            ${rightOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* Mode Switcher */}
          <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0">
            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
              <button onClick={() => setPreviewMode('live')} className={`p-1.5 rounded-md ${previewMode === 'live' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>
                <Play className="w-4 h-4" />
              </button>
              <button onClick={() => setPreviewMode('design')} className={`p-1.5 rounded-md ${previewMode === 'design' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>
                <MousePointer2 className="w-4 h-4" />
              </button>
              <button onClick={() => setPreviewMode('draw')} className={`p-1.5 rounded-md ${previewMode === 'draw' ? 'bg-pink-600 text-white' : 'text-slate-500'}`}>
                <PenTool className="w-4 h-4" />
              </button>
              <button onClick={() => setPreviewMode('ar')} className={`p-1.5 rounded-md ${previewMode === 'ar' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}>
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => setRightOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg"><X className="w-5 h-5 text-slate-400"/></button>
          </div>

          <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col">
            
            {/* 1. LIVE PREVIEW */}
            {previewMode === 'live' && (
              <div className="flex-1 flex items-center justify-center p-4">
                 <div className="w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                    <div className="flex-1 bg-white pt-8 flex flex-col items-center justify-center p-4 text-center">
                       <h3 className="text-black font-bold text-xl">App Preview</h3>
                       <p className="text-gray-500 text-sm mt-2">Interactive Mode</p>
                    </div>
                 </div>
              </div>
            )}

            {/* 2. DRAWING PAD */}
            {previewMode === 'draw' && (
              <div className="flex-1 flex flex-col bg-[#1e293b] relative">
                  {/* Canvas Toolbar */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                      <div className="bg-slate-800/90 backdrop-blur rounded-lg p-2 flex gap-2 pointer-events-auto border border-slate-700 shadow-xl">
                          <button onClick={clearCanvas} className="p-2 hover:bg-slate-700 rounded text-slate-300" title="Clear">
                              <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-slate-700 rounded text-slate-300" title="Undo">
                              <Undo className="w-4 h-4" />
                          </button>
                          <div className="w-px h-6 bg-slate-700 mx-1"></div>
                          <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                      </div>
                      
                      <button 
                        onClick={handleGenerateSketch}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg pointer-events-auto flex items-center gap-2"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        Generate Code
                      </button>
                  </div>

                  {/* The Canvas */}
                  <canvas 
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="flex-1 bg-[#1e293b] cursor-crosshair touch-none w-full h-full"
                  />
                  
                  {/* Grid Background Hint */}
                  <div className="absolute inset-0 pointer-events-none opacity-10" 
                       style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  </div>
              </div>
            )}
            
            {/* 3. DESIGN & AR (Placeholders) */}
            {(previewMode === 'design' || previewMode === 'ar') && (
               <div className="flex-1 flex items-center justify-center text-slate-500">
                  Mode Active
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