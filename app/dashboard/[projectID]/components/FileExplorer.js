"use client";

import { useState } from "react";
import { Folder, FileCode, ChevronRight, Search, Plus, FileJson, FileType } from "lucide-react";

export default function FileExplorer({ files = [] }) { 
  // CRASH PREVENTER: Defaulting 'files' to [] ensures .map() never explodes
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col h-full w-full bg-[#020617] text-slate-300 font-sans overflow-hidden border-r border-slate-800/50">

      {/* 1. PINNED HEADER (Matte & Neon) */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-[#020617] shrink-0 z-10 select-none">
        <div className="flex flex-col">
            <span className="font-bold text-white tracking-widest uppercase text-[10px]">Project Files</span>
            <span className="text-[8px] text-slate-500 font-mono">/root/app/src</span>
        </div>
        <div className="flex gap-1">
            <button className="p-2 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-blue-400 transition-all active:scale-95">
                <Search className="w-3.5 h-3.5" />
            </button>
            <button className="p-2 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-green-400 transition-all active:scale-95">
                <Plus className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>

      {/* 2. SCROLLABLE FILE TREE ZONE */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        <div className="space-y-0.5 font-mono text-sm select-none">
          
          {/* Root App Folder */}
          <FileItem name="app" type="folder" isOpen={true} depth={0}>
            <FileItem name="src" type="folder" isOpen={true} depth={1}>
                <FileItem name="main" type="folder" isOpen={true} depth={2}>
                    <FileItem name="java" type="folder" isOpen={true} depth={3}>
                        {/* DYNAMIC FILES (Guarded Map) */}
                        {files && files.length > 0 ? (
                            files.filter(f => f.name.endsWith('.kt')).map((file, index) => (
                                <FileItem 
                                    key={index} 
                                    name={file.name} 
                                    type="file" 
                                    ext="kt"
                                    depth={4}
                                    active={index === 0} 
                                />
                            ))
                        ) : (
                            <div className="pl-12 py-2 text-[10px] text-slate-600 italic">No source files...</div>
                        )}
                    </FileItem>
                    <FileItem name="res" type="folder" isOpen={true} depth={3}>
                        <FileItem name="layout" type="folder" isOpen={true} depth={4}>
                             {files && files.length > 0 ? (
                                files.filter(f => f.name.endsWith('.xml') && !f.name.includes('Manifest')).map((file, index) => (
                                    <FileItem 
                                        key={index} 
                                        name={file.name} 
                                        type="file" 
                                        ext="xml"
                                        depth={5}
                                    />
                                ))
                            ) : null}
                        </FileItem>
                    </FileItem>
                    {/* Manifest usually sits in main/ */}
                    {files && files.filter(f => f.name === 'AndroidManifest.xml').map((file, i) => (
                        <FileItem key={i} name={file.name} type="file" ext="xml" depth={3} />
                    ))}
                </FileItem>
            </FileItem>
          </FileItem>

          {/* Root Gradle Files */}
          <FileItem name="build.gradle" type="file" ext="gradle" depth={0} />
          <FileItem name="settings.gradle" type="file" ext="gradle" depth={0} />
        </div>
        
        <div className="h-8" />
      </div>

      {/* 3. PINNED STATUS FOOTER */}
      <div className="h-8 border-t border-slate-800 bg-[#020617] flex items-center px-4 shrink-0">
        <div className="truncate flex items-center gap-2 text-[9px] text-slate-500 font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
            <span className="opacity-70">VFS SYNC:</span>
            <span className="text-blue-400 font-bold">READY</span>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: RECURSIVE FILE ITEM ---
function FileItem({ name, type, isOpen: defaultOpen, children, ext, active, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Icon Logic
  let Icon = type === 'folder' ? Folder : FileCode;
  let color = "text-slate-500";
  if (ext === 'kt') { Icon = FileCode; color = "text-blue-400"; }
  if (ext === 'xml') { Icon = FileType; color = "text-orange-400"; }
  if (ext === 'gradle') { Icon = FileJson; color = "text-green-400"; }

  // Indentation padding calculation
  const paddingLeft = `${depth * 12 + 8}px`;

  return (
    <div className="group animate-in fade-in slide-in-from-left-1 duration-200">
      <div 
        className={`
            flex items-center gap-2 py-1.5 pr-2 mx-2 rounded-lg cursor-pointer transition-all border border-transparent
            ${active 
                ? 'bg-blue-600/10 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                : 'hover:bg-slate-800/50 hover:text-slate-200'
            }
        `}
        style={{ paddingLeft }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="opacity-50 w-4 flex justify-center shrink-0">
          {type === 'folder' && (
            <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
          )}
        </span>
        
        <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-blue-400' : color}`} />
        
        <span className={`truncate text-[11px] tracking-tight ${active ? 'text-white font-bold' : 'text-slate-400'}`}>
            {name}
        </span>
      </div>

      {isOpen && children && (
        <div className="transition-all relative">
            {/* Tree Guide Line */}
            <div 
                className="absolute w-px bg-slate-800 h-full top-0" 
                style={{ left: `${parseInt(paddingLeft) + 7}px` }} 
            />
            {children}
        </div>
      )}
    </div>
  );
}