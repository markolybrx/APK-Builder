"use client";

import { useState, useEffect, useMemo } from "react";
import { Smartphone, RotateCcw, Eye, Code2, Maximize2 } from "lucide-react";

export default function PreviewPane({ projectFiles, previewMode, setPreviewMode, triggerHaptic }) {
  const [scale, setScale] = useState(1);

  // 1. EXTRACT THE ACTIVE LAYOUT
  // We look for the most recently modified XML file, or default to activity_main.xml
  const activeLayout = useMemo(() => {
    return projectFiles.find(f => f.name.endsWith('.xml'))?.content || "";
  }, [projectFiles]);

  // 2. XML TO HTML TRANSPILER (The "Magic" Engine)
  // This is a simplified parser to visualize Android layouts in a Web Browser
  const renderXML = (xmlString) => {
    if (!xmlString) return <div className="text-slate-500">No Layout Found</div>;

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "text/xml");
    const root = doc.documentElement;

    if (root.nodeName === "parsererror") return <div className="text-red-500">XML Syntax Error</div>;

    const parseNode = (node, index) => {
      if (node.nodeType !== 1) return null; // Skip non-elements

      const androidWidth = node.getAttribute("android:layout_width");
      const androidHeight = node.getAttribute("android:layout_height");
      const bgColor = node.getAttribute("android:background") || "transparent";
      const text = node.getAttribute("android:text") || "";
      const textSize = node.getAttribute("android:textSize") || "14px";
      const textColor = node.getAttribute("android:textColor") || "#000";
      const orientation = node.getAttribute("android:orientation") || "vertical";
      const gravity = node.getAttribute("android:gravity") || "top";
      const padding = node.getAttribute("android:padding") || "0px";

      // Map Android Styles to CSS
      const style = {
        display: "flex",
        flexDirection: orientation === "vertical" ? "column" : "row",
        width: androidWidth === "match_parent" ? "100%" : "auto",
        height: androidHeight === "match_parent" ? "100%" : "auto",
        backgroundColor: bgColor.replace("@color/", "var(--"), // basic resource mapping
        padding: padding,
        color: textColor,
        fontSize: textSize.replace("sp", "px"),
        justifyContent: gravity.includes("center") ? "center" : "flex-start",
        alignItems: gravity.includes("center") ? "center" : "stretch",
        gap: "8px",
        border: "1px dashed rgba(59, 130, 246, 0.2)", // Debug outline
        position: "relative",
      };

      // Handle specific widgets
      if (node.nodeName === "TextView") {
        return <div key={index} style={style}>{text}</div>;
      }
      if (node.nodeName === "Button") {
        return (
            <button key={index} className="px-4 py-2 bg-blue-600 text-white rounded shadow-md font-bold uppercase text-sm">
                {text || "Button"}
            </button>
        );
      }
      if (node.nodeName === "ImageView") {
         return <div key={index} className="w-12 h-12 bg-slate-300 rounded flex items-center justify-center text-[8px]">IMG</div>;
      }

      // Recursive render for containers (LinearLayout, etc)
      return (
        <div key={index} style={style} className={`android-${node.nodeName.toLowerCase()}`}>
           {Array.from(node.childNodes).map((child, i) => parseNode(child, i))}
        </div>
      );
    };

    return parseNode(root, 0);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] border-l border-slate-800 relative overflow-hidden">
      
      {/* HEADER */}
      <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/50 backdrop-blur">
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
         <button onClick={() => setScale(scale > 1 ? 1 : 1.5)} className="text-slate-500 hover:text-white"><Maximize2 className="w-4 h-4" /></button>
      </div>

      {/* VIEWPORT AREA */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        
        {/* PHONE FRAME */}
        <div 
            className="w-[320px] h-[640px] bg-black rounded-[3rem] border-8 border-slate-900 shadow-2xl relative overflow-hidden transition-all duration-500"
            style={{ transform: `scale(${scale})` }}
        >
            {/* Dynamic Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20" />

            {/* SCREEN CONTENT */}
            <div className="absolute inset-0 bg-white overflow-y-auto pt-8">
                {previewMode === 'live' ? (
                    <div className="min-h-full w-full">
                        {renderXML(activeLayout)}
                    </div>
                ) : (
                    <div className="p-4 bg-[#0a0a0a] min-h-full">
                        <pre className="text-[10px] font-mono text-green-400 whitespace-pre-wrap">{activeLayout}</pre>
                    </div>
                )}
            </div>
            
            {/* Android Navigation Bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/50 rounded-full" />
        </div>

      </div>
    </div>
  );
}