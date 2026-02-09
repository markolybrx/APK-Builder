"use client";

import { signIn } from "next-auth/react";
import { Github, Chrome, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [bypassLoading, setBypassLoading] = useState(false);

  const handleLogin = async (provider) => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  const handleBypass = () => {
    setBypassLoading(true);
    // Force a hard reload to the dashboard
    window.location.href = "/dashboard";
  };

  return (
    // NUCLEAR FIX: 'fixed inset-0' forces this page to cover the entire screen
    // It sits on top of all other layouts, navbars, and containers.
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a] px-4 overflow-y-auto">
      
      {/* Main Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">

        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to start building.</p>
        </div>

        <div className="space-y-3">
          {/* GitHub Button */}
          <button
            type="button"
            onClick={() => handleLogin('github')}
            disabled={isLoading || bypassLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#24292F] text-white hover:bg-[#24292F]/90 font-bold py-3 rounded-xl transition-all border border-slate-700 disabled:opacity-50"
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </button>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleLogin('google')}
            disabled={isLoading || bypassLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            <Chrome className="w-5 h-5 text-blue-600" />
            <span>Continue with Google</span>
          </button>

          {/* Separator */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">Dev Option</span>
            </div>
          </div>

          {/* BYPASS BUTTON - Now shows loading state */}
          <button
            type="button"
            onClick={handleBypass}
            disabled={isLoading || bypassLoading}
            className="w-full flex items-center justify-center gap-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/20 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>
              {bypassLoading ? "Redirecting..." : "Bypass Auth (Dev Only)"}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}