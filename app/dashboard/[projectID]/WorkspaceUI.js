"use client";

import { useState } from "react";
import NavigationRail from "./components/NavigationRail"; // <--- NEW
import ChatInterface from "./components/ChatInterface";
import FileExplorer from "./components/FileExplorer";
import PreviewPane from "./components/PreviewPane";
import Terminal from "./components/Terminal";

// Placeholder for new views
function HistoryView() { return <div className="p-10 text-slate-500">History Timeline Coming Soon</div>; }
function SettingsView() { return <div className="p-10 text-slate-500">Project Settings Coming Soon</div>; }

export default function WorkspaceUI({ project }) {
  // --- STATE ---
  const [activeView, setActiveView] = useState('chat'); // Default view
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm ready to build "${project?.name || 'your app'}". Select a tool from the left to get started!` },
  ]);

  // Shared State for Preview Mode
  const [previewMode, setPreviewMode] = useState('live'); 

  // Utils
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex h-[100dvh] w-full bg-slate-950 text-slate-300 font-sans overflow-hidden">
      
      {/* 1. LEFT NAVIGATION RAIL (Always Visible) */}
      <NavigationRail 
        activeView={activeView} 
        setActiveView={setActiveView} 
        triggerHaptic={triggerHaptic}
      />

      {/* 2. MAIN CONTENT AREA (Switches based on selection) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        
        {/* VIEW: CHAT */}
        {activeView === 'chat' && (
           <ChatInterface 
              messages={messages} 
              setMessages={setMessages}
              setPreviewMode={(mode) => {
                  setPreviewMode(mode);
                  setActiveView('preview'); // Auto-switch to preview if AI asks
              }}
              triggerHaptic={triggerHaptic}
           />
        )}

        {/* VIEW: FILES */}
        {activeView === 'files' && (
           <FileExplorer isFullWidth={true} />
        )}

        {/* VIEW: PREVIEW (Phone / Draw / AR) */}
        {activeView === 'preview' && (
           <PreviewPane 
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
              triggerHaptic={triggerHaptic}
              isFullWidth={true}
           />
        )}

        {/* VIEW: TERMINAL */}
        {activeView === 'terminal' && (
           <div className="h-full w-full">
             <Terminal isOpen={true} setIsOpen={()=>{}} isFullView={true} triggerHaptic={triggerHaptic} />
           </div>
        )}

        {/* VIEW: HISTORY / SETTINGS */}
        {activeView === 'history' && <HistoryView />}
        {activeView === 'settings' && <SettingsView />}

      </div>
    </div>
  );
}
