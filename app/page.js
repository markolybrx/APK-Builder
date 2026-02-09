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
      color: "blue",
      features: ["Voice-to-Code", "Predictive UI", "Instant Scaffolding"]
    },
    {
      title: "Blueprinting",
      subtitle: "AI-Driven Design",
      desc: "Upload a screenshot of an app you love. Clone Vision converts pixels to native XML code in seconds.",
      icon: ScanLine,
      color: "pink",
      features: ["Clone Vision", "Asset Alchemist", "Material 3 Ready"]
    },
    {
      title: "Wiring",
      subtitle: "Visual Logic Mapping",
      desc: "Map out your app's flow with nodes. Record your own gestures to teach the AI how your app should behave.",
      icon: Share2,
      color: "purple",
      features: ["Logic Map", "Behavior Recorder", "Gesture Training"]
    },
    {
      title: "Polishing",
      subtitle: "Professional AI Audit",
      desc: "Get a 'Big Tech' finish. Our AI Critique audits your spacing, accessibility, and colors for a professional result.",
      icon: ShieldCheck,
      color: "yellow",
      features: ["AI Design Critique", "Auto-Fix Spacing", "Accessibility Scan"]
    },
    {
      title: "Readiness",
      subtitle: "Deployment & Testing",
      desc: "Beam your app to your physical phone via QR. Test real hardware sensors before you ever hit export.",
      icon: Activity,
      color: "green",
      features: ["QR-Live Share", "Sensor Bridge", "Signed APK Export"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. NAVIGATION */}
      <nav className="fixed top-0 inset-x-0 h-16 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800 z-[100] flex items-center justify-between px-6 lg:px-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white tracking-tighter text-lg">AppBuild AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold hover:text-white transition-colors">Login</Link>
          <Link href="/dashboard" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
            Start Building
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-40 pb-20 px-6 text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4" />
          THE FUTURE OF NO-CODE IS HERE
        </div>

        <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          Build Professional Apps at the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Speed of Thought.</span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The first mobile-native IDE that turns founders into builders. Speak, sketch, or snap—our AI handles the complex Android architecture for you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-extrabold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-xl">
            Create Your First Project <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
            <Play className="w-5 h-5 fill-current" /> Watch the Vision
          </button>
        </div>
      </section>

      {/* 3. THE VISIONARY'S JOURNEY (Roadmap Section) */}
      <section className="py-24 px-6 lg:px-20 bg-slate-950/50 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">The Visionary's Journey</h2>
          <p className="text-slate-500">From a napkin sketch to a production-ready APK in five stages.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 -translate-y-1/2 opacity-20" />

          {roadmap.map((step, i) => (
            <div 
              key={i}
              onMouseEnter={() => setActiveStep(i)}
              className={`
                p-6 rounded-3xl border transition-all duration-300 relative bg-[#020617] cursor-default
                ${activeStep === i ? 'border-blue-500 shadow-2xl scale-105 z-10' : 'border-slate-800 opacity-60 hover:opacity-100'}
              `}
            >
              <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center bg-${step.color}-600/20 text-${step.color}-400`}>
                <step.icon className="w-6 h-6" />
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Stage 0{i+1}</h4>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{step.desc}</p>
              
              <div className="space-y-2">
                {step.features.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                    <Zap className="w-3 h-3 text-yellow-500" /> {feat}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. KEY FEATURE SHOWCASE */}
      <section className="py-24 px-6 lg:px-20 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Stop explaining logic.<br/>Start performing it.
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Our <strong>Behavior Recorder</strong> and <strong>Logic Map</strong> allow you to build complex app architecture without touching code. Simply record your gestures or wire up screens visually, and the AI generates the native Android listeners for you.
          </p>
          <div className="space-y-4">
             <FeatureItem title="Hardware Bridge" desc="Link real phone sensors like GPS and Accelerometer directly to your project logic." />
             <FeatureItem title="Clone Vision" desc="Analyze any screenshot to generate professional UI code instantly." />
             <FeatureItem title="Repo Converter" desc="Import GitHub repos and watch AI translate Python or JS into native Android logic." />
          </div>
        </div>

        <div className="relative group">
           <div className="absolute inset-0 bg-blue-600/20 blur-[100px] group-hover:bg-purple-600/20 transition-colors" />
           <div className="relative bg-slate-900 border border-slate-800 rounded-[3rem] p-4 shadow-2xl overflow-hidden aspect-[9/16] max-w-[320px] mx-auto">
              <div className="w-full h-full bg-[#020617] rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20">
                    <Share2 className="w-10 h-10 text-blue-400" />
                 </div>
                 <h4 className="text-white font-bold mb-2">Logic Mapping</h4>
                 <p className="text-slate-500 text-xs">AI is generating Navigation Graph...</p>
                 <div className="w-full h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
                    <div className="w-2/3 h-full bg-blue-600 animate-[loading_2s_ease-in-out_infinite]" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 5. FOOTER CTA */}
      <section className="py-24 px-6 text-center border-t border-slate-900">
        <h2 className="text-4xl font-bold text-white mb-8">Ready to bring your vision to life?</h2>
        <Link href="/dashboard" className="px-10 py-5 bg-blue-600 text-white font-extrabold rounded-2xl inline-flex items-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 text-lg">
          Get Started for Free <ChevronRight className="w-6 h-6" />
        </Link>
        <p className="mt-6 text-slate-500 text-sm italic">No credit card required. Start building in seconds.</p>
      </section>
    </div>
  );
}

function FeatureItem({ title, desc }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
      </div>
      <div>
        <h5 className="font-bold text-white text-sm uppercase tracking-tighter mb-1">{title}</h5>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}