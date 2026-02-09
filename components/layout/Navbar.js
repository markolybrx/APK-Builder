"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Smartphone, Menu } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                AppBuild AI
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="#features" className="text-slate-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-slate-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Pricing
              </Link>
              
              {session ? (
                <>
                  <Link href="/dashboard" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-md text-sm font-medium transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                /* CRITICAL: Points to /login so you can see the Bypass Button */
                <Link
                  href="/login"
                  className="bg-white hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-md text-sm font-bold transition-all shadow-lg shadow-white/5"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button (Simple Version) */}
          <div className="md:hidden">
            {session ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-white text-slate-900 px-4 py-2 rounded-md text-sm font-bold"
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
