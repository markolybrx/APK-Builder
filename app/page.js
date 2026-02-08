import Link from "next/link";
import { getServerSession } from "next-auth"; // Server-side session check
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ArrowRight, Smartphone, Code2, CloudLightning, Sparkles, Terminal, Download } from "lucide-react";

export default async function Home() {
  // 1. AUTO-REDIRECT: Check if user is already logged in
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-matte-900 overflow-hidden text-white relative">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-neon-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 max-w-5xl mx-auto space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-xs font-bold uppercase tracking-widest backdrop-blur-md">
          <Sparkles className="w-3 h-3" />
          <span>V2.0 Public Beta Live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
          Turn Your Words Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple">
            Real Android Apps
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          No coding required. Describe your dream app, and our advanced AI engine writes the code, compiles the APK, and delivers it ready for the Play Store.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
          <Link 
            href="/login" 
            className="group flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-black bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl transition-all shadow-lg shadow-neon-blue/20 hover:scale-105"
          >
            Start Building Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-slate-600 text-sm border-t border-matte-border bg-matte-900">
        <p>© 2026 AppBuild AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
