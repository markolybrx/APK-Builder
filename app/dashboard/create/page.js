"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatBuilder() {
  const router = useRouter();
  const messagesEndRef = useRef(null);
  
  // State
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI Android Architect. Describe the app you want to build, and I'll write the code for you." }
  ]);
  const [buildStatus, setBuildStatus] = useState(null); // 'creating_repo', 'coding', 'pushing'

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, buildStatus]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput(""); // Clear input
    setIsLoading(true);

    // 1. Add User Message to Chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // 2. Start the Build Process
      setBuildStatus("analyzing");
      
      // We assume the first message is the "App Description"
      // In a real app, you'd extract a name using AI. Here we generate a random one for speed.
      const appName = "app-" + Math.random().toString(36).substring(7);

      // A. Create Repo
      setBuildStatus("creating_repo");
      const repoRes = await fetch('/api/github/create-repo', {
        method: 'POST',
        body: JSON.stringify({ name: appName, description: userMessage })
      });
      const repoData = await repoRes.json();
      
      if (!repoData.success) {
        throw new Error("GitHub Error: " + (repoData.error || "Failed to create repo"));
      }

      // B. Save to Database
      await fetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ 
          name: appName, 
          description: userMessage,
          repoName: repoData.repoName,
          repoUrl: repoData.repoUrl
        })
      });

      // C. Generate Code
      setBuildStatus("coding");
      const genRes = await fetch('/api/generate/code', {
        method: 'POST',
        body: JSON.stringify({ prompt: userMessage })
      });
      const genData = await genRes.json();
      
      if (!genData.success) {
         // If AI fails, we manually throw error to catch block
         throw new Error("AI Generation Failed: " + (genData.error || "Timeout or Invalid Key"));
      }

      // D. Push to GitHub
      setBuildStatus("pushing");
      await fetch('/api/github/commit', {
        method: 'POST',
        body: JSON.stringify({
          repoName: repoData.repoName,
          files: genData.files,
          message: "Initial AI Generation"
        })
      });

      // Success!
      setBuildStatus("done");
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Success! I've built your app. The compilation has started on GitHub.",
        actionLink: `/dashboard/${repoData.project?._id || ''}` // Note: You might need to adjust this ID logic depending on your API return
      }]);
      
      // Redirect after a short delay
      setTimeout(() => {
         // If we don't have the ID from the previous step easily, we just go to dashboard
         router.push('/dashboard'); 
      }, 3000);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', isError: true, content: "Error: " + error.message + ". Check your Vercel logs/Environment Variables." }]);
    } finally {
      setIsLoading(false);
      setBuildStatus(null);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-950 mt-16 text-white">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : msg.isError 
                  ? 'bg-red-900/50 border border-red-500/50 text-red-200'
                  : 'bg-slate-800 border border-slate-700 text-slate-200'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              {msg.actionLink && (
                 <div className="mt-3 p-2 bg-black/20 rounded text-sm">
                    Redirecting to dashboard...
                 </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading/Status Indicators */}
        {buildStatus && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-900 border border-blue-500/30 text-blue-400 rounded-2xl p-4 flex items-center gap-3">
              <Spinner />
              <span className="text-sm font-medium uppercase tracking-wider">
                {buildStatus === 'creating_repo' && "Creating GitHub Repo..."}
                {buildStatus === 'coding' && "AI is writing Kotlin code..."}
                {buildStatus === 'pushing' && "Pushing to GitHub..."}
                {buildStatus === 'done' && "Done! Redirecting..."}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/10">
        <div className="max-w-4xl mx-auto relative flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            placeholder="Describe your app (e.g., 'A ToDo app with a dark theme')..."
            className="w-full bg-slate-950 border border-slate-700 rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple Spinner Component
function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
