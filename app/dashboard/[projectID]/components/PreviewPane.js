"use client";

import { useState, useEffect, useMemo } from "react";
import { Smartphone, Eye, Code2, Maximize2, ChevronDown, RefreshCw } from "lucide-react";

export default function PreviewPane({ projectFiles, previewMode, setPreviewMode, triggerHaptic }) {
  const [scale, setScale] = useState(1);
  const [selectedLayout, setSelectedLayout] = useState("activity_main.xml");

  // 1. DYNAMIC XML LIST
  const layoutFiles = useMemo(() => {
    return projectFiles.filter(f => f.name.endsWith('.xml'));
  }, [projectFiles]);

  // 2. AUTO-SELECT NEWEST
  useEffect(() => {
    if (layoutFiles.length > 0) {
        const exists = layoutFiles.find(f => f.name === selectedLayout);
        if (!exists) {
            setSelectedLayout(layoutFiles[layoutFiles.length - 1].name);
        }
    }
  }, [layoutFiles.length, selectedLayout]);

  // 3. GET CONTENT
  const activeContent = useMemo(() => {
    return layoutFiles.find(f => f.name === selectedLayout)?.content || "";
  }, [layoutFiles, selectedLayout]);

  // 4. ROBUST XML RENDERER
  const renderXML = (xmlString) => {
    if (!xmlString) return <div className="text-zinc-600 text-xs text-center mt-20 font-mono">No Layout Content</div>;

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, "text/xml");
        const root = doc.documentElement;
        if (root.nodeName === "parsererror") return <div className="text-red-500 text-xs p-4 border border-red-900 bg-red-900/10 rounded m-4">XML Syntax Error</div>;

        const parseNode = (node, index) => {
            if (node.nodeType !== 1) return null;

            // Attribute Extraction
            const getAttr = (name) => node.getAttribute(`android:${name}`) || "";

            const width = getAttr("layout_width");
            const height = getAttr("layout_height");
            const bgColor = getAttr("background");
            const text = getAttr("text");
            const src = getAttr("src");
            const padding = getAttr("padding");
            const gravity = getAttr("gravity");
            const orientation = getAttr("orientation");

            // CSS Mapping
            const style = {
                display: "flex",
                flexDirection: orientation === "horizontal" ? "row" : "column",
                width: width === "match_parent" ? "100%" : "auto",
                height: height === "match_parent" ? "100%" : "auto",
                minHeight: height === "wrap_content" ? "auto" : "40px",
                backgroundColor: bgColor.startsWith("#") ? bgColor : "transparent",
                padding: padding.replace("dp", "px"),
                color: getAttr("textColor") || "#000",
                fontSize: (getAttr("textSize") || "14sp").replace("sp", "px"),
                justifyContent: gravity.includes("center") ? "center" : "flex-start",
                alignItems: gravity.includes("center") ? "center" : "stretch",
                gap: "8px",
                position: "relative",
                border: previewMode === 'live' ? 'none' : '1px dashed rgba(236, 72, 153, 0.3)' // Pink debug lines
            };

            // WIDGET RENDERING
            if (node.nodeName.includes("Button")) {
                return (
                    <button key={index} style={style} className="bg-blue-600 text-white rounded shadow-sm px-4 py-2 font-bold text-sm uppercase tracking-wide">
                        {text || "Button"}
                    </button>
                );
            }
            if (node.nodeName.includes("TextView")) {
                return <div key={index} style={style}>{text || "Text View"}</div>;
            }
            if (node.nodeName.includes("EditText")) {
                return <input key={index} style={style} placeholder={getAttr("hint")} className="border-b border-zinc-400 bg-transparent px-1 text-black" disabled />;
            }
            if (node.nodeName.includes("ImageView")) {
                return <div key={index} style={style} className="bg-zinc-200 rounded flex items-center justify-center text-[10px] text-zinc-500 min-h-[50px] min-w-[50px]">IMG</div>;
            }

            // Container Recursion
            return (
                <div key={index} style={style} className="android-container">
                    {Array.from(node.childNodes).map((child, i) => parseNode(child, i))}
                </div>
            );
        };
        return parseNode(root, 0);

    } catch (e) {
        return <div className="text-red-500 p-4">Render Error</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-black border-l border-zinc-800 relative overflow-hidden">

      {/* HEADER CONTROLS */}
      <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-black/50 backdrop-blur shrink-0">

         {/* Layout Selector */}
         <div className="relative group z-20">
            <button className="flex items-center gap-2 text-xs font-bold text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg hover:border-pink-500/50 transition-colors">
                <span className="font-mono text-pink-500">&lt;/&gt;</span> {selectedLayout} <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>
            {/* Dropdown */}
            <div className="absolute top-full left-0 mt-1 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden hidden group-hover:block">
                {layoutFiles.map(f => (
                    <button 
                        key={f.name}
                        onClick={() => setSelectedLayout(f.name)}
                        className="w-full text-left px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-black font-mono transition-colors border-b border-zinc-800 last:border-0"
                    >
                        {f.name}
                    </button>
                ))}
            </div>
         </div>

         {/* View Modes */}
         <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
             <button 
                onClick={() => setPreviewMode('live')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5 ${previewMode === 'live' ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg shadow-pink-500/20' : 'text-zinc-500 hover:text-white'}`}
             >
                <Eye className="w-3 h-3" /> LIVE
             </button>
             <button 
                onClick={() => setPreviewMode('code')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5 ${previewMode === 'code' ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500 hover:text-white'}`}
             >
                <Code2 className="w-3 h-3" /> XML
             </button>
         </div>
      </div>

      {/* VIEWPORT */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden">
        <div 
            className="w-[320px] h-[640px] bg-black rounded-[3rem] border-8 border-zinc-900 shadow-2xl relative overflow-hidden transition-all duration-500 shrink-0 ring-1 ring-zinc-800"
            style={{ transform: `scale(${scale})` }}
        >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-xl z-20 border-b border-x border-zinc-800" />

            <div className="absolute inset-0 bg-white overflow-y-auto pt-8 scrollbar-hide">
                {previewMode === 'live' ? (
                    <div className="min-h-full w-full">{renderXML(activeContent)}</div>
                ) : (
                    <div className="p-4 bg-[#050505] min-h-full">
                        <pre className="text-[10px] font-mono text-pink-400 whitespace-pre-wrap">{activeContent}</pre>
                    </div>
                )}
            </div>

            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-400/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
