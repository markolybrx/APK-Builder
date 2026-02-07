"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkles, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">AppBuild</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {session ? (
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/login"
                className="text-slate-300 hover:text-white font-medium text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/login" // We send them to login to "Get Started"
                className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-200 rounded-lg font-bold text-sm transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}