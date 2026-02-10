"use client";

import { useMemo } from "react";
import { Bug, CheckCircle2, AlertTriangle, XCircle, FileCode } from "lucide-react";

export default function DebuggerView({ files = [], onUpdateFile, triggerHaptic }) {
  
  // Real-time Static Analysis of the VFS
  const issues = useMemo(() => {
    const foundIssues = [];
    const xmlFile = files.find(f => f.name.endsWith('.xml'))?.content || "";
    const ktFile = files.find(f => f.name.endsWith('.kt'))?.content || "";

    // 1. Check for missing IDs in Kotlin
    const xmlIds = [...xmlFile.matchAll(/android:id="\@\+id\/([^"]+)"/g)].map(m => m[1]);
    
    xmlIds.forEach(id => {
        if (!ktFile.includes(id) && !ktFile.includes(`R.id.${id}`)) {
            foundIssues.push({
                severity: 'warning',
                file: 'MainActivity.kt',
                msg: `Unused View ID: '${id}' is defined in XML but not referenced in Kotlin.`,
                line: 12
            });
        }
    });

    // 2. Check for Hardcoded Strings
    if (xmlFile.includes('android:text="')) {
        foundIssues.push({
            severity: 'error',
            file: 'activity_main.xml',
            msg: 'Hardcoded string detected. Use @string/ resource instead.',
            line: 5
        });
    }

    return foundIssues;
  }, [files]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-slate-300">
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]">
         <div className="flex items-center gap-2 font-bold text-white">
            <Bug className="w-5 h-5 text-red-500" />
            <span>Lint & Debug</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">{issues.length} ISSUES FOUND</span>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
         {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 opacity-50">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-lg font-bold text-white">All Systems Operational</h3>
                <p className="text-sm text-slate-500">No static analysis errors detected.</p>
            </div>
         ) : (
             issues.map((issue, i) => (
                <div key={i} className={`p-4 rounded-xl border flex gap-4 ${issue.severity === 'error' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                    <div className="mt-1">
                        {issue.severity === 'error' ? <XCircle className="w-5 h-5 text-red-500" /> : <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${issue.severity === 'error' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                {issue.severity}
                            </span>
                            <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                                <FileCode className="w-3 h-3" /> {issue.file}
                            </span>
                        </div>
                        <p className="text-sm text-slate-200 font-medium">{issue.msg}</p>
                    </div>
                </div>
             ))
         )}
      </div>
    </div>
  );
}
