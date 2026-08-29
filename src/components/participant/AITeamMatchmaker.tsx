import React, { useState, useMemo, useCallback } from 'react';
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

  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAutoMatching, setIsAutoMatching] = useState(false);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  const myTeam = useMemo(() => {
    return teams.find(t => t.leaderId === participantUser.id || t.id === 'tm_1');
  }, [teams, participantUser.id]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(cand => {
      const matchesTrack = selectedTrack === 'all' || cand.targetTrack === selectedTrack;
      const matchesRole = selectedRole === 'all' || cand.preferredRole === selectedRole;
      return matchesTrack && matchesRole;
    });
  }, [candidates, selectedTrack, selectedRole]);

  const handleInvite = useCallback((candId: string) => {
    playSfx('beep');
    setInvitedIds(prev => [...prev, candId]);
    inviteCandidateToTeam(candId);
  }, [inviteCandidateToTeam, playSfx]);

  const handleAutoAssemble = useCallback(() => {
    setIsAutoMatching(true);
    playSfx('alert');
    setTimeout(() => {
      autoAssembleDreamTeam();
      setIsAutoMatching(false);
    }, 1200);
  }, [autoAssembleDreamTeam, playSfx]);

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
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Track:</span>
            {['all', 'AI & Autonomous Agents', 'Web3 & Security', 'HealthTech & Social Impact'].map((trk) => (
              <button
                key={trk}
                onClick={() => {
                  playSfx('beep');
                  setSelectedTrack(trk);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                  selectedTrack === trk
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {trk === 'all' ? 'All Tracks' : trk.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Role:</span>
            {['all', 'Backend Dev', 'UI/UX Designer', 'Product Lead'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  playSfx('beep');
                  setSelectedRole(r);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                  selectedRole === r
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {r === 'all' ? 'All Roles' : r}
              </button>
            ))}
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
          {filteredCandidates.map((candidate) => {
            const isInvited = invitedIds.includes(candidate.id);

            return (
              <div
                key={candidate.id}
                role="listitem"
                className="glass-card-hover rounded-2xl border border-white/10 p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-white font-sans">{candidate.name}</h4>
                        <div className="text-[11px] font-mono text-cyan-400 font-semibold">{candidate.preferredRole}</div>
                        <span className="text-[10px] font-mono text-slate-400 capitalize">{candidate.experienceLevel} Tier</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-gradient-to-b from-indigo-500/20 to-cyan-500/20 border border-cyan-500/30 text-center font-mono">
                      <div className="text-base font-black text-cyan-300">{candidate.compatibilityScore}%</div>
                      <div className="text-[8px] text-slate-300 font-semibold uppercase">Synergy</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Skill Arsenal:</span>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/5 text-[10px] font-mono text-slate-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-300 font-bold">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>AI Vector Synergy Analysis:</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {candidate.synergyReason}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400 truncate">
                    Track: {candidate.targetTrack}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleInvite(candidate.id)}
                    disabled={isInvited}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      isInvited
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-neon-indigo hover:scale-105'
                    }`}
                  >
                    {isInvited ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Recruited</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Recruit</span>
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
