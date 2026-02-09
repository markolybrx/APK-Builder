import { useState } from "react";
import { Circle, Square, Play, Wand2, History } from "lucide-react";

export default function BehaviorRecorder({ onRecordComplete, triggerHaptic }) {
  const [isRecording, setIsRecording] = useState(false);
  const [events, setEvents] = useState([]);

  const toggleRecording = () => {
    triggerHaptic();
    if (!isRecording) {
      setEvents([]);
      setIsRecording(true);
    } else {
      setIsRecording(false);
      onRecordComplete("Recorded: Button(login) -> SwipeUp -> Open(HomeActivity)");
    }
  };

  return (
    <div className="absolute bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-red-500/30 p-4 rounded-3xl shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-800'}`}>
            <Circle className={`w-5 h-5 text-white ${isRecording ? 'fill-current' : ''}`} />
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-tight">Behavior Recorder</h4>
            <p className="text-slate-400 text-[10px]">
              {isRecording ? "Capturing touch events..." : "Record gestures to generate logic."}
            </p>
          </div>
        </div>

        <button 
          onClick={toggleRecording}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${isRecording ? 'bg-white text-black' : 'bg-red-600 text-white shadow-lg shadow-red-500/20'}`}
        >
          {isRecording ? "Stop & Generate" : "Record"}
        </button>
      </div>
    </div>
  );
}