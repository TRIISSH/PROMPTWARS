import React, { useState } from 'react';
import { 
  Building2, 
  Flame, 
  Compass,
  Info,
  Layers
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { VenueZone } from '../../types';

export const DigitalTwinVenue: React.FC = () => {
  const { venueZones, analytics, playSfx } = useEvent();
  const [selectedZone, setSelectedZone] = useState<VenueZone>(venueZones[0]);

  const handleZoneClick = (zone: VenueZone) => {
    playSfx('beep');
    setSelectedZone(zone);
  };

  return (
    <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white font-sans">Event Digital Twin 2.0</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE 3D ISOMETRIC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Real-time venue spatial occupancy & heat telemetry</p>
          </div>
        </div>

        {/* Global Occupancy Status */}
        <div className="flex items-center gap-4 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">Total in Venue</span>
            <span className="font-bold text-cyan-400 text-sm">{analytics.activeInVenue} / {analytics.totalRegistered}</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <span className="text-slate-400 block text-[10px]">Avg Venue Density</span>
            <span className="font-bold text-emerald-400 text-sm">78.2%</span>
          </div>
        </div>
      </div>

      {/* Interactive Map & Zone Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: Interactive Venue Blueprint SVG */}
        <div className="lg:col-span-2 relative bg-slate-950/90 rounded-2xl border border-white/10 p-4 min-h-[380px] flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-radial-grid opacity-30 pointer-events-none" />

          {/* Map Top Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 font-mono pb-2">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>FLOOR LEVEL 1 — MAIN CONCOURSE</span>
            </span>
            <span className="text-[10px] text-cyan-400">Click any zone to inspect</span>
          </div>

          {/* Interactive SVG Zone Layout */}
          <div className="relative z-10 grid grid-cols-3 gap-3 my-auto py-2">
            {venueZones.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              const isCrowded = zone.status === 'crowded';
              const isRestricted = zone.status === 'restricted';

              return (
                <div
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  className={`group relative cursor-pointer p-4 rounded-xl border transition-all duration-300 select-none ${
                    isSelected 
                      ? 'bg-slate-900 border-cyan-400 shadow-neon-cyan ring-1 ring-cyan-400 scale-[1.02]' 
                      : 'bg-slate-900/60 border-white/10 hover:border-white/25 hover:bg-slate-900/90'
                  } ${isCrowded ? 'border-amber-500/40' : ''}`}
                >
                  {/* Zone Header */}
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-bold border border-white/5">
                      {zone.code}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      isRestricted 
                        ? 'bg-rose-500' 
                        : isCrowded 
                        ? 'bg-amber-400 animate-pulse' 
                        : 'bg-emerald-400'
                    }`} />
                  </div>

                  <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors truncate">
                    {zone.name}
                  </h4>

                  {/* Occupancy bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Occupancy</span>
                      <span className="font-bold text-slate-200">{zone.occupancy}/{zone.capacity}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          zone.heatLevel > 0.85 
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                            : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                        }`}
                        style={{ width: `${Math.min(100, zone.heatLevel * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Heat metric tag */}
                  <div className="mt-2.5 flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>Heat: {(zone.heatLevel * 100).toFixed(0)}%</span>
                    </span>
                    <span className="capitalize text-slate-300">{zone.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Legend */}
          <div className="relative z-10 flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Optimal (&lt;70%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Active (70-85%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> High Density (&gt;85%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Restricted Access
            </span>
          </div>
        </div>

        {/* Right Col: Selected Zone Telemetry Card */}
        <div className="bg-slate-950/90 rounded-2xl border border-white/10 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Zone Telemetry</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {selectedZone.code}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-white font-sans">{selectedZone.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target capacity: {selectedZone.capacity} seated developers
              </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400">Headcount</span>
                <div className="text-xl font-bold text-white font-mono">{selectedZone.occupancy}</div>
                <span className="text-[9px] text-emerald-400 font-mono">Live sensor synced</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5 space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400">Density Index</span>
                <div className="text-xl font-bold text-cyan-400 font-mono">{(selectedZone.heatLevel * 100).toFixed(0)}%</div>
                <span className="text-[9px] text-slate-400 font-mono">Capacity headroom: {selectedZone.capacity - selectedZone.occupancy}</span>
              </div>
            </div>

            {/* Smart Crowd Guidance Note */}
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                <Info className="w-3.5 h-3.5" />
                <span>AI Crowd Recommendation</span>
              </div>
              <p className="text-[11px] leading-relaxed text-indigo-200/80">
                {selectedZone.heatLevel > 0.85 
                  ? 'Density exceeds 85%. Automated recommendation: reroute incoming attendees to Hub 02 or Mentorship Pod.' 
                  : 'Room environment optimal. HVAC and WiFi bandwidth telemetry are operating at 100% capacity.'}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Zone Security</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Verified Clear
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
