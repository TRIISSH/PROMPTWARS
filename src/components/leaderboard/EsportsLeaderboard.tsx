import React, { useState, useMemo, useCallback } from 'react';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ExternalLink, 
  X, 
  Zap 
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { useEvent } from '../../context/EventContext';
import { Submission } from '../../types';
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

export const EsportsLeaderboard: React.FC = () => {
  const { submissions, playSfx, triggerConfetti, simulateLivePulse, showToast } = useEvent();

  const handleDemoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (isFictionalDemoUrl(url)) {
      e.preventDefault();
      playSfx('alert');
      showToast({
        type: 'info',
        title: 'Demo Sandbox Prototype',
        message: 'Live demo URL is connected to simulated environment.'
      });
    }
  }, [playSfx, showToast]);

  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [inspectSubmission, setInspectSubmission] = useState<Submission | null>(null);

  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter(s => selectedTrack === 'all' || s.track === selectedTrack)
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [submissions, selectedTrack]);

  const top1 = filteredSubmissions[0];
  const top2 = filteredSubmissions[1];
  const top3 = filteredSubmissions[2];

  const tracks = useMemo(() => [
    { id: 'all', label: 'All Tracks' },
    { id: 'AI & Autonomous Agents', label: 'AI & Agents' },
    { id: 'Web3 & Security', label: 'Web3 & ZK' },
    { id: 'HealthTech & Social Impact', label: 'HealthTech' },
    { id: 'Next-Gen Infrastructure', label: 'Infra & Mesh' },
  ], []);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Leaderboard Header Banner */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 relative overflow-hidden text-center">
        
        {/* Glow Spheres */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-indigo-500/20 via-amber-500/10 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>ESPORTS LIVE CHAMPIONSHIP ARENA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
            Live Dynamic Leaderboard
          </h1>
          <p className="text-xs text-slate-300 font-mono">
            Scores dynamically calculated in real-time from judge rubric submissions & AI bias validation
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                playSfx('cheer');
                triggerConfetti();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-black shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate Top 3</span>
            </button>
            <button
              onClick={() => {
                playSfx('beep');
                simulateLivePulse('SCORE_UPDATE');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-slate-300 font-mono text-xs font-medium transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulate Score Shift</span>
            </button>
          </div>
        </div>

        {/* Track Category Selector Filter */}
        <div 
          role="tablist" 
          aria-label="Filter leaderboard by track"
          className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-6 mt-6 border-t border-white/10"
        >
          {tracks.map((t) => {
            const isActive = selectedTrack === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  playSfx('beep');
                  setSelectedTrack(t.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-neon-indigo'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* 3D-Styled Glowing Podium (Top 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6">
        
        {/* 2nd Place (Silver) */}
        {top2 && (
          <div 
            role="button"
            tabIndex={0}
            aria-label={`Rank 2: ${top2.projectTitle} by ${top2.teamName}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setInspectSubmission(top2); }}
            onClick={() => setInspectSubmission(top2)}
            className="order-2 md:order-1 glass-card-hover rounded-3xl border border-slate-400/40 p-6 space-y-4 text-center relative overflow-hidden cursor-pointer group focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-400/20 text-slate-200 border border-slate-400/40 text-[10px] font-mono font-black">
              #2 RANK
            </div>

            <div className="relative mx-auto w-20 h-20">
              <img 
                src={top2.teamAvatar} 
                alt={top2.teamName} 
                className="w-full h-full rounded-2xl object-cover border-2 border-slate-300 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-slate-300 text-slate-900 font-bold text-xs shadow-md">
                🥈
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-white font-sans group-hover:text-cyan-300 transition-colors">
                {top2.projectTitle}
              </h3>
              <span className="text-xs font-mono text-cyan-400">{top2.teamName}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-0.5">
              <div className="text-2xl font-black text-white font-mono">{top2.totalScore}</div>
              <div className="text-[10px] font-mono text-slate-400">Score / 100</div>
            </div>

            <div className="text-[10px] font-mono text-slate-400">
              Track: {top2.track}
            </div>
          </div>
        )}

        {/* 1st Place (Gold / Champion) */}
        {top1 && (
          <div 
            role="button"
            tabIndex={0}
            aria-label={`Grand Champion Rank 1: ${top1.projectTitle} by ${top1.teamName}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setInspectSubmission(top1); }}
            onClick={() => setInspectSubmission(top1)}
            className="order-1 md:order-2 glass-card-glow-indigo rounded-3xl border-2 border-amber-400 p-7 space-y-5 text-center relative overflow-hidden cursor-pointer group shadow-2xl scale-[1.03] focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-amber-500 to-yellow-400 py-1 text-slate-950 font-mono font-black text-[10px] tracking-widest uppercase">
              GRAND CHAMPION (#1)
            </div>

            <div className="relative mx-auto w-24 h-24 pt-2">
              <Crown className="w-8 h-8 text-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
              <img 
                src={top1.teamAvatar} 
                alt={top1.teamName} 
                className="w-full h-full rounded-3xl object-cover border-2 border-amber-400 shadow-neon-cyan"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs shadow-md">
                🏆
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-white font-sans group-hover:text-amber-300 transition-colors">
                {top1.projectTitle}
              </h3>
              <span className="text-xs font-mono text-amber-400 font-semibold">{top1.teamName}</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/20 to-slate-900 border border-amber-500/30 space-y-0.5">
              <div className="text-3xl font-black text-amber-300 font-mono">{top1.totalScore}</div>
              <div className="text-[10px] font-mono text-slate-300">Composite Jury Score</div>
            </div>

            <div className="text-xs font-mono text-slate-300">
              Track: <strong className="text-white">{top1.track}</strong>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {top3 && (
          <div 
            role="button"
            tabIndex={0}
            aria-label={`Rank 3: ${top3.projectTitle} by ${top3.teamName}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setInspectSubmission(top3); }}
            onClick={() => setInspectSubmission(top3)}
            className="order-3 glass-card-hover rounded-3xl border border-amber-700/40 p-6 space-y-4 text-center relative overflow-hidden cursor-pointer group focus:outline-none focus:ring-2 focus:ring-amber-600"
          >
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-200 border border-amber-700/40 text-[10px] font-mono font-black">
              #3 RANK
            </div>

            <div className="relative mx-auto w-20 h-20">
              <img 
                src={top3.teamAvatar} 
                alt={top3.teamName} 
                className="w-full h-full rounded-2xl object-cover border-2 border-amber-700 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-amber-700 text-white font-bold text-xs shadow-md">
                🥉
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-white font-sans group-hover:text-cyan-300 transition-colors">
                {top3.projectTitle}
              </h3>
              <span className="text-xs font-mono text-cyan-400">{top3.teamName}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-0.5">
              <div className="text-2xl font-black text-white font-mono">{top3.totalScore}</div>
              <div className="text-[10px] font-mono text-slate-400">Score / 100</div>
            </div>

            <div className="text-[10px] font-mono text-slate-400">
              Track: {top3.track}
            </div>
          </div>
        )}

      </div>

      {/* Full Leaderboard Table (All Rankings) */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-white font-sans">Official Standings</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Click row for Rubric Score Breakdown
          </span>
        </div>

        <div className="divide-y divide-white/5" role="list">
          {filteredSubmissions.map((sub, index) => {
            const rank = index + 1;
            const delta = sub.rankDelta || 0;

            return (
              <div
                key={sub.id}
                role="listitem"
                tabIndex={0}
                aria-label={`Rank ${rank}: ${sub.projectTitle} with score ${sub.totalScore}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    playSfx('beep');
                    setInspectSubmission(sub);
                  }
                }}
                onClick={() => {
                  playSfx('beep');
                  setInspectSubmission(sub);
                }}
                className="py-4 px-3 rounded-2xl hover:bg-slate-900/80 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400"
              >
                {/* Left Rank & Team info */}
                <div className="flex items-center gap-4">
                  {/* Rank Badge & Delta */}
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-sm ${
                      rank === 1 
                        ? 'bg-amber-400 text-slate-950 shadow-md' 
                        : rank === 2 
                        ? 'bg-slate-300 text-slate-950' 
                        : rank === 3 
                        ? 'bg-amber-700 text-white' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {rank}
                    </span>

                    {/* Rank delta indicator */}
                    <div className="text-[10px] font-mono font-bold">
                      {delta > 0 ? (
                        <span className="text-emerald-400 flex items-center">
                          <TrendingUp className="w-3 h-3" /> +{delta}
                        </span>
                      ) : delta < 0 ? (
                        <span className="text-rose-400 flex items-center">
                          <TrendingDown className="w-3 h-3" /> {delta}
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center">
                          <Minus className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Team Logo & Details */}
                  <img src={sub.teamAvatar} alt={sub.teamName} className="w-10 h-10 rounded-xl object-cover border border-white/10" />

                  <div>
                    <h4 className="font-bold text-sm text-white font-sans hover:text-cyan-300 transition-colors">
                      {sub.projectTitle}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                      <span className="text-cyan-400 font-semibold">{sub.teamName}</span>
                      <span>•</span>
                      <span>{sub.track}</span>
                    </div>
                  </div>
                </div>

                {/* Right Score & Breakdown pill */}
                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="text-right font-mono">
                    <div className="text-xl font-black text-white">{sub.totalScore}</div>
                    <div className="text-[9px] text-slate-400">Jury Points</div>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all"
                  >
                    Breakdown
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inspect Project Modal (Deep Rubric Breakdown) */}
      {inspectSubmission && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="inspect-project-title"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="glass-card rounded-3xl border border-indigo-500/40 p-6 max-w-2xl w-full space-y-6 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img src={inspectSubmission.teamAvatar} alt={inspectSubmission.teamName} className="w-12 h-12 rounded-2xl object-cover border border-white/10" />
                <div>
                  <h3 id="inspect-project-title" className="font-bold text-lg text-white font-sans">{inspectSubmission.projectTitle}</h3>
                  <div className="text-xs font-mono text-cyan-400">Team {inspectSubmission.teamName} • {inspectSubmission.track}</div>
                </div>
              </div>
              <button
                onClick={() => setInspectSubmission(null)}
                aria-label="Close modal"
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Links */}
            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed font-sans">{inspectSubmission.description}</p>
              
              <div className="flex flex-wrap gap-1.5">
                {inspectSubmission.techStack.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] font-mono text-slate-300 border border-white/5">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-3 font-mono">
                {inspectSubmission.githubUrl && (
                  <a 
                    href={sanitizeURL(inspectSubmission.githubUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <GithubIcon className="w-3.5 h-3.5" /> GitHub Source
                  </a>
                )}
                {inspectSubmission.demoUrl && (
                  <a 
                    href={sanitizeURL(inspectSubmission.demoUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => handleDemoClick(e, inspectSubmission.demoUrl!)}
                    className="text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Live Prototype
                  </a>
                )}
              </div>
            </div>

            {/* 4-Pillar Score Breakdown Matrix */}
            {inspectSubmission.rubricScores && (
              <div className="space-y-3 pt-2">
                <h4 className="font-mono text-xs text-slate-300 font-bold uppercase tracking-wider">
                  Rubric Pillar Breakdown:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-center font-mono">
                    <span className="text-[10px] text-slate-400 block">Technical</span>
                    <div className="text-lg font-bold text-cyan-400">{inspectSubmission.rubricScores.technicalComplexity}/25</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-center font-mono">
                    <span className="text-[10px] text-slate-400 block">Innovation</span>
                    <div className="text-lg font-bold text-indigo-400">{inspectSubmission.rubricScores.innovation}/25</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-center font-mono">
                    <span className="text-[10px] text-slate-400 block">Design & UX</span>
                    <div className="text-lg font-bold text-emerald-400">{inspectSubmission.rubricScores.designAndUX}/25</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-center font-mono">
                    <span className="text-[10px] text-slate-400 block">Impact</span>
                    <div className="text-lg font-bold text-amber-400">{inspectSubmission.rubricScores.businessImpact}/25</div>
                  </div>
                </div>
              </div>
            )}

            {/* Judge Feedback Quote */}
            {inspectSubmission.judgeFeedbackPublic && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-bold block">
                  Lead Judge Comments:
                </span>
                <p className="text-xs text-slate-200 font-sans italic leading-relaxed">
                  "{inspectSubmission.judgeFeedbackPublic}"
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
