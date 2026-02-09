"use client";

import { useState } from "react";
import { 
  Github, ArrowRight, AlertTriangle, FileCode, 
  Smartphone, CheckCircle, Loader2, GitFork 
} from "lucide-react";

export default function RepoConverter({ 
  isOpen, 
  onClose, 
  onUpdateFile, // NEW: Required to write converted code to the explorer
  triggerHaptic 
}) {
  const [step, setStep] = useState('input'); 
  const [repoUrl, setRepoUrl] = useState("");
  const [detectedTech, setDetectedTech] = useState("");

  if (!isOpen) return null;

  const handleScan = () => {
    if (!repoUrl) return;
    triggerHaptic();
    setStep('scanning');

    setTimeout(() => {
      // Simulate detection logic
      const isPython = repoUrl.toLowerCase().includes("python") || repoUrl.toLowerCase().includes("flask");
      const tech = isPython ? "Python/Flask" : "HTML/JS Web App";
      setDetectedTech(tech);
      setStep('conflict'); 
    }, 2000);
  };

  const handleConvert = () => {
    triggerHaptic();
    setStep('converting');

    // --- REAL TRANSLATION LOGIC SIMULATION ---
    setTimeout(() => {
      if (detectedTech.includes("Python")) {
        // Translate Python logic to Kotlin
        onUpdateFile("MainActivity.kt", `// Converted from Python Flask
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState);
        // Translated @app.route('/') logic to onCreate
        val message = "Hello from converted Python Backend"
        Log.d("AppBuild", message)
    }
}`);
      } else {
        // Translate HTML/JS to XML Layout
        onUpdateFile("activity_main.xml", `<LinearLayout 
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#f8f9fa"
    android:orientation="vertical">
    <TextView 
        android:text="Web View Converted" 
        android:textSize="24sp" />
</LinearLayout>`);
      }

      setStep('success');
    }, 3500);
  };

  return (
    <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>

        {/* STEP 1: INPUT */}
        {step === 'input' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <Github className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Convert Repository</h3>
              <p className="text-slate-400 text-sm mt-2">Paste a non-Android repo link. We'll translate the logic to native Kotlin.</p>
            </div>
            <input 
              type="text" 
              placeholder="https://github.com/user/python-flask-app"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 font-mono text-xs"
            />
            <button 
              onClick={handleScan}
              disabled={!repoUrl}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
            >
              Start AI Analysis
            </button>
          </div>
        )}

        {/* STEP 2: SCANNING */}
        {step === 'scanning' && (
          <div className="text-center space-y-6 py-8">
            <div className="relative w-16 h-16 mx-auto">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin absolute inset-0" />
                <Github className="w-6 h-6 text-white absolute inset-0 m-auto" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Deconstructing Source...</h3>
              <p className="text-slate-400 text-xs font-mono">Identifying backend routes & logic patterns.</p>
            </div>
          </div>
        )}

        {/* STEP 3: CONFLICT / TRANSLATION PREVIEW */}
        {step === 'conflict' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <AlertTriangle className="w-10 h-10 text-blue-400 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-400 text-sm">Logic Translation Needed</h4>
                <p className="text-xs text-slate-400 mt-1">Detected: <strong>{detectedTech}</strong>. AI will map functions to Android Lifecycle methods.</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <div className="text-center">
                <FileCode className="w-8 h-8 text-slate-600 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-600">{detectedTech}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-500 animate-pulse" />
              <div className="text-center">
                <Smartphone className="w-8 h-8 text-blue-400 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-blue-400">Kotlin Native</span>
              </div>
            </div>

            <button 
              onClick={handleConvert}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-500 shadow-xl shadow-blue-500/20"
            >
              <GitFork className="w-4 h-4" /> Start AI Translation
            </button>
          </div>
        )}

        {/* STEP 4: CONVERTING */}
        {step === 'converting' && (
          <div className="space-y-6 py-4">
             <div className="flex items-center justify-between text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                <span>Translating Assets</span>
                <span>74%</span>
             </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-[loading_2s_infinite]" style={{width: '74%'}}></div>
            </div>
            <div className="space-y-2 font-mono text-[10px] text-slate-500">
              <p className="text-blue-400">&gt; Mapping Python @app.route to Android Activity...</p>
              <p>&gt; Converting HTML DOM to XML View Hierarchy...</p>
              <p>&gt; Generating build.gradle dependencies...</p>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === 'success' && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Ready for Mobile</h3>
            <p className="text-slate-400 text-sm">Logic successfully ported to <strong>Kotlin</strong>. Files are now in your explorer.</p>
            <button onClick={onClose} className="w-full py-4 bg-slate-100 text-black font-extrabold rounded-xl hover:bg-white transition-all">
              Launch Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
