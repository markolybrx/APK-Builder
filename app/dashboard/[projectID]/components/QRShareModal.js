"use client";

import { useState } from "react";
import { X, QrCode, Copy, Check, Smartphone, Wifi, Share2 } from "lucide-react";

export default function QRShareModal({ isOpen, onClose, triggerHaptic }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Uses the current URL for the QR code (fallback for SSR)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://visionary.app/preview';

  const handleCopy = () => {
    triggerHaptic?.();
    if (typeof navigator !== 'undefined') {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm bg-black border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden relative z-10">

        {/* Neon Header Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]" />

        <div className="p-8 flex flex-col items-center text-center">
            
            {/* Icon Header */}
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800 shadow-lg relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity" />
                <Smartphone className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            </div>

            <h2 className="text-white font-bold text-2xl mb-1 tracking-tight">Live Preview</h2>
            <p className="text-zinc-500 text-sm mb-8">Scan to run this build on your physical device.</p>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.1)] mb-8 group relative overflow-hidden">
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&color=000000`} 
                    alt="QR Code" 
                    className="w-48 h-48 mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" 
                />

                {/* Scanning Laser Animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_15px_rgba(236,72,153,0.8)] animate-[scan-down_2s_linear_infinite] pointer-events-none" />
            </div>

            {/* Network Status */}
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-green-400 mb-8 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                <Wifi className="w-3 h-3 animate-pulse" />
                <span>SECURE TUNNEL ACTIVE • LOW LATENCY</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full">
                <button 
                    onClick={onClose} 
                    className="flex-1 py-3 text-zinc-500 hover:text-white font-bold text-xs transition-colors hover:bg-zinc-900 rounded-xl"
                >
                    Dismiss
                </button>
                <button 
                    onClick={handleCopy}
                    className="flex-[2] py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-zinc-800 hover:border-zinc-700"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                    {copied ? <span className="text-green-400">Copied to Clipboard</span> : 'Copy Link'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
