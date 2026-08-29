import React, { useState, useMemo, useCallback } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  ExternalLink, 
  Check, 
  ChevronRight, 
  ShieldCheck 
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

export const JudgeDashboard: React.FC = () => {
  const { 
    judgeUser, 
    submissions, 
    submitRubricEvaluation, 
    playSfx, 
    setCurrentView,
    showToast
  } = useEvent();

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>(submissions[0]?.id || 'sub_1');
  const [filterTrack, setFilterTrack] = useState<string>('all');

  // Rubric Scoring State
  const [technical, setTechnical] = useState<number>(24);
  const [innovation, setInnovation] = useState<number>(25);
  const [design, setDesign] = useState<number>(23);
  const [impact, setImpact] = useState<number>(24);
  const [feedbackPublic, setFeedbackPublic] = useState('Groundbreaking agentic orchestration with sub-100ms response time.');
  const [feedbackPrivate, setFeedbackPrivate] = useState('Solid security architecture; verify enterprise quota limits.');
  const [submitResult, setSubmitResult] = useState<{ totalScore: number; biasDetected: boolean; biasReason?: string } | null>(null);

  const handleDemoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (isFictionalDemoUrl(url)) {
      e.preventDefault();
      playSfx('alert');
      showToast({
        type: 'info',
        title: 'Demo Environment Mock',
        message: 'This is a simulation sandbox project with simulated endpoints.'
      });
    }
  }, [playSfx, showToast]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => filterTrack === 'all' || s.track === filterTrack);
  }, [submissions, filterTrack]);

  const selectedSub = useMemo(() => {
    return submissions.find(s => s.id === selectedSubmissionId) || submissions[0];
  }, [submissions, selectedSubmissionId]);

  const totalScore = technical + innovation + design + impact;
  const isOutlier = totalScore >= 99 || totalScore < 65;

  const handleSelectSubmission = useCallback((sub: Submission) => {
    playSfx('beep');
    setSelectedSubmissionId(sub.id);
    if (sub.rubricScores) {
      setTechnical(sub.rubricScores.technicalComplexity);
      setInnovation(sub.rubricScores.innovation);
      setDesign(sub.rubricScores.designAndUX);
      setImpact(sub.rubricScores.businessImpact);
    }
    if (sub.judgeFeedbackPublic) setFeedbackPublic(sub.judgeFeedbackPublic);
    if (sub.judgeFeedbackPrivate) setFeedbackPrivate(sub.judgeFeedbackPrivate);
    setSubmitResult(null);
  }, [playSfx]);

  const handleScoreSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    playSfx('beep');
    const res = submitRubricEvaluation(
      selectedSub.id,
      {
        technicalComplexity: technical,
        innovation,
        designAndUX: design,
        businessImpact: impact
      },
      feedbackPublic,
      feedbackPrivate
    );
    setSubmitResult(res);
  }, [selectedSub, playSfx, submitRubricEvaluation, technical, innovation, design, impact, feedbackPublic, feedbackPrivate]);

  const setPreset = useCallback((type: 'balanced' | 'flawless' | 'harsh') => {
    playSfx('beep');
    if (type === 'balanced') {
      setTechnical(22);
      setInnovation(23);
      setDesign(22);
      setImpact(23);
    } else if (type === 'flawless') {
      setTechnical(25);
      setInnovation(25);
      setDesign(25);
      setImpact(25);
    } else if (type === 'harsh') {
      setTechnical(14);
      setInnovation(15);
      setDesign(13);
      setImpact(14);
    }
  }, [playSfx]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-indigo-500 to-cyan-400 p-[1.5px] shadow-neon-indigo">
              <div className="w-full h-full bg-[#090D16] rounded-[14px] flex items-center justify-center">
                <Scale className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                  Smart Judging & Evaluation Studio
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  AI BIAS AUDIT v2
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Judge: {judgeUser.name} • {judgeUser.company}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10">
              <span className="text-slate-400 block text-[10px]">Evaluated</span>
              <span className="font-bold text-emerald-400 text-sm">{judgeUser.evaluatedCount} Projects</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10">
              <span className="text-slate-400 block text-[10px]">Pending</span>
              <span className="font-bold text-amber-400 text-sm">{judgeUser.pendingCount} Projects</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10">
              <span className="text-slate-400 block text-[10px]">Judge Bias Index</span>
              <span className="font-bold text-cyan-300 text-sm">{judgeUser.biasIndex}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Queue (4 cols) & Rubric Evaluation Panel (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col (4 cols): Assigned Projects Queue */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <label htmlFor="judge-track-filter" className="text-slate-300">Filter Track:</label>
            <select
              id="judge-track-filter"
              value={filterTrack}
              onChange={(e) => setFilterTrack(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Tracks</option>
              <option value="AI & Autonomous Agents">AI & Agents</option>
              <option value="Web3 & Security">Web3 & Security</option>
              <option value="HealthTech & Social Impact">HealthTech</option>
              <option value="Next-Gen Infrastructure">Next-Gen Infra</option>
            </select>
          </div>

          <div className="space-y-3" role="list" aria-label="Projects Evaluation Queue">
            {filteredSubmissions.map((sub) => {
              const isSelected = sub.id === selectedSubmissionId;
              const isEvaluated = sub.status === 'evaluated';

              return (
                <div
                  key={sub.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectSubmission(sub); }}
                  onClick={() => handleSelectSubmission(sub)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-400/80 shadow-neon-indigo ring-1 ring-amber-400/50'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img src={sub.teamAvatar} alt={sub.teamName} className="w-8 h-8 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-white font-sans truncate max-w-[160px]">
                          {sub.projectTitle}
                        </h4>
                        <span className="text-[10px] font-mono text-cyan-400 font-semibold">{sub.teamName}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      isEvaluated 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {isEvaluated ? `${sub.totalScore}/100` : 'Pending'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-2 font-sans">
                    {sub.tagline}
                  </p>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{sub.track}</span>
                    <span className="text-cyan-400 flex items-center gap-0.5">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (8 cols): Interactive Rubric Scoring Studio */}
        <div className="lg:col-span-8 space-y-6">
          
          {selectedSub ? (
            <form onSubmit={handleScoreSubmit} className="glass-card rounded-2xl border border-white/10 p-6 space-y-6">
              
              {/* Submission Overview */}
              <div className="space-y-3 pb-5 border-b border-white/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {selectedSub.track}
                    </span>
                    <h3 className="text-xl font-extrabold text-white font-sans mt-1">
                      {selectedSub.projectTitle}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">By {selectedSub.teamName}</p>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    {selectedSub.githubUrl && (
                      <a 
                        href={sanitizeURL(selectedSub.githubUrl)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-slate-200 flex items-center gap-1.5 transition-all"
                      >
                        <GithubIcon className="w-3.5 h-3.5" /> <span>Repo</span>
                      </a>
                    )}
                    {selectedSub.demoUrl && (
                      <a 
                        href={sanitizeURL(selectedSub.demoUrl)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => handleDemoClick(e, selectedSub.demoUrl!)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {selectedSub.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedSub.techStack.map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/5 text-[10px] font-mono text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rubric Criteria Sliders */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <h4 className="font-bold text-sm text-white font-sans">Official Rubric Scoring Matrix</h4>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-slate-400 text-[10px]">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setPreset('balanced')}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-[10px]"
                    >
                      Strong (90)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreset('flawless')}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px]"
                    >
                      Flawless (100)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreset('harsh')}
                      className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px]"
                    >
                      Harsh (56)
                    </button>
                  </div>
                </div>

                {/* 1. Technical Complexity */}
                <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="flex justify-between text-xs font-mono">
                    <label htmlFor="tech-score-slider" className="text-slate-200 font-semibold">1. Technical Complexity & Architecture (0-25)</label>
                    <span className="text-cyan-400 font-bold text-sm">{technical} / 25</span>
                  </div>
                  <input
                    id="tech-score-slider"
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={technical}
                    onChange={(e) => setTechnical(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Basic CRUD (0-10)</span>
                    <span>Solid Full-Stack (15-20)</span>
                    <span>Novel AI/ZK Protocol (21-25)</span>
                  </div>
                </div>

                {/* 2. Innovation & Originality */}
                <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="flex justify-between text-xs font-mono">
                    <label htmlFor="innov-score-slider" className="text-slate-200 font-semibold">2. Innovation & Originality (0-25)</label>
                    <span className="text-indigo-400 font-bold text-sm">{innovation} / 25</span>
                  </div>
                  <input
                    id="innov-score-slider"
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={innovation}
                    onChange={(e) => setInnovation(Number(e.target.value))}
                    className="w-full accent-indigo-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Common Wrapper (0-10)</span>
                    <span>Smart Feature (15-20)</span>
                    <span>Category Redefining (21-25)</span>
                  </div>
                </div>

                {/* 3. Design & User Experience */}
                <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="flex justify-between text-xs font-mono">
                    <label htmlFor="design-score-slider" className="text-slate-200 font-semibold">3. Design, Polish & UX (0-25)</label>
                    <span className="text-emerald-400 font-bold text-sm">{design} / 25</span>
                  </div>
                  <input
                    id="design-score-slider"
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={design}
                    onChange={(e) => setDesign(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Bare Prototype (0-10)</span>
                    <span>Clean Interface (15-20)</span>
                    <span>Apple / Linear Grade (21-25)</span>
                  </div>
                </div>

                {/* 4. Business Impact & Viability */}
                <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="flex justify-between text-xs font-mono">
                    <label htmlFor="impact-score-slider" className="text-slate-200 font-semibold">4. Business Viability & Real-World Impact (0-25)</label>
                    <span className="text-amber-400 font-bold text-sm">{impact} / 25</span>
                  </div>
                  <input
                    id="impact-score-slider"
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={impact}
                    onChange={(e) => setImpact(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Toy Concept (0-10)</span>
                    <span>Niche Market (15-20)</span>
                    <span>Venture Scalable (21-25)</span>
                  </div>
                </div>
              </div>

              {/* Total Score & AI Bias Indicator Banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Composite Evaluation:</span>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {totalScore} <span className="text-sm text-slate-500 font-normal">/ 100 PTS</span>
                  </div>
                </div>

                {/* AI Bias Check Badge */}
                <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-mono ${
                  isOutlier 
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' 
                    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                }`}>
                  {isOutlier ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold">
                      {isOutlier ? 'AI Bias Anomaly Alert' : 'Rubric Bias Check Passed'}
                    </div>
                    <div className="text-[10px] opacity-80">
                      {isOutlier 
                        ? totalScore >= 99 
                          ? 'Score is >2.4σ above track median (Leniency risk)' 
                          : 'Score is >2.1σ below normal distribution'
                        : 'Score distribution is within 0.6σ of historical jury norms'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Written Feedback Fields */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="public-feedback" className="text-xs font-mono text-slate-300 font-semibold block mb-1">
                    Public Constructive Feedback (Visible to Hackers):
                  </label>
                  <textarea
                    id="public-feedback"
                    rows={2}
                    value={feedbackPublic}
                    onChange={(e) => setFeedbackPublic(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="private-feedback" className="text-xs font-mono text-slate-300 font-semibold block mb-1">
                    Private Jury Deliberation Notes (Internal Only):
                  </label>
                  <textarea
                    id="private-feedback"
                    rows={2}
                    value={feedbackPrivate}
                    onChange={(e) => setFeedbackPrivate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-neon-indigo transition-all"
              >
                <Check className="w-4 h-4 text-cyan-300" />
                <span>Submit Evaluation & Update Leaderboard Live</span>
              </button>

              {submitResult && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between font-mono animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Evaluation recorded ({submitResult.totalScore}/100). Standings updated across all client screens.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentView('leaderboard')}
                    className="text-cyan-300 hover:underline flex items-center gap-0.5 text-[11px] shrink-0"
                  >
                    <span>View Standings</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}

            </form>
          ) : (
            <div className="glass-card rounded-2xl border border-white/10 p-12 text-center text-slate-400 font-mono">
              Select a project from the queue to start rubric evaluation.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
