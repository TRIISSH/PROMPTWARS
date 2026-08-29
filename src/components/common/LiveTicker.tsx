import React from 'react';
import { Radio, ChevronRight, Bell } from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const LiveTicker: React.FC = () => {
  const { liveEvents, announcements, setCurrentView, playSfx } = useEvent();

  const latestEvent = liveEvents[0];
  const latestAnnouncement = announcements[0];

  return (
    <div className="w-full bg-slate-950/80 border-b border-white/5 py-1.5 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        
        {/* Left Pulse Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono font-bold text-indigo-300">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="tracking-wider">F1 TELEMETRY</span>
          </div>
        </div>

        {/* Middle Marquee / Latest Feed Item */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-3 truncate text-slate-300 font-mono text-[11px]">
            {latestEvent && (
              <div className="flex items-center gap-2 truncate animate-fadeIn">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="font-semibold text-white truncate">{latestEvent.title}</span>
                <span className="text-slate-400 hidden md:inline truncate">— {latestEvent.description}</span>
                <span className="text-slate-500 text-[10px] shrink-0">({latestEvent.timestamp})</span>
              </div>
            )}
            
            {latestAnnouncement && (
              <div className="hidden lg:flex items-center gap-2 text-amber-300 shrink-0 border-l border-white/10 pl-3">
                <Bell className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="font-bold truncate">{latestAnnouncement.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              playSfx('beep');
              setCurrentView('leaderboard');
            }}
            className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Live Standings</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
