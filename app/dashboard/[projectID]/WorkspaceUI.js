"use client";

export default function WorkspaceUI({ project }) {
  return (
    <div className="h-screen w-screen bg-red-900 text-white flex flex-col items-center justify-center font-mono p-10 overflow-auto">
      <h1 className="text-4xl font-bold mb-4">⚠️ DEBUG MODE ⚠️</h1>
      <p className="mb-8 text-xl">If you can see this, the routing works!</p>
      
      <div className="bg-black/50 p-6 rounded-xl border border-white/20 max-w-2xl w-full">
        <h2 className="text-lg font-bold mb-2 text-yellow-400">Project Data Received:</h2>
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(project, null, 2)}
        </pre>
      </div>
    </div>
  );
}
