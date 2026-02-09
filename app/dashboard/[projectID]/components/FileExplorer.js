"use client";

import { useState } from "react";
import { Folder, FileCode, ChevronRight, Search, Plus } from "lucide-react";

export default function FileExplorer({ files }) { 
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300 font-sans overflow-hidden">

      {/* 1. PINNED HEADER */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0 z-10">
        <span className="font-bold text-white tracking-wide uppercase text-[10px] opacity-70">Project Explorer</span>
        <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* 2. SCROLLABLE FILE TREE ZONE */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-1 font-mono text-sm select-none">
          <FileItem name="app" type="folder" isOpen={true}>
            {files.map((file, index) => (
              <FileItem 
                key={index} 
                name={file.name} 
                type="file" 
                ext={file.name.split('.').pop()} 
                active={index === 0} 
              />
            ))}
          </FileItem>
          <FileItem name="build.gradle" type="file" ext="gradle" />
          <FileItem name="settings.gradle" type="file" ext="gradle" />
        </div>
        {/* Padding to ensure bottom items aren't cramped */}
        <div className="h-8" />
      </div>

      {/* 3. PINNED STATUS FOOTER (Strictly above the 1px anchor) */}
      <div className="h-8 border-t border-slate-800 bg-slate-950 flex items-center px-4 text-[9px] text-slate-500 font-mono italic shrink-0">
        <div className="truncate flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse" />
            VFS Path: /app/src/main/java/
        </div>
      </div>
    </div>
  );
}

function FileItem({ name, type, isOpen: defaultOpen, children, ext, active }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  let Icon = type === 'folder' ? Folder : FileCode;
  let color = "text-slate-500";
  if (ext === 'kt') color = "text-blue-400";
  if (ext === 'xml') color = "text-orange-400";
  if (ext === 'gradle') color = "text-green-400";

  return (
    <div className="group animate-in fade-in slide-in-from-left-1 duration-200">
      <div 
        className={`
            flex items-center gap-2 px-2 py-2.5 rounded-lg cursor-pointer transition-all
            ${active ? 'bg-blue-600/10 text-white border border-blue-500/20 shadow-lg' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="opacity-50 w-4 flex justify-center shrink-0">
          {type === 'folder' && (
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
          )}
        </span>
        <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-blue-400' : color}`} />
        <span className="truncate text-[12px] tracking-tight">{name}</span>
      </div>

      {isOpen && children && (
        <div className="pl-4 border-l border-slate-800/50 ml-2.5 transition-all">
          {children}
        </div>
      )}
    </div>
  );
}
