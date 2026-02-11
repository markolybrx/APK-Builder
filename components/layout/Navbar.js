"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Smartphone, Menu, LayoutDashboard, LogOut, Code2 } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                AppBuild AI
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link href="#features" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                Pricing
              </Link>

              {session ? (
                <>
                  <div className="h-4 w-px bg-zinc-800" />
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 text-zinc-300 hover:text-white text-sm font-bold transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                /* CRITICAL: Points to /login so you can see the Bypass Button */
                <Link
                  href="/login"
                  className="bg-white hover:bg-zinc-200 text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button (Simple Version) */}
          <div className="md:hidden flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-bold"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold"
              >
                Log In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}