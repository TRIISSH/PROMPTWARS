import React, { useState, useMemo, useCallback } from 'react';
import { 
  Radio, 
  Building2, 
  Users, 
  QrCode, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  PlusCircle, 
  Search,
  Bot,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { useEvent } from '../../context/EventContext';
import { DigitalTwinVenue } from './DigitalTwinVenue';
import { AIAnnouncementStudio } from './AIAnnouncementStudio';
import { QRScannerModal } from './QRScannerModal';
import { GithubIcon } from '../common/Icons';
import { EventType } from '../../types';
import { sanitizeTextInput, sanitizeURL } from '../../utils/security';

export const OrganizerDashboard: React.FC = () => {
  const { 
    analytics, 
    timeRemainingSeconds,
    teams, 
    submissions, 
    aiInsights,
    dismissAIInsight,
    supportTickets,
    playSfx,
    setCurrentEventType,
    showToast
  } = useEvent();

  const [activeTab, setActiveTab] = useState<'overview' | 'broadcast' | 'checkin' | 'teams' | 'insights' | 'wizard'>('overview');
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardEventType, setWizardEventType] = useState<EventType>('hackathon');
  const [newEventTitle, setNewEventTitle] = useState('NextGen AI Global Summit & Hackathon 2026');
  const [newEventTagline, setNewEventTagline] = useState('Unifying 2,000+ developers, startup founders, and researchers worldwide.');
  const [newEventPrize, setNewEventPrize] = useState('$100,000');
  const [newEventCreatedSuccess, setNewEventCreatedSuccess] = useState(false);

  const formatTime = useCallback((secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const filteredTeams = useMemo(() => {
    const q = teamSearchQuery.toLowerCase().trim();
    if (!q) return teams;
    return teams.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.track.toLowerCase().includes(q) ||
      t.tableNumber.toLowerCase().includes(q)
    );
  }, [teams, teamSearchQuery]);

  const handleLaunchEvent = useCallback(() => {
    playSfx('cheer');
    const cleanTitle = sanitizeTextInput(newEventTitle, 100);
    setCurrentEventType(wizardEventType);
    setNewEventCreatedSuccess(true);
    showToast({
      type: 'success',
      title: 'Event Initialized',
      message: `"${cleanTitle}" is live and telemetry nodes are connected.`
    });
    setTimeout(() => {
      setShowCreateWizard(false);
      setNewEventCreatedSuccess(false);
      setWizardStep(1);
    }, 1800);
  }, [newEventTitle, playSfx, setCurrentEventType, showToast, wizardEventType]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Mission Control F1 HUD Header */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Title Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-neon-indigo">
                <div className="w-full h-full bg-[#090D16] rounded-[14px] flex items-center justify-center">
                  <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                    Organizer Mission Control
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    LIVE ECOSYSTEM
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  HackMatrix Global 2026 • San Francisco Arena & Global Edge Nodes
                </p>
              </div>
            </div>

            {/* Top Right Action & Countdown */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-white/10 font-mono text-right">
                <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>TIME REMAINING</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-cyan-400 tracking-wider">
                  {formatTime(timeRemainingSeconds)}
                </div>
              </div>

              <button
                onClick={() => {
                  playSfx('beep');
                  setShowCreateWizard(true);
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs font-mono shadow-neon-indigo transition-all hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Create Event</span>
              </button>
            </div>
          </div>

          {/* F1 Telemetry Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Checked-In</span>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                {analytics.totalCheckedIn} <span className="text-xs text-slate-500 font-normal">/ {analytics.totalRegistered}</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{analytics.attendanceRate}% Attendance</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Active in Venue</span>
              <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">
                {analytics.activeInVenue}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Across 6 Digital Zones
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Teams Formed</span>
              <div className="text-xl sm:text-2xl font-bold text-indigo-400 font-mono">
                {teams.length} Squads
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                0 Solo Stragglers
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Submissions</span>
              <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">
                {submissions.length} / {teams.length}
              </div>
              <div className="text-[10px] text-cyan-300 font-mono">
                Smart Rubric Ready
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Support Desk</span>
              <div className="text-xl sm:text-2xl font-bold text-purple-400 font-mono">
                {supportTickets.filter(t => t.status === 'open').length} Open
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {supportTickets.filter(t => t.status === 'resolved').length} Resolved
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">AI Insights</span>
              <div className="text-xl sm:text-2xl font-bold text-cyan-300 font-mono">
                {aiInsights.length} Active
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                Auto-Optimizing
              </div>
            </div>

          </div>

          {/* Module Navigation Tabs */}
          <div 
            role="tablist" 
            aria-label="Organizer Modules"
            className="flex flex-wrap gap-2 pt-2 border-t border-white/10"
          >
            {[
              { id: 'overview', label: 'Digital Twin & Crowd Analytics', icon: <Building2 className="w-4 h-4" /> },
              { id: 'broadcast', label: 'AI Multi-Channel Broadcast', icon: <Radio className="w-4 h-4 text-cyan-400" /> },
              { id: 'checkin', label: 'Fast-Track QR Scanner Desk', icon: <QrCode className="w-4 h-4 text-indigo-400" /> },
              { id: 'teams', label: 'Team Formation Radar & Submissions', icon: <Users className="w-4 h-4 text-emerald-400" /> },
              { id: 'insights', label: 'AI Insights & Bottleneck Alerts', icon: <Bot className="w-4 h-4 text-purple-400" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    playSfx('beep');
                    setActiveTab(tab.id as typeof activeTab);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Tab 1: Digital Twin & Crowd Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <DigitalTwinVenue />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 glass-card rounded-2xl border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-bold text-base text-white font-sans">Crowd Arrival Influx & Submission Velocity</h3>
                  <p className="text-xs text-slate-400 font-mono">Real-time hourly check-ins vs code submission surges</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> Check-ins
                  </span>
                  <span className="flex items-center gap-1 text-indigo-400">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" /> Submissions
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.hourlyTrends}>
                    <defs>
                      <linearGradient id="colorCheckIns" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="hour" stroke="#64748B" fontSize={11} fontFamily="JetBrains Mono" />
                    <YAxis stroke="#64748B" fontSize={11} fontFamily="JetBrains Mono" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                    />
                    <Area type="monotone" dataKey="checkIns" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorCheckIns)" name="Check-Ins" />
                    <Area type="monotone" dataKey="submissions" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorSubs)" name="Submissions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 glass-card rounded-2xl border border-white/10 p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-white font-sans">Track Distribution</h3>
                <p className="text-xs text-slate-400 font-mono">Teams categorized by challenge track</p>
              </div>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.trackDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={5}
                    >
                      {analytics.trackDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/5 text-[10px] font-mono">
                {analytics.trackDistribution.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-slate-300 truncate">{t.name}: <strong>{t.count}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Multi-Channel Broadcast Studio */}
      {activeTab === 'broadcast' && (
        <AIAnnouncementStudio />
      )}

      {/* Tab 3: Fast-Track QR Scanner Desk */}
      {activeTab === 'checkin' && (
        <QRScannerModal />
      )}

      {/* Tab 4: Team Formation Radar & Submissions */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-white font-sans">Team Formation Radar & Deliverable Submissions</h3>
              <p className="text-xs text-slate-400 font-mono">Track squads, table seating, and submission health</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                placeholder="Search team, track, or table..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
            {filteredTeams.map((team) => {
              const hasSubmission = team.submissionStatus === 'submitted' || team.submissionStatus === 'evaluated';
              const submissionData = submissions.find(s => s.teamId === team.id);

              return (
                <div
                  key={team.id}
                  role="listitem"
                  className="glass-card-hover rounded-2xl border border-white/10 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img src={team.avatar} alt={team.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                        <div>
                          <h4 className="font-bold text-sm text-white font-sans">{team.name}</h4>
                          <span className="text-[10px] font-mono text-cyan-400">{team.track}</span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-slate-300 border border-white/10">
                        {team.tableNumber}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                      {team.tagline}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Roster ({team.members.length} Hackers):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {team.members.map((m) => (
                          <div 
                            key={m.userId}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-[10px] font-mono text-slate-300"
                          >
                            <img src={m.avatar} alt={m.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                            <span>{m.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between text-xs font-mono">
                      <span className="text-indigo-300 text-[11px]">AI Team Synergy</span>
                      <span className="font-bold text-cyan-300">{team.compatibilityScore || 94}% Complementary</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      hasSubmission 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {hasSubmission ? `Submitted (${submissionData?.totalScore || 95}/100)` : 'Drafting Code'}
                    </span>

                    {team.githubRepo && (
                      <a 
                        href={sanitizeURL(team.githubRepo)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Repo</span>
                      </a>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: AI Insights & Bottleneck Detection */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white font-sans">AI Operations Co-Pilot & Bottleneck Alerts</h3>
                  <p className="text-xs text-slate-400 font-mono">Automated telemetry scans for crowd surges, judging delays, and capacity alerts</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ACTIVE MONITORING
              </span>
            </div>

            <div className="space-y-4">
              {aiInsights.map((insight) => (
                <div 
                  key={insight.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        insight.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : insight.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {insight.severity}
                      </span>
                      <h4 className="font-bold text-sm text-white font-sans">{insight.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 font-sans">{insight.description}</p>
                    <p className="text-xs text-cyan-300 font-mono mt-1">
                      💡 Recommendation: {insight.recommendation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                    <button
                      onClick={() => {
                        playSfx('success');
                        dismissAIInsight(insight.id);
                        showToast({
                          type: 'success',
                          title: 'Optimization Applied',
                          message: `Resolved: "${insight.title}"`
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-sm"
                    >
                      Execute Fix
                    </button>
                    <button
                      onClick={() => dismissAIInsight(insight.id)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Event Creation Wizard Modal (All Event Types) */}
      {showCreateWizard && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="wizard-title"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="glass-card rounded-3xl border border-indigo-500/40 p-6 max-w-xl w-full space-y-6 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="wizard-title" className="font-bold text-base text-white font-sans">Event Creation Operating Wizard</h3>
                  <p className="text-xs text-slate-400 font-mono">Launch any event category in 3 simple steps</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateWizard(false)}
                aria-label="Close wizard"
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wizard Steps Header */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/5 pb-2">
              <span className={wizardStep >= 1 ? 'text-cyan-400 font-bold' : ''}>1. Event Category</span>
              <span className={wizardStep >= 2 ? 'text-cyan-400 font-bold' : ''}>2. Details & Tracks</span>
              <span className={wizardStep >= 3 ? 'text-cyan-400 font-bold' : ''}>3. AI Modules & Launch</span>
            </div>

            {wizardStep === 1 && (
              <div className="space-y-3 text-xs font-mono">
                <label className="text-slate-300 block font-semibold">Select Event Architecture:</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'hackathon', label: 'Hackathon / Innovation Challenge', icon: '💻' },
                    { id: 'conference', label: 'Tech Conference / AI Summit', icon: '🎤' },
                    { id: 'startup_pitch', label: 'Startup Pitch / Demo Day', icon: '🚀' },
                    { id: 'esports', label: 'Esports Championship', icon: '🎮' },
                    { id: 'college_fest', label: 'College Fest / Tech Fest', icon: '🎓' },
                    { id: 'workshop_seminar', label: 'Hands-on Workshop / Seminar', icon: '📚' },
                  ].map((evt) => (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => {
                        playSfx('beep');
                        setWizardEventType(evt.id as EventType);
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        wizardEventType === evt.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-neon-cyan'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-lg">{evt.icon}</span>
                      <span className="text-xs truncate">{evt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label htmlFor="wizard-event-name" className="text-slate-300 block mb-1">Event Name:</label>
                  <input
                    id="wizard-event-name"
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label htmlFor="wizard-event-tagline" className="text-slate-300 block mb-1">Tagline & Vision:</label>
                  <input
                    id="wizard-event-tagline"
                    type="text"
                    value={newEventTagline}
                    onChange={(e) => setNewEventTagline(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label htmlFor="wizard-event-prize" className="text-slate-300 block mb-1">Prize Pool / Budget ($):</label>
                  <input
                    id="wizard-event-prize"
                    type="text"
                    value={newEventPrize}
                    onChange={(e) => setNewEventPrize(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2.5 text-slate-300">
                  <div className="font-bold text-cyan-400">Operating Modules Auto-Configured:</div>
                  <div>✅ Vector Team Matchmaking Engine (Auto-Active)</div>
                  <div>✅ Holographic QR Fast-Track Scanner & Digital Wallet Pass</div>
                  <div>✅ 4-Pillar Smart Rubric Studio with AI Bias Outlier Detection (±2σ)</div>
                  <div>✅ Omni-Channel AI Announcement Broadcast (Push, SMS, Email, Discord)</div>
                  <div>✅ Digital Twin 2.0 Spatial Heatmaps & Crowd Density Monitor</div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs hover:text-white"
                >
                  Back
                </button>
              ) : <div />}

              {wizardStep < 3 ? (
                <button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleLaunchEvent}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-mono text-xs font-bold shadow-neon-cyan"
                >
                  {newEventCreatedSuccess ? '✓ Event Initialized & Deployed!' : 'Publish Event Live'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
