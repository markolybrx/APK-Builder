import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-20 space-y-8 max-w-4xl mx-auto">
        
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium uppercase tracking-widest mb-4">
          ✨ V1.0 Beta Now Live
        </div>
        
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Build Android Apps <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            With Just Words
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Describe your dream app, and our AI writes the code, compiles the APK, and delivers it ready to install. No coding required.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
          <Link 
            href="/dashboard/create" 
            className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 hover:scale-105"
          >
            Start Building Free
          </Link>
          
          <Link 
            href="/dashboard" 
            className="px-8 py-4 text-lg font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-6xl mx-auto mb-20">
        <FeatureCard 
          icon="⚡"
          title="Instant Code" 
          desc="Our engine translates English into perfect Kotlin & XML code in seconds."
        />
        <FeatureCard 
          icon="🚀"
          title="Cloud Build" 
          desc="We run the heavy Gradle build process on our servers, so you don't need a powerful PC."
        />
        <FeatureCard 
          icon="💎"
          title="Production Ready" 
          desc="Get a signed APK file that you can install on your phone or upload to the Play Store."
        />
      </section>
    </div>
  );
}

// Helper Component for Cards
function FeatureCard({ title, desc, icon }) {
  return (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-blue-500/30 hover:bg-white/10 transition-all group">
      <div className="text-4xl mb-4 bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
