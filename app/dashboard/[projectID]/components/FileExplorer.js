import { useState } from "react";
import { Folder, FileCode, ChevronRight, Search, Plus } from "lucide-react";

export default function FileExplorer() {
  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300">
      
      {/* --- Header --- */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0">
        <span className="font-bold text-white tracking-wide">Project Files</span>
        <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* --- File Tree Area --- */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <FileTree />
      </div>

      {/* --- Status Footer --- */}
      <div className="h-8 border-t border-slate-800 bg-slate-950 flex items-center px-4 text-[10px] text-slate-500 font-mono">
        src/main/java/MainActivity.kt
      </div>
    </div>
  );
}

// --- Recursive File Tree Component ---
function FileTree() {
  return (
    <div className="space-y-1 font-mono text-sm select-none">
      <FileItem name="app" type="folder" isOpen={true}>
        <FileItem name="src" type="folder" isOpen={true}>
          <FileItem name="main" type="folder" isOpen={true}>
            <FileItem name="java" type="folder" isOpen={true}>
              <FileItem name="com.example.app" type="folder" isOpen={true}>
                 <FileItem name="MainActivity.kt" type="file" ext="kt" active />
                 <FileItem name="Utils.kt" type="file" ext="kt" />
              </FileItem>
            </FileItem>
            <FileItem name="res" type="folder">
              <FileItem name="layout" type="folder">
                <FileItem name="activity_main.xml" type="file" ext="xml" />
                <FileItem name="item_card.xml" type="file" ext="xml" />
              </FileItem>
              <FileItem name="values" type="folder">
                <FileItem name="colors.xml" type="file" ext="xml" />
                <FileItem name="strings.xml" type="file" ext="xml" />
              </FileItem>
            </FileItem>
            <FileItem name="AndroidManifest.xml" type="file" ext="xml" />
          </FileItem>
        </FileItem>
      </FileItem>
      <FileItem name="build.gradle" type="file" ext="gradle" />
      <FileItem name="settings.gradle" type="file" ext="gradle" />
    </div>
  );
}

function FileItem({ name, type, isOpen: defaultOpen, children, ext, active }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Icon Selection
  let Icon = type === 'folder' ? Folder : FileCode;
  let color = "text-slate-500";
  if (ext === 'kt') color = "text-blue-400";
  if (ext === 'xml') color = "text-orange-400";
  if (ext === 'gradle') color = "text-green-400";

  return (
    <div className="group">
      <div 
        className={`
            flex items-center gap-2 px-2 py-3 rounded-lg cursor-pointer transition-colors
            ${active ? 'bg-blue-600/10 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="opacity-50 w-4 flex justify-center shrink-0">
          {type === 'folder' && (
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
          )}
        </span>
        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-400' : color}`} />
        <span className="truncate">{name}</span>
      </div>
      
      {isOpen && children && (
        <div className="pl-4 border-l border-slate-800 ml-2.5 transition-all">
          {children}
        </div>
      )}
    </div>
  );
}