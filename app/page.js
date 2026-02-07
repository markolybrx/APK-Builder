import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-8 bg-gradient-to-b from-slate-900 to-slate-800">
      
      {/* Hero Section */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-blue-400 uppercase bg-blue-900/30 rounded-full border border-blue-800">
          Beta Access
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
          Text to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Android App</span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Describe your dream app, and our AI will code, compile, and build the APK file for you. No coding knowledge required.
        </p>
      </div>

      {/* Call to Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link 
          href="/dashboard/create" 
          className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25"
        >
          Start Building Free
        </Link>
        
        <Link 
          href="/dashboard" 
          className="px-8 py-4 text-lg font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all"
        >
          View Demo
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-left max-w-5xl">
        <FeatureCard 
          title="AI Generated Code" 
          desc="Our engine writes Kotlin & XML perfectly tailored to your request."
          icon="🤖"
        />
        <FeatureCard 
          title="Instant APK Build" 
          desc="We run a cloud build pipeline to deliver a ready-to-install APK file."
          icon="⚡"
        />
        <FeatureCard 
          title="Google Play Ready" 
          desc="Export signed AAB files ready for the Play Store console."
          icon="🚀"
        />
      </div>
    </div>
  );
}

// A small helper component for the grid
function FeatureCard({ title, desc, icon }) {
  return (
    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-blue-500/50 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}
