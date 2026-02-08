"use client";

import { useSession, signIn } from "next-auth/react";
import { Github, Smartphone, Link as LinkIcon, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, you would fetch the list of connected accounts from your DB here.
  // For now, we assume if they have an image from github, they are connected, etc.
  // Or simply allow them to trigger the link flow.

  const handleLink = async (provider) => {
    setIsLoading(true);
    // NextAuth Magic: If you are already logged in and call signIn, 
    // it automatically links the new account to the current user.
    await signIn(provider, { callbackUrl: "/dashboard/settings" });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

      <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-blue-400" />
            Connected Accounts
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Link your accounts to enable features like exporting code to GitHub.
          </p>
        </div>

        <div className="p-6 space-y-4">
          
          {/* GitHub Connection */}
          <div className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#24292F] rounded-lg flex items-center justify-center">
                <Github className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">GitHub</h3>
                <p className="text-sm text-slate-400">Required to export and push code.</p>
              </div>
            </div>
            
            <button
              onClick={() => handleLink('github')}
              disabled={isLoading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              Connect GitHub
            </button>
          </div>

          {/* Google Connection */}
          <div className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h3 className="font-bold text-white">Google</h3>
                <p className="text-sm text-slate-400">Used for easy sign-in.</p>
              </div>
            </div>
            
             <button
              onClick={() => handleLink('google')}
              disabled={isLoading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              Connect Google
            </button>
          </div>

        </div>
      </div>
      
      {/* Session Debug (Optional - Remove in Production) */}
      <div className="mt-8 p-4 bg-slate-900 rounded-xl border border-white/10">
        <h3 className="text-sm font-mono text-slate-500 mb-2">Debug Session Data:</h3>
        <pre className="text-xs text-blue-400 overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
