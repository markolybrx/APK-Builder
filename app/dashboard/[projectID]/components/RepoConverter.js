import { useState } from "react";
import { 
  Github, ArrowRight, AlertTriangle, FileCode, 
  Smartphone, CheckCircle, Loader2, GitFork 
} from "lucide-react";

export default function RepoConverter({ isOpen, onClose, onConvertSuccess, triggerHaptic }) {
  const [step, setStep] = useState('input'); // input, scanning, conflict, converting, success
  const [repoUrl, setRepoUrl] = useState("");
  const [detectedTech, setDetectedTech] = useState("");

  if (!isOpen) return null;

  const handleScan = () => {
    if (!repoUrl) return;
    triggerHaptic();
    setStep('scanning');

    // MOCK: Simulate scanning a non-Android repo
    setTimeout(() => {
      // Logic: If user types a python/web repo, we detect it
      const tech = repoUrl.includes("python") ? "Python/Flask" : "HTML/JS Web App";
      setDetectedTech(tech);
      setStep('conflict'); // Force a conflict for demo purposes
    }, 2000);
  };

  const handleConvert = () => {
    triggerHaptic();
    setStep('converting');

    // MOCK: Simulate the heavy lifting of conversion
    setTimeout(() => {
      setStep('success');
      // Update the parent workspace with new "Converted" files
      onConvertSuccess(); 
    }, 3500);
  };

  return (
    <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-500 hover:text-white"
        >
          ✕
        </button>

        {/* STEP 1: INPUT */}
        {step === 'input' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Github className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Import Repository</h3>
              <p className="text-slate-400 text-sm mt-2">
                Paste a GitHub link. We'll analyze and import it.
              </p>
            </div>

            <input 
              type="text" 
              placeholder="https://github.com/username/my-project"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500"
            />

            <button 
              onClick={handleScan}
              disabled={!repoUrl}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-95"
            >
              Scan Repository
            </button>
          </div>
        )}

        {/* STEP 2: SCANNING */}
        {step === 'scanning' && (
          <div className="text-center space-y-6 py-8">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white">Analyzing Structure...</h3>
              <p className="text-slate-400 text-sm">Checking for AndroidManifest.xml and Gradle build files.</p>
            </div>
          </div>
        )}

        {/* STEP 3: CONFLICT DETECTED */}
        {step === 'conflict' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
              <AlertTriangle className="w-10 h-10 text-yellow-500 shrink-0" />
              <div>
                <h4 className="font-bold text-yellow-500 text-sm">Incompatible Tech Stack</h4>
                <p className="text-xs text-yellow-200/70 mt-1">
                  We detected <strong>{detectedTech}</strong> files, which usually don't run natively on Android.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between px-4">
              <div className="text-center opacity-50">
                <FileCode className="w-8 h-8 mx-auto mb-1" />
                <span className="text-xs">Original</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600" />
              <div className="text-center text-blue-400">
                <Smartphone className="w-8 h-8 mx-auto mb-1" />
                <span className="text-xs font-bold">Native Android</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-slate-400 text-sm text-center">
                Would you like us to <strong>convert this logic</strong> to Java/Kotlin and create a NEW repository?
              </p>
              
              <button 
                onClick={handleConvert}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-500 transition-all"
              >
                <GitFork className="w-4 h-4" />
                Yes, Convert & Fork
              </button>
              
              <button 
                onClick={onClose}
                className="w-full py-3 bg-transparent border border-slate-700 text-slate-400 font-bold rounded-xl hover:text-white transition-all"
              >
                Cancel import
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONVERTING */}
        {step === 'converting' && (
          <div className="space-y-6 py-4">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-[progress_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
            </div>
            <div className="space-y-2 font-mono text-xs text-slate-400">
              <p className="text-green-400">> Translating logic...</p>
              <p>> Creating XML Layouts from HTML...</p>
              <p>> Generating MainActivity.kt...</p>
              <p>> Initializing new git repo: {repoUrl.split('/').pop()}-android...</p>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === 'success' && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Conversion Complete!</h3>
              <p className="text-slate-400 text-sm mt-2">
                Your project has been successfully converted to Android format.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700"
            >
              Open Project
            </button>
          </div>
        )}

      </div>
    </div>
  );
}