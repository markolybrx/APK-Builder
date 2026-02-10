"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ZoomIn, ZoomOut, Move, Navigation } from "lucide-react";

// --- MINI SCREEN RENDERER (Unchanged) ---
const MiniScreen = ({ content, name }) => {
  const renderXML = (xmlString) => {
     if (!xmlString) return <div className="text-[8px] text-slate-600 p-2">Empty Layout</div>;
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
        <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 p-1 text-center">
            <p className="text-[8px] text-white font-mono truncate">{name.replace('.xml', '')}</p>
        </div>
    </div>
  );
};

export default function LogicMapView({ projectFiles, onLogicUpdate, triggerHaptic }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 }); // Will be auto-centered on mount
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState(null);
  const [nodePositions, setNodePositions] = useState({});

  // Mobile Pinch State
  const [initialPinchDist, setInitialPinchDist] = useState(null);
  const [initialScale, setInitialScale] = useState(1);

  // 1. BUILD GRAPH DATA
  const { nodes, edges } = useMemo(() => {
    const xmlFiles = projectFiles.filter(f => f.name.endsWith('.xml'));
    
    // Simple Grid Layout Logic
    // We center the grid around (0,0) conceptually first
    const _nodes = xmlFiles.map((f, i) => {
       const shortName = f.name.replace('activity_', '').replace('.xml', '');
       const cols = 3;
       const col = i % cols;
       const row = Math.floor(i / cols);
       
       return {
           id: shortName,
           file: f,
           // Layout spacing: 250px wide, 300px tall gaps
           x: col * 250, 
           y: row * 300,
           type: 'screen'
       };
    });

    // Detect Connections (Intent logic)
    const connections = [];
    projectFiles.filter(f => f.name.endsWith('.kt')).forEach(kt => {
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

  // 2. AUTO-CENTERING EFFECT
  useEffect(() => {
     if (nodes.length === 0 || !containerRef.current) return;

     // Initialize node positions
     const initialPos = {};
     let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

     nodes.forEach(n => {
         if (!nodePositions[n.id]) {
             initialPos[n.id] = { x: n.x, y: n.y };
             // Update bounding box
             if (n.x < minX) minX = n.x;
             if (n.x > maxX) maxX = n.x;
             if (n.y < minY) minY = n.y;
             if (n.y > maxY) maxY = n.y;
         }
     });

     setNodePositions(prev => ({ ...prev, ...initialPos }));

     // Calculate Center
     // If we just loaded, center the bounding box in the viewport
     if (Object.keys(nodePositions).length === 0) {
        const contentWidth = maxX - minX + 100; // +100 for card width
        const contentHeight = maxY - minY + 180; // +180 for card height
        
        const containerW = containerRef.current.clientWidth;
        const containerH = containerRef.current.clientHeight;

        const centerX = (containerW - contentWidth) / 2 - minX;
        const centerY = (containerH - contentHeight) / 2 - minY;

        setPan({ x: centerX, y: centerY });
     }

  }, [nodes]);

  // --- MOUSE DRAG HANDLERS (Desktop) ---
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
      setInitialPinchDist(null); // Reset pinch
  };

  // --- TOUCH HANDLERS (Mobile Pinch & Pan) ---
  const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
          // PINCH STARTED
          const dist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
          );
          setInitialPinchDist(dist);
          setInitialScale(scale);
      } else if (e.touches.length === 1) {
          // PAN STARTED
          setIsDragging(true);
          const touch = e.touches[0];
          setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
      }
  };

  const handleTouchMove = (e) => {
      e.preventDefault(); // Prevent scrolling the whole page
      
      if (e.touches.length === 2 && initialPinchDist) {
          // PINCH ZOOMING
          const dist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
          );
          const zoomFactor = dist / initialPinchDist;
          const newScale = Math.min(Math.max(initialScale * zoomFactor, 0.4), 3);
          setScale(newScale);
      } else if (e.touches.length === 1 && isDragging) {
          // PANNING
          const touch = e.touches[0];
          setPan({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
      }
  };

  const handleTouchEnd = () => {
      setIsDragging(false);
      setInitialPinchDist(null);
  };

  // --- RENDERERS ---
  const renderConnections = () => {
      return edges.map(edge => {
          const start = nodePositions[edge.source];
          const end = nodePositions[edge.target];
          if (!start || !end) return null;

          const x1 = start.x + 50;
          const y1 = start.y + 90;
          const x2 = end.x + 50;
          const y2 = end.y + 90;
          const path = `M ${x1} ${y1} C ${x1 + 100} ${y1}, ${x2 - 100} ${y2}, ${x2} ${y2}`;

          return (
              <g key={edge.id}>
                 <path d={path} stroke="#3b82f6" strokeWidth="2" fill="none" className="drop-shadow-md" />
                 <circle cx={x2} cy={y2} r="4" fill="#3b82f6" />
                 <circle cx={x1} cy={y1} r="2" fill="#64748b" />
              </g>
          );
      });
  };

  return (
    <div 
        ref={containerRef}
        className="h-full w-full bg-[#0a0a0a] relative overflow-hidden cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
            backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', 
            backgroundSize: `${20 * scale}px ${20 * scale}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
    >
      {/* TOOLBAR: Hidden on Mobile (sm:flex) */}
      <div className="hidden sm:flex absolute top-4 right-4 z-50 gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-xl backdrop-blur text-slate-400 shadow-xl">
         <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:text-white hover:bg-white/10 rounded-lg"><ZoomOut className="w-4 h-4" /></button>
         <span className="p-2 text-xs font-mono font-bold text-blue-400">{Math.round(scale * 100)}%</span>
         <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 hover:text-white hover:bg-white/10 rounded-lg"><ZoomIn className="w-4 h-4" /></button>
         <div className="w-px bg-slate-700 mx-1" />
         <button onClick={() => { /* Recenter Logic could go here */ }} className="p-2 hover:text-white hover:bg-white/10 rounded-lg"><Move className="w-4 h-4" /></button>
      </div>

      {/* CANVAS */}
      <div 
        className="absolute inset-0 origin-top-left will-change-transform"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
      >
          <svg className="absolute -top-[5000px] -left-[5000px] w-[10000px] h-[10000px] pointer-events-none z-0">
             <g transform="translate(5000, 5000)">
                {renderConnections()}
             </g>
          </svg>

          {nodes.map(node => {
              const pos = nodePositions[node.id] || { x: node.x, y: node.y };
              return (
                  <div 
                    key={node.id}
                    className={`absolute z-10 group transition-shadow duration-200 ${activeNode === node.id ? 'z-50 scale-105 shadow-2xl shadow-blue-500/30' : ''}`}
                    style={{ left: pos.x, top: pos.y }}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                  >
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
              {nodes.length} Screens Detected
          </p>
      </div>
    </div>
  );
}