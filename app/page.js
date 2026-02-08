import Link from "next/link";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { 
  ArrowRight, 
  Smartphone, 
  Code2, 
  CloudLightning, 
  Sparkles, 
  Download 
} from "lucide-react";

export default async function Home() {
  // 1. AUTO-REDIRECT: Check if user is already logged in
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-hidden text-white relative selection:bg-neon-blue selection:text-white">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 max-w-5xl mx-auto space-y-8">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
          <Sparkles className="w-3 h-3" />
          <span>V2.0 Public Beta Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
          Turn Your Words Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500">
            Real Android Apps
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          No coding required. Describe your dream app, and our advanced AI engine writes the code, compiles the APK, and delivers it ready for the Play Store.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
          <Link 
            href="/api/auth/signin" 
            className="group flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:scale-105 hover:shadow-blue-500/40"
          >
            Start Building Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Sales Strategy / Features Section (RESTORED) */}
      <section className="relative z-10 py-24 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
              Why Choose AppBuild AI?
            </h2>
            <p className="mt-4 text-slate-400 text-lg">Stop paying developers $5,000+. Build it yourself in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-black border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] group">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                <CloudLightning className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-slate-400 leading-relaxed">
                Generate a full codebase in under 60 seconds. Our specialized AI models are trained on millions of Android repositories to deliver speed without compromise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-black border border-slate-800 hover:border-purple-500/50 transition-all hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)] group">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                <Code2 className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Clean Code Export</h3>
              <p className="text-slate-400 leading-relaxed">
                You own the code. Unlike other builders that lock you in, we provide the full Android Studio project source files to customize or publish anywhere.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-black border border-slate-800 hover:border-pink-500/50 transition-all hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.15)] group">
              <div className="w-14 h-14 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-pink-500/20">
                <Smartphone className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real APK Files</h3>
              <p className="text-slate-400 leading-relaxed">
                We don't just give you snippets. Our cloud build servers compile a ready-to-install .APK file directly to your phone. No laptop required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-slate-600 text-sm border-t border-white/5 bg-slate-950">
        <p>© 2026 AppBuild AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
