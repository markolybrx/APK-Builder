"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ZoomIn, ZoomOut, Move, Share2 } from "lucide-react";

// --- SUB-COMPONENT: MINIATURE SCREEN RENDERER ---
const MiniScreen = ({ content, name }) => {
  const renderXML = (xmlString) => {
     if (!xmlString) return <div className="text-[8px] text-zinc-700 p-2 font-mono">NO LAYOUT</div>;
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
                 backgroundColor: getAttr("background")?.startsWith("#") ? getAttr("background") : "transparent",
                 padding: "2px",
                 gap: "2px",
                 fontSize: "4px",
                 color: getAttr("textColor") || "#000",
                 border: "1px solid rgba(255,255,255,0.05)", 
                 alignItems: "center",
                 justifyContent: "center"
             };

             // Mock Element Styling for Visual Clarity
             if (node.nodeName.includes("Button")) return <div key={index} style={{...style, backgroundColor: '#2563eb', color: 'white', borderRadius: 2, height: 8, width: '80%'}}></div>;
             if (node.nodeName.includes("ImageView")) return <div key={index} style={{...style, backgroundColor: '#27272a', height: 12, width: 12}}></div>;
             if (node.nodeName.includes("TextView")) return <div key={index} style={style}>{getAttr("text")?.slice(0, 10) || "..."}</div>;

             return <div key={index} style={style} className="w-full h-full">{Array.from(node.childNodes).map((child, i) => parseNode(child, i))}</div>;
         };
         return parseNode(doc.documentElement, 0);
     } catch (e) { return null; }
  };

  return (
    <div className="w-[100px] h-[180px] bg-black rounded-lg shadow-2xl overflow-hidden border border-zinc-800 relative select-none pointer-events-none group-hover:border-pink-500/50 transition-colors">
        {/* Device Frame Header */}
        <div className="absolute top-0 w-full h-3 bg-zinc-900 border-b border-zinc-800 z-10 flex items-center justify-center">
            <div className="w-8 h-1 bg-zinc-800 rounded-full" />
        </div>

        {/* Viewport Content */}
        <div className="mt-3 h-full overflow-hidden bg-black p-1">
            <div className="w-full h-full bg-white rounded overflow-hidden">
                {renderXML(content)}
            </div>
        </div>

        {/* Footer Label */}
        <div className="absolute bottom-0 inset-x-0 bg-zinc-900/90 border-t border-zinc-800 p-1 text-center backdrop-blur-sm">
            <p className="text-[8px] text-zinc-300 font-mono truncate font-bold uppercase">{name.replace('.xml', '')}</p>
        </div>
    </div>
  );
};

export default function LogicMapView({ projectFiles, onLogicUpdate, triggerHaptic }) {
  const containerRef = useRef(null);
  
  // --- STATE: CANVAS TRANSFORMS ---
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // --- STATE: NODES ---
  const [activeNode, setActiveNode] = useState(null);
  const [nodePositions, setNodePositions] = useState({});

  // --- 1. GRAPH CONSTRUCTION ENGINE ---
  const { nodes, edges } = useMemo(() => {
    const xmlFiles = projectFiles.filter(f => f.name.endsWith('.xml'));

    // Create Nodes (Screens)
    const _nodes = xmlFiles.map((f, i) => {
       const shortName = f.name.replace('activity_', '').replace('.xml', '');
       const cols = 3;
       const col = i % cols;
       const row = Math.floor(i / cols);

       return {
           id: shortName,
           file: f,
           x: col * 250, 
           y: row * 300,
           type: 'screen'
       };
    });

    // Create Edges (Navigation Logic) via Regex Analysis
    const connections = [];
    projectFiles.filter(f => f.name.endsWith('.kt')).forEach(kt => {
        // Regex to find: Intent(this, TargetActivity::class.java)
        const matches = [...kt.content.matchAll(/Intent\s*\(\s*this\s*,\s*(\w+)::class\.java\s*\)/g)];
        matches.forEach(m => {
            connections.push({ from: kt.name.replace('Activity.kt', ''), to: m[1].replace('Activity', '') });
        });
    });

    const _edges = connections.map((conn, i) => {
        const fromNode = _nodes.find(n => n.id.includes(conn.from.toLowerCase()));
        const toNode = _nodes.find(n => n.id.includes(conn.to.toLowerCase()));
        if (fromNode && toNode) return { id: `e-${i}`, source: fromNode.id, target: toNode.id };
        return null;
    }).filter(Boolean);

    return { nodes: _nodes, edges: _edges };
  }, [projectFiles]);

  // --- 2. AUTO-CENTERING LOGIC ---
  useEffect(() => {
     if (nodes.length === 0 || !containerRef.current) return;

     const initialPos = {};
     let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

     nodes.forEach(n => {
         if (!nodePositions[n.id]) {
             initialPos[n.id] = { x: n.x, y: n.y };
             if (n.x < minX) minX = n.x;
             if (n.x > maxX) maxX = n.x;
             if (n.y < minY) minY = n.y;
             if (n.y > maxY) maxY = n.y;
         }
     });

     setNodePositions(prev => ({ ...prev, ...initialPos }));

     // Center viewport on first load
     if (Object.keys(nodePositions).length === 0) {
        const contentWidth = maxX - minX + 100;
        const contentHeight = maxY - minY + 180;
        const containerW = containerRef.current.clientWidth;
        const containerH = containerRef.current.clientHeight;
        const centerX = (containerW - contentWidth) / 2 - minX;
        const centerY = (containerH - contentHeight) / 2 - minY;
        setPan({ x: centerX, y: centerY });
     }

  }, [nodes]);

  // --- 3. INTERACTION HANDLERS ---
  const handleMouseDown = (e, nodeId) => {
     e.stopPropagation();
     setActiveNode(nodeId);
     triggerHaptic?.();
  };

  const handleCanvasMouseDown = (e) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
      if (activeNode) {
          setNodePositions(prev => ({
              ...prev,
              [activeNode]: {
                  x: prev[activeNode].x + e.movementX / scale,
                  y: prev[activeNode].y + e.movementY / scale
              }
          }));
      } else if (isDragging) {
          setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
  };

  const handleMouseUp = () => {
      setIsDragging(false);
      setActiveNode(null);
  };

  // --- 4. CONNECTION RENDERER (SVG) ---
  const renderConnections = () => {
      return edges.map(edge => {
          const start = nodePositions[edge.source];
          const end = nodePositions[edge.target];
          if (!start || !end) return null;

          // Bezier Curve Calculation
          const x1 = start.x + 50; // Center width offset
          const y1 = start.y + 90; // Center height offset
          const x2 = end.x + 50;
          const y2 = end.y + 90;
          const path = `M ${x1} ${y1} C ${x1 + 100} ${y1}, ${x2 - 100} ${y2}, ${x2} ${y2}`;

          return (
              <g key={edge.id}>
                 {/* Neon Glow Layer */}
                 <path d={path} stroke="#ec4899" strokeWidth="4" fill="none" className="opacity-20 blur-sm animate-pulse" />
                 {/* Core Line Layer */}
                 <path d={path} stroke="#3b82f6" strokeWidth="2" fill="none" />
                 {/* Endpoints */}
                 <circle cx={x2} cy={y2} r="4" fill="#3b82f6" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                 <circle cx={x1} cy={y1} r="3" fill="#ec4899" />
              </g>
          );
      });
  };

  return (
    <div 
        ref={containerRef}
        className="h-full w-full bg-black relative overflow-hidden cursor-grab active:cursor-grabbing touch-none selection:bg-pink-500/30"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ 
            backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)', 
            backgroundSize: `${20 * scale}px ${20 * scale}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
    >
      {/* CONTROL HUD */}
      <div className="hidden sm:flex absolute top-4 right-4 z-50 gap-2 bg-zinc-900/90 border border-zinc-800 p-2 rounded-xl backdrop-blur text-zinc-400 shadow-xl">
         <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:text-white hover:bg-white/10 rounded-lg"><ZoomOut className="w-4 h-4" /></button>
         <span className="p-2 text-xs font-mono font-bold text-pink-500 min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
         <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 hover:text-white hover:bg-white/10 rounded-lg"><ZoomIn className="w-4 h-4" /></button>
         <div className="w-px bg-zinc-700 mx-1" />
         <button className="p-2 hover:text-white hover:bg-white/10 rounded-lg" title="Auto-Fit"><Move className="w-4 h-4" /></button>
      </div>

      {/* INFINITE CANVAS LAYER */}
      <div 
        className="absolute inset-0 origin-top-left will-change-transform"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
      >
          {/* SVG CONNECTION LAYER */}
          <svg className="absolute -top-[5000px] -left-[5000px] w-[10000px] h-[10000px] pointer-events-none z-0">
             <g transform="translate(5000, 5000)">
                {renderConnections()}
             </g>
          </svg>

          {/* NODE LAYER */}
          {nodes.map(node => {
              const pos = nodePositions[node.id] || { x: node.x, y: node.y };
              return (
                  <div 
                    key={node.id}
                    className={`absolute z-10 group transition-shadow duration-200 ${activeNode === node.id ? 'z-50 scale-105 shadow-[0_0_40px_rgba(59,130,246,0.3)]' : 'shadow-2xl'}`}
                    style={{ left: pos.x, top: pos.y }}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                  >
                      {/* Interaction Handle */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-move">
                          <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]" />
                      </div>

                      <MiniScreen content={node.file.content} name={node.file.name} />
                  </div>
              );
          })}
      </div>

      {/* STATUS FOOTER */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur pointer-events-none animate-in slide-in-from-bottom-4 shadow-xl">
          <p className="text-[10px] text-zinc-400 flex items-center gap-2 font-medium font-mono uppercase tracking-wide">
              <Share2 className="w-3 h-3 text-pink-500" />
              <span className="text-white font-bold">{nodes.length}</span> Logic Nodes Active
          </p>
      </div>
    </div>
  );
}
