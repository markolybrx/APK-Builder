"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Terminal as TerminalIcon, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  Power,
  Cpu,
  Zap
} from "lucide-react";

export default function Terminal({ project, triggerHaptic }) {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const projectName = (project?.name || 'app').toLowerCase().replace(/\s/g, '-');

  const [history, setHistory] = useState([
    { type: 'system', content: 'Linux build-node-v14-amd64 5.15.0-76-generic' },
    { type: 'system', content: 'Connected to AppBuild Cloud Build Farm' },
    { type: 'success', content: 'VFS Synchronized with project state.' },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentPath, setCurrentPath] = useState("~/project");

  // Mock File System State
  const [fileSystem, setFileSystem] = useState({
    "~/project": ["src", "res", "AndroidManifest.xml", "build.gradle", "README.md"],
    "~/project/src": ["main", "test"],
    "~/project/res": ["layout", "values", "drawable"],
    "~": ["project", ".bashrc"]
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleContainerClick = () => inputRef.current?.focus();

  // --- REAL-TIME BUILD SIMULATOR ---
  const simulateBuild = async () => {
    const buildSteps = [
      { t: 'info', c: '> Task :app:preBuild UP-TO-DATE' },
      { t: 'info', c: '> Task :app:compileDebugKotlin' },
      { t: 'info', c: 'Analyzing MainActivity.kt...' },
      { t: 'success', c: 'Kotlin compilation successful.' },
      { t: 'info', c: '> Task :app:mergeDebugResources' },
      { t: 'info', c: 'Merging XML layouts from res/layout...' },
      { t: 'info', c: '> Task :app:processDebugMainManifest' },
      { t: 'info', c: '> Task :app:dexBuilderDebug' },
      { t: 'warning', c: 'Expiring Daemon because JVM heap space is exhausted...' },
      { t: 'info', c: '> Task :app:packageDebug' },
      { t: 'success', c: 'BUILD SUCCESSFUL in 4s' },
      { t: 'success', c: 'APK generated: ~/project/build/outputs/apk/debug/app-debug.apk' },
    ];

    for (const step of buildSteps) {
      await new Promise(r => setTimeout(r, Math.random() * 400 + 200));
      setHistory(prev => [...prev, { type: step.t, content: step.c }]);
    }
    triggerHaptic && triggerHaptic();
  };

  const processCommand = async (rawCmd) => {
    if (!rawCmd.trim()) return;

    setHistory(prev => [...prev, { type: 'user', content: rawCmd, path: currentPath }]);
    setCmdHistory(prev => [rawCmd, ...prev]);
    setHistoryIndex(-1);
    setInput("");
    triggerHaptic && triggerHaptic();

    const args = rawCmd.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    const param = args[1];

    await new Promise(r => setTimeout(r, 100));

    let output = [];

    switch (cmd) {
      case 'help':
        output = [
          { type: 'success', content: 'AppBuild AI Build Shell - Core Commands:' },
          { type: 'info', content: '  Build:   gradle build, gradlew, npm run build' },
          { type: 'info', content: '  Files:   ls, cd, pwd, cat, rm, touch' },
          { type: 'info', content: '  System:  clear, whoami, top, date' },
        ];
        break;

      case 'ls':
        output = [{ type: 'info', content: (fileSystem[currentPath] || []).join('   ') }];
        break;

      case 'pwd':
        output = [{ type: 'info', content: currentPath.replace('~', '/home/user') }];
        break;

      case 'gradle':
      case './gradlew':
      case 'build':
        if (param === 'build' || cmd === 'build') {
          await simulateBuild();
          return;
        }
        output = [{ type: 'info', content: 'Gradle 8.0.2 active. Use "gradle build" to compile.' }];
        break;

      case 'npm':
        if (param === 'start' || param === 'run') {
           setHistory(prev => [...prev, { type: 'success', content: '> Initializing Android Emulator Bridge...' }]);
           await new Promise(r => setTimeout(r, 1000));
           output = [{ type: 'success', content: 'Server running at http://localhost:8081' }];
        } else {
           output = [{ type: 'info', content: 'npm v9.6.7' }];
        }
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        return;

      case 'whoami':
        output = [{ type: 'info', content: 'visionary_dev' }];
        break;

      case 'top':
        output = [{ type: 'info', content: 'Tasks: 16 total, 1 running\nCPU: 2.1% used | RAM: 1.4GB / 8GB' }];
        break;

      default:
        output = [{ type: 'error', content: `bash: ${cmd}: command not found` }];
    }

    setHistory(prev => [...prev, ...output]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') processCommand(input);
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const i = historyIndex + 1;
        setHistoryIndex(i);
        setInput(cmdHistory[i]);
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const i = historyIndex - 1;
        setHistoryIndex(i);
        setInput(cmdHistory[i]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className={`flex flex-col h-full w-full bg-[#020617] text-slate-300 font-mono text-[11px] border-t border-slate-800 ${isMaximized ? 'fixed inset-0 z-[300]' : 'relative'}`}>
      
      {/* TERMINAL HEADER */}
      <div className="h-9 border-b border-slate-800 flex items-center justify-between px-3 bg-slate-900/50 shrink-0">
        <div className="flex items-center gap-2">
           <div className="flex gap-1.5 mr-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
           </div>
           <span className="text-slate-500 font-bold uppercase tracking-tighter text-[9px] flex items-center gap-1">
             <Cpu className="w-3 h-3" /> build-node-01@{projectName}
           </span>
        </div>
        <div className="flex items-center gap-1">
            <button onClick={() => setIsMaximized(!isMaximized)} className="p-1 hover:bg-slate-800 rounded">
                {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
        </div>
      </div>

      {/* TERMINAL CANVAS */}
      <div 
        className="flex-1 overflow-y-auto p-4 custom-scrollbar selection:bg-blue-500/30" 
        onClick={handleContainerClick}
        ref={scrollRef}
      >
        {history.map((line, i) => (
            <div key={i} className="mb-1.5 leading-relaxed animate-in fade-in duration-300">
                {line.type === 'user' && (
                    <div className="flex gap-2 text-white font-bold mt-2">
                        <span className="text-blue-500">➜</span>
                        <span className="text-blue-400/70">{line.path}</span>
                        <span>{line.content}</span>
                    </div>
                )}
                {line.type === 'system' && <div className="text-slate-600 italic">{line.content}</div>}
                {line.type === 'info' && <div className="text-slate-400">{line.content}</div>}
                {line.type === 'success' && <div className="text-green-400 flex items-center gap-2"><Zap className="w-3 h-3 fill-current" /> {line.content}</div>}
                {line.type === 'warning' && <div className="text-yellow-500/80">⚠ {line.content}</div>}
                {line.type === 'error' && <div className="text-red-400 font-bold underline decoration-red-900">err: {line.content}</div>}
            </div>
        ))}

        <div className="flex gap-2 items-center mt-2">
            <span className="text-blue-500 font-bold animate-pulse">➜</span>
            <span className="text-blue-400/70 font-bold">{currentPath}</span>
            <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white font-mono caret-blue-500"
                autoComplete="off"
                autoFocus
                spellCheck="false"
            />
        </div>
        <div className="h-12" />
      </div>
    </div>
  );
}
