"use client";

import { useState } from "react";
import Header from "./components/Header";
import FileExplorer from "./components/FileExplorer";
import ChatInterface from "./components/ChatInterface";
import PreviewPane from "./components/PreviewPane";

export default function WorkspaceUI({ project }) {
  // Global State
  const [leftOpen, setLeftOpen] = useState(false);  
  const [rightOpen, setRightOpen] = useState(false); 
  const [previewMode, setPreviewMode] = useState('live');
  
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm ready to build "${project?.name || 'your app'}". Use voice, draw a sketch, or type below!` },
  ]);

  // Global Utils
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-300 font-sans overflow-hidden">
      
      <Header 
        project={project}
        leftOpen={leftOpen} setLeftOpen={setLeftOpen}
        rightOpen={rightOpen} setRightOpen={setRightOpen}
        triggerHaptic={triggerHaptic}
      />

      <div className="flex-1 flex overflow-hidden relative w-full">
        
        <FileExplorer 
          leftOpen={leftOpen} 
          setLeftOpen={setLeftOpen} 
        />

        <ChatInterface 
          messages={messages} 
          setMessages={setMessages}
          setPreviewMode={setPreviewMode}
          setRightOpen={setRightOpen}
          triggerHaptic={triggerHaptic}
        />

        <PreviewPane 
          rightOpen={rightOpen} 
          setRightOpen={setRightOpen}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          triggerHaptic={triggerHaptic}
        />

      </div>
    </div>
  );
}
