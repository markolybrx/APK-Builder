"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-full relative bg-gray-900">
      
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50">
        <Sidebar />
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-white hover:bg-white/10 p-2 rounded-md"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="ml-4 font-bold text-white text-lg">AppBuild</span>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar Panel */}
          <div className="relative bg-gray-900 w-72 h-full shadow-xl flex flex-col">
            <div className="absolute top-4 right-4 z-50">
               <button 
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="text-white p-2 hover:bg-white/10 rounded-full"
                >
                 <X className="w-6 h-6" />
               </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="md:pl-72 h-full">
        {/* We add padding so content doesn't touch the edges */}
        <div className="h-full p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
