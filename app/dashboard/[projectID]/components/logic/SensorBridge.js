"use client";

import { useState, useEffect } from "react";
import { 
  X, Activity, MapPin, Compass, Wifi, 
  Smartphone, Zap, CheckCircle2, LocateFixed 
} from "lucide-react";

export default function SensorBridge({ isOpen, onClose, onUpdateFile, triggerHaptic }) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0, lat: null, lng: null });
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  // --- 1. SENSOR FUSION ENGINE ---
  useEffect(() => {
    let motionHandler;
    let geoId;
    let simInterval;

    // A. Attempt Real Hardware Connection
    if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
        motionHandler = (event) => {
            if (event.accelerationIncludingGravity) {
                setData(prev => ({
                    ...prev,
                    x: event.accelerationIncludingGravity.x || 0,
                    y: event.accelerationIncludingGravity.y || 0,
                    z: event.accelerationIncludingGravity.z || 0,
                }));
            }
        };
        window.addEventListener("devicemotion", motionHandler);
    }

    // B. Attempt Geolocation Lock
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
        geoId = navigator.geolocation.watchPosition(
            (pos) => {
                setData(prev => ({
                    ...prev,
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }));
            },
            (err) => console.log("GPS signal lost, switching to sim"),
            { enableHighAccuracy: true }
        );
    }

    // C. Fallback: Desktop Simulation Loop
    const checkSensors = setTimeout(() => {
        if (data.x === 0 && data.y === 0 && data.z === 0) {
            setIsSimulating(true);
            simInterval = setInterval(() => {
                setData(prev => ({
                    x: (Math.random() - 0.5) * 0.5, 
                    y: (Math.random() - 0.5) * 0.5,
                    z: 9.8 + (Math.random() - 0.5) * 0.2, 
                    lat: 37.7749 + (Math.random() * 0.0001),
                    lng: -122.4194 + (Math.random() * 0.0001)
                }));
            }, 100);
        }
    }, 1500);

    return () => {
        if (motionHandler) window.removeEventListener("devicemotion", motionHandler);
        if (geoId) navigator.geolocation.clearWatch(geoId);
        if (simInterval) clearInterval(simInterval);
        clearTimeout(checkSensors);
    };
  }, [isOpen]);

  // --- 2. LOGIC INJECTION ---
  const handleInject = () => {
    triggerHaptic?.();
    
    // Kotlin Boilerplate for SensorManager
    const sensorCode = `
package com.visionary.app.services

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.util.Log

class SensorBridge : SensorEventListener {
    // [VISIONARY] Hardware Bridge Active
    // Streaming telemetry to UI State...

    override fun onSensorChanged(event: SensorEvent?) {
        event?.let {
            val x = it.values[0]
            val y = it.values[1]
            val z = it.values[2]
            Log.d("SensorBridge", "Accelerometer: $x, $y, $z")
            // TODO: Bind to LiveData<SensorData>
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Handle calibration events
    }
}`;

    if (onUpdateFile) {
        onUpdateFile("SensorBridge.kt", sensorCode);
    }
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">

      {/* AMBIENT SIGNAL GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg bg-black border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative z-10 ring-1 ring-white/5">

        {/* HEADER HUB */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/30">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                  <h3 className="font-bold text-white text-sm tracking-wide uppercase">Sensor Bridge™</h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-2">
                      {isSimulating ? <span className="text-yellow-500">Simulation Mode</span> : <span className="text-emerald-500">Hardware Linked</span>}
                  </p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 border border-transparent hover:border-zinc-700">
              <X className="w-5 h-5" />
           </button>
        </div>

        {/* TELEMETRY DASHBOARD */}
        <div className="p-6 space-y-6">

            <div className="grid grid-cols-2 gap-4">

                {/* ACCELEROMETER MODULE */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1.5 tracking-wider">
                            <Activity className="w-3 h-3" /> IMU Sensor
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    </div>

                    <div className="space-y-3 font-mono text-[10px]">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-zinc-400">
                                <span>X-AXIS</span>
                                <span className="text-white font-bold">{data.x.toFixed(2)}</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 transition-all duration-100" style={{ width: `${Math.min(Math.abs(data.x) * 20, 100)}%` }} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-zinc-400">
                                <span>Y-AXIS</span>
                                <span className="text-white font-bold">{data.y.toFixed(2)}</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 transition-all duration-100" style={{ width: `${Math.min(Math.abs(data.y) * 20, 100)}%` }} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-zinc-400">
                                <span>Z-AXIS</span>
                                <span className="text-white font-bold">{data.z.toFixed(2)}</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${Math.min(Math.abs(data.z) * 10, 100)}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* GPS MODULE */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1.5 tracking-wider">
                            <MapPin className="w-3 h-3" /> GPS Lock
                        </span>
                        <Wifi className="w-3 h-3 text-emerald-500" />
                    </div>

                    <div className="text-center py-2 space-y-1">
                        <div className="text-lg font-bold text-white tracking-tighter font-mono">
                            {data.lat ? data.lat.toFixed(4) : "SEARCHING..."}
                        </div>
                        <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Lat</div>
                    </div>

                    <div className="w-full h-px bg-zinc-800" />

                    <div className="text-center py-2 space-y-1">
                        <div className="text-lg font-bold text-white tracking-tighter font-mono">
                            {data.lng ? data.lng.toFixed(4) : "SEARCHING..."}
                        </div>
                        <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Long</div>
                    </div>
                </div>

            </div>

            {/* STATUS BAR */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-3 flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-lg border border-zinc-700 flex items-center justify-center shadow-inner">
                    <Smartphone className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="flex-1">
                    <h4 className="text-white text-[10px] font-bold uppercase tracking-wide">Telemetry Stream Active</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">Raw Sensor Data &gt;&gt; Neural Engine</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-900/20 border border-emerald-900/50 rounded text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-bold tracking-tight">LIVE</span>
                </div>
            </div>

            {/* ACTION BUTTON */}
            <button 
                onClick={handleInject}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-xs tracking-widest"
            >
                <Zap className="w-4 h-4 fill-current" /> Inject Sensor Logic
            </button>

        </div>
      </div>
    </div>
  );
}
