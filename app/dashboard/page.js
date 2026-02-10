"use client";

import Link from "next/link";
import { Plus, Search, MoreVertical, Folder, Clock, Zap } from "lucide-react";

export default function Dashboard() {
  // Static dummy data to visualize the theme safely
  const projects = [
    { id: 'p1', name: "E-Commerce App", updated: "2 mins ago", version: "v1.4" },
    { id: 'p2', name: "Fitness Tracker", updated: "2 hours ago", version: "v0.9" },
    { id: 'p3', name: "Social Feed", updated: "1 day ago", version: "v2.1" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 selection:bg-pink-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                    <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
              </div>
              <p className="text-zinc-500">Manage your neural projects</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-pink-500 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 outline-none w-64 transition-all" 
                 />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 p-[1px]">
                 <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <span className="font-bold text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">VD</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           {/* Create New Card */}
           <Link href="/dashboard/create" className="group relative h-64 rounded-3xl border border-zinc-800 border-dashed hover:border-zinc-600 bg-zinc-900/10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:border-pink-500/50 transition-all shadow-lg">
                 <Plus className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <span className="font-bold text-zinc-500 group-hover:text-white transition-colors">Create New Project</span>
           </Link>

           {/* Project Cards */}
           {projects.map((p) => (
             <Link key={p.id} href={`/dashboard/${p.id}`} className="group relative h-64 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between hover:bg-zinc-900/50 hover:border-zinc-700 transition-all overflow-hidden">
                {/* Neon Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500" />
                
                <div className="flex justify-between items-start relative z-10">
                   <div className="w-12 h-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center group-hover:border-pink-500/50 transition-colors shadow-inner">
                      <Folder className="w-5 h-5 text-zinc-400 group-hover:text-pink-400 transition-colors" />
                   </div>
                   <button className="p-2 hover:bg-black rounded-lg text-zinc-600 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                </div>

                <div className="relative z-10">
                   <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-100 transition-colors">{p.name}</h3>
                   <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.updated}</span>
                      <span className="text-zinc-700">•</span>
                      <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{p.version}</span>
                   </div>
                </div>
             </Link>
           ))}

        </div>
      </div>
    </div>
  );
}