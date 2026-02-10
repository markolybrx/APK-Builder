"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Share2, ScanLine, Smartphone, 
  ChevronRight, Code2, Zap, ShieldCheck, 
  Activity, ArrowRight, Play, Mic 
} from "lucide-react";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  const roadmap = [
    {
      title: "The Spark",
      subtitle: "Ideation via Chat & Voice",
      desc: "Speak your idea into existence. Our AI understands high-level intent to build the foundation of your app instantly.",
      icon: Mic,
      features: ["Voice-to-Code", "Predictive UI", "Instant Scaffolding"]
    },
    {
      title: "Blueprinting",
      subtitle: "AI-Driven Design",
      desc: "Upload a screenshot of an app you love. Clone Vision converts pixels to native XML code in seconds.",
      icon: ScanLine,
      features: ["Clone Vision", "Asset Alchemist", "Material 3 Ready"]
    },
    {
      title: "Wiring",
      subtitle: "Visual Logic Mapping",
      desc: "Map out your app's flow with nodes. Record your own gestures to teach the AI how your app should behave.",
      icon: Share2,
      features: ["Logic Map", "Behavior Recorder", "Gesture Training"]
    },
    {
      title: "Polishing",
      subtitle: "Professional AI Audit",
      desc: "Get a 'Big Tech' finish. Our AI Critique audits your spacing, accessibility, and colors for a professional result.",
      icon: ShieldCheck,
      features: ["AI Design Critique", "Auto-Fix Spacing", "Accessibility Scan"]
    },
    {
      title: "Readiness",
      subtitle: "Deployment & Testing",
      desc: "Beam your app to your physical phone via QR. Test real hardware sensors before you ever hit export.",
      icon: Activity,
      features: ["QR-Live Share", "Sensor Bridge", "Signed APK Export"]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-pink-500/30 overflow-x-hidden">

      {/* 1. NAVIGATION */}
      <nav className="fixed top-0 inset-x-0 h-16 bg-black/80 backdrop-blur-xl border-b border-zinc-800 z-[100] flex items-center justify-between px-6 lg:px-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.4)]">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white tracking-tighter text-lg">AppBuild AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold hover:text-white transition-colors">Login</Link>
          <Link href="/dashboard" className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 text-sm font-bold rounded-xl transition-all shadow-lg shadow-white/10">
            Start Building
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-40 pb-20 px-6 text-center relative overflow-hidden">
        {/* Neon Glow Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute top-40 left-1/3 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[100px] -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          THE FUTURE OF NO-CODE IS HERE
        </div>

        <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          Build Professional Apps at the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">Speed of Thought.</span>
        </h1>

        <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          The first mobile-native IDE that turns founders into builders. Speak, sketch, or snap—our AI handles the complex Android architecture for you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-600 to-blue-600 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_-5px_rgba(236,72,153,0.5)]">
            Create Your First Project <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all hover:border-zinc-700">
            <Play className="w-5 h-5 fill-current" /> Watch the Vision
          </button>
        </div>
      </section>

      {/* 3. THE VISIONARY'S JOURNEY (Roadmap Section) */}
      <section className="py-24 px-6 lg:px-20 bg-zinc-950/50 relative border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">The Visionary's Journey</h2>
          <p className="text-zinc-500">From a napkin sketch to a production-ready APK in five stages.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 -translate-y-1/2 opacity-20" />

          {roadmap.map((step, i) => (
            <div 
              key={i}
              onMouseEnter={() => setActiveStep(i)}
              className={`
                p-6 rounded-3xl border transition-all duration-500 relative cursor-default
                ${activeStep === i 
                    ? 'bg-zinc-900/80 border-pink-500/50 shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)] z-10 scale-105' 
                    : 'bg-zinc-900/20 border-zinc-800 hover:border-zinc-700'
                }
              `}
            >
              <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center transition-colors duration-300
                ${activeStep === i ? 'bg-gradient-to-br from-pink-500 to-blue-500 text-white' : 'bg-zinc-900 text-zinc-600 border border-zinc-800'}
              `}>
                <step.icon className="w-6 h-6" />
              </div>
              <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors ${activeStep === i ? 'text-pink-400' : 'text-zinc-600'}`}>
                Stage 0{i+1}
              </h4>
              <h3 className={`text-lg font-bold mb-2 transition-colors ${activeStep === i ? 'text-white' : 'text-zinc-300'}`}>
                {step.title}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">{step.desc}</p>

              <div className="space-y-2">
                {step.features.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase">
                    <Zap className={`w-3 h-3 ${activeStep === i ? 'text-blue-400' : 'text-zinc-700'}`} /> {feat}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. KEY FEATURE SHOWCASE */}
      <section className="py-24 px-6 lg:px-20 grid lg:grid-cols-2 gap-20 items-center border-t border-zinc-900">
        <div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Stop explaining logic.<br/>Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">performing</span> it.
          </h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Our <strong>Behavior Recorder</strong> and <strong>Logic Map</strong> allow you to build complex app architecture without touching code. Simply record your gestures or wire up screens visually, and the AI generates the native Android listeners for you.
          </p>
          <div className="space-y-4">
             <FeatureItem title="Hardware Bridge" desc="Link real phone sensors like GPS and Accelerometer directly to your project logic." />
             <FeatureItem title="Clone Vision" desc="Analyze any screenshot to generate professional UI code instantly." />
             <FeatureItem title="Repo Converter" desc="Import GitHub repos and watch AI translate Python or JS into native Android logic." />
          </div>
        </div>

        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-blue-500/20 blur-[100px] transition-colors" />
           <div className="relative bg-black border border-zinc-800 rounded-[3rem] p-4 shadow-2xl overflow-hidden aspect-[9/16] max-w-[320px] mx-auto">
              <div className="w-full h-full bg-zinc-950 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                 {/* Grid Background */}
                 <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                 
                 <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800 relative z-10 shadow-lg">
                    <Share2 className="w-10 h-10 text-pink-500" />
                 </div>
                 <h4 className="text-white font-bold mb-2 relative z-10">Logic Mapping</h4>
                 <p className="text-zinc-500 text-xs relative z-10">AI is generating Navigation Graph...</p>
                 <div className="w-full h-1 bg-zinc-800 rounded-full mt-6 overflow-hidden relative z-10">
                    <div className="w-2/3 h-full bg-gradient-to-r from-pink-500 to-blue-500 animate-[loading_2s_ease-in-out_infinite]" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 5. FOOTER CTA */}
      <section className="py-24 px-6 text-center border-t border-zinc-900 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black" />
        
        <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-8">Ready to bring your vision to life?</h2>
            <Link href="/dashboard" className="px-10 py-5 bg-gradient-to-r from-pink-600 to-blue-600 text-white font-extrabold rounded-2xl inline-flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(236,72,153,0.5)] text-lg">
            Get Started for Free <ChevronRight className="w-6 h-6" />
            </Link>
            <p className="mt-6 text-zinc-500 text-sm italic">No credit card required. Start building in seconds.</p>
        </div>
      </section>
    </div>
  );
}

function FeatureItem({ title, desc }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-pink-500 transition-colors">
        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full group-hover:bg-pink-500 transition-colors" />
      </div>
      <div>
        <h5 className="font-bold text-white text-sm uppercase tracking-tighter mb-1 group-hover:text-pink-400 transition-colors">{title}</h5>
        <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}