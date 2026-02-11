"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, Cpu, Activity } from "lucide-react";

export default function Terminal({ project, triggerHaptic }) {
  const [logs, setLogs] = useState([]);
  const bottomRef = useRef(null);

  // Initial Boot Sequence Simulation
  useEffect(() => {
    const bootSequence = [
      { type: 'dim', text: `> Initializing environment for ${project?.name || 'Visionary Project'}...` },
      { type: 'success', text: '> VFS mounted successfully [rw].' },
      { type: 'info', text: '> Connecting to Neural Engine v2.5...' },
      { type: 'dim', text: '> Verifying dependency graph...' },
      { type: 'warn', text: '> Notice: Experimental Kotlin compiler active.' },
      { type: 'success', text: '> System Ready. Waiting for neural commands.' },
    ];

    let delay = 0;
    bootSequence.forEach(log => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, delay);
      delay += 600;
    });
  }, [project?.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-black font-mono text-[10px] md:text-xs overflow-hidden border-t border-zinc-800">

      {/* Terminal Header */}
      <div className="h-10 bg-black border-b border-zinc-800 flex items-center justify-between px-4 select-none shrink-0">
        <div className="flex items-center gap-2 text-zinc-400">
            <TerminalIcon className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-bold tracking-wider text-zinc-300">CONSOLE_OUTPUT</span>
        </div>
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-900/20 border border-green-900/50 rounded text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" />
                <span className="text-[9px] font-bold tracking-tight">ONLINE</span>
             </div>
        </div>
      </div>

      {/* Log Output */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar bg-black relative">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        {logs.length === 0 && <div className="text-zinc-700 italic">Initializing stream...</div>}

        {logs.map((log, i) => (
            <div key={i} className="flex gap-3 relative z-10 animate-in slide-in-from-left-2 duration-200">
                <span className="text-zinc-600 shrink-0 select-none w-16 text-right">
                    {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                </span>
                <span className={`
                    break-all
                    ${log.type === 'error' ? 'text-red-500 font-bold' : ''}
                    ${log.type === 'success' ? 'text-green-400' : ''}
                    ${log.type === 'warn' ? 'text-yellow-400' : ''}
                    ${log.type === 'info' ? 'text-blue-400' : ''}
                    ${log.type === 'dim' ? 'text-zinc-600' : ''}
                    ${!log.type ? 'text-zinc-300' : ''}
                `}>
                    {log.text}
                </span>
            </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Line (Visual Only) */}
      <div className="p-2 bg-zinc-900/30 border-t border-zinc-800 flex items-center gap-2 text-zinc-500 shrink-0">
        <span className="text-pink-500 font-bold">➜</span>
        <span className="text-blue-500 font-bold">~/project/src</span>
        <span className="w-1.5 h-4 bg-zinc-500 animate-pulse" />
      </div>
    </div>
  );
}
