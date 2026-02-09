"use client";

import { signIn } from "next-auth/react";
import { Github, Smartphone, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (provider) => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    // Container: Added 'px-4' to prevent edge touching
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] px-4 py-12 relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      {/* Main Card: Removed 'border', Added 'shadow-black/50' for depth */}
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50 relative z-10">

        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to start building your Android app.</p>
        </div>

        {/* Login Buttons */}
        <div className="space-y-4">

          <button
            onClick={() => handleLogin('github')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#24292F] text-white hover:bg-[#24292F]/90 font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>

          <button
            onClick={() => handleLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
               <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
               <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
               <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
               <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* --- DEV BYPASS SECTION --- */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/50 px-2 text-slate-500">Dev Option</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center justify-center gap-3 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/20 font-bold py-3.5 px-4 rounded-xl transition-all"
          >
            <ShieldAlert className="w-5 h-5" />
            Bypass Auth (Dev Only)
          </button>

        </div>

        <div className="mt-8 text-center text-xs text-slate-500 px-4">
          <p>By signing in, you agree to grant AppBuild access to create repositories on your behalf.</p>
        </div>

      </div>
    </div>
  );
}