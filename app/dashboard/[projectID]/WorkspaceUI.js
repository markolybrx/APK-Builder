"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, Code2, Smartphone, GitBranch, 
  Settings, Terminal as TerminalIcon
} from "lucide-react"; 

// --- 1. CORE CLUSTER ---
import ChatInterface from "./components/core/ChatInterface";
import FileExplorer from "./components/core/FileExplorer";
import PreviewPane from "./components/core/PreviewPane";
import Terminal from "./components/core/Terminal";

// --- 2. VISIONARY CLUSTER ---
import ActionOrbMenu from "./components/visionary/ActionOrbMenu"; 
import RepoConverter from "./components/visionary/RepoConverter";
import CloneVision from "./components/visionary/CloneVision";
import AssetAlchemist from "./components/visionary/AssetAlchemist";

// --- 3. LOGIC CLUSTER ---
import LogicMapView from "./components/logic/LogicMapView"; 
import BehaviorRecorder from "./components/logic/BehaviorRecorder";
import SensorBridge from "./components/logic/SensorBridge";

// --- 4. PROFESSIONAL CLUSTER ---
import ContextualLens from "./components/professional/ContextualLens";
import DesignCritique from "./components/professional/DesignCritique";

// --- 5. SHARED CLUSTER (SYSTEM INTERNALS) ---
import Header from "./components/shared/Header";
import HistoryView from "./components/shared/HistoryView";
import SettingsView from "./components/shared/SettingsView";
import DebuggerView from "./components/shared/DebuggerView"; 
import QRShareModal from "./components/shared/QRShareModal";

// --- NEW COMPONENT: TOP TAB NAVIGATION ---
const WorkspaceTabs = ({ activeView, setActiveView, triggerHaptic }) => {
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'files', label: 'Code', icon: Code2 },
    { id: 'preview', label: 'Preview', icon: Smartphone },
    { id: 'logic', label: 'Logic', icon: GitBranch },
    { id: 'terminal', label: 'Console', icon: TerminalIcon },
  ];

  return (
    <div className="h-10 border-b border-zinc-900 bg-black flex items-center px-4 gap-1 shrink-0 z-40 select-none">
      {tabs.map((tab) => {
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => { setActiveView(tab.id); triggerHaptic?.(); }}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all
              ${isActive 
                ? 'bg-zinc-800 text-zinc-100 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}
            `}
          >
            <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-pink-500' : 'text-zinc-600'}`} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default function WorkspaceUI({ project }) {
  const router = useRouter();

  // --- INITIAL VFS STATE ---
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

  // --- MODAL & HUB STATES ---
  const [isOrbOpen, setIsOrbOpen] = useState(false); 
  const [activeTool, setActiveTool] = useState(null); 
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- AUTO-SAVE SYSTEM ---
  useEffect(() => {
    if (!project?._id || project.isDemo) return;
    const saveTimer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        // Simulated Save Call
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (err) { setSaveStatus('error'); }
    }, 2000);
    return () => clearTimeout(saveTimer);
  }, [projectFiles, project?._id]);

  // --- CORE UTILITIES ---
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  const updateFile = useCallback((filesOrName, content) => {
    // Helper: Normalize to array
    const updates = Array.isArray(filesOrName) 
      ? filesOrName 
      : [{ name: filesOrName, content: content }];

    setProjectFiles(prev => {
      let newFiles = [...prev];
      updates.forEach(update => {
        const index = newFiles.findIndex(f => f.name === update.name);
        if (index >= 0) {
          newFiles[index] = { ...newFiles[index], content: update.content };
        } else {
          const defaultPath = update.name.endsWith('.xml') ? "app/src/main/res/layout/" : "app/src/main/java/";
          newFiles.push({ name: update.name, content: update.content, path: defaultPath });
        }
      });
      return newFiles;
    });
    triggerHaptic();
  }, []);

  const handleTriggerTool = (toolId) => {
    setActiveTool(toolId);
    setIsOrbOpen(false);
    triggerHaptic();
  };

  return (
    <div className="flex flex-col w-full h-screen bg-black text-zinc-300 fixed inset-0 overflow-hidden font-sans">
      
      {/* 1. GLOBAL HEADER */}
      <Header 
        project={project}
        saveStatus={saveStatus} 
        onShareClick={() => setIsQRModalOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onImportClick={() => setIsConverterOpen(true)}
        onCloneClick={() => setActiveTool('clone-vision')}
        triggerHaptic={triggerHaptic}
      />

      {/* 2. WORKSPACE TABS (Replaces Sidebar) */}
      <WorkspaceTabs 
        activeView={activeView} 
        setActiveView={setActiveView} 
        triggerHaptic={triggerHaptic} 
      />

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-black relative overflow-hidden">
        
        {/* VIEW SWITCHER */}
        {activeView === 'chat' && (
          <ChatInterface 
            projectFiles={projectFiles} 
            onUpdateFiles={updateFile} 
            triggerHaptic={triggerHaptic} 
          />
        )}
        
        {activeView === 'logic' && (
          <LogicMapView projectFiles={projectFiles} triggerHaptic={triggerHaptic} />
        )}
        
        {activeView === 'files' && (
          <FileExplorer files={projectFiles} />
        )}
        
        {activeView === 'terminal' && (
          <Terminal project={project} />
        )}
        
        {activeView === 'preview' && (
          <PreviewPane 
            projectFiles={projectFiles} 
            previewMode={previewMode} 
            setPreviewMode={setPreviewMode} 
            triggerHaptic={triggerHaptic}
          />
        )}
        
        {/* Utility Views */}
        {activeView === 'history' && <HistoryView triggerHaptic={triggerHaptic} />}
        {activeView === 'settings' && <SettingsView project={project} />}
      </div>

      {/* --- ACTIVE TOOL OVERLAYS --- */}
      {activeTool === 'asset-alchemist' && <AssetAlchemist isOpen={true} onClose={() => setActiveTool(null)} onUpdateFile={updateFile} />}
      {activeTool === 'clone-vision' && <CloneVision isOpen={true} onClose={() => setActiveTool(null)} />}
      {activeTool === 'behavior-recorder' && <BehaviorRecorder isOpen={true} onClose={() => setActiveTool(null)} onUpdateFile={updateFile} />}
      {activeTool === 'contextual-lens' && <ContextualLens isOpen={true} onClose={() => setActiveTool(null)} projectFiles={projectFiles} />}
      {activeTool === 'design-critique' && <DesignCritique isOpen={true} onClose={() => setActiveTool(null)} projectFiles={projectFiles} onUpdateFile={updateFile} />}
      {activeTool === 'sensor-bridge' && <SensorBridge isOpen={true} onClose={() => setActiveTool(null)} onUpdateFile={updateFile} />}

      {/* --- UTILITY MODALS --- */}
      <QRShareModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
      <RepoConverter isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} onUpdateFile={updateFile} />

    </div>
  );
}