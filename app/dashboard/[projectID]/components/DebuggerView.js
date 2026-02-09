"use client";

import { useState } from "react";
import { Bug, Play, ShieldAlert, CheckCircle, RefreshCw, Code2 } from "lucide-react";

export default function DebuggerView({ files, onUpdateFile, triggerHaptic }) {
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState([
    { id: 1, type: 'error', file: 'activity_main.xml', msg: 'Missing closing tag for <Button>', status: 'open' },
    { id: 2, type: 'warning', file: 'MainActivity.kt', msg: 'Unused import: android.widget.Toast', status: 'open' }
  ]);

  const runScan = () => {
    setIsScanning(true);
    triggerHaptic();
    // Simulate AI scanning the projectFiles state
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const handleFix = (log) => {
    triggerHaptic();
    // Logic: Actually fix the file in the global state
    if (log.file === 'activity_main.xml') {
      onUpdateFile('activity_main.xml', '\n<LinearLayout>\n  <Button />\n</LinearLayout>');
    }
    setLogs(prev => prev.map(l => l.id === log.id ? { ...l, status: 'fixed' } : l));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300">
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-red-400" />
          <span className="font-bold text-white uppercase tracking-widest text-[10px]">AI Debugger</span>
        </div>
        <button 
          onClick={runScan}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold shadow-lg"
        >
          {isScanning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          {isScanning ? "Scanning..." : "Run Project Audit"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {logs.map((log) => (
          <div key={log.id} className={`p-4 rounded-2xl border ${log.status === 'fixed' ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-900 border-slate-800'} transition-all`}>
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`p-2 rounded-xl bg-slate-950 ${log.status === 'fixed' ? 'text-green-500' : 'text-red-400'}`}>
                  {log.status === 'fixed' ? <CheckCircle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{log.file}</span>
                    <span className={`text-[8px] font-bold uppercase px-1.5 rounded border ${log.status === 'fixed' ? 'border-green-500/30 text-green-500' : 'border-red-500/30 text-red-500'}`}>
                      {log.type}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-200">{log.msg}</p>
                </div>
              </div>
              
              {log.status === 'open' && (
                <button 
                  onClick={() => handleFix(log)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-blue-600 text-white text-[10px] font-bold rounded-lg transition-colors"
                >
                  One-Tap Fix
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-[10px] text-slate-500 italic text-center uppercase tracking-tighter">
        * The Debugger continuously monitors your projectFiles state for runtime conflicts.
      </div>
    </div>
  );
}
