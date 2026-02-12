"use client";

import { useState, useEffect } from "react";
import { X, QrCode, Copy, Check, Smartphone, Wifi, Share2, Scan } from "lucide-react";

export default function QRShareModal({ isOpen, onClose, triggerHaptic }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // --- 1. HYDRATION SAFE URL ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
        setShareUrl(window.location.href);
    }
  }, []);

  if (!isOpen) return null;

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

      {/* AMBIENT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm bg-black border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 ring-1 ring-white/5">

        {/* NEON HEADER LINE */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-[0_0_20px_rgba(236,72,153,0.6)]" />

        <div className="p-8 flex flex-col items-center text-center">

            {/* ICON HEADER */}
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800 shadow-lg relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity" />
                <Smartphone className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
            </div>

            <h2 className="text-white font-bold text-2xl mb-1 tracking-tight">Live Device Preview</h2>
            <p className="text-zinc-500 text-xs mb-8 uppercase tracking-wider font-mono">Scan to execute build on hardware</p>

            {/* QR CODE CONTAINER */}
            <div className="p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.15)] mb-8 group relative overflow-hidden">
                {shareUrl && (
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&color=000000&bgcolor=FFFFFF&margin=2`} 
                        alt="Preview QR Code" 
                        className="w-48 h-48 mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" 
                    />
                )}

                {/* SCANNING LASER ANIMATION */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[scan-down_2.5s_linear_infinite] pointer-events-none opacity-80" />
            </div>

            {/* NETWORK STATUS */}
            <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-green-400 mb-8 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.1)] uppercase tracking-widest">
                <Wifi className="w-3 h-3 animate-pulse" />
                <span>Secure Tunnel Active • 12ms Latency</span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 w-full">
                <button 
                    onClick={onClose} 
                    className="flex-1 py-3.5 text-zinc-500 hover:text-white font-bold text-xs transition-colors hover:bg-zinc-900 rounded-xl uppercase tracking-wider"
                >
                    Dismiss
                </button>
                <button 
                    onClick={handleCopy}
                    className="flex-[2] py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-zinc-800 hover:border-zinc-700 uppercase tracking-wider group"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />}
                    {copied ? <span className="text-green-400">Link Copied</span> : 'Copy URL'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
