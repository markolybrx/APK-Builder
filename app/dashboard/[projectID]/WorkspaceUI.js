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
import RepoConverter from "./components/RepoConverter";

// --- TEMPORARILY DISABLED FOR BUILD SUCCESS ---
// import CloneVision from "./components/CloneVision";
// import QRShareModal from "./components/QRShareModal";
// import LogicMapView from "./components/LogicMapView";
// import WelcomeTour from "./components/WelcomeTour";

export default function WorkspaceUI({ project }) {
  const router = useRouter();

  // --- STATE ---
  const [activeView, setActiveView] = useState('chat'); 
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Placeholders for missing features
  const [isCloneOpen, setIsCloneOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);

  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm ready to build "${project?.name || 'your app'}".` },
  ]);

  const [previewMode, setPreviewMode] = useState('live'); 
  const [pendingAIChange, setPendingAIChange] = useState(null);

  // --- UTILS ---
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  const handleExitConfirm = () => {
    triggerHaptic();
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f172a] text-slate-300 font-sans overflow-hidden fixed inset-0">

      <Header 
        project={project}
        triggerHaptic={triggerHaptic}
        onImportClick={() => setIsConverterOpen(true)}
        onCloneClick={() => alert("Clone Vision coming soon!")}
        onShareClick={() => alert("Live Share coming soon!")}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <NavigationRail 
          activeView={activeView} 
          setActiveView={setActiveView} 
          onExit={() => setIsExitModalOpen(true)}
          triggerHaptic={triggerHaptic}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
          {activeView === 'chat' && (
             <ChatInterface 
                messages={messages} 
                setMessages={setMessages}
                setPreviewMode={(mode) => { setPreviewMode(mode); setActiveView('preview'); }}
                onAIChange={(change) => { setPendingAIChange(change); setActiveView('preview'); }}
                triggerHaptic={triggerHaptic}
             />
          )}

          {activeView === 'files' && <FileExplorer />}
          {activeView === 'preview' && (
             <PreviewPane 
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                pendingChange={pendingAIChange}
                onResolveChange={() => setPendingAIChange(null)}
                triggerHaptic={triggerHaptic}
             />
          )}
          {activeView === 'terminal' && <Terminal project={project} triggerHaptic={triggerHaptic} />}
          {activeView === 'history' && <HistoryView triggerHaptic={triggerHaptic} />}
          {activeView === 'settings' && <SettingsView project={project} triggerHaptic={triggerHaptic} />}
          
          {/* Fallback for Logic Map until file is created */}
          {activeView === 'logic' && (
            <div className="flex-1 flex items-center justify-center text-slate-500 italic">
               Logic Map View coming in next update.
            </div>
          )}
        </div>

        {/* --- PROFILE OVERLAY --- */}
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
                </div>
             </div>
           </>
        )}
      </div>

      <RepoConverter 
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        onConvertSuccess={() => { setIsConverterOpen(false); setActiveView('files'); }}
        triggerHaptic={triggerHaptic}
      />

      {isExitModalOpen && (
        <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-bold text-white text-center mb-2">Exit Project?</h3>
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
