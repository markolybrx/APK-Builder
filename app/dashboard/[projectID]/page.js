"use client";

import { useState, useEffect, useRef } from "react";
import { Send, FileCode, Play, Download, ChevronRight, Loader2, Code2, Terminal } from "lucide-react";
import { useParams } from "next/navigation";

export default function ProjectWorkspace() {
  // CRITICAL CHANGE: We use 'projectid' because that is your folder name
  const { projectid } = useParams(); 
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll chat to bottom
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
      // We pass the projectid to the API so it knows which app we are building
      const response = await fetch("/api/generate/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userMessage.content,
          projectId: projectid // Sending the ID to the backend
        }),
      });

      const data = await response.json();

      if (data.success && data.files) {
        setFiles(data.files);
        // Default to showing MainActivity.kt or the first file
        const mainFile = data.files.find(f => f.path.includes("MainActivity.kt")) || data.files[0];
        setSelectedFile(mainFile);
        
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "I've generated the code for you. Check the file explorer on the left." }
        ]);
      } else {
        throw new Error(data.error || "Failed to generate code");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${error.message}. Please try again.` }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4">
      
      {/* LEFT: File Explorer */}
      <div className="w-64 flex-shrink-0 bg-slate-900/50 glass border border-white/10 rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-400" /> Project Files
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {files.length === 0 ? (
            <div className="text-center text-slate-500 text-sm py-8 px-4">
              No files yet. Ask AI to build something.
            </div>
          ) : (
            files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFile(file)}
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

      {/* MIDDLE: Code Editor Preview */}
      <div className="flex-1 bg-slate-950 border border-white/10 rounded-xl flex flex-col overflow-hidden shadow-2xl">
        {/* Editor Toolbar */}
        <div className="h-12 bg-slate-900 border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
             <Code2 className="w-4 h-4" />
             <span className="font-mono text-xs">{selectedFile ? selectedFile.path : "No file selected"}</span>
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Download Code">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Content */}
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

      {/* RIGHT: AI Chat Panel */}
      <div className="w-80 flex-shrink-0 bg-slate-900/50 glass border border-white/10 rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h2 className="font-semibold text-white">Gemini Assistant</h2>
        </div>
        
        {/* Messages Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-500 text-sm mt-10">
              <p>Describe your app concept to start generating code.</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-slate-800 text-slate-200 border border-white/10 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-white/10 rounded-2xl px-4 py-3 rounded-bl-none flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>Writing code...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-white/10 bg-slate-900/80">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your app..."
              className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder:text-slate-600"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
