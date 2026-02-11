"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, X, LogOut } from "lucide-react"; 

// --- 1. CORE COMPONENTS ---
import NavigationRail from "./components/NavigationRail";
import Header from "./components/Header";
import ChatInterface from "./components/ChatInterface";
import FileExplorer from "./components/FileExplorer";
import PreviewPane from "./components/PreviewPane";
import LogicMapView from "./components/LogicMapView"; 

// --- 2. VISIONARY TOOLS & MENU ---
import ActionOrbMenu from "./components/visionary/ActionOrbMenu"; // NEW HUB
import RepoConverter from "./components/RepoConverter";
import CloneVision from "./components/CloneVision";
import QRShareModal from "./components/QRShareModal";
import WelcomeTour from "./components/WelcomeTour";
import Terminal from "./components/Terminal";
import AssetAlchemist from "./components/AssetAlchemist";
import BehaviorRecorder from "./components/BehaviorRecorder";
import ContextualLens from "./components/ContextualLens";
import DesignCritique from "./components/DesignCritique";
import SensorBridge from "./components/SensorBridge";

// --- 3. SYSTEM INTERNALS ---
import HistoryView from "./components/HistoryView";
import SettingsView from "./components/SettingsView";
import DebuggerView from "./components/DebuggerView"; 

export default function WorkspaceUI({ project }) {
  const router = useRouter();

  // --- 4. INITIAL VFS STATE ---
  const [projectFiles, setProjectFiles] = useState(project?.files || [
    { 
      name: "MainActivity.kt", 
      path: "app/src/main/java/", 
      content: "package com.example.app\n\nimport android.os.Bundle\nimport androidx.appcompat.app.AppCompatActivity\n\nclass MainActivity : AppCompatActivity() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_main)\n    }\n}" 
    },
    { 
      name: "activity_main.xml", 
      path: "app/src/main/res/layout/", 
      content: "<?xml version='1.0' encoding='utf-8'?>\n<LinearLayout xmlns:android='http://schemas.android.com/apk/res/android' android:layout_width='match_parent' android:layout_height='match_parent' android:orientation='vertical' android:gravity='center'>\n    <TextView android:text='Visionary OS Online' android:textSize='24sp' android:layout_width='wrap_content' android:layout_height='wrap_content' />\n    <Button android:id='@+id/btn_start' android:text='Initialize' android:layout_width='wrap_content' android:layout_height='wrap_content' android:layout_marginTop='20dp' />\n</LinearLayout>" 
    }
  ]);

  const [activeView, setActiveView] = useState('chat'); 
  const [previewMode, setPreviewMode] = useState('live'); 
  const [saveStatus, setSaveStatus] = useState('idle'); 

  // --- 5. MODAL & HUB STATES ---
  const [isOrbOpen, setIsOrbOpen] = useState(false); // Action Orb Hub
  const [activeTool, setActiveTool] = useState(null); // Central Tool State
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  const [messages, setMessages] = useState([
    { role: 'ai', text: `Neural Link Active. Workspace synchronized for "${project?.name || 'New Project'}".` },
  ]);

  // --- 6. AUTO-SAVE SYSTEM ---
  useEffect(() => {
    if (!project?._id || project.isDemo) return;
    const saveTimer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const res = await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: project._id, files: projectFiles })
        });
        if (res.ok) {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } else { setSaveStatus('error'); }
      } catch (err) { setSaveStatus('error'); }
    }, 2000);
    return () => clearTimeout(saveTimer);
  }, [projectFiles, project?._id]);

  // --- 7. CORE UTILITIES ---
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  const updateFile = useCallback((fileName, newContent) => {
    if (!fileName) return;
    setProjectFiles(prev => {
      const exists = prev.find(f => f.name === fileName);
      if (exists) return prev.map(file => file.name === fileName ? { ...file, content: newContent } : file);
      const defaultPath = fileName.endsWith('.xml') ? "app/src/main/res/layout/" : "app/src/main/java/";
      return [...prev, { name: fileName, content: newContent, path: defaultPath }];
    });
    triggerHaptic();
  }, []);

  const handleTriggerTool = (toolId) => {
    setActiveTool(toolId);
    setIsOrbOpen(false);
    triggerHaptic();
  };

  const executeAICommand = async (commandType, payload) => {
    triggerHaptic();
    switch(commandType) {
      case 'UPDATE_FILE': updateFile(payload.name, payload.content); break;
      case 'OPEN_TOOL': setActiveTool(payload.toolId); break; // AI can now open Orb tools
      case 'CREATE_PAGE':
        const newFileName = payload.name.includes('.') ? payload.name : `${payload.name}Activity.kt`;
        updateFile(newFileName, payload.content);
        break;
    }
  };

  return (
    <div className="flex flex-col w-full bg-black text-zinc-300 fixed inset-0 selection:bg-pink-500/30" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      <Header 
        project={project}
        saveStatus={saveStatus} 
        onShareClick={() => setIsQRModalOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <NavigationRail 
            activeView={activeView} 
            setActiveView={setActiveView} 
            onOpenOrb={() => setIsOrbOpen(true)} // Launcher Trigger
            onExit={() => setIsExitModalOpen(true)}
            triggerHaptic={triggerHaptic}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-black relative overflow-hidden border-l border-zinc-800">
          {activeView === 'chat' && <ChatInterface messages={messages} setMessages={setMessages} projectFiles={projectFiles} onExecute={executeAICommand} />}
          {activeView === 'logic' && <LogicMapView projectFiles={projectFiles} triggerHaptic={triggerHaptic} />}
          {activeView === 'files' && <FileExplorer files={projectFiles} />}
          {activeView === 'terminal' && <Terminal project={project} />}
          {activeView === 'preview' && <PreviewPane projectFiles={projectFiles} previewMode={previewMode} setPreviewMode={setPreviewMode} />}
          {activeView === 'history' && <HistoryView triggerHaptic={triggerHaptic} />}
          {activeView === 'settings' && <SettingsView project={project} />}
          {activeView === 'debug' && <DebuggerView files={projectFiles} onUpdateFile={updateFile} />}
        </main>
      </div>

      {/* --- OVERLAYS --- */}
      <ActionOrbMenu isOpen={isOrbOpen} onClose={() => setIsOrbOpen(false)} onTriggerTool={handleTriggerTool} triggerHaptic={triggerHaptic} />
      
      {/* Dynamic Tool Rendering */}
      {activeTool === 'asset-alchemist' && <AssetAlchemist isOpen={true} onClose={() => setActiveTool(null)} onUpdateFile={updateFile} />}
      {activeTool === 'clone-vision' && <CloneVision isOpen={true} onClose={() => setActiveTool(null)} />}
      {activeTool === 'behavior-recorder' && <BehaviorRecorder isOpen={true} onClose={() => setActiveTool(null)} onUpdateFile={updateFile} />}
      {activeTool === 'contextual-lens' && <ContextualLens isOpen={true} onClose={() => setActiveTool(null)} projectFiles={projectFiles} />}
      {activeTool === 'design-critique' && <DesignCritique isOpen={true} onClose={() => setActiveTool(null)} projectFiles={projectFiles} onUpdateFile={updateFile} />}
      {activeTool === 'sensor-bridge' && <SensorBridge isOpen={true} onClose={() => setActiveTool(null)} onUpdateFile={updateFile} />}

      <QRShareModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
      <RepoConverter isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} onUpdateFile={updateFile} />
    </div>
  );
}
