import React, { useState } from 'react';
import { 
  Terminal, 
  Radio, 
  Users, 
  Scale, 
  Trophy, 
  FileCode2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Menu,
  X,
  Play,
  HeartHandshake
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ViewMode, UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    activeRole, 
    setActiveRole,
    isLiveSimulating,
    setIsLiveSimulating,
    isAudioEnabled,
    setIsAudioEnabled,
    playSfx,
    simulateLivePulse,
    currentEventType
  } = useEvent();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'landing', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'organizer', label: 'Mission Control', icon: <Radio className="w-4 h-4 text-cyan-400" />, badge: 'F1 Live' },
    { id: 'participant', label: 'Hacker Hub', icon: <Users className="w-4 h-4 text-indigo-400" />, badge: 'AI Match' },
    { id: 'judge', label: 'Judge Room', icon: <Scale className="w-4 h-4 text-amber-400" />, badge: 'Bias AI' },
    { id: 'mentor', label: 'Mentor Desk', icon: <HeartHandshake className="w-4 h-4 text-purple-400" />, badge: 'Staff' },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4 text-yellow-400" />, badge: 'Live' },
    { id: 'docs', label: 'Architecture & Schema', icon: <FileCode2 className="w-4 h-4 text-emerald-400" /> },
  ];

  const handleNavClick = (viewId: ViewMode) => {
    playSfx('beep');
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  const handleRoleChange = (role: UserRole) => {
    playSfx('beep');
    setActiveRole(role);
    if (role === 'organizer') setCurrentView('organizer');
    else if (role === 'participant') setCurrentView('participant');
    else if (role === 'judge') setCurrentView('judge');
    else if (role === 'mentor') setCurrentView('mentor');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090D16]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-neon-cyan transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-cyan-400 transition-colors group-hover:text-indigo-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-lg text-white font-sans">
                Event<span className="text-cyan-400 font-black">OS</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-mono">
                AI v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block uppercase tracking-wider">
              {currentEventType.replace('_', ' ')} OS
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/60 border border-white/5 p-1 rounded-xl">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-indigo-500/20 text-cyan-300 border border-cyan-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls: Role Switcher & Live Sim & Sound */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Role Switcher Pill */}
          <div className="hidden sm:flex items-center bg-slate-900/90 border border-white/10 p-0.5 rounded-lg text-[11px] font-medium font-mono">
            <span className="px-2 text-slate-400 text-[10px] uppercase tracking-wider">Persona:</span>
            {(['organizer', 'participant', 'judge', 'mentor'] as UserRole[]).map((role) => {
              const isCurrent = activeRole === role;
              return (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`px-2 py-1 rounded capitalize transition-all ${
                    isCurrent 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>

          {/* Quick Simulator Trigger Button */}
          <button
            onClick={() => {
              playSfx('beep');
              simulateLivePulse();
            }}
            title="Simulate Instant Real-Time WebSocket Event"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition-all"
          >
            <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
            <span className="hidden md:inline">Sim Pulse</span>
          </button>

          {/* Real-Time Live Status Pill */}
          <button
            onClick={() => {
              playSfx('beep');
              setIsLiveSimulating(!isLiveSimulating);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              isLiveSimulating
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Live WebSocket Simulation Stream"
          >
            <span className={`w-2 h-2 rounded-full ${isLiveSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="hidden sm:inline">{isLiveSimulating ? 'LIVE 50ms' : 'PAUSED'}</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              setIsAudioEnabled(!isAudioEnabled);
              if (!isAudioEnabled) playSfx('beep');
            }}
            className={`p-2 rounded-lg border transition-all ${
              isAudioEnabled 
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                : 'bg-slate-800/50 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
            title={isAudioEnabled ? 'Mute Interface Sound FX' : 'Enable Cyber Sound FX'}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-slate-800 border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-white/10 bg-slate-950/95 p-4 space-y-3 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 p-3 rounded-lg text-xs font-semibold text-left ${
                  currentView === item.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-900 border border-white/5 text-slate-300'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">Switch Persona:</span>
            <div className="flex gap-1.5">
              {(['organizer', 'participant', 'judge', 'mentor'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`px-2.5 py-1 text-xs rounded font-mono capitalize ${
                    activeRole === role 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' 
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
