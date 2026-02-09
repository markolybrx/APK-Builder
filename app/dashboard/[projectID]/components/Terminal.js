"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Terminal as TerminalIcon, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  X,
  Power
} from "lucide-react";

export default function Terminal({ triggerHaptic }) {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  
  // --- STATE ---
  const [history, setHistory] = useState([
    { type: 'system', content: 'Linux android-build-server 5.10.0 #1 SMP PREEMPT' },
    { type: 'system', content: 'Welcome to AppBuild Shell v2.0 (tty1)' },
    { type: 'info', content: 'Type "help" for a list of available commands.' },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentPath, setCurrentPath] = useState("~/project");

  // --- MOCK FILE SYSTEM STATE ---
  // Keeps track of fake files so 'mkdir' and 'touch' actually seem to work
  const [fileSystem, setFileSystem] = useState({
    "~/project": ["src", "res", "AndroidManifest.xml", "build.gradle", "README.md"],
    "~/project/src": ["main", "test"],
    "~/project/res": ["layout", "values", "drawable"],
    "~": ["project", ".bashrc", ".config"]
  });

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleContainerClick = () => inputRef.current?.focus();

  // --- COMMAND PROCESSOR ---
  const processCommand = async (rawCmd) => {
    if (!rawCmd.trim()) return;

    // 1. Log User Input
    const newEntry = { type: 'user', content: rawCmd, path: currentPath };
    setHistory(prev => [...prev, newEntry]);
    setCmdHistory(prev => [rawCmd, ...prev]);
    setHistoryIndex(-1);
    setInput("");
    triggerHaptic();

    // 2. Parse Arguments
    const args = rawCmd.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    const param = args[1];

    // 3. Simulate Network Delay (random 50-200ms)
    await new Promise(r => setTimeout(r, Math.random() * 150 + 50));

    let output = [];

    // --- COMMAND REGISTRY ---
    switch (cmd) {
      // === FILE SYSTEM ===
      case 'ls':
      case 'll':
        const files = fileSystem[currentPath] || [];
        output = [{ type: 'success', content: files.join('   ') }];
        break;

      case 'cd':
        if (!param || param === '~') {
          setCurrentPath("~");
        } else if (param === '..') {
          const parts = currentPath.split('/');
          if (parts.length > 1) parts.pop();
          setCurrentPath(parts.join('/') || "~");
        } else if (param === 'project' && currentPath === '~') {
          setCurrentPath("~/project");
        } else if (fileSystem[currentPath]?.includes(param)) {
           // Basic check if it "looks" like a folder
           if (!param.includes('.')) {
             setCurrentPath(`${currentPath}/${param}`);
           } else {
             output = [{ type: 'error', content: `bash: cd: ${param}: Not a directory` }];
           }
        } else {
          output = [{ type: 'error', content: `bash: cd: ${param}: No such file or directory` }];
        }
        break;

      case 'pwd':
        output = [{ type: 'info', content: currentPath.replace('~', '/home/user') }];
        break;

      case 'mkdir':
        if (param) {
            setFileSystem(prev => ({
                ...prev,
                [currentPath]: [...(prev[currentPath] || []), param]
            }));
            // No output on success, just like real linux
        } else {
            output = [{ type: 'error', content: 'mkdir: missing operand' }];
        }
        break;

      case 'touch':
        if (param) {
            setFileSystem(prev => ({
                ...prev,
                [currentPath]: [...(prev[currentPath] || []), param]
            }));
        } else {
            output = [{ type: 'error', content: 'touch: missing file operand' }];
        }
        break;

      case 'rm':
        if (param === '-rf' && args[2] === '/') {
            output = [{ type: 'error', content: 'Nice try. Permission denied.' }];
        } else if (param) {
            setFileSystem(prev => ({
                ...prev,
                [currentPath]: (prev[currentPath] || []).filter(f => f !== param)
            }));
        } else {
            output = [{ type: 'error', content: 'rm: missing operand' }];
        }
        break;

      case 'cat':
        if (!param) {
            output = [{ type: 'error', content: 'cat: missing filename' }];
        } else if (param === 'README.md') {
            output = [{ type: 'info', content: '# AppBuild Project\nThis is an auto-generated project.' }];
        } else if (param.endsWith('.xml') || param.endsWith('.kt') || param.endsWith('.gradle')) {
            output = [{ type: 'info', content: '[Binary or Large File Content Hidden]' }];
        } else {
            output = [{ type: 'error', content: `cat: ${param}: No such file` }];
        }
        break;

      // === NETWORK ===
      case 'ping':
        if (!param) {
            output = [{ type: 'error', content: 'ping: missing host argument' }];
        } else {
            setHistory(prev => [...prev, { type: 'info', content: `PING ${param} (127.0.0.1): 56 data bytes` }]);
            for(let i=0; i<3; i++) {
                await new Promise(r => setTimeout(r, 800));
                setHistory(prev => [...prev, { type: 'info', content: `64 bytes from 127.0.0.1: icmp_seq=${i} ttl=64 time=${(Math.random()*10).toFixed(2)} ms` }]);
            }
            return; // Loop handled updates
        }
        break;
      
      case 'curl':
      case 'wget':
        if (!param) output = [{ type: 'error', content: `${cmd}: missing URL` }];
        else output = [{ type: 'success', content: 'HTTP/1.1 200 OK\n<htmlData>...fetched...</htmlData>' }];
        break;
      
      case 'ifconfig':
      case 'ip':
        output = [{ type: 'info', content: 'eth0: flags=4163<UP,BROADCAST,RUNNING> mtu 1500\n      inet 192.168.1.42  netmask 255.255.255.0  broadcast 192.168.1.255' }];
        break;

      // === DEV TOOLS ===
      case 'npm':
      case 'yarn':
        if (param === 'install' || param === 'i' || param === 'add') {
             output = [{ type: 'info', content: 'Resolving packages...\nFetching...\nDone in 1.4s' }];
        } else if (param === 'start') {
             output = [{ type: 'success', content: '> Starting development server...' }];
        } else {
             output = [{ type: 'info', content: `npm version 8.19.2` }];
        }
        break;

      case 'git':
        if (param === 'status') output = [{ type: 'info', content: 'On branch main\nNothing to commit, working tree clean' }];
        else if (param === 'log') output = [{ type: 'info', content: 'commit 8f3a1...\nAuthor: You <dev@appbuild.ai>\nDate:   Today\n\n    Initial commit' }];
        else if (param === 'push') output = [{ type: 'success', content: 'Everything up-to-date' }];
        else output = [{ type: 'info', content: 'git version 2.34.1' }];
        break;

      case 'gradle':
      case './gradlew':
        output = [{ type: 'info', content: 'Starting a Gradle Daemon...\nBUILD SUCCESSFUL in 2s' }];
        break;

      case 'node':
        if (param === '-v') output = [{ type: 'info', content: 'v18.16.0' }];
        else output = [{ type: 'warning', content: 'Interactive node shell not supported in mock mode.' }];
        break;

      // === SYSTEM & FUN ===
      case 'clear':
      case 'cls':
        setHistory([]);
        return;

      case 'whoami':
        output = [{ type: 'info', content: 'root' }];
        break;

      case 'date':
        output = [{ type: 'info', content: new Date().toString() }];
        break;

      case 'uptime':
        output = [{ type: 'info', content: ' 10:00:00 up 4 days, 2:32,  1 user,  load average: 0.00, 0.01, 0.05' }];
        break;

      case 'top':
      case 'htop':
        output = [{ type: 'info', content: 'Tasks: 12 total, 1 running, 11 sleeping\n%Cpu(s):  1.2 us,  0.5 sy,  0.0 ni, 98.3 id' }];
        break;

      case 'uname':
        if (param === '-a') output = [{ type: 'info', content: 'Linux build-server 5.10.0 #1 SMP PREEMPT' }];
        else output = [{ type: 'info', content: 'Linux' }];
        break;

      case 'vi':
      case 'vim':
      case 'nano':
        output = [{ type: 'warning', content: 'Error: Terminal too small for text editor UI. Please use the "Files" tab.' }];
        break;

      case 'sudo':
        output = [{ type: 'warning', content: 'User is already root. "sudo" is unnecessary.' }];
        break;

      case 'reboot':
      case 'exit':
        output = [{ type: 'error', content: 'System managed by AppBuild AI. Manual reboot disabled.' }];
        break;

      case 'help':
        output = [
          { type: 'success', content: 'AppBuild Mock Shell - Common Commands:' },
          { type: 'info', content: '  File:    ls, cd, pwd, mkdir, rm, touch, cat, cp, mv' },
          { type: 'info', content: '  Dev:     npm, git, gradle, node, java' },
          { type: 'info', content: '  Network: ping, curl, ifconfig, wget' },
          { type: 'info', content: '  System:  clear, whoami, date, uptime, top, uname' },
        ];
        break;

      // === CATCH ALL ===
      default:
        output = [{ type: 'error', content: `bash: ${cmd}: command not found` }];
    }

    setHistory(prev => [...prev, ...output]);
  };

  // --- KEYBOARD CONTROLS ---
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === 'c' && e.ctrlKey) {
        // Ctrl+C simulation
        setHistory(prev => [...prev, { type: 'user', content: '^C', path: currentPath }]);
        setInput("");
    }
  };

  return (
    <div className={`flex flex-col h-full w-full bg-[#0f172a] text-slate-300 font-mono text-xs md:text-sm border-t border-slate-800 ${isMaximized ? 'fixed inset-0 z-[200]' : 'relative'}`}>
      
      {/* HEADER */}
      <div className="h-10 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0 select-none">
        <div className="flex items-center gap-2 text-slate-400">
           <TerminalIcon className="w-4 h-4" />
           <span className="font-bold">user@{project?.name?.toLowerCase().replace(/\s/g,'-') || 'app'}: ~</span>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => { setHistory([]); triggerHaptic(); }} className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-white" title="Clear">
                <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { setIsMaximized(!isMaximized); triggerHaptic(); }} className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-white">
                {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            {isMaximized && (
               <button onClick={() => setIsMaximized(false)} className="p-1.5 hover:bg-red-900/50 rounded text-red-400 hover:text-red-200">
                   <Power className="w-3.5 h-3.5" />
               </button>
            )}
        </div>
      </div>

      {/* BODY */}
      <div 
        className="flex-1 overflow-y-auto p-4 bg-[#020617] cursor-text custom-scrollbar" 
        onClick={handleContainerClick}
        ref={scrollRef}
      >
        {history.map((line, i) => (
            <div key={i} className="mb-1 break-all whitespace-pre-wrap leading-relaxed">
                {/* USER INPUT ROW */}
                {line.type === 'user' && (
                    <div className="flex flex-wrap gap-2 text-slate-100 font-bold mt-3">
                        <span className="text-green-500">➜</span>
                        <span className="text-blue-400">{line.path || "~"}</span>
                        <span>{line.content}</span>
                    </div>
                )}
                
                {/* SYSTEM RESPONSE ROWS */}
                {line.type === 'system' && <div className="text-slate-500 opacity-80">{line.content}</div>}
                {line.type === 'info' && <div className="text-slate-300">{line.content}</div>}
                {line.type === 'success' && <div className="text-green-400 font-semibold">{line.content}</div>}
                {line.type === 'warning' && <div className="text-yellow-400">{line.content}</div>}
                {line.type === 'error' && <div className="text-red-400 font-bold">{line.content}</div>}
            </div>
        ))}

        {/* ACTIVE INPUT LINE */}
        <div className="flex gap-2 items-center mt-2">
            <span className="text-green-500 font-bold shrink-0">➜</span>
            <span className="text-blue-400 font-bold shrink-0">{currentPath}</span>
            <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono caret-green-500 min-w-[50px]"
                autoComplete="off"
                autoFocus
                spellCheck="false"
            />
        </div>
        
        <div className="h-24" /> {/* Spacer for mobile keyboards */}
      </div>
    </div>
  );
}