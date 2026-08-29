import React, { useState } from 'react';
import { 
  Zap, 
  UserCheck, 
  Trophy, 
  Sparkles, 
  Send, 
  Sliders,
  X,
  Radio
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const SimControlModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    simulateLivePulse, 
    triggerConfetti, 
    isLiveSimulating, 
    setIsLiveSimulating,
    checkInTicket,
    playSfx,
    createAnnouncementFromPrompt
  } = useEvent();

  const [customMsg, setCustomMsg] = useState('');

  const handleSimCheckIn = () => {
    playSfx('beep');
    checkInTicket('EVOS-RANDOM-PASS');
  };

  const handleSimScore = () => {
    playSfx('beep');
    simulateLivePulse('SCORE_UPDATE');
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    createAnnouncementFromPrompt(customMsg, 'high');
    setCustomMsg('');
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom-Right */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => {
            playSfx('beep');
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-medium text-xs shadow-neon-indigo border border-white/20 hover:scale-105 transition-all active:scale-95 group"
        >
          <Sliders className="w-4 h-4 text-cyan-300 animate-spin-slow group-hover:rotate-90 transition-transform" />
          <span className="font-mono font-bold tracking-wide">SIMULATOR ENGINE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Simulator Overlay Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-96 max-w-[calc(100vw-40px)] glass-card border border-indigo-500/30 rounded-2xl p-5 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-cyan-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white font-sans">Live Simulator Controls</h4>
                <p className="text-[10px] text-slate-400 font-mono">Simulate real-time WebSocket telemetry</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 pt-3 text-xs">
            {/* Simulation Status Toggle */}
            <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
              <div>
                <span className="font-medium text-slate-200">Auto-Pulse Stream</span>
                <p className="text-[10px] text-slate-400">Pushes random events every 12s</p>
              </div>
              <button
                onClick={() => {
                  playSfx('beep');
                  setIsLiveSimulating(!isLiveSimulating);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  isLiveSimulating 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {isLiveSimulating ? 'ACTIVE' : 'PAUSED'}
              </button>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSimCheckIn}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-200 text-left transition-all"
              >
                <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-semibold text-[11px]">Sim Check-In</div>
                  <div className="text-[9px] text-slate-400">+1 Attendee & Zone Heat</div>
                </div>
              </button>

              <button
                onClick={handleSimScore}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/20 hover:border-indigo-400/50 hover:bg-indigo-500/10 text-slate-200 text-left transition-all"
              >
                <Trophy className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold text-[11px]">Score Shift</div>
                  <div className="text-[9px] text-slate-400">Trigger rank swap</div>
                </div>
              </button>

              <button
                onClick={() => {
                  playSfx('cheer');
                  triggerConfetti();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/20 hover:border-amber-400/50 hover:bg-amber-500/10 text-slate-200 text-left transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-semibold text-[11px]">Award Confetti</div>
                  <div className="text-[9px] text-slate-400">Podium celebration</div>
                </div>
              </button>

              <button
                onClick={() => {
                  playSfx('beep');
                  simulateLivePulse('HEAT_PULSE');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/10 text-slate-200 text-left transition-all"
              >
                <Zap className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <div className="font-semibold text-[11px]">Zone Occupancy</div>
                  <div className="text-[9px] text-slate-400">Fluctuate crowd heat</div>
                </div>
              </button>
            </div>

            {/* Quick Broadcast Push */}
            <form onSubmit={handleBroadcast} className="space-y-2 pt-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Instant AI Broadcast Dispatch:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="e.g. Workshop in Hall C starting..."
                  className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
