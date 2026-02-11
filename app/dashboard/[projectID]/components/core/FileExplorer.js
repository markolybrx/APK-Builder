"use client";

import { useState } from "react";
import { Folder, FileCode, ChevronRight, Search, Plus, FileJson, FileType, Hash } from "lucide-react";

export default function FileExplorer({ files = [] }) { 
  const [searchQuery, setSearchQuery] = useState("");

  // Placeholder for future active file logic
  const isFileActive = (fileName) => false; 

  return (
    <div className="flex flex-col h-full w-full bg-black text-zinc-400 font-sans overflow-hidden border-r border-zinc-800 select-none">

      {/* 1. PINNED HEADER */}
      <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-black shrink-0 z-10">
        <div className="flex flex-col">
            <span className="font-bold text-white tracking-widest uppercase text-[10px]">Project Files</span>
            <span className="text-[8px] text-zinc-600 font-mono">/root/app/src</span>
        </div>
        <div className="flex gap-1">
            <button className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-pink-400 transition-all active:scale-95">
                <Search className="w-3.5 h-3.5" />
            </button>
            <button className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-blue-400 transition-all active:scale-95">
                <Plus className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>

      {/* 2. SCROLLABLE FILE TREE ZONE */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        <div className="space-y-0.5 font-mono text-sm">

          {/* Root App Folder */}
          <FileItem name="app" type="folder" isOpen={true} depth={0}>
            <FileItem name="src" type="folder" isOpen={true} depth={1}>
                <FileItem name="main" type="folder" isOpen={true} depth={2}>
                    <FileItem name="java" type="folder" isOpen={true} depth={3}>
                        {/* DYNAMIC KOTLIN FILES */}
                        {files && files.length > 0 ? (
                            files.filter(f => f.name.endsWith('.kt')).map((file, index) => (
                                <FileItem 
                                    key={`kt-${index}`} 
                                    name={file.name} 
                                    type="file" 
                                    ext="kt"
                                    depth={4}
                                    active={index === 0} // Default highlight first file
                                />
                            ))
                        ) : (
                            <div className="pl-12 py-2 text-[10px] text-zinc-700 italic">No source files...</div>
                        )}
                    </FileItem>
                    <FileItem name="res" type="folder" isOpen={true} depth={3}>
                        <FileItem name="layout" type="folder" isOpen={true} depth={4}>
                             {files && files.length > 0 ? (
                                files.filter(f => f.name.endsWith('.xml') && !f.name.includes('Manifest')).map((file, index) => (
                                    <FileItem 
                                        key={`xml-${index}`} 
                                        name={file.name} 
                                        type="file" 
                                        ext="xml"
                                        depth={5}
                                    />
                                ))
                            ) : null}
                        </FileItem>
                    </FileItem>
                    {/* Manifest */}
                    {files && files.filter(f => f.name === 'AndroidManifest.xml').map((file, i) => (
                        <FileItem key={`man-${i}`} name={file.name} type="file" ext="xml" depth={3} />
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
      <div className="h-8 border-t border-zinc-800 bg-black flex items-center px-4 shrink-0 justify-between">
        <div className="truncate flex items-center gap-2 text-[9px] text-zinc-600 font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)] animate-pulse" />
            <span>VFS SYNC:</span>
            <span className="text-green-500 font-bold uppercase">Active</span>
        </div>
        <div className="text-[9px] text-zinc-700 font-mono uppercase">
            {files.length} Files
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: RECURSIVE FILE ITEM ---
function FileItem({ name, type, isOpen: defaultOpen, children, ext, active, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Icon & Color Logic based on File Extension
  let Icon = Folder;
  let color = "text-zinc-600 group-hover:text-zinc-400"; 

  if (type === 'file') {
      if (ext === 'kt') { Icon = FileCode; color = "text-blue-500"; }
      else if (ext === 'xml') { Icon = FileType; color = "text-pink-500"; }
      else if (ext === 'gradle') { Icon = Hash; color = "text-green-500"; }
      else { Icon = FileCode; color = "text-zinc-500"; }
  }

  const paddingLeft = `${depth * 12 + 12}px`;

  return (
    <div className="group animate-in fade-in slide-in-from-left-1 duration-200">
      <div 
        className={`
            flex items-center gap-2 py-1.5 pr-2 mx-2 rounded-lg cursor-pointer transition-all border border-transparent
            ${active 
                ? 'bg-zinc-900 border-zinc-800 shadow-sm' 
                : 'hover:bg-zinc-900/50 hover:text-zinc-200'
            }
        `}
        style={{ paddingLeft }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="opacity-50 w-4 flex justify-center shrink-0">
          {type === 'folder' && (
            <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-90 text-zinc-400' : 'text-zinc-600'}`} />
          )}
        </span>

        <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${active ? color : color}`} />

        <span className={`truncate text-[10px] tracking-tight transition-colors ${active ? 'text-white font-bold' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
            {name}
        </span>
      </div>

      {isOpen && children && (
        <div className="transition-all relative">
            {/* Indentation Guide Line */}
            <div 
                className="absolute w-px bg-zinc-800/50 h-full top-0" 
                style={{ left: `${parseInt(paddingLeft) + 7}px` }} 
            />
            {children}
        </div>
      )}
    </div>
  );
}
