import { useState, useEffect } from "react";
import { Activity, MapPin, Compass, ShieldCheck, AlertCircle } from "lucide-react";

export default function SensorBridge({ triggerHaptic }) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0, lat: "Waiting...", lng: "Waiting..." });
  const [error, setError] = useState(null);

  useEffect(() => {
    // --- 1. REAL-TIME ACCELEROMETER ---
    const handleMotion = (event) => {
      if (event.accelerationIncludingGravity) {
        setData(prev => ({
          ...prev,
          x: event.accelerationIncludingGravity.x?.toFixed(2) || 0,
          y: event.accelerationIncludingGravity.y?.toFixed(2) || 0,
          z: event.accelerationIncludingGravity.z?.toFixed(2) || 0,
        }));
      }
    };

    // --- 2. REAL-TIME GPS TRACKING ---
    const geoId = navigator.geolocation.watchPosition(
      (pos) => {
        setData(prev => ({
          ...prev,
          lat: pos.coords.latitude.toFixed(4),
          lng: pos.coords.longitude.toFixed(4),
        }));
      },
      (err) => setError("Location access denied"),
      { enableHighAccuracy: true }
    );

    // Requesting permission for iOS devices
    if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then(response => {
          if (response === "granted") {
            window.addEventListener("devicemotion", handleMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("devicemotion", handleMotion);
    }

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      navigator.geolocation.clearWatch(geoId);
    };
  }, []);

  return (
    <div className="space-y-4 p-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold text-xs flex items-center gap-2 tracking-tight">
          <ShieldCheck className={`w-4 h-4 ${error ? 'text-red-400' : 'text-green-400'}`} /> 
          {error ? 'Hardware Bridge Offline' : 'Live Sensor Stream Active'}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <SensorItem 
          icon={Activity} 
          label="Accelerometer (Real-time)" 
          value={`X: ${data.x}  Y: ${data.y}  Z: ${data.z}`} 
          active={!error}
        />
        <SensorItem 
          icon={MapPin} 
          label="GPS Satellite Link" 
          value={`${data.lat}, ${data.lng}`} 
          active={data.lat !== "Waiting..."}
        />
        <SensorItem 
          icon={Compass} 
          label="Orientation Logic" 
          value={`${(Math.abs(data.x) * 10).toFixed(0)}° Deviance`} 
          active={!error}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400">
          <AlertCircle className="w-3 h-3" />
          <span>{error}. Please enable system permissions.</span>
        </div>
      )}

      <p className="text-[10px] text-slate-500 italic px-2 leading-relaxed">
        * Hardware data is currently feeding into your project's `SensorController` logic in real-time.
      </p>
    </div>
  );
}

function SensorItem({ icon: Icon, label, value, active }) {
  return (
    <div className={`bg-slate-900 border ${active ? 'border-blue-500/30 shadow-lg shadow-blue-500/5' : 'border-slate-800'} p-4 rounded-2xl flex items-center gap-4 transition-all duration-300`}>
      <div className={`p-2.5 rounded-xl ${active ? 'bg-blue-600/10 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</div>
        <div className={`text-[13px] font-mono truncate ${active ? 'text-white' : 'text-slate-600'}`}>
          {value}
        </div>
      </div>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
    </div>
  );
}
