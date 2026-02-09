"use client";

import { useState, useEffect, useCallback } from "react";
// ... (imports remain the same as your provided code)

export default function WorkspaceUI({ project }) {
  // ... (router, projectFiles, activeView, etc. remain the same)

  // --- 1. ENHANCED FILE UPDATE (The Reactive Loop) ---
  // We use useCallback to prevent unnecessary re-renders in children
  const updateFile = useCallback((fileName, newContent) => {
    setProjectFiles(prev => {
      const updated = prev.map(file => 
        file.name === fileName ? { ...file, content: newContent } : file
      );
      // Logic Map and Preview will automatically re-render when projectFiles changes
      return updated;
    });
    triggerHaptic();
  }, []);

  // --- 2. THE AI "SYSTEM HANDS" (Multi-file Execution) ---
  // This allows the AI to perform complex operations like "Create Page"
  const executeAICommand = async (commandType, payload) => {
    triggerHaptic();
    
    switch(commandType) {
      case 'ADD_COMPONENT':
        // Updates the XML and the Kotlin files simultaneously to ensure build integrity
        updateFile("activity_main.xml", payload.xml);
        if (payload.kotlin) updateFile("MainActivity.kt", payload.kotlin);
        break;
      
      case 'CREATE_PAGE':
        // Adds a new file to the state array
        const newFileName = `${payload.name}Activity.kt`;
        setProjectFiles(prev => [
          ...prev, 
          { name: newFileName, path: "app/src/main/java/", content: payload.content }
        ]);
        break;

      default:
        console.warn("Unknown AI Command:", commandType);
    }
  };

  const handleLogicUpdate = (log) => {
    // Parsing logic map transitions into AndroidManifest
    const manifestFile = projectFiles.find(f => f.name === "AndroidManifest.xml");
    const updatedManifest = manifestFile.content.replace("</manifest>", `${log}\n</manifest>`);
    updateFile("AndroidManifest.xml", updatedManifest);
    
    setMessages(prev => [...prev, { 
      role: 'ai', 
      text: `Integrated your visual flow into the Manifest.` 
    }]);
  };

  // ... (resize effects and handlers remain the same)

  return (
    <div 
      className="flex flex-col w-full bg-[#0f172a] text-slate-300 font-sans overflow-hidden fixed inset-0" 
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <Header project={project} />

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        <NavigationRail activeView={activeView} setActiveView={setActiveView} />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative overflow-hidden">
          {activeView === 'chat' && (
             <ChatInterface 
                messages={messages} 
                setMessages={setMessages}
                projectFiles={projectFiles} // AI can now READ the files
                onExecute={executeAICommand} // AI now has HANDS to write
                setPreviewMode={(mode) => { setPreviewMode(mode); setActiveView('preview'); }}
                triggerHaptic={triggerHaptic}
             />
          )}

          {activeView === 'logic' && (
             <LogicMapView 
                projectFiles={projectFiles} // Logic map now READS XML for buttons
                onLogicUpdate={handleLogicUpdate}
                triggerHaptic={triggerHaptic} 
             />
          )}

          {activeView === 'files' && (
             <FileExplorer files={projectFiles} /> 
          )}

          {activeView === 'preview' && (
             <PreviewPane 
                projectFiles={projectFiles} // Preview now RENDERS real XML content
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                onResolveChange={(fileName, content) => updateFile(fileName, content)}
                triggerHaptic={triggerHaptic}
             />
          )}

          {/* ... other views */}
        </main>
      </div>
      <div className="h-[1px] w-full bg-slate-800/50 shrink-0 z-[100]" />
      {/* ... overlays */}
    </div>
  );
}
