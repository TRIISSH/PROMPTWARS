import React, { useState, useMemo, useCallback } from 'react';
import { 
  HeartHandshake, 
  CheckCircle2, 
  MapPin, 
  Check
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const MentorDashboard: React.FC = () => {
  const { 
    mentorUser, 
    supportTickets, 
    claimSupportTicket, 
    resolveSupportTicket, 
    playSfx, 
    triggerConfetti 
  } = useEvent();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTickets = useMemo(() => {
    return supportTickets.filter(tkt => {
      const matchesCat = filterCategory === 'all' || tkt.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || tkt.status === filterStatus;
      return matchesCat && matchesStatus;
    });
  }, [supportTickets, filterCategory, filterStatus]);

  const handleClaim = useCallback((ticketId: string) => {
    playSfx('beep');
    claimSupportTicket(ticketId, mentorUser.name);
  }, [claimSupportTicket, mentorUser.name, playSfx]);

  const handleResolve = useCallback((ticketId: string) => {
    playSfx('success');
    resolveSupportTicket(ticketId);
    triggerConfetti();
  }, [playSfx, resolveSupportTicket, triggerConfetti]);

  const openTicketsCount = useMemo(() => {
    return supportTickets.filter(t => t.status === 'open').length;
  }, [supportTickets]);

  const inProgressTicketsCount = useMemo(() => {
    return supportTickets.filter(t => t.status === 'in_progress').length;
  }, [supportTickets]);

  const resolvedTicketsCount = useMemo(() => {
    return supportTickets.filter(t => t.status === 'resolved').length;
  }, [supportTickets]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 p-[1.5px] shadow-neon-indigo">
              <div className="w-full h-full bg-[#090D16] rounded-[14px] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                  Mentor & Volunteer Command Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  REAL-TIME HELP DESK
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Staff: {mentorUser.name} • {mentorUser.preferredRole} • {mentorUser.tableAssigned}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10">
              <span className="text-slate-400 block text-[10px]">Open Tickets</span>
              <span className="font-bold text-amber-400 text-sm">
                {openTicketsCount} Active
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10">
              <span className="text-slate-400 block text-[10px]">In Progress</span>
              <span className="font-bold text-cyan-400 text-sm">
                {inProgressTicketsCount} Claimed
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10">
              <span className="text-slate-400 block text-[10px]">Resolved</span>
              <span className="font-bold text-emerald-400 text-sm">
                {resolvedTicketsCount} Cleared
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="glass-card rounded-2xl border border-white/10 p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter tickets by category">
          <span className="text-slate-400">Category:</span>
          {['all', 'Technical / API', 'Hardware', 'Mentorship', 'Logistics / Pass'].map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={filterCategory === cat}
              onClick={() => {
                playSfx('beep');
                setFilterCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterCategory === cat
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2" role="tablist" aria-label="Filter tickets by status">
          <span className="text-slate-400">Status:</span>
          {['all', 'open', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              role="tab"
              aria-selected={filterStatus === st}
              onClick={() => {
                playSfx('beep');
                setFilterStatus(st);
              }}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                filterStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
        {filteredTickets.map((ticket) => {
          const isOpen = ticket.status === 'open';
          const isInProgress = ticket.status === 'in_progress';
          const isResolved = ticket.status === 'resolved';

          return (
            <div
              key={ticket.id}
              role="listitem"
              className={`glass-card-hover rounded-2xl border p-5 space-y-4 flex flex-col justify-between ${
                isOpen
                  ? 'border-amber-500/40 bg-slate-900/90'
                  : isInProgress
                  ? 'border-cyan-500/40 bg-slate-900/90'
                  : 'border-white/5 bg-slate-950/60 opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    ticket.priority === 'urgent' || ticket.priority === 'high'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {ticket.priority} Priority
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold capitalize ${
                    isOpen 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : isInProgress 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white font-sans">{ticket.category}</h4>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{ticket.tableNumber}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{ticket.authorName}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-white/5">
                  "{ticket.description}"
                </p>

                {ticket.assignedTo && (
                  <div className="text-[11px] font-mono text-purple-300 flex items-center gap-1">
                    <span>Mentor Assigned:</span>
                    <strong className="text-white">{ticket.assignedTo}</strong>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-500">{ticket.createdAt}</span>

                {isOpen && (
                  <button
                    onClick={() => handleClaim(ticket.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono shadow-sm transition-all hover:scale-105"
                  >
                    Claim Ticket
                  </button>
                )}

                {isInProgress && (
                  <button
                    onClick={() => handleResolve(ticket.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono flex items-center gap-1 shadow-sm transition-all hover:scale-105"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                )}

                {isResolved && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
