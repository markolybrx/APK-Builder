"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, X, Settings } from "lucide-react"; 

// --- CORE COMPONENTS ---
import NavigationRail from "./components/NavigationRail";
import Header from "./components/Header";

// --- TEMPORARILY DISABLED (Do not uncomment yet) ---
// import ChatInterface from "./components/ChatInterface";
// import FileExplorer from "./components/FileExplorer";
// import PreviewPane from "./components/PreviewPane";
// import LogicMapView from "./components/LogicMapView";

export default function WorkspaceUI({ project }) {
  const router = useRouter();
  const [activeView, setActiveView] = useState('chat'); 

  // Basic Haptic Helper
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden fixed inset-0">
      
      {/* 1. TEST HEADER */}
      <Header 
        project={project}
        triggerHaptic={triggerHaptic}
        onImportClick={() => console.log("Import")}
        onCloneClick={() => console.log("Clone")}
        onShareClick={() => console.log("Share")}
        onProfileClick={() => console.log("Profile")}
      />

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        {/* 2. TEST RAIL */}
        <NavigationRail 
            activeView={activeView} 
            setActiveView={setActiveView} 
            onExit={() => router.push('/dashboard')}
            triggerHaptic={triggerHaptic}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative overflow-hidden items-center justify-center border-l border-slate-800">
           <h2 className="text-xl font-bold text-white mb-2">Phase 1 Complete</h2>
           <p className="text-slate-500">Header & Rail are active. Next: Chat & Files.</p>
        </main>
      </div>
    </div>
  );
}
