"use client";

import { useState } from "react";
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

export default function WorkspaceUI({ project }) {
  const router = useRouter();

  // --- VIEW STATE ---
  const [activeView, setActiveView] = useState('chat'); 
  const [previewMode, setPreviewMode] = useState('live'); 

  // --- MODAL & OVERLAY STATE ---
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false); 
  const [isCloneOpen, setIsCloneOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- JARVIS LAYER STATE ---
  const [pendingAIChange, setPendingAIChange] = useState(null); // For Contextual Lens
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm ready to build "${project?.name || 'your app'}".` },
  ]);

  // --- UTILS ---
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  const handleExitConfirm = () => {
    triggerHaptic();
    router.push('/dashboard');
  };

  const handleConvertSuccess = () => {
    setMessages(prev => [...prev, { role: 'ai', text: "Repository imported successfully! I've converted the logic to Android. Check the Files tab." }]);
    setIsConverterOpen(false);
    setActiveView('files'); 
  };

  const handleCloneSuccess = () => {
    setMessages(prev => [...prev, { role: 'ai', text: "Screenshot analyzed! I've generated the matching XML layout for you." }]);
    setIsCloneOpen(false);
    setActiveView('preview');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f172a] text-slate-300 font-sans overflow-hidden fixed inset-0">

      {/* 1. HEADER (Now wired with all triggers) */}
      <Header 
        project={project}
        triggerHaptic={triggerHaptic}
        onImportClick={() => setIsConverterOpen(true)}
        onCloneClick={() => setIsCloneOpen(true)}
        onShareClick={() => setIsQRModalOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      {/* 2. WORKSPACE BODY */}
      <div className="flex flex-1 overflow-hidden relative">

        <NavigationRail 
          activeView={activeView} 
          setActiveView={setActiveView} 
          onExit={() => setIsExitModalOpen(true)}
          triggerHaptic={triggerHaptic}
        />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">

          {activeView === 'chat' && (
             <ChatInterface 
                messages={messages} 
                setMessages={setMessages}
                setPreviewMode={(mode) => { setPreviewMode(mode); setActiveView('preview'); }}
                onAIChange={(change) => { setPendingAIChange(change); setActiveView('preview'); }} // Contextual Lens Trigger
                triggerHaptic={triggerHaptic}
             />
          )}

          {activeView === 'logic' && <LogicMapView triggerHaptic={triggerHaptic} />}

          {activeView === 'files' && <FileExplorer />}

          {activeView === 'preview' && (
             <PreviewPane 
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                pendingChange={pendingAIChange} // Ghost UI layer
                onResolveChange={() => setPendingAIChange(null)}
                triggerHaptic={triggerHaptic}
             />
          )}

          {activeView === 'terminal' && (
             <div className="h-full w-full">
               <Terminal project={project} triggerHaptic={triggerHaptic} />
             </div>
          )}

          {activeView === 'history' && <HistoryView triggerHaptic={triggerHaptic} />}
          {activeView === 'settings' && <SettingsView project={project} triggerHaptic={triggerHaptic} />}

        </div>

        {/* --- PROFILE SIDEBAR OVERLAY --- */}
        {isProfileOpen && (
           <>
             <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setIsProfileOpen(false)} />
             <div className="absolute top-0 right-0 bottom-0 w-72 bg-slate-900 border-l border-slate-800 shadow-2xl z-[70] animate-in slide-in-from-right duration-200 flex flex-col">
                <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
                   <span className="font-bold text-white">Profile</span>
                   <button onClick={() => setIsProfileOpen(false)} className="p-1 hover:bg-slate-800 rounded">
                     <X className="w-5 h-5 text-slate-400" />
                   </button>
                </div>
                <div className="p-6 flex flex-col items-center border-b border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-blue-500 flex items-center justify-center mb-3">
                       <User className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white">Guest User</h3>
                    <p className="text-xs text-slate-500">guest@appbuild.ai</p>
                    <span className="mt-2 px-2 py-0.5 bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase rounded border border-blue-600/30">Free Plan</span>
                </div>
                <div className="flex-1 p-2 space-y-1">
                   <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 rounded-lg text-left"><Settings className="w-4 h-4" /> Account Settings</button>
                   <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 rounded-lg text-left"><CreditCard className="w-4 h-4" /> Subscription</button>
                   <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 rounded-lg text-left"><LogOut className="w-4 h-4" /> Sign Out</button>
                </div>
             </div>
           </>
        )}

      </div>

      {/* --- ALL MODALS --- */}

      <RepoConverter 
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        onConvertSuccess={handleConvertSuccess}
        triggerHaptic={triggerHaptic}
      />

      <CloneVision 
        isOpen={isCloneOpen}
        onClose={() => setIsCloneOpen(false)}
        onCloneSuccess={handleCloneSuccess}
        triggerHaptic={triggerHaptic}
      />

      <QRShareModal 
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        triggerHaptic={triggerHaptic}
      />

      {isExitModalOpen && (
        <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
               <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Exit Project?</h3>
            <p className="text-slate-400 text-center text-sm mb-6">Any unsaved changes may be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsExitModalOpen(false)} className="flex-1 py-3 text-slate-300 font-bold hover:bg-slate-800 rounded-xl">Cancel</button>
              <button onClick={handleExitConfirm} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg">Yes, Exit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}