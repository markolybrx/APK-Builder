"use client";

import { useState } from "react";
import { 
  Menu, X, Github, Play, Smartphone, 
  Settings, Folder, Code2, MessageSquare, 
  Share2, Save 
} from "lucide-react";
import Link from "next/link";

export default function Workspace({ params }) {
  // UI States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false); // Mobile toggle
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true); // Right panel toggle
  const [isGithubConnected, setIsGithubConnected] = useState(false); // Mock status

  return (
    <div className="flex flex-col h-screen bg-matte-900 text-slate-300 overflow-hidden">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <header className="h-16 bg-matte-800 border-b border-matte-border flex items-center justify-between px-4 z-50">
        
        {/* Left: Logo & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link href="/dashboard" className="font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="hidden md:inline">AppBuilder</span>
          </Link>
        </div>

        {/* Center: Project Actions */}
        <div className="flex items-center gap-2">
           {/* GITHUB CONNECT BUTTON (The Feature You Requested) */}
          {!isGithubConnected ? (
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#24292F] hover:bg-[#24292F]/80 text-white text-xs font-bold rounded-lg border border-white/10 transition-all">
              <Github className="w-3.5 h-3.5" />
              Link GitHub
            </button>
          ) : (
            <span className="text-xs text-green-400 flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded border border-green-900/50">
              <Github className="w-3 h-3" /> Linked
            </span>
          )}

          <div className="h-6 w-px bg-matte-border mx-2" />

          <button className="p-2 text-neon-blue bg-neon-blue/10 rounded-lg hover:bg-neon-blue/20 transition-all">
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Right: AI Toggle */}
        <button 
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className={`p-2 rounded-lg transition-all ${rightSidebarOpen ? 'text-white bg-matte-700' : 'text-slate-400 hover:text-white'}`}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </header>


      {/* --- MAIN WORKSPACE (3 Columns) --- */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* 1. LEFT SIDEBAR (File Explorer) */}
        {/* Hidden on mobile by default, fixed width on desktop */}
        <aside 
          className={`
            absolute md:relative z-40 h-full w-64 bg-matte-900 border-r border-matte-border transition-transform duration-300 ease-in-out
            ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="p-4 border-b border-matte-border flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Explorer</span>
            <button onClick={() => setLeftSidebarOpen(false)} className="md:hidden text-slate-400"><X className="w-4 h-4"/></button>
          </div>
          
          <div className="p-2 space-y-1">
            {/* Mock File Tree */}
            <FileItem name="app" type="folder" isOpen={true} />
            <div className="pl-4 space-y-1">
               <FileItem name="src" type="folder" />
               <FileItem name="MainActivity.kt" type="file" active />
               <FileItem name="ui_layout.xml" type="file" />
               <FileItem name="AndroidManifest.xml" type="file" />
            </div>
            <FileItem name="gradle" type="folder" />
          </div>
        </aside>

        {/* 2. CENTER PANEL (Code Editor / Canvas) */}
        <main className="flex-1 bg-matte-800 relative flex flex-col min-w-0">
          
          {/* Editor Tabs */}
          <div className="flex items-center bg-matte-900 border-b border-matte-border overflow-x-auto no-scrollbar">
            <Tab name="MainActivity.kt" active />
            <Tab name="ui_layout.xml" />
          </div>

          {/* Editor Content Area */}
          <div className="flex-1 p-8 overflow-auto">
             <div className="font-mono text-sm text-slate-400">
               <span className="text-purple-400">package</span> com.example.app<br/><br/>
               <span className="text-purple-400">import</span> android.os.Bundle<br/>
               <span className="text-purple-400">import</span> androidx.activity.ComponentActivity<br/><br/>
               <span className="text-blue-400">class</span> <span className="text-yellow-400">MainActivity</span> : <span className="text-yellow-400">ComponentActivity</span>() {'{'}<br/>
               &nbsp;&nbsp;<span className="text-blue-400">override fun</span> <span className="text-yellow-400">onCreate</span>(savedInstanceState: Bundle?) {'{'}<br/>
               &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">super</span>.onCreate(savedInstanceState)<br/>
               &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// Your AI generated code appears here...</span><br/>
               &nbsp;&nbsp;{'}'}<br/>
               {'}'}
             </div>
          </div>

        </main>

        {/* 3. RIGHT SIDEBAR (AI Assistant) */}
        {/* Hidden on mobile unless toggled, fixed width on desktop if open */}
        {rightSidebarOpen && (
          <aside className="w-80 bg-matte-900 border-l border-matte-border flex flex-col absolute right-0 h-full md:relative z-30 shadow-2xl md:shadow-none">
            
            <div className="p-4 border-b border-matte-border bg-matte-900">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-purple" />
                AI Architect
              </h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* Chat Message: AI */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-matte-800 border border-matte-border flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-neon-purple" />
                </div>
                <div className="bg-matte-800 rounded-2xl rounded-tl-none p-3 text-sm text-slate-300 border border-matte-border">
                  I've initialized your Android project. Do you want to add a login screen or a map view first?
                </div>
              </div>

              {/* Chat Message: User */}
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-lg bg-neon-blue/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-neon-blue">YO</span>
                </div>
                <div className="bg-neon-blue/10 rounded-2xl rounded-tr-none p-3 text-sm text-white border border-neon-blue/20">
                  Let's start with a login screen using Google Auth.
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-matte-border bg-matte-900">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask AI to edit code..."
                  className="w-full bg-matte-800 border border-matte-border rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-neon-purple/50 transition-colors"
                />
                <button className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </aside>
        )}

      </div>
    </div>
  );
}

// --- Helper Components ---

function FileItem({ name, type, isOpen, active }) {
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer ${active ? 'bg-neon-blue/10 text-neon-blue' : 'text-slate-400 hover:bg-matte-800 hover:text-white'}`}>
      {type === 'folder' ? (
        <Folder className={`w-4 h-4 ${isOpen ? 'text-slate-200' : 'text-slate-500'}`} />
      ) : (
        <Code2 className="w-4 h-4 text-slate-500" />
      )}
      <span>{name}</span>
    </div>
  );
}

function Tab({ name, active }) {
  return (
    <div className={`
      px-4 py-2.5 text-xs font-medium border-r border-matte-border cursor-pointer flex items-center gap-2
      ${active ? 'bg-matte-800 text-white border-t-2 border-t-neon-blue' : 'text-slate-500 hover:bg-matte-800 hover:text-slate-300'}
    `}>
      <span className="text-blue-400">Kt</span>
      {name}
      {active && <X className="w-3 h-3 ml-2 hover:text-red-400" />}
    </div>
  );
}
