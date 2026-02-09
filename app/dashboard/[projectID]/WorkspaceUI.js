"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import NavigationRail from "./components/NavigationRail";
import ChatInterface from "./components/ChatInterface";
import FileExplorer from "./components/FileExplorer";
import PreviewPane from "./components/PreviewPane";
import Terminal from "./components/Terminal";
import Header from "./components/Header";
import HistoryView from "./components/HistoryView";
import SettingsView from "./components/SettingsView";
import RepoConverter from "./components/RepoConverter"; // <--- NEW IMPORT

export default function WorkspaceUI({ project }) {
  const router = useRouter();

  // --- STATE ---
  const [activeView, setActiveView] = useState('chat'); 
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false); // <--- CONVERTER STATE
  
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi! I'm ready to build "${project?.name || 'your app'}".` },
  ]);

  const [previewMode, setPreviewMode] = useState('live'); 

  // Utils
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  const handleExitConfirm = () => {
    triggerHaptic();
    router.push('/dashboard');
  };

  const handleConvertSuccess = () => {
    // In a real app, this would reload the project data
    setMessages(prev => [...prev, { role: 'ai', text: "Repository imported successfully! I've converted the logic to Android. Check the Files tab." }]);
    setIsConverterOpen(false);
    setActiveView('files'); // Switch to files to show the result
  };

  return (
    <div className="fixed inset-0 z-[100] flex h-[100dvh] w-full bg-slate-950 text-slate-300 font-sans overflow-hidden">
      
      {/* 1. LEFT NAVIGATION RAIL */}
      <NavigationRail 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onExit={() => setIsExitModalOpen(true)}
        triggerHaptic={triggerHaptic}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
        
        {/* HEADER (Now has Import Button) */}
        <Header 
          project={project}
          leftOpen={activeView === 'files'} // Just for visual sync, optional
          setLeftOpen={() => setActiveView('files')}
          rightOpen={activeView === 'preview'}
          setRightOpen={() => setActiveView(activeView === 'preview' ? 'chat' : 'preview')}
          triggerHaptic={triggerHaptic}
          onImportClick={() => setIsConverterOpen(true)} // <--- TRIGGER
        />
        
        {/* VIEW: CHAT */}
        {activeView === 'chat' && (
           <ChatInterface 
              messages={messages} 
              setMessages={setMessages}
              setPreviewMode={(mode) => { setPreviewMode(mode); setActiveView('preview'); }}
              triggerHaptic={triggerHaptic}
           />
        )}

        {/* VIEW: FILES */}
        {activeView === 'files' && <FileExplorer />}

        {/* VIEW: PREVIEW */}
        {activeView === 'preview' && (
           <PreviewPane 
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
              triggerHaptic={triggerHaptic}
           />
        )}

        {/* VIEW: TERMINAL */}
        {activeView === 'terminal' && (
           <div className="h-full w-full">
             <Terminal triggerHaptic={triggerHaptic} />
           </div>
        )}

        {activeView === 'history' && <HistoryView triggerHaptic={triggerHaptic} />}
        {activeView === 'settings' && <SettingsView project={project} triggerHaptic={triggerHaptic} />}

      </div>

      {/* --- MODALS --- */}
      
      {/* 1. EXIT CONFIRMATION */}
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

      {/* 2. REPO CONVERTER MODAL (NEW) */}
      <RepoConverter 
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        onConvertSuccess={handleConvertSuccess}
        triggerHaptic={triggerHaptic}
      />

    </div>
  );
}