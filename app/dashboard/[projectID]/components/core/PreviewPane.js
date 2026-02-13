"use client";

import { useState, useMemo } from "react";
import { 
  Smartphone, Eye, Code2, ChevronDown, 
  RotateCcw, Maximize2, Layers 
} from "lucide-react";

export default function PreviewPane({ 
  projectFiles, 
  previewMode = 'live', 
  setPreviewMode, 
  triggerHaptic 
}) {
  const [scale, setScale] = useState(1);
  const [selectedLayout, setSelectedLayout] = useState("activity_main.xml");
  const [rotation, setRotation] = useState(0);

  // --- DATA RESOLUTION ---
  const layoutFiles = useMemo(() => 
    projectFiles.filter(f => f.name.endsWith('.xml')), 
  [projectFiles]);

  const activeContent = useMemo(() => {
    // Default to first available if selected doesn't exist
    const file = layoutFiles.find(f => f.name === selectedLayout) || layoutFiles[0];
    return file?.content || "";
  }, [layoutFiles, selectedLayout]);

  // --- XML RENDERER ENGINE ---
  const renderXML = (xmlString) => {
    if (!xmlString) return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2">
            <Layers className="w-8 h-8 opacity-20" />
            <span className="text-[10px] font-mono uppercase tracking-widest">No Layout Data</span>
        </div>
    );

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, "text/xml");
        if (doc.documentElement.nodeName === "parsererror") return (
            <div className="h-full flex items-center justify-center bg-red-500/5 p-4 text-center">
                <span className="text-red-500 font-mono text-[10px] uppercase">XML Syntax Error</span>
            </div>
        );

        // Recursive Parser
        const parseNode = (node, index) => {
            if (node.nodeType !== 1) return null;

            const getAttr = (n) => node.getAttribute(`android:${n}`) || "";
            
            // Layout Params
            const w = getAttr("layout_width");
            const h = getAttr("layout_height");
            const orient = getAttr("orientation");
            const bg = getAttr("background");
            const pad = getAttr("padding");
            const grav = getAttr("gravity");
            
            const style = {
                display: "flex",
                flexDirection: orient === "horizontal" ? "row" : "column",
                width: w === "match_parent" ? "100%" : "auto",
                height: h === "match_parent" ? "100%" : "auto",
                backgroundColor: bg.startsWith("#") ? bg : "transparent",
                padding: pad ? pad.replace("dp", "px") : "0px",
                justifyContent: grav.includes("center") ? "center" : "flex-start",
                alignItems: grav.includes("center") ? "center" : "stretch",
                gap: "8px",
                boxSizing: "border-box",
                position: "relative",
                color: getAttr("textColor") || "#000",
                fontSize: (getAttr("textSize") || "14sp").replace("sp", "px"),
            };

            // Widget Mapping
            if (node.nodeName.includes("Button")) {
                return (
                    <button key={index} style={style} className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm font-bold text-sm uppercase tracking-wide">
                        {getAttr("text") || "BUTTON"}
                    </button>
                );
            }
            if (node.nodeName.includes("TextView")) {
                return <div key={index} style={style}>{getAttr("text") || "TextView"}</div>;
            }
            if (node.nodeName.includes("ImageView")) {
                return (
                    <div key={index} style={style} className="bg-zinc-100 rounded flex items-center justify-center min-w-[50px] min-h-[50px]">
                        <span className="text-[8px] text-zinc-400 font-bold uppercase">IMG</span>
                    </div>
                );
            }
            if (node.nodeName.includes("EditText")) {
                return (
                    <div key={index} style={style} className="border-b border-zinc-300 w-full py-1 text-zinc-400 italic">
                        {getAttr("hint") || "Enter text..."}
                    </div>
                );
            }

            // Recursive Container
            return (
                <div key={index} style={style} className="android-view-group">
                    {Array.from(node.childNodes).map((child, i) => parseNode(child, i))}
                </div>
            );
        };
        
        return <div className="w-full h-full bg-white text-black overflow-y-auto">{parseNode(doc.documentElement, 0)}</div>;

    } catch (e) {
        return <div className="text-red-500 p-4 font-mono text-[10px]">RENDER FAILURE</div>;
    }
  };

  return (
    <div className="h-full w-full bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center">

      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* FLOATING CONTROL ISLAND */}
      <div className="absolute top-6 z-30">
          <div className="bg-[#09090b]/80 backdrop-blur-xl border border-zinc-800 p-1.5 rounded-[20px] shadow-2xl flex items-center gap-1 ring-1 ring-white/5">
              
              {/* File Selector */}
              <div className="relative group px-2">
                  <button className="flex items-center gap-2 text-[10px] font-bold text-zinc-300 hover:text-white transition-colors uppercase tracking-wider py-1.5 px-2 rounded-lg hover:bg-white/5">
                      <span className="text-pink-500 font-mono">XML</span>
                      {selectedLayout}
                      <ChevronDown className="w-3 h-3 opacity-50" />
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#09090b] border border-zinc-800 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-200">
                      {layoutFiles.map(f => (
                          <button 
                              key={f.name}
                              onClick={() => { setSelectedLayout(f.name); triggerHaptic?.(); }}
                              className="w-full text-left px-4 py-2.5 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-900 border-b border-zinc-800/50 last:border-0 font-mono transition-colors"
                          >
                              {f.name}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="w-px h-4 bg-zinc-800 mx-1" />

              {/* View Toggles */}
              <div className="flex bg-zinc-900/50 rounded-xl p-0.5 border border-zinc-800/50">
                  <button 
                      onClick={() => { setPreviewMode('live'); triggerHaptic?.(); }}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all flex items-center gap-1.5 ${previewMode === 'live' ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                      <Eye className="w-3 h-3" /> PREVIEW
                  </button>
                  <button 
                      onClick={() => { setPreviewMode('code'); triggerHaptic?.(); }}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all flex items-center gap-1.5 ${previewMode === 'code' ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                      <Code2 className="w-3 h-3" /> CODE
                  </button>
              </div>

              <div className="w-px h-4 bg-zinc-800 mx-1" />

              {/* Rotation Trigger */}
              <button 
                  onClick={() => { setRotation(r => r === 0 ? 90 : 0); triggerHaptic?.(); }}
                  className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
              >
                  <RotateCcw className="w-3.5 h-3.5" />
              </button>
          </div>
      </div>

      {/* DEVICE FRAME */}
      <div 
          className="relative transition-all duration-700 ease-in-out z-10"
          style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
      >
          {/* TITANIUM CHASSIS */}
          <div className="w-[320px] h-[650px] bg-[#1a1a1a] rounded-[3.5rem] p-3 shadow-2xl relative border border-zinc-800/50 ring-4 ring-black ring-opacity-50">
              
              {/* Outer Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-pink-500/5 via-transparent to-blue-500/5 rounded-[4rem] blur-2xl opacity-50 pointer-events-none" />

              {/* Inner Bezel */}
              <div className="w-full h-full bg-black rounded-[3rem] border-[6px] border-black overflow-hidden relative">
                  
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-0 inset-x-0 h-8 z-50 flex justify-center pointer-events-none">
                      <div className="w-32 h-7 bg-black rounded-b-[1.5rem] flex items-center justify-center gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />
                          <div className="w-12 h-1.5 rounded-full bg-[#1a1a1a]/50" />
                      </div>
                  </div>

                  {/* SCREEN CONTENT */}
                  {previewMode === 'live' ? (
                      <div className="w-full h-full bg-white overflow-hidden animate-in fade-in duration-500">
                          {/* Status Bar Mock */}
                          <div className="h-8 w-full flex justify-between items-center px-6 pt-2">
                              <span className="text-[10px] font-bold text-black">9:41</span>
                              <div className="flex gap-1.5">
                                  <div className="w-3 h-3 bg-black rounded-full opacity-20" />
                                  <div className="w-3 h-3 bg-black rounded-full opacity-20" />
                                  <div className="w-5 h-3 bg-black rounded-sm opacity-20" />
                              </div>
                          </div>
                          {/* Actual Render */}
                          <div className="h-[calc(100%-2rem)] overflow-y-auto custom-scrollbar">
                              {renderXML(activeContent)}
                          </div>
                      </div>
                  ) : (
                      <div className="w-full h-full bg-[#0d0d0d] overflow-hidden flex flex-col animate-in fade-in duration-500">
                           <div className="h-8 bg-[#121212] border-b border-white/5 flex items-center px-4">
                               <span className="text-[10px] text-zinc-500 font-mono">{selectedLayout}</span>
                           </div>
                           <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                                <pre className="text-[10px] font-mono text-pink-400 whitespace-pre-wrap leading-relaxed">
                                    {activeContent}
                                </pre>
                           </div>
                      </div>
                  )}

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
                      <div className="w-32 h-1 bg-zinc-500/50 rounded-full backdrop-blur-md" />
                  </div>

              </div>

              {/* Hardware Buttons */}
              <div className="absolute -left-[2px] top-24 w-[2px] h-8 bg-zinc-700 rounded-l-md" />
              <div className="absolute -left-[2px] top-36 w-[2px] h-12 bg-zinc-700 rounded-l-md" />
              <div className="absolute -right-[2px] top-28 w-[2px] h-16 bg-zinc-700 rounded-r-md" />
          </div>
      </div>

    </div>
  );
}