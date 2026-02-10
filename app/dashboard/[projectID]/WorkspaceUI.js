"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, X } from "lucide-react"; // Removed unused imports

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
  const [projectFiles, setProjectFiles] = useState([
    { name: "MainActivity.kt", path: "app/src/main/java/", content: "// Initialized\npackage com.example.app\n\nimport android.os.Bundle\nimport androidx.appcompat.app.AppCompatActivity\n\nclass MainActivity : AppCompatActivity() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_main)\n    }\n}" },
    { name: "activity_main.xml", path: "app/src/main/res/layout/", content: "<?xml version='1.0' encoding='utf-8'?>\n<LinearLayout xmlns:android='http://schemas.android.com/apk/res/android' android:layout_width='match_parent' android:layout_height='match_parent' android:orientation='vertical' android:gravity='center'>\n    <TextView android:text='Hello World!' android:layout_width='wrap_content' android:layout_height='wrap_content' />\n</LinearLayout>" },
    { name: "AndroidManifest.xml", path: "app/src/main/", content: "<?xml version='1.0' encoding='utf-8'?>\n<manifest xmlns:android='http://schemas.android.com/apk/res/android' package='com.visionary.app'>\n</manifest>" }
  ]);

  const [activeView, setActiveView] = useState('chat'); 
  const [previewMode, setPreviewMode] = useState('live'); 
  const [showTour, setShowTour] = useState(false); 

  // --- MODAL STATES ---
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
  if (!projectFiles || projectFiles.length === 0) {
    return <div className="h-screen w-screen bg-[#020617] flex items-center justify-center font-mono text-blue-500 animate-pulse text-xs">RECONSTRUCTING VFS...</div>;
  }

  const handleExitConfirm = () => {
    triggerHaptic();
    router.push('/dashboard');
  };

  return (
    <div 
      className="flex flex-col w-full bg-[#020617] text-slate-300 font-sans overflow-hidden fixed inset-0" 
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* HEADER: NOW FULLY CONNECTED */}
      <Header 
        project={project}
        triggerHaptic={triggerHaptic}
        onImportClick={() => { setIsConverterOpen(true); triggerHaptic(); }}
        onCloneClick={() => { setIsCloneOpen(true); triggerHaptic(); }}
        onShareClick={() => { setIsQRModalOpen(true); triggerHaptic(); }}
        onProfileClick={() => { setIsProfileOpen(true); triggerHaptic(); }}
      />

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        <NavigationRail 
            activeView={activeView} 
            setActiveView={setActiveView} 
            onExit={() => setIsExitModalOpen(true)}
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

      {/* HORIZON FOOTER */}
      <div className="h-[1px] w-full bg-blue-500/20 shrink-0 z-[100] shadow-[0_0_10px_rgba(59,130,246,0.1)]" />

      {/* --- OVERLAYS --- */}
      <RepoConverter isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} onUpdateFile={updateFile} triggerHaptic={triggerHaptic} />
      <CloneVision isOpen={isCloneOpen} onClose={() => setIsCloneOpen(false)} triggerHaptic={triggerHaptic} />
      <QRShareModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} triggerHaptic={triggerHaptic} />
      {showTour && <WelcomeTour onComplete={() => setShowTour(false)} triggerHaptic={triggerHaptic} />}

      {/* PROFILE DRAWER */}
      {isProfileOpen && (
           <>
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setIsProfileOpen(false)} />
             <div className="absolute top-0 right-0 bottom-0 w-72 bg-[#020617] border-l border-slate-800 shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300">
                <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 font-bold text-white">
                   User Profile
                   <button onClick={() => setIsProfileOpen(false)} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-slate-900 border border-blue-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                       <User className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white text-lg">Visionary Dev</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">PRO TIER ACTIVE</p>
                </div>
             </div>
           </>
      )}

      {/* EXIT DIALOG */}
      {isExitModalOpen && (
        <div className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-white mb-2">Exit Workspace?</h3>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsExitModalOpen(false)} className="flex-1 py-3 text-slate-300 font-bold bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleExitConfirm} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-600/20">Yes, Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}