"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, X, Maximize2, Play } from "lucide-react";

export default function Terminal({ project, triggerHaptic }) {
  const [logs, setLogs] = useState([]);
  const bottomRef = useRef(null);

  // Initial Boot Sequence Simulation
  useEffect(() => {
    const bootSequence = [
      { type: 'info', text: `> Initializing environment for ${project?.packageName || 'com.app'}...` },
      { type: 'success', text: '> VFS mounted successfully.' },
      { type: 'info', text: '> Loading dependency graph...' },
      { type: 'warn', text: '> Notice: Using experimental Kotlin compiler.' },
      { type: 'success', text: '> System Ready. Waiting for commands.' },
    ];

    let delay = 0;
    bootSequence.forEach(log => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, delay);
      delay += 800;
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] font-mono text-xs overflow-hidden border-t border-slate-800">
      
      {/* Terminal Header */}
      <div className="h-10 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2 text-slate-400">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span className="font-bold">OUTPUT</span>
        </div>
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 rounded text-green-500">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold">CONNECTED</span>
             </div>
        </div>
      </div>

      {/* Log Output */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {logs.length === 0 && <div className="text-slate-600 italic">No output generated...</div>}
        
        {logs.map((log, i) => (
            <div key={i} className="flex gap-2 animate-in slide-in-from-left-2 duration-200">
                <span className="text-slate-600 shrink-0 select-none">
                    {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                </span>
                <span className={`
                    ${log.type === 'error' ? 'text-red-400' : ''}
                    ${log.type === 'success' ? 'text-green-400' : ''}
                    ${log.type === 'warn' ? 'text-yellow-400' : ''}
                    ${log.type === 'info' ? 'text-blue-400' : ''}
                    ${!log.type ? 'text-slate-300' : ''}
                `}>
                    {log.text}
                </span>
            </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Line (Visual Only) */}
      <div className="p-2 bg-[#050505] flex items-center gap-2 text-slate-500">
        <span className="text-green-500 font-bold">➜</span>
        <span className="animate-pulse">_</span>
      </div>
    </div>
  );
}
