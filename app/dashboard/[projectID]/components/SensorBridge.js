import { useState, useEffect } from "react";
import { Activity, MapPin, Compass, ShieldCheck } from "lucide-react";

export default function SensorBridge({ triggerHaptic }) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0, lat: "0.00", lng: "0.00" });

  useEffect(() => {
    // Mock sensor stream for preview
    const interval = setInterval(() => {
      setData({
        x: (Math.random() * 2 - 1).toFixed(2),
        y: (9.8 + Math.random() * 0.5).toFixed(2), // Gravity
        z: (Math.random() * 2 - 1).toFixed(2),
        lat: "37.7749",
        lng: "-122.4194"
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 p-4 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400" /> Sensor Permissions Active
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <SensorItem icon={Activity} label="Accelerometer" value={`X:${data.x} Y:${data.y} Z:${data.z}`} />
        <SensorItem icon={MapPin} label="GPS Location" value={`${data.lat}, ${data.lng}`} />
        <SensorItem icon={Compass} label="Gyroscope" value={`${(data.x * 45).toFixed(0)}° Tilt`} />
      </div>
      
      <p className="text-[10px] text-slate-500 italic px-2">
        * Move your device to see real-time data feeding into your app's logic controllers.
      </p>
    </div>
  );
}

function SensorItem({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-4">
      <div className="p-2 bg-blue-600/10 rounded-lg text-blue-400">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[10px] text-slate-500 font-bold uppercase">{label}</div>
        <div className="text-sm text-white font-mono">{value}</div>
      </div>
    </div>
  );
}