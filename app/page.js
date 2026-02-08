"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Code2, CloudLightning, Sparkles, Terminal, Download } from "lucide-react";

export default function Home() {
  return (
    // UPDATED: Uses 'bg-matte-900' and text colors to match the new theme
    <div className="flex flex-col min-h-screen bg-matte-900 overflow-hidden text-white">
      
      {/* Background Gradients (Matches globals.css) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 max-w-5xl mx-auto space-y-8">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-xs font-bold uppercase tracking-widest backdrop-blur-md"
        >
          <Sparkles className="w-3 h-3" />
          <span>V2.0 Public Beta Live</span>
        </motion.div>
        
        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
        >
          Turn Your Words Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple animate-pulse-slow">
            Real Android Apps
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          No coding required. Describe your dream app, and our advanced AI engine writes the code, compiles the APK, and delivers it ready for the Play Store.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center"
        >
          {/* UPDATED: Neon Gradient Button */}
          <Link 
            href="/login" 
            className="group flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-black bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl transition-all shadow-lg shadow-neon-blue/20 hover:scale-105 hover:shadow-neon-blue/40"
          >
            Start Building Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="#how-it-works"
            className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-slate-300 bg-matte-800 border border-matte-border rounded-xl hover:bg-matte-700 transition-all backdrop-blur-sm"
          >
            <Smartphone className="w-5 h-5" />
            View Demo
          </Link>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 bg-matte-800/50 border-y border-matte-border scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">From Idea to APK in Minutes</h2>
            <p className="text-slate-400">Our engine handles the complex engineering so you don't have to.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              step="01"
              title="Describe It"
              desc="Tell our AI what you want. 'A fitness tracker with a dark mode and a timer.'"
              icon={<Terminal className="w-6 h-6 text-neon-blue" />}
            />
            <StepCard 
              step="02"
              title="AI Builds It"
              desc="We generate full Android Studio projects: Kotlin, XML, and Gradle files."
              icon={<Code2 className="w-6 h-6 text-neon-purple" />}
            />
            <StepCard 
              step="03"
              title="Download APK"
              desc="Our cloud servers compile the code and give you a signed APK ready to install."
              icon={<Download className="w-6 h-6 text-green-400" />}
            />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<CloudLightning className="w-6 h-6 text-yellow-400" />}
            title="Instant Generation" 
            desc="Our proprietary model translates natural language into production-grade Kotlin code in seconds."
          />
          <FeatureCard 
            icon={<Smartphone className="w-6 h-6 text-neon-blue" />}
            title="Native Android" 
            desc="We don't build web-wrappers. You get real, performant native apps that access the camera, GPS, and sensors."
          />
          <FeatureCard 
            icon={<Code2 className="w-6 h-6 text-green-400" />}
            title="Play Store Ready" 
            desc="Export signed AAB bundles that meet all Google Play Console requirements for immediate publishing."
          />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-slate-600 text-sm border-t border-matte-border bg-matte-900">
        <p>© 2026 AppBuild AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Components

function StepCard({ step, title, desc, icon }) {
  return (
    <div className="relative p-8 rounded-2xl bg-matte-900 border border-matte-border hover:border-neon-blue/30 transition-colors">
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-matte-800 rounded-xl border border-matte-border flex items-center justify-center text-slate-400 font-mono font-bold">
        {step}
      </div>
      <div className="mb-4 p-3 bg-matte-800 rounded-lg w-fit border border-matte-border">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-matte-800/50 border border-matte-border hover:border-neon-blue/30 hover:bg-matte-800 transition-all group"
    >
      <div className="w-12 h-12 mb-4 rounded-xl bg-matte-900 flex items-center justify-center group-hover:scale-110 transition-transform border border-matte-border">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}
