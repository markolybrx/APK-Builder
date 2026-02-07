import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-2xl tracking-tighter text-white flex items-center gap-2">
              <span className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">AI</span>
              AppGen
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard/create" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                + New App
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu Icon (Simple version) */}
          <div className="md:hidden">
            <Link href="/dashboard/create" className="text-blue-400 font-bold">New App</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
