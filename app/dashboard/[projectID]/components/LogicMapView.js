"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Share2, ZoomIn, ZoomOut, MousePointer2, Move, Navigation } from "lucide-react";

// --- MINI SCREEN RENDERER (Reused from PreviewPane logic) ---
const MiniScreen = ({ content, name, scale = 1 }) => {
  const renderXML = (xmlString) => {
     if (!xmlString) return <div className="text-[8px] text-slate-600 p-2">Empty Layout</div>;
     try {
         const parser = new DOMParser();
         const doc = parser.parseFromString(xmlString, "text/xml");
         if (doc.documentElement.nodeName === "parsererror") return null;

         const parseNode = (node, index) => {
             if (node.nodeType !== 1) return null;
             const getAttr = (n) => node.getAttribute(`android:${n}`) || "";
             
             // Simplified styling for miniatures
             const style = {
                 display: "flex",
                 flexDirection: getAttr("orientation") === "horizontal" ? "row" : "column",
                 width: getAttr("layout_width") === "match_parent" ? "100%" : "auto",
                 backgroundColor: getAttr("background")?.startsWith("#") ? getAttr("background") : "transparent",
                 padding: "2px",
                 gap: "2px",
                 fontSize: "4px", // Tiny text
                 color: getAttr("textColor") || "#000",
                 border: "1px solid rgba(0,0,0,0.05)",
                 alignItems: "center",
                 justifyContent: "center"
             };

             if (node.nodeName.includes("Button")) return <div key={index} style={{...style, backgroundColor: '#2563eb', color: 'white', borderRadius: 2, height: 8, width: '80%'}}></div>;
             if (node.nodeName.includes("ImageView")) return <div key={index} style={{...style, backgroundColor: '#e2e8f0', height: 12, width: 12}}></div>;
             if (node.nodeName.includes("TextView")) return <div key={index} style={style}>{getAttr("text")?.slice(0, 10) || "..."}</div>;

             return <div key={index} style={style} className="w-full h-full">{Array.from(node.childNodes).map((child, i) => parseNode(child, i))}</div>;
         };
         return parseNode(doc.documentElement, 0);
     } catch (e) { return null; }
  };

  return (
    <div className="w-[100px] h-[180px] bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200 relative select-none pointer-events-none">
        <div className="absolute top-0 w-full h-3 bg-slate-900 z-10" />
        <div className="mt-3 h-full overflow-hidden">{renderXML(content)}</div>
        {/* Screen Label Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 p-1 text-center">
            <p className="text-[8px] text-white font-mono truncate">{name.replace('.xml', '')}</p>
        </div>
    </div>
  );
};

export default function LogicMapView({ projectFiles, onLogicUpdate, triggerHaptic }) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState(null); // Node being dragged

  // 1. BUILD THE GRAPH
  const { nodes, edges } = useMemo(() => {
    // A. FIND SCREENS (XML)
    const xmlFiles = projectFiles.filter(f => f.name.endsWith('.xml'));
    
    // B. FIND LOGIC (Kotlin) to detect connections
    const connections = [];
    projectFiles.filter(f => f.name.endsWith('.kt')).forEach(kt => {
        // Look for: Intent(this, TargetActivity::class.java)
        const matches = [...kt.content.matchAll(/Intent\s*\(\s*this\s*,\s*(\w+)::class\.java\s*\)/g)];
        matches.forEach(m => {
            const targetName = m[1]; // e.g., "LoginActivity"
            // Find connection source (Current File) -> Target (Found Intent)
            connections.push({ from: kt.name.replace('Activity.kt', ''), to: targetName.replace('Activity', '') });
        });
    });

    // C. GENERATE NODES WITH POSITIONS
    // Simple algorithm: Place them in a grid based on index
    const _nodes = xmlFiles.map((f, i) => {
       const shortName = f.name.replace('activity_', '').replace('.xml', '');
       const isMain = shortName === 'main';
       return {
           id: shortName,
           file: f,
           // Initial layout logic: Main in center, others spiraling out or in grid
           x: isMain ? 400 : 400 + (i % 3) * 250,
           y: isMain ? 300 : 300 + Math.floor(i / 3) * 300,
           type: 'screen'
       };
    });

    // D. GENERATE EDGES
    const _edges = connections.map((conn, i) => {
        // Map Kotlin Activity names to XML Layout names (simplified heuristic)
        // LoginActivity -> activity_login
        const fromNode = _nodes.find(n => n.id.includes(conn.from.toLowerCase()));
        const toNode = _nodes.find(n => n.id.includes(conn.to.toLowerCase()));
        
        if (fromNode && toNode) {
            return { id: `e-${i}`, source: fromNode.id, target: toNode.id };
        }
        return null;
    }).filter(Boolean);

    return { nodes: _nodes, edges: _edges };
  }, [projectFiles]);

  // Node Positions State (To allow dragging)
  const [nodePositions, setNodePositions] = useState({});

  // Initialize positions once nodes are loaded
  useEffect(() => {
     const initialPos = {};
     nodes.forEach(n => {
         if (!nodePositions[n.id]) initialPos[n.id] = { x: n.x, y: n.y };
     });
     if (Object.keys(initialPos).length > 0) {
         setNodePositions(prev => ({ ...prev, ...initialPos }));
     }
  }, [nodes]);

  // --- DRAG HANDLERS ---
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
          // Move Node
          setNodePositions(prev => ({
              ...prev,
              [activeNode]: {
                  x: prev[activeNode].x + e.movementX / scale,
                  y: prev[activeNode].y + e.movementY / scale
              }
          }));
      } else if (isDragging) {
          // Pan Canvas
          setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
  };

  const handleMouseUp = () => {
      setIsDragging(false);
      setActiveNode(null);
  };

  // --- SVG CONNECTION LINES ---
  const renderConnections = () => {
      return edges.map(edge => {
          const start = nodePositions[edge.source];
          const end = nodePositions[edge.target];
          if (!start || !end) return null;

          // Center of the cards (Card width ~100px, height ~180px)
          const x1 = start.x + 50;
          const y1 = start.y + 90;
          const x2 = end.x + 50;
          const y2 = end.y + 90;

          // Bezier Curve
          const path = `M ${x1} ${y1} C ${x1 + 100} ${y1}, ${x2 - 100} ${y2}, ${x2} ${y2}`;

          return (
              <g key={edge.id}>
                 <path d={path} stroke="#3b82f6" strokeWidth="2" fill="none" className="drop-shadow-md animate-in fade-in" />
                 <circle cx={x2} cy={y2} r="4" fill="#3b82f6" />
                 <circle cx={x1} cy={y1} r="2" fill="#64748b" />
              </g>
          );
      });
  };

  return (
    <div 
        className="h-full w-full bg-[#0a0a0a] relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ 
            backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', 
            backgroundSize: `${20 * scale}px ${20 * scale}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
    >
      {/* TOOLBAR */}
      <div className="absolute top-4 right-4 z-50 flex gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-xl backdrop-blur text-slate-400 shadow-xl">
         <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:text-white hover:bg-white/10 rounded-lg"><ZoomOut className="w-4 h-4" /></button>
         <span className="p-2 text-xs font-mono font-bold text-blue-400">{Math.round(scale * 100)}%</span>
         <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 hover:text-white hover:bg-white/10 rounded-lg"><ZoomIn className="w-4 h-4" /></button>
         <div className="w-px bg-slate-700 mx-1" />
         <button onClick={() => { setPan({x:0, y:0}); setScale(1); }} className="p-2 hover:text-white hover:bg-white/10 rounded-lg"><Move className="w-4 h-4" /></button>
      </div>

      {/* CANVAS */}
      <div 
        className="absolute inset-0 origin-top-left transition-transform duration-75 ease-out"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
      >
          {/* LAYER 1: CONNECTIONS */}
          <svg className="absolute top-0 left-0 w-[5000px] h-[5000px] pointer-events-none z-0">
             {renderConnections()}
          </svg>

          {/* LAYER 2: NODES */}
          {nodes.map(node => {
              const pos = nodePositions[node.id] || { x: node.x, y: node.y };
              return (
                  <div 
                    key={node.id}
                    className={`absolute z-10 group transition-shadow duration-200 ${activeNode === node.id ? 'z-50 scale-105 shadow-2xl shadow-blue-500/30' : ''}`}
                    style={{ left: pos.x, top: pos.y }}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                  >
                      {/* Connection Handle (Visual Only) */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      </div>

                      <MiniScreen content={node.file.content} name={node.file.name} />
                  </div>
              );
          })}
      </div>

      {/* FOOTER HINT */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800 backdrop-blur pointer-events-none animate-in slide-in-from-bottom-4">
          <p className="text-[10px] text-slate-400 flex items-center gap-2">
              <Navigation className="w-3 h-3 text-blue-400" />
              Blue lines indicate code navigation detected in Kotlin.
          </p>
      </div>
    </div>
  );
}