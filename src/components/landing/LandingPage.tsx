import React from 'react';
import { 
  Sparkles, 
  Radio, 
  Users, 
  Scale, 
  Trophy, 
  Building2, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  Play,
  HeartHandshake,
  PlusCircle
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { EventType } from '../../types';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setActiveRole, playSfx, analytics, currentEventType, setCurrentEventType } = useEvent();

  const handleLaunchDemo = (role: 'organizer' | 'participant' | 'judge' | 'mentor' | 'leaderboard') => {
    playSfx('beep');
    if (role === 'leaderboard') {
      setCurrentView('leaderboard');
    } else {
      setActiveRole(role);
      setCurrentView(role);
    }
  };

  const eventCategories: { id: EventType; label: string; icon: string; tag: string }[] = [
    { id: 'hackathon', label: 'Hackathons & Innovation Challenges', icon: '💻', tag: 'Team Matchmaker + Rubrics' },
    { id: 'tech_fest', label: 'College & University Tech Fests', icon: '🎓', tag: 'Multi-Track Registrations' },
    { id: 'conference', label: 'Tech Summits & AI Conferences', icon: '🎤', tag: 'Keynote Digital Twin' },
    { id: 'startup_pitch', label: 'Startup Pitch & Demo Days', icon: '🚀', tag: 'VC Scoring Matrix' },
    { id: 'esports', label: 'Esports Tournaments', icon: '🎮', tag: 'Live Championship Podium' },
    { id: 'workshop_seminar', label: 'Hands-on Workshops & Seminars', icon: '📚', tag: 'QR Verification & Mentors' },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 text-center max-w-5xl mx-auto px-4 space-y-8">
        
        {/* Glowing Background Radial Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold shadow-neon-cyan animate-float">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>SMART EVENT OPERATING SYSTEM • ENTERPRISE SAAS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Master Hero Headline & Subheadline */}
        <div className="space-y-5">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-sans tracking-tight leading-[1.08]">
            One Platform. Every Event. <span className="text-gradient-cyan">Infinite Possibilities.</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed">
            Manage registrations, attendance, teams, announcements, judging, analytics, and leaderboards in real time from a single intelligent platform.
          </p>
        </div>

        {/* Master Primary & Secondary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => handleLaunchDemo('organizer')}
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm font-mono shadow-neon-indigo hover:scale-105 transition-all active:scale-95 group"
          >
            <PlusCircle className="w-4 h-4 text-cyan-300 group-hover:rotate-90 transition-transform" />
            <span>Create Event</span>
          </button>

          <button
            onClick={() => handleLaunchDemo('participant')}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-cyan-400/40 text-slate-200 text-sm font-mono font-bold transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span>Explore Demo</span>
          </button>
        </div>

        {/* Event Versatility Category Selector */}
        <div className="pt-8">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-3">
            Built to Power Any Event Architecture:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {eventCategories.map((cat) => {
              const isSelected = currentEventType === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playSfx('beep');
                    setCurrentEventType(cat.id);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all select-none ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-neon-cyan text-white'
                      : 'bg-slate-900/70 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="font-bold text-[11px] text-white truncate font-sans">{cat.label}</div>
                  <div className="text-[9px] font-mono text-cyan-300 truncate mt-0.5">{cat.tag}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Metrics Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400">Total Checked In</span>
            <div className="text-xl font-bold text-white font-mono">{analytics.totalCheckedIn} Attendees</div>
            <span className="text-[10px] font-mono text-emerald-400">94.5% Attendance Rate</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400">AI Team Matchmaking</span>
            <div className="text-xl font-bold text-cyan-400 font-mono">0.4s Latency</div>
            <span className="text-[10px] font-mono text-cyan-300">Vector Synergy</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400">Jury Evaluation Pace</span>
            <div className="text-xl font-bold text-indigo-400 font-mono">4x Faster</div>
            <span className="text-[10px] font-mono text-indigo-300">±2σ Bias Audit</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400">WebSocket Sync</span>
            <div className="text-xl font-bold text-amber-400 font-mono">&lt;50ms</div>
            <span className="text-[10px] font-mono text-emerald-400">F1 Live Telemetry</span>
          </div>
        </div>

      </section>

      {/* 2. Interactive 4-Persona Role Switcher Showcase */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
            ONE UNIFIED PLATFORM • FOUR PURPOSE-BUILT WORKSPACES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
            Crafted for Every Role in the Event Ecosystem
          </h2>
          <p className="text-xs text-slate-400 font-mono max-w-xl mx-auto">
            Switch instantly between specialized command centers for organizers, participants, judges, and mentors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Organizer Card */}
          <div 
            onClick={() => handleLaunchDemo('organizer')}
            className="glass-card-hover rounded-3xl border border-white/10 p-6 space-y-4 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-sans group-hover:text-cyan-300 transition-colors">
                  Organizer Mission Control
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1">
                  Digital Twin 2.0 spatial heatmaps, multi-channel AI broadcasts, and crowd velocity telemetry.
                </p>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold group-hover:underline">
              <span>Launch Mission Control</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Participant Card */}
          <div 
            onClick={() => handleLaunchDemo('participant')}
            className="glass-card-hover rounded-3xl border border-white/10 p-6 space-y-4 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-sans group-hover:text-indigo-300 transition-colors">
                  Participant Hacker Hub
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1">
                  Holographic Apple-Wallet QR pass, vector team matchmaking, milestones, and AI chat co-pilot.
                </p>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-indigo-400 font-bold group-hover:underline">
              <span>Open Hacker Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Judge Card */}
          <div 
            onClick={() => handleLaunchDemo('judge')}
            className="glass-card-hover rounded-3xl border border-white/10 p-6 space-y-4 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-sans group-hover:text-amber-300 transition-colors">
                  Smart Judging Studio
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1">
                  4-pillar rubric scoring, automated score aggregation, and real-time ±2σ AI bias outlier alerts.
                </p>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold group-hover:underline">
              <span>Open Judge Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mentor Card */}
          <div 
            onClick={() => handleLaunchDemo('mentor')}
            className="glass-card-hover rounded-3xl border border-white/10 p-6 space-y-4 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-sans group-hover:text-purple-300 transition-colors">
                  Mentor & Volunteer Desk
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1">
                  Live support ticket dispatcher, table assistance routing, and zone coordination for volunteers.
                </p>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-purple-400 font-bold group-hover:underline">
              <span>Open Mentor Desk</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Deep Feature Showcase: 6 Hackathon-Winning Innovations */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-widest">
            HACKATHON-WINNING ARCHITECTURAL PILLARS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
            Engineered for Maximum Scale & Innovation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 w-fit">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white font-sans">AI Team Matchmaker</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Auto-computes vector compatibility scores, recommends ideal team compositions, and alerts for missing skills like Cloud DevOps or ZK crypto.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 w-fit">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white font-sans">Event Digital Twin 2.0</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Live interactive 2D/3D spatial blueprint of the venue showing occupancy density, crowded zones, and automated room re-routing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white font-sans">Smart Crowd Analytics</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Real-time attendance curves, peak influx velocity predictions, track distributions, and engagement indexing powered by Recharts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 w-fit">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white font-sans">AI Announcement Studio</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Type 1 intent sentence and AI generates Push notifications, 160-character SMS, responsive HTML email, and Discord markdown in 40ms.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white font-sans">Smart Rubrics & Bias Detection</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Weighted 4-pillar evaluation with standard deviation variance checking to catch leniency or harshness grading anomalies before finals.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 w-fit">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white font-sans">Esports Live Leaderboard</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              3D-styled podium for the Top 3, animated rank delta indicators, category filters, and deep score breakdown modals.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-card-glow-indigo rounded-3xl border border-indigo-500/40 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
              Deploy EventOS AI for Your Next Global Event
            </h2>
            <p className="text-sm text-slate-300 font-sans">
              Production-ready for hackathons, college fests, conferences, and startup pitch competitions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleLaunchDemo('organizer')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm font-mono shadow-neon-cyan transition-all hover:scale-105"
            >
              Launch Mission Control Alpha
            </button>
            <button
              onClick={() => {
                playSfx('beep');
                setCurrentView('docs');
              }}
              className="px-6 py-4 rounded-2xl bg-slate-900 border border-white/10 text-slate-200 text-sm font-mono hover:text-white transition-all"
            >
              View System Architecture & Schema
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
