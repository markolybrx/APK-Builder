"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, X, Settings } from "lucide-react"; 

// --- CORE COMPONENTS ---
import NavigationRail from "./components/NavigationRail";
import Header from "./components/Header";
import ChatInterface from "./components/ChatInterface"; // UNCOMMENTED
import FileExplorer from "./components/FileExplorer";   // UNCOMMENTED

// --- TEMPORARILY DISABLED ---
// import PreviewPane from "./components/PreviewPane";
// import LogicMapView from "./components/LogicMapView";

export default function WorkspaceUI({ project }) {
  const router = useRouter();
  const [activeView, setActiveView] = useState('chat'); 
  const [previewMode, setPreviewMode] = useState('live'); 

  // --- 1. INITIALIZE VFS ---
  const [projectFiles, setProjectFiles] = useState([
    { name: "MainActivity.kt", path: "app/src/main/java/", content: "package com.example.app\n\nimport android.os.Bundle\nimport androidx.appcompat.app.AppCompatActivity\n\nclass MainActivity : AppCompatActivity() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_main)\n    }\n}" },
    { name: "activity_main.xml", path: "app/src/main/res/layout/", content: "<?xml version='1.0' encoding='utf-8'?>\n<LinearLayout xmlns:android='http://schemas.android.com/apk/res/android' android:layout_width='match_parent' android:layout_height='match_parent' android:orientation='vertical' android:gravity='center'>\n    <TextView android:text='Phase 2 Active' android:textSize='24sp' android:layout_width='wrap_content' android:layout_height='wrap_content' />\n</LinearLayout>" },
    { name: "AndroidManifest.xml", path: "app/src/main/", content: "<?xml version='1.0' encoding='utf-8'?>\n<manifest xmlns:android='http://schemas.android.com/apk/res/android' package='com.visionary.app'>\n</manifest>" }
  ]);

  const [messages, setMessages] = useState([
    { role: 'ai', text: `System Online. VFS linked for "${project?.name || 'New Project'}".` },
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

  return (
    <div className="flex flex-col w-full h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden fixed inset-0">
      
      <Header 
        project={project}
        triggerHaptic={triggerHaptic}
        onImportClick={() => console.log("Import")}
        onCloneClick={() => console.log("Clone")}
        onShareClick={() => console.log("Share")}
        onProfileClick={() => console.log("Profile")}
      />

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        <NavigationRail 
            activeView={activeView} 
            setActiveView={setActiveView} 
            onExit={() => router.push('/dashboard')}
            triggerHaptic={triggerHaptic}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative overflow-hidden">
          
          {/* ACTIVE VIEW LOGIC */}
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

          {/* Placeholders for disabled views */}
          {(activeView !== 'chat' && activeView !== 'files') && (
            <div className="flex-1 flex items-center justify-center text-slate-500 font-mono">
                [View Disabled: Logic/Preview]
            </div>
          )}
        </main>
      </div>
    </div>
  );
}