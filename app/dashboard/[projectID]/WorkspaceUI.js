"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, User, Settings, CreditCard, LogOut, X } from "lucide-react";

// --- CORE COMPONENTS ---
import NavigationRail from "./components/NavigationRail";
import ChatInterface from "./components/ChatInterface";
import FileExplorer from "./components/FileExplorer";
import PreviewPane from "./components/PreviewPane";
import Terminal from "./components/Terminal";
import Header from "./components/Header";
import HistoryView from "./components/HistoryView";
import SettingsView from "./components/SettingsView";

// --- ADVANCED LAYERS ---
import RepoConverter from "./components/RepoConverter";
import CloneVision from "./components/CloneVision";
import QRShareModal from "./components/QRShareModal";
import LogicMapView from "./components/LogicMapView";
import WelcomeTour from "./components/WelcomeTour";
import DebuggerView from "./components/DebuggerView"; 

export default function WorkspaceUI({ project }) {
  const router = useRouter();

  // --- GUARDRAIL: INITIAL VFS STATE ---
  // Ensuring these always exist prevents undefined errors in the Parser
  const [projectFiles, setProjectFiles] = useState([
    { name: "MainActivity.kt", path: "app/src/main/java/", content: "// Initialized\nclass MainActivity : AppCompatActivity() {}" },
    { name: "activity_main.xml", path: "app/src/main/res/layout/", content: "<?xml version='1.0' encoding='utf-8'?>\n<LinearLayout xmlns:android='http://schemas.android.com/apk/res/android' android:layout_width='match_parent' android:layout_height='match_parent' android:orientation='vertical' android:padding='16dp'></LinearLayout>" },
    { name: "AndroidManifest.xml", path: "app/src/main/", content: "<?xml version='1.0' encoding='utf-8'?>\n<manifest xmlns:android='http://schemas.android.com/apk/res/android' package='com.visionary.app'>\n</manifest>" }
  ]);

  const [activeView, setActiveView] = useState('chat'); 
  const [previewMode, setPreviewMode] = useState('live'); 
  const [showTour, setShowTour] = useState(false); 

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false); 
  const [isCloneOpen, setIsCloneOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [messages, setMessages] = useState([
    { role: 'ai', text: `VFS initialized for "${project?.name || 'new app'}". Ready for commands.` },
  ]);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  // --- RECONSTRUCTED REACTIVE UPDATE LOOP ---
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
      default:
        console.warn("AI System Error: Unrecognized Command", commandType);
    }
  };

  const handleLogicUpdate = (log) => {
    const manifestFile = projectFiles.find(f => f.name === "AndroidManifest.xml");
    if (manifestFile) {
        const updatedManifest = manifestFile.content.replace("</manifest>", `${log}\n</manifest>`);
        updateFile("AndroidManifest.xml", updatedManifest);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- RENDER GUARDRAIL ---
  // Prevents the "Client-side Exception" by waiting for VFS availability
  if (!projectFiles || projectFiles.length === 0) {
    return <div className="h-screen w-screen bg-[#020617] flex items-center justify-center font-mono text-blue-500 animate-pulse text-xs">RECONSTRUCTING VFS...</div>;
  }

  return (
    <div 
      className="flex flex-col w-full bg-[#020617] text-slate-300 font-sans overflow-hidden fixed inset-0" 
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <Header project={project} onProfileClick={() => setIsProfileOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        <NavigationRail activeView={activeView} setActiveView={setActiveView} />

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

          {activeView === 'logic' && (
             <LogicMapView 
                projectFiles={projectFiles} 
                onLogicUpdate={handleLogicUpdate}
                triggerHaptic={triggerHaptic} 
             />
          )}

          {activeView === 'files' && (
             <FileExplorer files={projectFiles} /> 
          )}

          {activeView === 'preview' && (
             <PreviewPane 
                projectFiles={projectFiles} 
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                onResolveChange={(fileName, content) => updateFile(fileName, content)}
                triggerHaptic={triggerHaptic}
             />
          )}

          {activeView === 'debug' && <DebuggerView files={projectFiles} onUpdateFile={updateFile} triggerHaptic={triggerHaptic} />}
          {activeView === 'terminal' && <Terminal project={project} triggerHaptic={triggerHaptic} />}
          {activeView === 'history' && <HistoryView triggerHaptic={triggerHaptic} />}
          {activeView === 'settings' && <SettingsView project={project} triggerHaptic={triggerHaptic} />}
        </main>
      </div>

      <div className="h-[1px] w-full bg-blue-500/20 shrink-0 z-[100] shadow-[0_0_10px_rgba(59,130,246,0.1)]" />
    </div>
  );
}