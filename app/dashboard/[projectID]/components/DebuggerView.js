"use client";

import { useState, useEffect, useMemo } from "react";
import { Smartphone, Eye, Code2, Maximize2, ChevronDown, RefreshCw } from "lucide-react";

export default function PreviewPane({ projectFiles, previewMode, setPreviewMode, triggerHaptic }) {
  const [scale, setScale] = useState(1);
  const [selectedLayout, setSelectedLayout] = useState("activity_main.xml");

  // 1. DYNAMIC XML LIST
  // Filter only XML files from the project
  const layoutFiles = useMemo(() => {
    return projectFiles.filter(f => f.name.endsWith('.xml'));
  }, [projectFiles]);

  // 2. AUTO-SELECT NEWEST
  // If a new file appears that isn't in our list, switch to it
  useEffect(() => {
    if (layoutFiles.length > 0) {
        // If the currently selected file doesn't exist anymore, or we want to default to the last modified
        const exists = layoutFiles.find(f => f.name === selectedLayout);
        if (!exists) {
            setSelectedLayout(layoutFiles[layoutFiles.length - 1].name);
        }
    }
  }, [layoutFiles.length]);

  // 3. GET CONTENT
  const activeContent = useMemo(() => {
    return layoutFiles.find(f => f.name === selectedLayout)?.content || "";
  }, [layoutFiles, selectedLayout]);

  // 4. ROBUST XML RENDERER
  const renderXML = (xmlString) => {
    if (!xmlString) return <div className="text-slate-500 text-xs text-center mt-20">No Layout Content</div>;

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, "text/xml");
        const root = doc.documentElement;
        if (root.nodeName === "parsererror") return <div className="text-red-500 text-xs p-4">XML Syntax Error</div>;

        const parseNode = (node, index) => {
            if (node.nodeType !== 1) return null;

            // Attribute Extraction
            const getAttr = (name) => node.getAttribute(`android:${name}`) || "";
            
            const width = getAttr("layout_width");
            const height = getAttr("layout_height");
            const bgColor = getAttr("background");
            const text = getAttr("text");
            const src = getAttr("src"); // For ImageViews
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
                border: previewMode === 'live' ? 'none' : '1px dashed rgba(59,130,246,0.3)' // Debug lines
            };

            // WIDGET RENDERING
            if (node.nodeName.includes("Button")) {
                return (
                    <button key={index} style={style} className="bg-blue-600 text-white rounded shadow px-4 py-2 font-bold text-sm uppercase">
                        {text || "Button"}
                    </button>
                );
            }
            if (node.nodeName.includes("TextView")) {
                return <div key={index} style={style}>{text || "Text View"}</div>;
            }
            if (node.nodeName.includes("EditText")) {
                return <input key={index} style={style} placeholder={getAttr("hint")} className="border-b border-slate-400 bg-transparent px-1" disabled />;
            }
            if (node.nodeName.includes("ImageView")) {
                return <div key={index} style={style} className="bg-slate-200 rounded flex items-center justify-center text-xs text-slate-500 min-h-[50px] min-w-[50px]">Image</div>;
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
        return <div className="text-red-500">Render Error</div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] border-l border-slate-800 relative overflow-hidden">
      
      {/* HEADER CONTROLS */}
      <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/50 backdrop-blur shrink-0">
         
         {/* Layout Selector */}
         <div className="relative group">
            <button className="flex items-center gap-2 text-xs font-bold text-white bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors">
                <span className="font-mono text-blue-400">&lt;/&gt;</span> {selectedLayout} <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            {/* Dropdown */}
            <div className="absolute top-full left-0 mt-1 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50">
                {layoutFiles.map(f => (
                    <button 
                        key={f.name}
                        onClick={() => setSelectedLayout(f.name)}
                        className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 font-mono"
                    >
                        {f.name}
                    </button>
                ))}
            </div>
         </div>

         {/* View Modes */}
         <div className="flex bg-slate-800/50 rounded-lg p-1">
             <button 
                onClick={() => setPreviewMode('live')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${previewMode === 'live' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
             >
                <Eye className="w-3 h-3 inline mr-1" /> LIVE
             </button>
             <button 
                onClick={() => setPreviewMode('code')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${previewMode === 'code' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
             >
                <Code2 className="w-3 h-3 inline mr-1" /> XML
             </button>
         </div>
      </div>

      {/* VIEWPORT */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden">
        <div 
            className="w-[320px] h-[640px] bg-black rounded-[3rem] border-8 border-slate-900 shadow-2xl relative overflow-hidden transition-all duration-500 shrink-0"
            style={{ transform: `scale(${scale})` }}
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20" />
            
            <div className="absolute inset-0 bg-white overflow-y-auto pt-8">
                {previewMode === 'live' ? (
                    <div className="min-h-full w-full">{renderXML(activeContent)}</div>
                ) : (
                    <div className="p-4 bg-[#0a0a0a] min-h-full">
                        <pre className="text-[10px] font-mono text-green-400 whitespace-pre-wrap">{activeContent}</pre>
                    </div>
                )}
            </div>
            
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}