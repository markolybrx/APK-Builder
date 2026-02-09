"use client";

import Link from "next/link";
// Removed all database imports
// Removed all icon imports

export default function Dashboard() {
  // Static dummy data to test UI
  const projects = []; 

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        <h1 className="text-3xl font-bold text-white">Dashboard Safe Mode</h1>
        
        <p className="text-slate-400">
          If you can see this, the previous error was caused by the Database or Icons.
        </p>

        <div className="p-6 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
          <h3 className="text-xl font-bold mb-4">No Projects Yet</h3>
          
          <Link 
            href="/dashboard/create" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            + Create New App
          </Link>
        </div>

      </div>
    </div>
  );
}