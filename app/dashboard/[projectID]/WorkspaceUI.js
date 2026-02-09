"use client";

import { useState } from "react";
import { 
  Menu, X, Github, Play, Smartphone, 
  Settings, Folder, Code2, MessageSquare, 
  Share2, Save, Sparkles, FileCode, FileJson 
} from "lucide-react";
import Link from "next/link";

export default function WorkspaceUI({ project }) {
  // UI States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false); // Mobile: False by default
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false); // Mobile: False by default
  const [isGithubConnected, setIsGithubConnected] = useState(false); 

  // Helper to toggle sidebars on mobile
  const toggleLeftSidebar = () => setLeftSidebarOpen(!leftSidebarOpen);
  const toggleRightSidebar = () => setRightSidebarOpen(!rightSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-300 overflow-hidden font-sans">

      {/* --- TOP NAVIGATION BAR --- */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50 shrink-0">

        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLeftSidebar}
            className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-white leading-none text-sm md:text-base">
                  {project?.name || "Untitled App"}
                </span>
                <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
                  {project?.packageName || "com.app.draft"}
                </span>
            </div>
          </Link>
        </div>

        {/* Center: Toolbar Actions */}
        <div className="flex items-center gap-2">
          {!isGithubConnected ? (
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#24292F] hover:bg-[#24292F]/80 text-white text-xs font-bold rounded-lg border border-white/10 transition-all">
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Link GitHub</span>
            </button>
          ) : (
            <span className="text-xs text-green-400 flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded border border-green-900/50">
              <Github className="w-3 h-3" /> Linked
            </span>
          )}

          <div className="h-6 w-px bg-slate-800 mx-1 md:mx-2" />

          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-600/20">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Build APK</span>
          </button>
        </div>

        {/* Right: AI Toggle */}
        <button 
          onClick={toggleRightSidebar}
          className={`p-2 rounded-lg transition-all ml-2 ${rightSidebarOpen ? 'text-white bg-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </header>


      {/* --- MAIN WORKSPACE AREA --- */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* 1. LEFT SIDEBAR (File Explorer) */}
        {/* Mobile: Absolute position, slides in. Desktop: Relative, always visible */}
        <aside 
          className={`
            absolute md:relative z-40 h-full w-64 bg-slate-950 border-r border-slate-800 shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out
            ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="p-4 border-b border-slate-800 flex justify-between items-center h-12">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Project Files</span>
            <button onClick={() => setLeftSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
              <X className="w-4 h-4"/>
            </button>
          </div>

          <div className="p-2 space-y-1 font-mono text-sm overflow-y-auto h-[calc(100%-3rem)]">
            <FileItem name="app" type="folder" isOpen={true} />
            <div className="pl-4 space-y-1 border-l border-slate-800 ml-2">
               <FileItem name="src" type="folder" />
               <div className="pl-4 space-y-1 border-l border-slate-800 ml-2">
                 <FileItem name="main" type="folder" />
                 <FileItem name="java" type="folder" />
                 <FileItem name="MainActivity.kt" type="file" icon={<FileCode className="w-4 h-4 text-blue-400"/>} active />
                 <FileItem name="res" type="folder" />
                 <FileItem name="layout" type="folder" />
                 <FileItem name="activity_main.xml" type="file" icon={<FileCode className="w-4 h-4 text-orange-400"/>} />
                 <FileItem name="AndroidManifest.xml" type="file" icon={<FileCode className="w-4 h-4 text-green-400"/>} />
               </div>
            </div>
            <FileItem name="build.gradle" type="file" icon={<Settings className="w-4 h-4 text-slate-400"/>} />
          </div>
        </aside>

        {/* OVERLAY for Mobile Sidebar (Clicking outside closes it) */}
        {leftSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setLeftSidebarOpen(false)}
          />
        )}


        {/* 2. CENTER PANEL (Code Editor) */}
        <main className="flex-1 bg-[#0f172a] relative flex flex-col min-w-0">
          
          {/* Editor Tabs */}
          <div className="flex items-center bg-slate-900 border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0">
            <Tab name="MainActivity.kt" active type="kt" />
            <Tab name="activity_main.xml" type="xml" />
          </div>

          {/* Editor Content */}
          <div className="flex-1 p-4 md:p-8 overflow-auto">
             <div className="font-mono text-sm leading-relaxed whitespace-pre font-medium">
               <span className="text-purple-400">package</span> {project?.packageName || "com.example.app"}<br/><br/>
               <span className="text-purple-400">import</span> android.os.Bundle<br/>
               <span className="text-purple-400">import</span> androidx.activity.ComponentActivity<br/><br/>
               <span className="text-blue-400">class</span> <span className="text-yellow-400">MainActivity</span> : <span className="text-yellow-400">ComponentActivity</span>() {'{'}<br/>
               &nbsp;&nbsp;<span className="text-blue-400">override fun</span> <span className="text-yellow-400">onCreate</span>(savedInstanceState: Bundle?) {'{'}<br/>
               &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">super</span>.onCreate(savedInstanceState)<br/>
               &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// AI Prompt: {project?.description || "No description"}</span><br/>
               &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// TODO: Implement main screen logic</span><br/>
               &nbsp;&nbsp;&nbsp;&nbsp;setContentView(R.layout.activity_main)<br/>
               &nbsp;&nbsp;{'}'}<br/>
               {'}'}
             </div>
          </div>
        </main>


        {/* 3. RIGHT SIDEBAR (AI Assistant) */}
        {/* Mobile: Absolute position (over content). Desktop: Relative (side-by-side) if open */}
        {rightSidebarOpen && (
          <aside className="absolute md:relative right-0 h-full w-80 bg-slate-900 border-l border-slate-800 flex flex-col z-40 shadow-2xl md:shadow-none">
            
            <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center h-12 shrink-0">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI Architect
              </h3>
              <button onClick={() => setRightSidebarOpen(false)} className="md:hidden text-slate-400">
                <X className="w-4 h-4"/>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3 text-sm text-slate-300 border border-slate-700">
                  Project <strong>{project?.name || "App"}</strong> initialized. <br/>
                  I can edit files, fix errors, or generate new features. What's next?
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask AI to edit code..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
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

// --- SUB-COMPONENTS ---

function FileItem({ name, type, isOpen, active, icon }) {
  return (
    <div className={`
      flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors select-none
      ${active ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
    `}>
      {type === 'folder' ? (
        <Folder className={`w-4 h-4 ${isOpen ? 'text-slate-200' : 'text-slate-500'}`} />
      ) : (
        icon || <Code2 className="w-4 h-4 text-slate-500" />
      )}
      <span className="truncate">{name}</span>
    </div>
  );
}

function Tab({ name, active, type }) {
  const isKt = type === 'kt';
  return (
    <div className={`
      px-4 py-2.5 text-xs font-medium border-r border-slate-800 cursor-pointer flex items-center gap-2 select-none whitespace-nowrap
      ${active ? 'bg-[#0f172a] text-white border-t-2 border-t-blue-500' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300 bg-slate-900'}
    `}>
      <span className={isKt ? "text-blue-400" : "text-orange-400"}>
        {isKt ? "Kt" : "Xml"}
      </span>
      {name}
      {active && <X className="w-3 h-3 ml-2 hover:text-red-400" />}
    </div>
  );
}