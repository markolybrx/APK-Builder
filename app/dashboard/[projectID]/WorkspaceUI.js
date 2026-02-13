"use client";

import { useState, useCallback } from "react";
// ... (imports remain the same)

const WorkspaceTabs = ({ activeView, setActiveView, onOpenTools, triggerHaptic }) => {
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'files', label: 'Code', icon: Code2 },
    { id: 'preview', label: 'Preview', icon: Smartphone },
    { id: 'logic', label: 'Logic', icon: GitBranch },
    { id: 'terminal', label: 'Console', icon: TerminalIcon },
    { id: 'tools', label: 'Tools', icon: Sparkles, isAction: true }, 
  ];

  return (
    <div className="h-10 border-b border-zinc-900 bg-black flex items-center px-4 gap-1 shrink-0 z-40">
      {tabs.map((tab) => {
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => { 
                triggerHaptic?.();
                tab.isAction ? onOpenTools() : setActiveView(tab.id);
            }}
            // Centering Fix: flex items-center justify-center with defined heights
            className={`
              flex items-center justify-center gap-2 px-3 h-8 rounded-md text-[11px] font-medium transition-all
              ${isActive && !tab.isAction ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}
            `}
          >
            <tab.icon className={`w-3.5 h-3.5 ${isActive || tab.isAction ? 'text-pink-500' : 'text-zinc-600'}`} />
            <span className="leading-none">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default function WorkspaceUI({ project }) {
  // ... (state logic remains the same)

  const updateFile = useCallback((updates) => {
    setProjectFiles(prev => {
      let newFiles = [...prev];
      updates.forEach(update => {
        const index = newFiles.findIndex(f => f.name === update.name);
        if (index >= 0) {
          newFiles[index] = { ...newFiles[index], content: update.content };
        } else {
          newFiles.push({ ...update, path: update.name.endsWith('.xml') ? "res/layout/" : "java/" });
        }
      });
      return newFiles;
    });
  }, []);

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-black fixed inset-0 overflow-hidden">
      <Header project={project} onShareClick={() => setIsQRModalOpen(true)} />
      
      <WorkspaceTabs 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onOpenTools={() => setIsOrbOpen(true)} 
        triggerHaptic={triggerHaptic} 
      />

      <div className="flex-1 relative overflow-hidden">
        {activeView === 'chat' && (
          <ChatInterface 
            messages={messages} 
            setMessages={setMessages} 
            projectFiles={projectFiles} 
            onUpdateFiles={updateFile} // Correctly wired to file system
            setPreviewMode={setPreviewMode}
            triggerHaptic={triggerHaptic}
          />
        )}
        {/* ... (other views) */}
      </div>

      {/* Overlays */}
      <ActionOrbMenu isOpen={isOrbOpen} onClose={() => setIsOrbOpen(false)} />
      {/* ... (Tool modals) */}
    </div>
  );
}
