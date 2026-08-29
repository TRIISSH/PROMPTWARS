import React, { useState } from 'react';
import { 
  Sparkles, 
  UserPlus, 
  Check, 
  Cpu, 
  Zap, 
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const AITeamMatchmaker: React.FC = () => {
  const { 
    candidates, 
    inviteCandidateToTeam, 
    autoAssembleDreamTeam, 
    participantUser,
    playSfx,
    teams 
  } = useEvent();

  const [selectedTrack, _setSelectedTrack] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAutoMatching, setIsAutoMatching] = useState(false);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  const myTeam = teams.find(t => t.leaderId === participantUser.id || t.id === 'tm_1');

  const filteredCandidates = candidates.filter(cand => {
    const matchesTrack = selectedTrack === 'all' || cand.targetTrack === selectedTrack;
    const matchesRole = selectedRole === 'all' || cand.preferredRole === selectedRole;
    return matchesTrack && matchesRole;
  });

  const handleInvite = (candId: string) => {
    playSfx('beep');
    setInvitedIds(prev => [...prev, candId]);
    inviteCandidateToTeam(candId);
  };

  const handleAutoAssemble = () => {
    setIsAutoMatching(true);
    playSfx('alert');
    setTimeout(() => {
      autoAssembleDreamTeam();
      setIsAutoMatching(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Matchmaker Header & Auto-Assemble Hero */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white font-sans">
                  AI Team Matchmaker & Synergy Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  VECTOR SYNERGY v3
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Calculates skill complementarities, experience parity, and role gaps across 500+ attendees
              </p>
            </div>
          </div>

          {/* 1-Click Auto Assemble CTA */}
          <button
            type="button"
            onClick={handleAutoAssemble}
            disabled={isAutoMatching || candidates.length === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs font-mono shadow-neon-indigo transition-all disabled:opacity-50"
          >
            {isAutoMatching ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Running Vector Synergy Clustering...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>AI Auto-Assemble Dream Team</span>
              </>
            )}
          </button>
        </div>

        {/* Current Team Status Bar */}
        {myTeam && (
          <div className="mt-5 p-3.5 rounded-xl bg-slate-900/90 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Your Squad: <strong className="text-white">{myTeam.name}</strong></span>
              <span className="text-slate-400">Roster: <strong className="text-cyan-400">{myTeam.members.length} / 4 Members</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-indigo-300">Composite Team Synergy:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                {myTeam.compatibilityScore || 96}% (Dream Squad Match)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Filter By Role:</span>
          {['all', 'Backend Dev', 'UI/UX Designer', 'Product Lead'].map((r) => (
            <button
              key={r}
              onClick={() => {
                playSfx('beep');
                setSelectedRole(r);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedRole === r
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing <strong className="text-white">{filteredCandidates.length}</strong> top-matched candidates
        </span>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center space-y-3 font-mono">
          <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="font-bold text-white text-base">Your Team Roster is Fully Optimized!</h4>
          <p className="text-xs text-slate-400">
            All high-synergy candidates have been recruited or assigned into balanced hackathon squads.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCandidates.map((cand) => {
            const isInvited = invitedIds.includes(cand.id);

            return (
              <div 
                key={cand.id}
                className="glass-card-hover rounded-2xl border border-white/10 p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={cand.avatar} 
                        alt={cand.name} 
                        className="w-12 h-12 rounded-2xl object-cover border border-white/10" 
                      />
                      <div>
                        <h4 className="font-bold text-base text-white font-sans">{cand.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono text-cyan-400 font-semibold">{cand.preferredRole}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 capitalize">
                            {cand.experienceLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Score Badge */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-emerald-400 font-mono font-black text-base">
                        <Flame className="w-4 h-4 text-emerald-400" />
                        <span>{cand.compatibilityScore}%</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 block">AI Match</span>
                    </div>
                  </div>

                  {/* AI Synergy Explanation */}
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
                    <div className="flex items-center gap-1 text-indigo-300 font-bold text-[11px] font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Synergy Analysis:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-indigo-200/90 font-sans">
                      {cand.synergyReason}
                    </p>
                  </div>

                  {/* Skills Pills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Core Skills & Tech Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cand.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-900 border border-white/10 text-[10px] font-mono text-slate-300 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skill Complements */}
                  {cand.missingSkillsComplement.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 pt-1">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>Fills team gap: {cand.missingSkillsComplement.join(', ')}</span>
                    </div>
                  )}

                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono text-slate-400">Target Track: {cand.targetTrack}</span>
                  
                  <button
                    type="button"
                    onClick={() => handleInvite(cand.id)}
                    disabled={isInvited}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      isInvited
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-neon-indigo hover:scale-105'
                    }`}
                  >
                    {isInvited ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Invited to Squad</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Invite to Team</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
