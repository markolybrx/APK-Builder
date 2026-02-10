"use client";

import { useMemo } from "react";
import { Bug, CheckCircle2, AlertTriangle, XCircle, FileCode } from "lucide-react";

export default function DebuggerView({ files = [], onUpdateFile, triggerHaptic }) {
  
  // REAL-TIME STATIC ANALYSIS
  const issues = useMemo(() => {
    const foundIssues = [];
    
    // 1. Gather all XML IDs across all layout files
    const declaredIds = new Set();
    files.filter(f => f.name.endsWith('.xml')).forEach(file => {
        const matches = [...file.content.matchAll(/android:id="\@\+id\/([^"]+)"/g)];
        matches.forEach(m => declaredIds.add(m[1]));
    });

    // 2. Scan Kotlin files for references
    files.filter(f => f.name.endsWith('.kt')).forEach(file => {
        // Check for findViewById calls
        const references = [...file.content.matchAll(/R\.id\.([a-zA-Z0-9_]+)/g)];
        
        references.forEach(match => {
            const idRef = match[1];
            if (!declaredIds.has(idRef)) {
                foundIssues.push({
                    severity: 'error',
                    file: file.name,
                    msg: `Missing View ID: '${idRef}' referenced in Kotlin but not found in any XML layout.`,
                });
            }
        });

        // Check for Empty Activity
        if (file.content.includes("class MainActivity") && !file.content.includes("setContentView")) {
             foundIssues.push({
                severity: 'warning',
                file: file.name,
                msg: `Activity declared without 'setContentView'. UI will be blank.`,
            });
        }
    });

    // 3. Scan XML for UX Issues
    files.filter(f => f.name.endsWith('.xml')).forEach(file => {
        if (file.content.includes("ConstraintLayout") && !file.content.includes("app:layout_")) {
             foundIssues.push({
                severity: 'warning',
                file: file.name,
                msg: `ConstraintLayout used but views lack constraints. Elements may jump to (0,0).`,
            });
        }
    });

    return foundIssues;
  }, [files]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-slate-300">
      <div className="h-12 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a] shrink-0">
         <div className="flex items-center gap-2 font-bold text-white">
            <Bug className="w-5 h-5 text-red-500" />
            <span>Lint & Debug</span>
         </div>
         <span className={`text-[10px] font-bold px-2 py-1 rounded ${issues.length > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {issues.length} ISSUES
         </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
         {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <div className="text-center">
                    <h3 className="text-lg font-bold text-white">All Systems Operational</h3>
                    <p className="text-sm text-slate-500">Static analysis found 0 compilation errors.</p>
                </div>
            </div>
         ) : (
             issues.map((issue, i) => (
                <div key={i} className={`p-4 rounded-xl border flex gap-4 ${issue.severity === 'error' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'} animate-in slide-in-from-left-2`}>
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
                        <p className="text-sm text-slate-200 font-medium leading-relaxed">{issue.msg}</p>
                    </div>
                </div>
             ))
         )}
      </div>
    </div>
  );
}