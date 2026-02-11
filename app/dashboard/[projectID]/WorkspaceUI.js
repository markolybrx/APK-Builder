"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, X, Settings, LogOut } from "lucide-react"; 

// --- 1. CORE COMPONENTS ---
import NavigationRail from "./components/NavigationRail";
import Header from "./components/Header";
import ChatInterface from "./components/ChatInterface";
import FileExplorer from "./components/FileExplorer";
import PreviewPane from "./components/PreviewPane";
import LogicMapView from "./components/LogicMapView"; 

// --- 2. VISIONARY TOOLS ---
import RepoConverter from "./components/RepoConverter";
import CloneVision from "./components/CloneVision";
import QRShareModal from "./components/QRShareModal";
import WelcomeTour from "./components/WelcomeTour";
import Terminal from "./components/Terminal";

// --- NEW FEATURES ACTIVATED ---
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
    },
    { 
      name: "AndroidManifest.xml", 
      path: "app/src/main/", 
      content: "<?xml version='1.0' encoding='utf-8'?>\n<manifest xmlns:android='http://schemas.android.com/apk/res/android' package='com.visionary.app'>\n</manifest>" 
    }
  ]);

  const [activeView, setActiveView] = useState('chat'); 
  const [previewMode, setPreviewMode] = useState('live'); 
  const [showTour, setShowTour] = useState(false); 
  const [saveStatus, setSaveStatus] = useState('idle'); 

  // --- 5. MODAL STATES ---
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Feature Modals
  const [isConverterOpen, setIsConverterOpen] = useState(false); 
  const [isCloneOpen, setIsCloneOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAssetAlchemistOpen, setIsAssetAlchemistOpen] = useState(false);
  const [isBehaviorRecorderOpen, setIsBehaviorRecorderOpen] = useState(false);
  const [isContextualLensOpen, setIsContextualLensOpen] = useState(false);
  const [isDesignCritiqueOpen, setIsDesignCritiqueOpen] = useState(false);
  const [isSensorBridgeOpen, setIsSensorBridgeOpen] = useState(false);

  const [messages, setMessages] = useState([
    { role: 'ai', text: `System Online. VFS linked for "${project?.name || 'New Project'}". Ready for commands.` },
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
          body: JSON.stringify({ 
            projectId: project._id,
            files: projectFiles 
          })
        });

        if (res.ok) {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } else {
            setSaveStatus('error');
        }
      } catch (err) {
        console.error("Auto-Save Failed:", err);
        setSaveStatus('error');
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [projectFiles, project?._id]);


  // --- 7. HARDWARE BRIDGE ---
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  // --- 8. REACTIVE FILE SYSTEM ---
  const updateFile = useCallback((fileName, newContent) => {
    if (!fileName) return;
    setProjectFiles(prev => {
      if (!prev) return [];
      const exists = prev.find(f => f.name === fileName);
      if (exists) {
          return prev.map(file => file.name === fileName ? { ...file, content: newContent } : file);
      }
      const defaultPath = fileName.endsWith('.xml') ? "app/src/main/res/layout/" : "app/src/main/java/";
      return [...prev, { name: fileName, content: newContent, path: defaultPath }];
    });
    triggerHaptic();
  }, []);

  // --- 9. AI AGENT HANDLERS ---
  const executeAICommand = async (commandType, payload) => {
    triggerHaptic();
    switch(commandType) {
      case 'UPDATE_FILE':
        updateFile(payload.name, payload.content);
        break;
      case 'ADD_COMPONENT':
        if (payload.xml) updateFile("activity_main.xml", payload.xml);
        if (payload.kotlin) updateFile("MainActivity.kt", payload.kotlin);
        break;
      case 'CREATE_PAGE':
        const newFileName = payload.name.includes('.') ? payload.name : `${payload.name}Activity.kt`;
        updateFile(newFileName, payload.content);
        break;
      
      // NEW: Feature Triggers via Chat
      case 'OPEN_CLONE_VISION': setIsCloneOpen(true); break;
      case 'OPEN_ASSET_ALCHEMIST': setIsAssetAlchemistOpen(true); break;
      case 'OPEN_DESIGN_CRITIQUE': setIsDesignCritiqueOpen(true); break;
      case 'OPEN_SENSOR_BRIDGE': setIsSensorBridgeOpen(true); break;
      case 'OPEN_BEHAVIOR_RECORDER': setIsBehaviorRecorderOpen(true); break;
    }
  };

  const handleLogicUpdate = (log) => {
    const manifestFile = projectFiles.find(f => f.name === "AndroidManifest.xml");
    if (manifestFile) {
        const updatedManifest = manifestFile.content.replace("</manifest>", `${log}\n</manifest>`);
        updateFile("AndroidManifest.xml", updatedManifest);
    }
  };

  // --- 10. VIEWPORT FIX ---
  useEffect(() => {
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

  // --- 11. RENDER GUARDRAIL ---
  if (!projectFiles) {
    return <div className="h-screen w-screen bg-black text-zinc-500 flex items-center justify-center animate-pulse font-mono text-sm">INITIALIZING NEURAL LINK...</div>;
  }

  return (
    <div 
      className="flex flex-col w-full bg-black text-zinc-300 font-sans overflow-hidden fixed inset-0 selection:bg-pink-500/30" 
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* HEADER */}
      <Header 
        project={project}
        saveStatus={saveStatus} 
        triggerHaptic={triggerHaptic}
        onImportClick={() => { setIsConverterOpen(true); triggerHaptic(); }}
        onCloneClick={() => { setIsCloneOpen(true); triggerHaptic(); }}
        onShareClick={() => { setIsQRModalOpen(true); triggerHaptic(); }}
        onProfileClick={() => { setIsProfileOpen(true); triggerHaptic(); }}
        // NEW Handlers
        onAssetClick={() => { setIsAssetAlchemistOpen(true); triggerHaptic(); }}
      />

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        <NavigationRail 
            activeView={activeView} 
            setActiveView={setActiveView} 
            onExit={() => setIsExitModalOpen(true)}
            triggerHaptic={triggerHaptic}
            // Feature Triggers
            onOpenDesignCritique={() => setIsDesignCritiqueOpen(true)}
            onOpenSensorBridge={() => setIsSensorBridgeOpen(true)}
            onOpenBehaviorRecorder={() => setIsBehaviorRecorderOpen(true)}
            onOpenContextualLens={() => setIsContextualLensOpen(true)}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-black relative overflow-hidden border-l border-zinc-800">

          {/* VIEW ROUTER */}
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

          {activeView === 'files' && <FileExplorer files={projectFiles} />}

          {activeView === 'terminal' && <Terminal project={project} triggerHaptic={triggerHaptic} />}

          {activeView === 'preview' && (
             <PreviewPane 
                projectFiles={projectFiles} 
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                onResolveChange={(fileName, content) => updateFile(fileName, content)}
                triggerHaptic={triggerHaptic}
             />
          )}

          {activeView === 'history' && <HistoryView triggerHaptic={triggerHaptic} />}

          {activeView === 'settings' && <SettingsView project={project} triggerHaptic={triggerHaptic} />}

          {activeView === 'debug' && <DebuggerView files={projectFiles} onUpdateFile={updateFile} triggerHaptic={triggerHaptic} />}

        </main>
      </div>

      {/* HORIZON LINE - The Neon Gradient Pulse */}
      <div className="h-[1px] w-full bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-blue-500/50 shrink-0 z-[100] shadow-[0_0_15px_rgba(236,72,153,0.3)]" />

      {/* --- OVERLAYS & MODALS --- */}
      <RepoConverter isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} onUpdateFile={updateFile} triggerHaptic={triggerHaptic} />
      <CloneVision isOpen={isCloneOpen} onClose={() => setIsCloneOpen(false)} triggerHaptic={triggerHaptic} />
      <QRShareModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} triggerHaptic={triggerHaptic} />
      
      {/* NEW FEATURES */}
      <AssetAlchemist isOpen={isAssetAlchemistOpen} onClose={() => setIsAssetAlchemistOpen(false)} onUpdateFile={updateFile} triggerHaptic={triggerHaptic} />
      <BehaviorRecorder isOpen={isBehaviorRecorderOpen} onClose={() => setIsBehaviorRecorderOpen(false)} onUpdateFile={updateFile} triggerHaptic={triggerHaptic} />
      <ContextualLens isOpen={isContextualLensOpen} onClose={() => setIsContextualLensOpen(false)} projectFiles={projectFiles} triggerHaptic={triggerHaptic} />
      <DesignCritique isOpen={isDesignCritiqueOpen} onClose={() => setIsDesignCritiqueOpen(false)} projectFiles={projectFiles} onUpdateFile={updateFile} triggerHaptic={triggerHaptic} />
      <SensorBridge isOpen={isSensorBridgeOpen} onClose={() => setIsSensorBridgeOpen(false)} onUpdateFile={updateFile} triggerHaptic={triggerHaptic} />

      {/* ONBOARDING TOUR */}
      {showTour && <WelcomeTour onComplete={() => setShowTour(false)} triggerHaptic={triggerHaptic} />}

      {/* PROFILE DRAWER */}
      {isProfileOpen && (
           <>
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setIsProfileOpen(false)} />
             <div className="absolute top-0 right-0 bottom-0 w-72 bg-black border-l border-zinc-800 shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300">
                <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0 font-bold text-white bg-zinc-900/30">
                   User Profile
                   <button onClick={() => setIsProfileOpen(false)} className="p-1 text-zinc-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-black border border-zinc-800 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.2)] p-1 relative">
                       <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full opacity-20" />
                       <User className="w-8 h-8 text-zinc-200 relative z-10" />
                    </div>
                    <h3 className="font-bold text-white text-lg">Visionary Dev</h3>
                    <div className="mt-2 px-3 py-1 bg-gradient-to-r from-pink-500/10 to-blue-500/10 border border-pink-500/20 rounded-full">
                       <p className="text-[10px] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 font-bold uppercase tracking-wide">Pro Tier Active</p>
                    </div>
                </div>
                <div className="mt-auto p-6 border-t border-zinc-800">
                    <button onClick={() => router.push('/login')} className="flex items-center gap-3 w-full p-3 rounded-xl bg-zinc-900/50 hover:bg-red-500/10 hover:text-red-400 text-zinc-400 transition-all text-sm font-medium">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
             </div>
           </>
      )}

      {/* EXIT DIALOG */}
      {isExitModalOpen && (
        <div className="absolute inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-white mb-2">Exit Workspace?</h3>
            <p className="text-sm text-zinc-500 mb-6">Unsaved changes will be automatically synced.</p>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setIsExitModalOpen(false)} className="flex-1 py-3 text-zinc-300 font-bold bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors text-sm">Cancel</button>
              <button onClick={() => { triggerHaptic(); router.push('/dashboard'); }} className="flex-1 py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-600/50 text-red-500 font-bold rounded-xl transition-colors shadow-lg text-sm">Yes, Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
