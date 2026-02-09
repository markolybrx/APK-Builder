"use client";

import { useState, useEffect } from "react";
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
import DebuggerView from "./components/DebuggerView"; // NEW: AI Debugger

export default function WorkspaceUI({ project }) {
  const router = useRouter();

  // --- 1. GLOBAL FILE SYSTEM STATE (Source of Truth) ---
  const [projectFiles, setProjectFiles] = useState([
    { name: "MainActivity.kt", path: "app/src/main/java/", content: "// Welcome to AppBuild AI\n// Your generated code will appear here." },
    { name: "activity_main.xml", path: "app/src/main/res/layout/", content: "\n<LinearLayout />" },
    { name: "AndroidManifest.xml", path: "app/src/main/", content: "<?xml version='1.0' encoding='utf-8'?>\n<manifest />" }
  ]);

  // --- VIEW & TOUR STATE ---
  const [activeView, setActiveView] = useState('chat'); 
  const [previewMode, setPreviewMode] = useState('live'); 
  const [showTour, setShowTour] = useState(true); 

  // --- MODAL & OVERLAY STATE ---
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false); 
  const [isCloneOpen, setIsCloneOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- JARVIS LAYER STATE ---
  const [pendingAIChange, setPendingAIChange] = useState(null); 
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm ready to build "${project?.name || 'your app'}".` },
  ]);

  // --- UTILS ---
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  // --- 2. GLOBAL FILE UPDATE FUNCTION (The Brain Connection) ---
  const updateFile = (fileName, newContent) => {
    setProjectFiles(prev => prev.map(file => 
      file.name === fileName ? { ...file, content: newContent } : file
    ));
    triggerHaptic();
  };

  const handleLogicUpdate = (log) => {
    updateFile("AndroidManifest.xml", `\n${log}`);
    setMessages(prev => [...prev, { 
      role: 'ai', 
      text: `✅ System: I've updated your app navigation logic based on the map.` 
    }]);
  };

  // --- LAYOUT ENGINE Fix ---
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExitConfirm = () => {
    triggerHaptic();
    router.push('/dashboard');
  };

  const handleCloneSuccess = () => {
    updateFile("activity_main.xml", "\n<RelativeLayout />");
    setMessages(prev => [...prev, { role: 'ai', text: "Screenshot analyzed! I've updated activity_main.xml with the matching layout." }]);
    setIsCloneOpen(false);
    setActiveView('preview');
  };

  return (
    <div 
      className="flex flex-col w-full bg-[#0f172a] text-slate-300 font-sans overflow-hidden fixed inset-0" 
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
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
          onExit={() => { setIsExitModalOpen(true); triggerHaptic(); }}
          triggerHaptic={triggerHaptic}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative overflow-hidden">
          {activeView === 'chat' && (
             <ChatInterface 
                messages={messages} 
                setMessages={setMessages}
                onUpdateFile={updateFile} 
                setPreviewMode={(mode) => { setPreviewMode(mode); setActiveView('preview'); }}
                onAIChange={(change) => { setPendingAIChange(change); setActiveView('preview'); }}
                triggerHaptic={triggerHaptic}
             />
          )}

          {activeView === 'logic' && (
             <LogicMapView 
                triggerHaptic={triggerHaptic} 
                onLogicUpdate={handleLogicUpdate}
             />
          )}

          {activeView === 'files' && (
             <FileExplorer files={projectFiles} /> 
          )}

          {activeView === 'preview' && (
             <PreviewPane 
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                pendingChange={pendingAIChange}
                onResolveChange={(logic) => {
                    if (logic) updateFile("MainActivity.kt", logic);
                    setPendingAIChange(null);
                }}
                triggerHaptic={triggerHaptic}
             />
          )}

          {/* NEW: DEBUGGER VIEW INTEGRATION */}
          {activeView === 'debug' && (
             <DebuggerView 
                files={projectFiles} 
                onUpdateFile={updateFile} 
                triggerHaptic={triggerHaptic} 
             />
          )}

          {activeView === 'terminal' && <Terminal project={project} triggerHaptic={triggerHaptic} />}
          {activeView === 'history' && <HistoryView triggerHaptic={triggerHaptic} />}
          {activeView === 'settings' && <SettingsView project={project} triggerHaptic={triggerHaptic} />}
        </main>

        {/* --- PROFILE OVERLAY --- */}
        {isProfileOpen && (
           <>
             <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[100]" onClick={() => setIsProfileOpen(false)} />
             <div className="absolute top-0 right-0 bottom-0 w-72 bg-slate-900 border-l border-slate-800 shadow-2xl z-[110] flex flex-col">
                <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 font-bold text-white">
                   Profile
                   <button onClick={() => setIsProfileOpen(false)} className="p-1"><X className="w-5 h-5" /></button>
                </div>
                {/* Profile content... */}
             </div>
           </>
        )}
      </div>

      {/* --- FLOATING MODALS --- */}
      <RepoConverter 
        isOpen={isConverterOpen} 
        onClose={() => setIsConverterOpen(false)} 
        onUpdateFile={updateFile} // Enabled logic for real conversion
        triggerHaptic={triggerHaptic} 
      />
      <CloneVision isOpen={isCloneOpen} onClose={() => setIsCloneOpen(false)} triggerHaptic={triggerHaptic} onCloneSuccess={handleCloneSuccess} />
      <QRShareModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} triggerHaptic={triggerHaptic} />
      {showTour && <WelcomeTour onComplete={() => setShowTour(false)} triggerHaptic={triggerHaptic} />}

      {/* EXIT DIALOG */}
      {isExitModalOpen && (
        <div className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-white mb-2">Exit Workspace?</h3>
            <div className="flex gap-3">
              <button onClick={() => setIsExitModalOpen(false)} className="flex-1 py-3 text-slate-300 font-bold bg-slate-800 rounded-xl">Cancel</button>
              <button onClick={handleExitConfirm} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl">Yes, Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
