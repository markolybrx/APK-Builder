import { useState, useRef } from "react";
import { 
  Camera, Image as ImageIcon, UploadCloud, 
  Smartphone, ArrowRight, Loader2, CheckCircle, X 
} from "lucide-react";

export default function CloneVision({ isOpen, onClose, onCloneSuccess, triggerHaptic }) {
  const [step, setStep] = useState('upload'); // upload, analyzing, confirming, generating, success
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      triggerHaptic();
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
      setStep('analyzing');
      
      // MOCK: Simulate AI analyzing the UI hierarchy
      setTimeout(() => setStep('confirming'), 2000);
    }
  };

  const handleGenerate = () => {
    triggerHaptic();
    setStep('generating');
    
    // MOCK: Simulate XML generation from pixels
    setTimeout(() => {
        setStep('success');
        setTimeout(() => {
            onCloneSuccess();
        }, 1500);
    }, 3000);
  };

  return (
    <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X className="w-5 h-5"/>
        </button>

        {/* STEP 1: UPLOAD SCREENSHOT */}
        {step === 'upload' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto text-purple-400">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Clone Vision</h3>
              <p className="text-slate-400 text-sm mt-2">Upload a screenshot of an app you like. We'll build the layout automatically.</p>
            </div>

            <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 hover:border-purple-500 transition-all"
            >
                <UploadCloud className="w-10 h-10 text-slate-500 mb-2" />
                <span className="text-sm font-bold text-slate-300">Tap to Upload Screenshot</span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
          </div>
        )}

        {/* STEP 2: AI ANALYSIS */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
             <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-700">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1 bg-purple-500/50 absolute top-1/2 animate-[ping_1s_infinite]" />
                    <Loader2 className="w-10 h-10 text-white animate-spin drop-shadow-lg" />
                </div>
             </div>
             <p className="text-slate-300 font-mono text-[10px] animate-pulse">Detecting UI Elements...</p>
          </div>
        )}

        {/* STEP 3: ELEMENT CONFIRMATION */}
        {step === 'confirming' && (
           <div className="space-y-4">
              <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl">
                 <Smartphone className="w-6 h-6 text-purple-400" />
                 <div>
                    <h4 className="font-bold text-purple-400 text-sm">UI Detected</h4>
                    <p className="text-[10px] text-purple-200/70">Found: Toolbar, Hero Image, and Action Buttons.</p>
                 </div>
              </div>
              <div className="h-40 bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-10" />
                 <pre className="text-[9px] text-green-400 font-mono leading-tight">
                    {`<LinearLayout ... >
  <Toolbar android:id="@+id/nav" ... />
  <ImageView android:src="@drawable/hero" ... />
  <Button text="Sign Up" ... />
...</LinearLayout>`}
                 </pre>
              </div>
              <button onClick={handleGenerate} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20">
                 Generate Layout
              </button>
           </div>
        )}

        {/* STEP 4: GENERATING NATIVE CODE */}
        {step === 'generating' && (
           <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-purple-500 animate-spin" />
              <div className="space-y-1">
                 <h3 className="text-lg font-bold text-white">Writing XML...</h3>
                 <p className="text-slate-500 text-xs">Matching fonts and styling resources...</p>
              </div>
           </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === 'success' && (
           <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 animate-in zoom-in">
                 <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Layout Cloned!</h3>
              <p className="text-slate-400 text-sm">The native layout has been successfully added to your project.</p>
           </div>
        )}
      </div>
    </div>
  );
}
