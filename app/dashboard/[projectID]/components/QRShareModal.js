import { X, QrCode, Share2, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function QRShareModal({ isOpen, onClose, triggerHaptic }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://appbuild-live.vercel.app/test/698958221aac";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    triggerHaptic();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        <button onClick={onClose} className="self-end p-2 text-slate-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
          <QrCode className="w-8 h-8 text-blue-400" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Live Share</h3>
        <p className="text-slate-400 text-sm mb-6">
          Scan this code with another device to test your app in a real browser environment.
        </p>

        {/* MOCK QR CODE */}
        <div className="bg-white p-4 rounded-2xl mb-6 shadow-lg">
           <div className="w-40 h-40 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://appbuild-live.vercel.app/test/698958221aac')] bg-cover" />
        </div>

        <div className="flex w-full gap-2">
           <button 
             onClick={handleCopy}
             className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold border border-slate-700 active:scale-95 transition-all"
           >
             {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
             {copied ? "Copied" : "Copy Link"}
           </button>
           <button className="p-3 bg-blue-600 text-white rounded-xl active:scale-95 transition-all">
              <Share2 className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  );
}
