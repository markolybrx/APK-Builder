import { useState } from "react";
import { Folder, FileCode, ChevronRight, X } from "lucide-react";

export default function FileExplorer({ leftOpen, setLeftOpen }) {
  return (
    <>
      <aside 
        className={`
          absolute top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 shadow-2xl transition-transform duration-300
          ${leftOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Explorer</span>
          <button onClick={() => setLeftOpen(false)}><X className="w-5 h-5 text-slate-400"/></button>
        </div>
        <div className="p-2 overflow-y-auto h-full pb-20">
          <FileTree />
        </div>
      </aside>
      
      {/* Overlay */}
      {leftOpen && <div className="absolute inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={() => setLeftOpen(false)} />}
    </>
  );
}

// Dummy Tree
function FileTree() {
  return (
    <div className="space-y-1 font-mono text-sm">
      <FileItem name="app" type="folder" isOpen={true}>
        <FileItem name="src" type="folder" isOpen={true}>
            <FileItem name="MainActivity.kt" type="file" ext="kt" />
            <FileItem name="activity_main.xml" type="file" ext="xml" />
        </FileItem>
      </FileItem>
      <FileItem name="build.gradle" type="file" ext="gradle" />
    </div>
  );
}

function FileItem({ name, type, isOpen: defaultOpen, children, ext }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  let Icon = type === 'folder' ? Folder : FileCode;
  let color = ext === 'kt' ? "text-blue-400" : ext === 'xml' ? "text-orange-400" : "text-slate-500";
  return (
    <div>
      <div 
        className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-800 text-slate-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="truncate text-slate-300">{name}</span>
      </div>
      {isOpen && children && <div className="pl-4 border-l border-slate-800 ml-2">{children}</div>}
    </div>
  );
}
