"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, User, Settings, CreditCard, LogOut, X } from "lucide-react";

// --- COMPONENTS ---
import NavigationRail from "./components/NavigationRail";
import ChatInterface from "./components/ChatInterface";
import FileExplorer from "./components/FileExplorer";
import PreviewPane from "./components/PreviewPane";
import Terminal from "./components/Terminal";
import Header from "./components/Header";
import HistoryView from "./components/HistoryView";
import SettingsView from "./components/SettingsView";
import RepoConverter from "./components/RepoConverter";

export default function WorkspaceUI({ project }) {
  const router = useRouter();

  // --- STATE ---
  const [activeView, setActiveView] = useState('chat'); 
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false); 
  const [isProfileOpen, setIsProfileOpen] = useState(false); // <--- NEW PROFILE STATE
  
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm ready to build "${project?.name || 'your app'}".` },
  ]);

  const [previewMode, setPreviewMode] = useState('live'); 

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

  return (
    // ROOT: Flex Column (Header on top, everything else below)
    <div className="flex flex-col h-screen w-full bg-[#0f172a] text-slate-300 font-sans overflow-hidden fixed inset-0">
      
      {/* 1. HEADER (Full Width) */}
      <Header 
        project={project}
        triggerHaptic={triggerHaptic}
        onImportClick={() => setIsConverterOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      {/* 2. WORKSPACE BODY (Rail + Main View) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Navigation Rail */}
        <NavigationRail 
          activeView={activeView} 
          setActiveView={setActiveView} 
          onExit={() => setIsExitModalOpen(true)}
          triggerHaptic={triggerHaptic}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
          
          {activeView === 'chat' && (
             <ChatInterface 
                messages={messages} 
                setMessages={setMessages}
                setPreviewMode={(mode) => { setPreviewMode(mode); setActiveView('preview'); }}
                triggerHaptic={triggerHaptic}
             />
          )}

          {activeView === 'files' && <FileExplorer />}

          {activeView === 'preview' && (
             <PreviewPane 
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
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
             {/* Backdrop */}
             <div 
               className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[60]"
               onClick={() => setIsProfileOpen(false)}
             />
             
             {/* Drawer */}
             <div className="absolute top-0 right-0 bottom-0 w-72 bg-slate-900 border-l border-slate-800 shadow-2xl z-[70] animate-in slide-in-from-right duration-200 flex flex-col">
                {/* Drawer Header */}
                <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
                   <span className="font-bold text-white">Profile</span>
                   <button onClick={() => setIsProfileOpen(false)} className="p-1 hover:bg-slate-800 rounded">
                     <X className="w-5 h-5 text-slate-400" />
                   </button>
                </div>

                {/* User Info */}
                <div className="p-6 flex flex-col items-center border-b border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-blue-500 flex items-center justify-center mb-3">
                       <User className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white">Guest User</h3>
                    <p className="text-xs text-slate-500">guest@appbuild.ai</p>
                    <span className="mt-2 px-2 py-0.5 bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase rounded border border-blue-600/30">
                       Free Plan
                    </span>
                </div>

                {/* Menu Items */}
                <div className="flex-1 p-2 space-y-1">
                   <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-left">
                      <Settings className="w-4 h-4" /> Account Settings
                   </button>
                   <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-left">
                      <CreditCard className="w-4 h-4" /> Subscription
                   </button>
                   <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-left">
                      <LogOut className="w-4 h-4" /> Sign Out
                   </button>
                </div>
             </div>
           </>
        )}

      </div>

      {/* --- OTHER MODALS --- */}
      
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

      <RepoConverter 
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        onConvertSuccess={handleConvertSuccess}
        triggerHaptic={triggerHaptic}
      />

    </div>
  );
}