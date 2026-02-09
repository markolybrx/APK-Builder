import { Settings, Download, Trash2, Save, Package } from "lucide-react";

export default function SettingsView({ project, triggerHaptic }) {
  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-300">
      
      {/* Header */}
      <div className="h-14 border-b border-slate-800 flex items-center px-4 bg-slate-900 shrink-0">
        <span className="font-bold text-white tracking-wide">Project Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full space-y-8">
        
        {/* General Settings */}
        <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" /> General
            </h3>
            <div className="space-y-4 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">App Name</label>
                    <input 
                        type="text" 
                        defaultValue={project?.name || "Untitled App"} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Package Name</label>
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-400">
                        <Package className="w-4 h-4" />
                        <input 
                            type="text" 
                            defaultValue={project?.packageName || "com.example.app"} 
                            className="bg-transparent w-full outline-none text-white font-mono text-sm"
                        />
                    </div>
                </div>
                <button 
                    onClick={triggerHaptic}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-colors w-fit"
                >
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>
        </section>

        {/* Export */}
        <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Download className="w-4 h-4" /> Export
            </h3>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-white">Download APK</h4>
                    <p className="text-xs text-slate-400 mt-1">Build a debug APK for testing on Android devices.</p>
                </div>
                <button 
                    onClick={() => { triggerHaptic(); alert("Build started..."); }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs border border-slate-700"
                >
                    Build .apk
                </button>
            </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4">
            <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Danger Zone
            </h3>
            <div className="bg-red-900/10 p-6 rounded-xl border border-red-900/30 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-red-400">Delete Project</h4>
                    <p className="text-xs text-red-400/70 mt-1">This action cannot be undone.</p>
                </div>
                <button 
                    onClick={() => { triggerHaptic(); alert("This is a demo."); }}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-bold text-xs border border-red-500/30"
                >
                    Delete
                </button>
            </div>
        </section>

      </div>
    </div>
  );
}
