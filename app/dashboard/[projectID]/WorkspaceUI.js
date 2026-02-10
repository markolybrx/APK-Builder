"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, X, Settings } from "lucide-react"; 

// --- CORE COMPONENTS (Must exist in /components folder) ---
import NavigationRail from "./components/NavigationRail";
import ChatInterface from "./components/ChatInterface";
import FileExplorer from "./components/FileExplorer";
import PreviewPane from "./components/PreviewPane";
import Header from "./components/Header";

// --- TEMPORARILY DISABLED (Do not uncomment until we verify they exist) ---
// import Terminal from "./components/Terminal";
// import HistoryView from "./components/HistoryView";
// import SettingsView from "./components/SettingsView";
// import RepoConverter from "./components/RepoConverter";
// import CloneVision from "./components/CloneVision";
// import QRShareModal from "./components/QRShareModal";
// import LogicMapView from "./components/LogicMapView";
// import WelcomeTour from "./components/WelcomeTour";
// import DebuggerView from "./components/DebuggerView"; 

export default function WorkspaceUI({ project }) {
  const router = useRouter();

  // --- INITIAL VFS STATE ---
  const [projectFiles, setProjectFiles] = useState([
    { name: "MainActivity.kt", path: "app/src/main/java/", content: "package com.example.app\n\nimport android.os.Bundle\nimport androidx.appcompat.app.AppCompatActivity\n\nclass MainActivity : AppCompatActivity() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_main)\n    }\n}" },
    { name: "activity_main.xml", path: "app/src/main/res/layout/", content: "<?xml version='1.0' encoding='utf-8'?>\n<LinearLayout xmlns:android='http://schemas.android.com/apk/res/android' android:layout_width='match_parent' android:layout_height='match_parent' android:orientation='vertical' android:gravity='center'>\n    <TextView android:text='System Online' android:textSize='24sp' android:layout_width='wrap_content' android:layout_height='wrap_content' />\n</LinearLayout>" },
    { name: "AndroidManifest.xml", path: "app/src/main/", content: "<?xml version='1.0' encoding='utf-8'?>\n<manifest xmlns:android='http://schemas.android.com/apk/res/android' package='com.visionary.app'>\n</manifest>" }
  ]);

  const [activeView, setActiveView] = useState('chat'); 
  const [previewMode, setPreviewMode] = useState('live'); 

  const [messages, setMessages] = useState([
    { role: 'ai', text: `Safe Mode Active. VFS linked for "${project?.name || 'New Project'}".` },
  ]);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  const updateFile = useCallback((fileName, newContent) => {
    if (!fileName) return;
    setProjectFiles(prev => {
      if (!prev) return [];
      return prev.map(file => 
        file.name === fileName ? { ...file, content: newContent } : file
      );
    });
    triggerHaptic();
  }, []);

  const executeAICommand = async (commandType, payload) => {
    triggerHaptic();
    switch(commandType) {
      case 'ADD_COMPONENT':
        if (payload.xml) updateFile("activity_main.xml", payload.xml);
        if (payload.kotlin) updateFile("MainActivity.kt", payload.kotlin);
        break;
      case 'CREATE_PAGE':
        const newFileName = `${payload.name}Activity.kt`;
        setProjectFiles(prev => [...prev, { name: newFileName, path: "app/src/main/java/", content: payload.content }]);
        break;
    }
  };

  useEffect(() => {
    // Safe viewport height calculation
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // --- RENDER GUARDRAIL ---
  if (!projectFiles) {
    return <div className="h-screen w-screen bg-[#020617] text-white flex items-center justify-center">Loading VFS...</div>;
  }

  return (
    <div 
      className="flex flex-col w-full bg-[#020617] text-slate-300 font-sans overflow-hidden fixed inset-0" 
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* HEADER: Passing empty handlers to prevent crashes if modals don't exist */}
      <Header 
        project={project}
        triggerHaptic={triggerHaptic}
        onImportClick={() => console.log("Import clicked")}
        onCloneClick={() => console.log("Clone clicked")}
        onShareClick={() => console.log("Share clicked")}
        onProfileClick={() => console.log("Profile clicked")}
      />

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        <NavigationRail 
            activeView={activeView} 
            setActiveView={setActiveView} 
            onExit={() => router.push('/dashboard')}
            triggerHaptic={triggerHaptic}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative overflow-hidden">
          {activeView === 'chat' && (
             <ChatInterface 
                messages={messages} 
                setMessages={setMessages}
                projectFiles={projectFiles} 
                onExecute={executeAICommand} 
                setPreviewMode={(mode) => { setPreviewMode(mode); setActiveView('preview'); }}
                triggerHaptic={triggerHaptic}
             />
          )}

          {activeView === 'files' && <FileExplorer files={projectFiles} />}

          {activeView === 'preview' && (
             <PreviewPane 
                projectFiles={projectFiles} 
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                onResolveChange={(fileName, content) => updateFile(fileName, content)}
                triggerHaptic={triggerHaptic}
             />
          )}

          {/* Placeholders for disabled views */}
          {(activeView !== 'chat' && activeView !== 'files' && activeView !== 'preview') && (
            <div className="flex-1 flex items-center justify-center text-slate-500">
                View Disabled in Safe Mode
            </div>
          )}
        </main>
      </div>
      <div className="h-[1px] w-full bg-blue-500/20 shrink-0 z-[100]" />
    </div>
  );
}