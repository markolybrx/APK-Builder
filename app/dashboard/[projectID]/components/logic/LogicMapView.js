"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Move, Share2, Activity, GitBranch } from "lucide-react";

// --- SUB-COMPONENT: MINIATURE SCREEN RENDERER ---
const MiniScreen = ({ content, name }) => {
  // Simple XML Parser for Visual Preview
  const renderXML = (xmlString) => {
     if (!xmlString) return <div className="text-[8px] text-zinc-800 p-4 font-mono text-center">NO LAYOUT DATA</div>;
     try {
         const parser = new DOMParser();
         const doc = parser.parseFromString(xmlString, "text/xml");
         if (doc.documentElement.nodeName === "parsererror") return null;

         const parseNode = (node, index) => {
             if (node.nodeType !== 1) return null;
             const getAttr = (n) => node.getAttribute(`android:${n}`) || "";

             const style = {
                 display: "flex",
                 flexDirection: getAttr("orientation") === "horizontal" ? "row" : "column",
                 width: getAttr("layout_width") === "match_parent" ? "100%" : "auto",
                 height: getAttr("layout_height") === "match_parent" ? "100%" : "auto",
                 backgroundColor: getAttr("background")?.startsWith("#") ? getAttr("background") : "transparent",
                 padding: "4px",
                 gap: "4px",
                 alignItems: "center",
                 justifyContent: "center",
                 boxSizing: "border-box"
             };

             // Mock Element Styles
             if (node.nodeName.includes("Button")) return (
                <div key={index} className="h-4 w-full bg-blue-600 rounded-sm flex items-center justify-center">
                    <div className="h-1 w-1/2 bg-white/20 rounded-full" />
                </div>
             );
             if (node.nodeName.includes("ImageView")) return (
                <div key={index} className="h-8 w-8 bg-zinc-800 rounded-md flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full border border-zinc-700" />
                </div>
             );
             if (node.nodeName.includes("TextView")) return (
                <div key={index} className="h-2 w-3/4 bg-zinc-800/50 rounded-sm" />
             );

             return (
                <div key={index} style={style} className="border border-white/5 min-h-[10px] min-w-[10px] rounded-sm">
                    {Array.from(node.childNodes).map((child, i) => parseNode(child, i))}
                </div>
             );
         };
         return parseNode(doc.documentElement, 0);
     } catch (e) { return null; }
  };

  return (
    <div className="w-[140px] h-[240px] bg-[#09090b] rounded-[1.5rem] shadow-2xl overflow-hidden border border-zinc-800 relative select-none pointer-events-none group-hover:border-pink-500/50 transition-colors ring-1 ring-white/5">
        
        {/* Device Notch */}
        <div className="absolute top-0 inset-x-0 h-4 bg-black border-b border-zinc-900 z-20 flex justify-center">
            <div className="w-12 h-2.5 bg-zinc-900 rounded-b-lg border-x border-b border-zinc-800" />
        </div>

        {/* Screen Content */}
        <div className="mt-4 h-full bg-black p-2 overflow-hidden relative">
            <div className="w-full h-full bg-white/5 rounded-xl border border-white/5 overflow-hidden flex flex-col p-2 gap-2">
                {renderXML(content)}
            </div>
        </div>

        {/* Footer Label */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center">
            <div className="bg-zinc-900/90 border border-zinc-800 px-3 py-1 rounded-full backdrop-blur-md shadow-lg">
                <p className="text-[9px] text-zinc-300 font-mono font-bold uppercase tracking-wider">{name.replace('.xml', '')}</p>
            </div>
        </div>
    </div>
  );
};

export default function LogicMapView({ projectFiles, onLogicUpdate, triggerHaptic }) {
  const containerRef = useRef(null);

  // --- CANVAS STATE ---
  const [scale, setScale] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState(null);

  // --- GRAPH ENGINE ---
  const { nodes, edges } = useMemo(() => {
    if (!projectFiles) return { nodes: [], edges: [] };
    
    const xmlFiles = projectFiles.filter(f => f.name.endsWith('.xml'));
    const ktFiles = projectFiles.filter(f => f.name.endsWith('.kt'));

    // 1. Generate Nodes (Screens)
    const _nodes = xmlFiles.map((f, i) => {
       const shortName = f.name.replace('activity_', '').replace('.xml', '');
       // Spiral Layout Algorithm
       const angle = i * 0.8; 
       const radius = 250 + (i * 50);
       return {
           id: shortName,
           file: f,
           x: Math.cos(angle) * radius + 400, // Offset to center roughly
           y: Math.sin(angle) * radius + 300,
           type: 'screen'
       };
    });

    // 2. Generate Edges (Intents)
    const _edges = [];
    ktFiles.forEach(kt => {
        const sourceName = kt.name.replace('Activity.kt', '').toLowerCase();
        const sourceNode = _nodes.find(n => n.id === sourceName || n.id === `activity_${sourceName}`);
        
        if (sourceNode) {
            // Find explicit Intents
            const matches = [...kt.content.matchAll(/Intent\s*\(\s*this\s*,\s*(\w+)::class\.java\s*\)/g)];
            matches.forEach(m => {
                const targetName = m[1].replace('Activity', '').toLowerCase();
                const targetNode = _nodes.find(n => n.id.includes(targetName));
                if (targetNode) {
                    _edges.push({ 
                        id: `${sourceNode.id}-${targetNode.id}`, 
                        source: sourceNode, 
                        target: targetNode 
                    });
                }
            });
        }
    });

    return { nodes: _nodes, edges: _edges };
  }, [projectFiles]);

  // --- INTERACTION HANDLERS ---
  const handleWheel = (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale(s => Math.min(Math.max(0.4, s * delta), 2));
    } else {
        setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  };

  const handleMouseDown = (e) => {
    if (e.button === 1 || e.button === 0) { // Middle or Left click to pan background
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // --- SVG CONNECTOR RENDERER ---
  const renderConnections = () => {
    return edges.map((edge, i) => {
        const sx = edge.source.x + 70; // Center of node (140px width)
        const sy = edge.source.y + 120; // Center of node (240px height)
        const tx = edge.target.x + 70;
        const ty = edge.target.y + 120;

        // Cubic Bezier with curvature
        const dist = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
        const controlOffset = Math.min(dist * 0.5, 300);
        
        const path = `M ${sx} ${sy} C ${sx + controlOffset} ${sy}, ${tx - controlOffset} ${ty}, ${tx} ${ty}`;

        return (
            <g key={edge.id} className="pointer-events-none">
                {/* Glow Layer */}
                <path d={path} stroke="#ec4899" strokeWidth="6" fill="none" className="opacity-20 blur-sm" />
                {/* Base Line */}
                <path d={path} stroke="#52525b" strokeWidth="2" fill="none" />
                {/* Data Flow Particle */}
                <circle r="3" fill="#ec4899">
                    <animateMotion dur={`${2 + i % 2}s`} repeatCount="indefinite" path={path} />
                </circle>
            </g>
        );
    });
  };

  return (
    <div 
        ref={containerRef}
        className="h-full w-full bg-black relative overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
        {/* BACKGROUND GRID */}
        <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{ 
                backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', 
                backgroundSize: `${30 * scale}px ${30 * scale}px`,
                backgroundPosition: `${pan.x}px ${pan.y}px`
            }} 
        />

        {/* INFINITE CANVAS CONTENT */}
        <div 
            className="absolute inset-0 transform-gpu origin-top-left transition-transform duration-75 ease-out"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
        >
            {/* CONNECTIONS LAYER */}
            <svg className="absolute top-0 left-0 w-[5000px] h-[5000px] overflow-visible z-0 pointer-events-none">
                {renderConnections()}
            </svg>

            {/* NODES LAYER */}
            {nodes.map(node => (
                <div 
                    key={node.id}
                    className={`absolute z-10 group transition-transform duration-300 ${activeNode === node.id ? 'scale-110 z-50' : 'hover:scale-105 hover:z-40'}`}
                    style={{ left: node.x, top: node.y }}
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                >
                    {/* Connection Ports */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border border-zinc-700 flex items-center justify-center z-[-1]">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    </div>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border border-zinc-700 flex items-center justify-center z-[-1]">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                    </div>

                    <MiniScreen content={node.file.content} name={node.file.name} />
                </div>
            ))}
        </div>

        {/* FLOATING HUD CONTROLS */}
        <div className="absolute bottom-8 right-8 flex gap-2 z-50">
            <div className="flex bg-[#09090b]/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-1.5 shadow-2xl ring-1 ring-white/5">
                <button onClick={() => setScale(s => Math.max(0.4, s - 0.2))} className="p-2.5 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                    <ZoomOut className="w-4 h-4" />
                </button>
                <div className="w-px bg-zinc-800 my-2" />
                <button onClick={() => { setPan({x: 0, y: 0}); setScale(0.8); }} className="p-2.5 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                    <Move className="w-4 h-4" />
                </button>
                <div className="w-px bg-zinc-800 my-2" />
                <button onClick={() => setScale(s => Math.min(2, s + 0.2))} className="p-2.5 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                    <ZoomIn className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* INFO BADGE */}
        <div className="absolute top-8 left-8 z-50">
             <div className="bg-[#09090b]/80 backdrop-blur-md border border-zinc-800 px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 ring-1 ring-white/5">
                <div className="p-1.5 bg-pink-500/10 rounded-full">
                    <GitBranch className="w-3.5 h-3.5 text-pink-500" />
                </div>
                <div>
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Logic Graph</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">{nodes.length} Screens • {edges.length} Flows</p>
                </div>
             </div>
        </div>

    </div>
  );
}
