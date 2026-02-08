"use client";

import { useState, useEffect, useRef } from "react";
import { Send, FileCode, Download, ChevronRight, Loader2, Code2, Terminal, Menu, X, LayoutTemplate } from "lucide-react";
import { useParams } from "next/navigation";

export default function ProjectWorkspace() {
  const { id } = useParams(); // Using 'id' or 'projectid' depending on your folder name
  
  // State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Mobile Tab State (Files, Editor, Chat)
  const [activeTab, setActiveTab] = useState("chat"); 
  
  const chatContainerRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userMessage.content,
          projectId: id 
        }),
      });

      const data = await response.json();

      if (data.success && data.files) {
        setFiles(data.files);
        const mainFile = data.files.find(f => f.path.includes("MainActivity.kt")) || data.files[0];
        setSelectedFile(mainFile);
        
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "I've generated the code. Check the 'Files' tab." }
        ]);
        
        // On mobile, switch to editor or files to show progress
        if (window.innerWidth < 768) {
           setActiveTab("editor");
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${error.message}` }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] relative">
      
      {/* MOBILE TABS (Visible only on small screens) */}
      <div className="md:hidden flex border-b border-white/10 bg-slate-900">
        <button 
          onClick={() => setActiveTab("files")}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "files" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400"}`}
        >
          Files
        </button>
        <button 
          onClick={() => setActiveTab("editor")}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "editor" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400"}`}
        >
          Editor
        </button>
        <button 
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "chat" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400"}`}
        >
          Chat
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT COLUMN: File Explorer */}
        <div className={`
          absolute inset-0 z-10 bg-slate-900 md:static md:w-64 md:flex-shrink-0 md:bg-slate-900/50 md:glass md:border md:border-white/10 md:rounded-xl md:flex md:flex-col
          ${activeTab === "files" ? "flex flex-col" : "hidden md:flex"}
        `}>
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" /> Project Files
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {files.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-8 px-4">No files yet.</div>
            ) : (
              files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedFile(file);
                    // On mobile, auto-switch to editor when file is clicked
                    if (window.innerWidth < 768) setActiveTab("editor");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate flex items-center gap-2 transition-all ${
                    selectedFile === file 
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <ChevronRight className="w-3 h-3 opacity-50" />
                  {file.path.split('/').pop()}
                </button>
              ))
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: Code Editor */}
        <div className={`
          absolute inset-0 z-10 bg-slate-950 md:static md:flex-1 md:border md:border-white/10 md:rounded-xl md:flex md:flex-col md:shadow-2xl
          ${activeTab === "editor" ? "flex flex-col" : "hidden md:flex"}
        `}>
          <div className="h-12 bg-slate-900 border-b border-white/10 flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
               <Code2 className="w-4 h-4" />
               <span className="font-mono text-xs truncate max-w-[200px]">
                 {selectedFile ? selectedFile.path : "No file selected"}
               </span>
            </div>
            <button className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white">
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-[#0d1117]">
            {selectedFile ? (
              <pre className="text-slate-300 leading-relaxed">
                <code>{selectedFile.content}</code>
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <Terminal className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a file to view code</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AI Chat */}
        <div className={`
          absolute inset-0 z-10 bg-slate-900 md:static md:w-80 md:flex-shrink-0 md:bg-slate-900/50 md:glass md:border md:border-white/10 md:rounded-xl md:flex md:flex-col
          ${activeTab === "chat" ? "flex flex-col" : "hidden md:flex"}
        `}>
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h2 className="font-semibold text-white">Gemini Assistant</h2>
          </div>
          
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 md:pb-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 text-sm mt-10">
                <p>Describe your app concept to start.</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-200 border border-white/10"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 text-slate-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Writing code...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10 bg-slate-900/80">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your app..."
                className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isGenerating}
                className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}