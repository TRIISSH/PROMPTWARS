import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Users, 
  Send, 
  Calendar, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Flame, 
  Check, 
  Bot, 
  LifeBuoy,
  X
} from 'lucide-react';
import QRCode from 'qrcode';
import { useEvent } from '../../context/EventContext';
import { AITeamMatchmaker } from './AITeamMatchmaker';
import { INITIAL_MILESTONES } from '../../data/mockData';
import { GithubIcon } from '../common/Icons';
import { sanitizeURL } from '../../utils/security';

const FICTIONAL_DEMO_URLS = [
  'omninexus-ai.live',
  'zerolag.network',
  'pulseflow.health',
  'aetherdb.io',
  'neurosynthetix.app',
];

const isFictionalDemoUrl = (url: string) => {
  return FICTIONAL_DEMO_URLS.some(fictional => url.includes(fictional));
};

export const ParticipantDashboard: React.FC = () => {
  const { 
    participantUser, 
    submissions, 
    submitProject, 
    playSfx, 
    aiChatMessages, 
    sendAIChatMessage, 
    createSupportTicket,
    showToast
  } = useEvent();

  const handleDemoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (isFictionalDemoUrl(url)) {
      e.preventDefault();
      playSfx('alert');
      showToast({
        type: 'info',
        title: 'Demo Environment Simulation',
        message: 'Live demo prototype is connected to test sandbox.'
      });
    }
  }, [playSfx, showToast]);

  const [activeTab, setActiveTab] = useState<'matchmaker' | 'submission' | 'schedule' | 'assistant' | 'gamification'>('matchmaker');

  // Digital Pass QR Canvas ref
  const passCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // AI Chat Input
  const [chatInput, setChatInput] = useState('');

  // Support Ticket Modal
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<'Technical / API' | 'Hardware' | 'Logistics / Pass' | 'Mentorship' | 'General'>('Technical / API');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Submission Form State
  const [projectTitle, setProjectTitle] = useState('OmniNexus AI: Autonomous Hackathon Co-Pilot');
  const [projectTagline, setProjectTagline] = useState('Real-time agentic orchestrator that writes, tests, and deploys full micro-apps live.');
  const [projectDescription, setProjectDescription] = useState('OmniNexus orchestrates sub-agents running over low-latency WebSockets with sub-100ms neural audio feedback, dynamic code synthesis, and automated cloud deployments.');
  const [projectTrack, setProjectTrack] = useState('AI & Autonomous Agents');
  const [projectGithub, setProjectGithub] = useState('https://github.com/omninexus/copilot');
  const [projectDemo, setProjectDemo] = useState('https://omninexus-ai.live');
  const [projectVideo, setProjectVideo] = useState('https://youtube.com/watch?v=demo-omninexus');
  const [techStackInput, setTechStackInput] = useState('PyTorch, Next.js 15, TypeScript, WebSockets, Tailwind, Supabase');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (passCanvasRef.current) {
      QRCode.toCanvas(
        passCanvasRef.current,
        participantUser.qrHash,
        {
          width: 140,
          margin: 1,
          color: {
            dark: '#00F0FF',
            light: '#090D16'
          }
        },
        () => {}
      );
    }
  }, [participantUser.qrHash]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectGithub.trim()) return;

    setIsSubmitting(true);
    playSfx('beep');

    setTimeout(() => {
      submitProject({
        title: projectTitle,
        tagline: projectTagline,
        description: projectDescription,
        techStack: techStackInput.split(',').map(s => s.trim()).filter(Boolean),
        track: projectTrack,
        githubUrl: projectGithub,
        demoUrl: projectDemo,
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 600);
  }, [projectTitle, projectGithub, projectTagline, projectDescription, techStackInput, projectTrack, projectDemo, playSfx, submitProject]);

  const handleSendChat = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendAIChatMessage(chatInput);
    setChatInput('');
  }, [chatInput, sendAIChatMessage]);

  const handleFileTicket = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;

    createSupportTicket({
      authorName: `${participantUser.name} (Team OmniNexus)`,
      authorRole: 'Participant',
      tableNumber: participantUser.tableAssigned || 'Table 14',
      category: ticketCategory,
      description: ticketDesc,
      priority: 'high'
    });

    setTicketSuccess(true);
    setTimeout(() => {
      setShowTicketModal(false);
      setTicketSuccess(false);
      setTicketDesc('');
    }, 1800);
  }, [ticketDesc, participantUser.name, participantUser.tableAssigned, ticketCategory, createSupportTicket]);

  const mySubmission = useMemo(() => {
    return submissions.find(s => s.teamId === 'tm_1');
  }, [submissions]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner: Hacker Profile & Holographic Passport */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left (8 cols): Hacker Identity & Level Badge */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img 
                src={participantUser.avatar} 
                alt={participantUser.name} 
                className="w-20 h-20 rounded-3xl object-cover border-2 border-cyan-400/50 shadow-neon-cyan"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                    {participantUser.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    LVL {participantUser.level} APEX HACKER
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans mt-1 max-w-xl leading-relaxed">
                  {participantUser.bio}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[11px]">
                  <span className="text-cyan-400 font-semibold">{participantUser.preferredRole}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">Table: {participantUser.tableAssigned}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Checked-In
                  </span>
                </div>
              </div>
            </div>

            {/* XP Progress Bar & Quick Help Trigger */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>XP Level Progress (Level {participantUser.level})</span>
                </span>
                <span className="text-cyan-300 font-bold">{participantUser.xpPoints} / 3500 XP</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(participantUser.xpPoints / 3500) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right (4 cols): Apple Wallet Style Holographic Digital Pass */}
          <div className="lg:col-span-4 flex flex-col items-center gap-3">
            <div className="w-full max-w-[280px] rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-950 border border-cyan-400/40 p-4 shadow-neon-indigo space-y-3 relative overflow-hidden hologram-shimmer group select-none">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-extrabold tracking-wider text-white">EVENT<span className="text-cyan-400">OS</span> PASS</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="flex justify-center p-2 bg-[#090D16] rounded-2xl border border-white/10 shadow-inner">
                <canvas ref={passCanvasRef} className="rounded-xl" />
              </div>

              <div className="space-y-0.5 text-center font-mono">
                <div className="text-xs font-bold text-white tracking-widest">{participantUser.ticketCode}</div>
                <div className="text-[9px] text-slate-400">Tap at any venue kiosk for meals & kits</div>
              </div>
            </div>

            <button
              onClick={() => {
                playSfx('beep');
                setShowTicketModal(true);
              }}
              className="flex items-center gap-1.5 text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors focus:outline-none focus:underline"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Need Mentor Help? File Ticket</span>
            </button>
          </div>

        </div>

        {/* Participant Navigation Tabs */}
        <div 
          role="tablist"
          aria-label="Hacker Hub Modules"
          className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-white/10"
        >
          {[
            { id: 'matchmaker', label: 'AI Team Matchmaker', icon: <Users className="w-4 h-4 text-cyan-400" /> },
            { id: 'submission', label: 'Project Submission Portal', icon: <Send className="w-4 h-4 text-indigo-400" /> },
            { id: 'schedule', label: 'Live Schedule & Countdown', icon: <Calendar className="w-4 h-4 text-emerald-400" /> },
            { id: 'assistant', label: 'AI Event Co-Pilot Assistant', icon: <Bot className="w-4 h-4 text-purple-400" /> },
            { id: 'gamification', label: 'Hacker XP & Badges', icon: <Award className="w-4 h-4 text-amber-400" /> },
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

      {/* Tab 1: AI Team Matchmaker */}
      {activeTab === 'matchmaker' && (
        <AITeamMatchmaker />
      )}

      {/* Tab 2: Project Submission Portal */}
      {activeTab === 'submission' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-card rounded-2xl border border-white/10 p-6 space-y-5">
            <div>
              <h3 className="font-bold text-lg text-white font-sans">Smart Project Submission Portal</h3>
              <p className="text-xs text-slate-400 font-mono">Submit your repository for automated AI complexity assessment & judge evaluation</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label htmlFor="proj-title" className="text-slate-300 block mb-1 font-semibold">Project Title:</label>
                <input
                  id="proj-title"
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div>
                <label htmlFor="proj-tagline" className="text-slate-300 block mb-1 font-semibold">Short Tagline (Elevator Pitch):</label>
                <input
                  id="proj-tagline"
                  type="text"
                  value={projectTagline}
                  onChange={(e) => setProjectTagline(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div>
                <label htmlFor="proj-desc" className="text-slate-300 block mb-1 font-semibold">Detailed Description & Architecture:</label>
                <textarea
                  id="proj-desc"
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 font-sans resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="proj-track" className="text-slate-300 block mb-1 font-semibold">Target Challenge Track:</label>
                  <select
                    id="proj-track"
                    value={projectTrack}
                    onChange={(e) => setProjectTrack(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="AI & Autonomous Agents">AI & Autonomous Agents</option>
                    <option value="Web3 & Security">Web3 & Security</option>
                    <option value="HealthTech & Social Impact">HealthTech & Social Impact</option>
                    <option value="Next-Gen Infrastructure">Next-Gen Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="proj-techstack" className="text-slate-300 block mb-1 font-semibold">Tech Stack (comma-separated):</label>
                  <input
                    id="proj-techstack"
                    type="text"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="proj-github" className="text-slate-300 block mb-1 font-semibold">GitHub Repo URL:</label>
                  <input
                    id="proj-github"
                    type="url"
                    value={projectGithub}
                    onChange={(e) => setProjectGithub(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label htmlFor="proj-demo" className="text-slate-300 block mb-1 font-semibold">Live Demo URL:</label>
                  <input
                    id="proj-demo"
                    type="url"
                    value={projectDemo}
                    onChange={(e) => setProjectDemo(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label htmlFor="proj-video" className="text-slate-300 block mb-1 font-semibold">Video Demo Link:</label>
                  <input
                    id="proj-video"
                    type="url"
                    value={projectVideo}
                    onChange={(e) => setProjectVideo(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-neon-indigo transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>Triggering AI Complexity Check & Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-cyan-300" />
                    <span>Submit Project to Smart Judging Engine</span>
                  </>
                )}
              </button>

              {submitSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Submission confirmed! Project queued for Judge Marcus Sterling. (+500 XP Earned)</span>
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Live Submission Card</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {mySubmission ? 'EVALUATION ACTIVE' : 'PREVIEW'}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-lg text-white font-sans">{projectTitle || 'Your Project Title'}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{projectTagline}</p>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400">Track:</div>
                  <div className="text-xs font-mono font-semibold text-cyan-400">{projectTrack}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400">Tech Stack:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {techStackInput.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-900 text-[10px] font-mono text-slate-300 border border-white/5">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3 text-xs font-mono">
                  {projectGithub && (
                    <a 
                      href={sanitizeURL(projectGithub)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <GithubIcon className="w-3.5 h-3.5" /> Repo
                    </a>
                  )}
                  {projectDemo && (
                    <a 
                      href={sanitizeURL(projectDemo)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => handleDemoClick(e, projectDemo)}
                      className="text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Demo
                    </a>
                  )}
                </div>
              </div>

              {mySubmission && mySubmission.rubricScores && (
                <div className="mt-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-300 font-bold">Judge Score:</span>
                    <span className="text-lg font-black text-cyan-300">{mySubmission.totalScore} / 100</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans italic">"{mySubmission.judgeFeedbackPublic}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Live Schedule & Countdown */}
      {activeTab === 'schedule' && (
        <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="font-bold text-lg text-white font-sans">Official Hackathon Milestones</h3>
              <p className="text-xs text-slate-400 font-mono">Real-time synchronized event schedule</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">All Times in PDT</span>
          </div>

          <div className="space-y-4" role="list">
            {INITIAL_MILESTONES.map((milestone) => (
              <div 
                key={milestone.id}
                role="listitem"
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  milestone.isCurrent
                    ? 'bg-indigo-950/40 border-cyan-400 shadow-neon-cyan ring-1 ring-cyan-400'
                    : milestone.isCompleted
                    ? 'bg-slate-900/60 border-white/5 opacity-80'
                    : 'bg-slate-900/90 border-white/10'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    milestone.isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : milestone.isCurrent
                      ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {milestone.isCompleted ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white font-sans">{milestone.title}</h4>
                      {milestone.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                          CURRENT PHASE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">{milestone.description}</p>
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-slate-300 shrink-0">
                  {milestone.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: AI Event Assistant Co-Pilot Chat */}
      {activeTab === 'assistant' && (
        <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-sans">AI Event Assistant Co-Pilot</h3>
                <p className="text-xs text-slate-400 font-mono">Ask anything about schedule, WiFi, mentors, dinner, rules & API keys</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              AI MODEL ONLINE
            </span>
          </div>

          {/* Messages Container */}
          <div 
            role="log"
            aria-live="polite"
            className="space-y-4 max-h-[380px] overflow-y-auto p-3 bg-slate-950/80 rounded-2xl border border-white/5"
          >
            {aiChatMessages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div key={msg.id} className={`flex gap-3 ${isAssistant ? 'items-start' : 'items-end justify-end'}`}>
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                    isAssistant 
                      ? 'bg-slate-900 border border-white/10 text-slate-200' 
                      : 'bg-indigo-600 text-white shadow-neon-indigo'
                  }`}>
                    <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
                    
                    {/* Suggested Action Quick Buttons */}
                    {msg.suggestedActions && (
                      <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap gap-1.5 font-mono text-[10px]">
                        {msg.suggestedActions.map((sug, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => sendAIChatMessage(sug)}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-purple-500/30 hover:border-cyan-400 text-purple-200 hover:text-white transition-all"
                          >
                            ⚡ {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendChat} className="flex gap-2 pt-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask EventOS AI a question... e.g. What is the WiFi password?"
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Ask AI</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Gamification & Badges */}
      {activeTab === 'gamification' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-4">
            <div>
              <h3 className="font-bold text-lg text-white font-sans">Gamification & Achievement Matrix</h3>
              <p className="text-xs text-slate-400 font-mono">Earn XP points by checking in, assembling squads, committing code, and presenting demos</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {participantUser.badges.map((badge) => {
                const isUnlocked = Boolean(badge.unlockedAt);
                return (
                  <div 
                    key={badge.id}
                    className={`p-5 rounded-2xl border text-center space-y-3 relative overflow-hidden transition-all ${
                      isUnlocked 
                        ? 'bg-slate-900/90 border-cyan-400/50 shadow-neon-cyan' 
                        : 'bg-slate-950/60 border-white/5 opacity-50 grayscale'
                    }`}
                  >
                    <div className="text-4xl mx-auto">{badge.icon}</div>
                    <div>
                      <h4 className="font-bold text-sm text-white font-sans">{badge.name}</h4>
                      <p className="text-[11px] text-slate-400 font-sans mt-1">{badge.description}</p>
                    </div>
                    <div className="pt-2 border-t border-white/5 font-mono text-[10px]">
                      {isUnlocked ? (
                        <span className="text-emerald-400 font-bold">✓ Unlocked ({badge.unlockedAt})</span>
                      ) : (
                        <span className="text-slate-500">Locked • Incomplete</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* File Support Ticket Modal */}
      {showTicketModal && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="ticket-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="glass-card rounded-3xl border border-purple-500/40 p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-purple-400" />
                <h3 id="ticket-modal-title" className="font-bold text-base text-white font-sans">Request Mentor & Staff Assistance</h3>
              </div>
              <button
                onClick={() => setShowTicketModal(false)}
                aria-label="Close modal"
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFileTicket} className="space-y-4 text-xs font-mono">
              <div>
                <label htmlFor="ticket-category-select" className="text-slate-300 block mb-1 font-semibold">Category:</label>
                <select
                  id="ticket-category-select"
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as typeof ticketCategory)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Technical / API">Technical / API Help</option>
                  <option value="Hardware">Hardware / Equipment</option>
                  <option value="Mentorship">Mentorship & Pitch Feedback</option>
                  <option value="Logistics / Pass">Logistics / Badge / Venue</option>
                  <option value="General">General Question</option>
                </select>
              </div>

              <div>
                <label htmlFor="ticket-desc-input" className="text-slate-300 block mb-1 font-semibold">Describe the issue / blocker:</label>
                <textarea
                  id="ticket-desc-input"
                  rows={3}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="e.g. Need assistance with PyTorch CUDA runtime on Docker..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 font-sans resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-[10px] text-slate-400">
                A mentor or volunteer will be routed to <strong>{participantUser.tableAssigned}</strong> immediately.
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono transition-all"
              >
                Dispatch Help Request
              </button>

              {ticketSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ticket dispatched to Mentor David Chen!</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
