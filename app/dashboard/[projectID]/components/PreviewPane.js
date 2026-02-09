import { useState, useRef, useEffect } from "react";
import { X, Play, MousePointer2, PenTool, Camera, Trash2, Zap } from "lucide-react";

export default function PreviewPane({ rightOpen, setRightOpen, previewMode, setPreviewMode, triggerHaptic }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // --- Drawing Logic ---
  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };
  
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Get correct coordinates
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    }
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#3b82f6"; 
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath(); 
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    triggerHaptic();
  };

  useEffect(() => {
    if (previewMode === 'draw' && canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
  }, [previewMode, rightOpen]);


  return (
    <aside 
      className={`
        absolute top-0 bottom-0 right-0 z-50 w-full md:w-[450px] bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 flex flex-col
        ${rightOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {/* Toolbar */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 shrink-0">
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
          <ModeBtn mode="live" current={previewMode} set={setPreviewMode} icon={Play} />
          <ModeBtn mode="design" current={previewMode} set={setPreviewMode} icon={MousePointer2} />
          <ModeBtn mode="draw" current={previewMode} set={setPreviewMode} icon={PenTool} />
          <ModeBtn mode="ar" current={previewMode} set={setPreviewMode} icon={Camera} />
        </div>
        <button onClick={() => setRightOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg"><X className="w-5 h-5 text-slate-400"/></button>
      </div>

      <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col">
        
        {/* Live Mode */}
        {previewMode === 'live' && (
          <div className="flex-1 flex items-center justify-center p-4">
             <div className="w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                <div className="flex-1 bg-white pt-8 flex flex-col items-center justify-center p-4 text-center">
                   <h3 className="text-black font-bold text-xl">App Preview</h3>
                   <button onClick={triggerHaptic} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full active:scale-95 transition-transform">
                     Tap Me
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Draw Mode */}
        {previewMode === 'draw' && (
          <div className="flex-1 flex flex-col bg-[#1e293b] relative">
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                  <button onClick={clearCanvas} className="pointer-events-auto p-2 bg-slate-800 rounded text-white shadow hover:bg-slate-700">
                      <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="pointer-events-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg flex items-center gap-2">
                    <Zap className="w-3 h-3 fill-current" />
                    Generate
                  </button>
              </div>
              <canvas 
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="flex-1 bg-[#1e293b] cursor-crosshair touch-none w-full h-full"
              />
          </div>
        )}

        {/* Other Modes */}
        {(previewMode === 'design' || previewMode === 'ar') && (
           <div className="flex-1 flex items-center justify-center text-slate-500">
              Mode Active
           </div>
        )}
      </div>
    </aside>
  );
}

function ModeBtn({ mode, current, set, icon: Icon }) {
  const active = current === mode;
  return (
    <button 
      onClick={() => set(mode)} 
      className={`p-1.5 rounded-md transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
