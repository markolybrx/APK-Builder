"use client";

import { useState } from "react";
import { X, QrCode, Copy, Check, Smartphone, Wifi } from "lucide-react";

export default function QRShareModal({ isOpen, onClose, triggerHaptic }) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  // Uses the current URL for the QR code
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://visionary.app/preview';

  const handleCopy = () => {
    triggerHaptic?.();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden relative">
        
        {/* Neon Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]" />

        <div className="p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                <Smartphone className="w-6 h-6 text-blue-400" />
            </div>

            <h2 className="text-white font-bold text-xl mb-1">Live Preview</h2>
            <p className="text-slate-400 text-xs mb-8">Scan to run this build on your physical device.</p>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.15)] mb-8 group relative overflow-hidden">
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&color=0f172a`} 
                    alt="QR Code" 
                    className="w-48 h-48 mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" 
                />
                
                {/* Scanning Animation Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent h-1/2 w-full animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
            </div>

            {/* Network Status */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-green-500 mb-6 bg-green-500/10 px-3 py-1 rounded-full">
                <Wifi className="w-3 h-3" />
                <span>TUNNEL ACTIVE • LOW LATENCY</span>
            </div>

            {/* Copy Link Button */}
            <div className="flex gap-3 w-full">
                <button onClick={onClose} className="flex-1 py-3 text-slate-400 hover:text-white font-bold text-xs transition-colors">Dismiss</button>
                <button 
                    onClick={handleCopy}
                    className="flex-[2] py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy Link'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}