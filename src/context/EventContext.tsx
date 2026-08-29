import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  Team, 
  Submission, 
  Judge, 
  Announcement, 
  VenueZone, 
  CrowdAnalytics, 
  LiveEventItem, 
  MatchmakingCandidate,
  ViewMode,
  UserRole,
  RubricScores,
  SupportTicket,
  AIInsightAlert,
  AIChatMessage,
  EventType
} from '../types';
import { 
  INITIAL_USER_PARTICIPANT, 
  INITIAL_USER_ORGANIZER, 
  INITIAL_USER_JUDGE,
  INITIAL_USER_MENTOR,
  INITIAL_TEAMS,
  INITIAL_CANDIDATES,
  INITIAL_SUBMISSIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_VENUE_ZONES,
  INITIAL_ANALYTICS,
  INITIAL_LIVE_EVENTS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_AI_INSIGHTS,
  INITIAL_AI_CHAT_MESSAGES
} from '../data/mockData';

interface EventContextType {
  // Navigation & Role & Event Type
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentEventType: EventType;
  setCurrentEventType: (type: EventType) => void;

  // Profiles
  participantUser: UserProfile;
  organizerUser: UserProfile;
  judgeUser: Judge;
  mentorUser: UserProfile;
  updateParticipantProfile: (updates: Partial<UserProfile>) => void;

  // Data Collections
  teams: Team[];
  candidates: MatchmakingCandidate[];
  submissions: Submission[];
  announcements: Announcement[];
  venueZones: VenueZone[];
  analytics: CrowdAnalytics;
  liveEvents: LiveEventItem[];
  supportTickets: SupportTicket[];
  aiInsights: AIInsightAlert[];
  aiChatMessages: AIChatMessage[];

  // Simulation Controls & Sound
  isLiveSimulating: boolean;
  setIsLiveSimulating: (active: boolean) => void;
  isAudioEnabled: boolean;
  setIsAudioEnabled: (enabled: boolean) => void;
  playSfx: (type: 'beep' | 'success' | 'alert' | 'cheer') => void;

  // Actions
  triggerConfetti: () => void;
  checkInTicket: (ticketOrHash: string, zone?: string) => { success: boolean; message: string; participantName?: string };
  createAnnouncementFromPrompt: (rawPrompt: string, priority?: 'normal' | 'high' | 'urgent' | 'emergency') => Announcement;
  submitRubricEvaluation: (submissionId: string, scores: RubricScores, feedbackPublic: string, feedbackPrivate: string) => { totalScore: number; biasDetected: boolean; biasReason?: string };
  submitProject: (projectData: { title: string; tagline: string; description: string; techStack: string[]; track: string; githubUrl: string; demoUrl: string }) => void;
  inviteCandidateToTeam: (candidateId: string) => void;
  autoAssembleDreamTeam: () => void;
  simulateLivePulse: (type?: string) => void;

  // New Actions: Support Tickets & AI Assistant & Insights
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
  claimSupportTicket: (ticketId: string, mentorName: string) => void;
  resolveSupportTicket: (ticketId: string) => void;
  sendAIChatMessage: (userText: string) => void;
  dismissAIInsight: (insightId: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [activeRole, setActiveRole] = useState<UserRole>('organizer');
  const [currentEventType, setCurrentEventType] = useState<EventType>('hackathon');

  const [participantUser, setParticipantUser] = useState<UserProfile>(INITIAL_USER_PARTICIPANT);
  const [organizerUser] = useState<UserProfile>(INITIAL_USER_ORGANIZER);
  const [judgeUser, setJudgeUser] = useState<Judge>(INITIAL_USER_JUDGE);
  const [mentorUser] = useState<UserProfile>(INITIAL_USER_MENTOR);

  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [candidates, setCandidates] = useState<MatchmakingCandidate[]>(INITIAL_CANDIDATES);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [venueZones, setVenueZones] = useState<VenueZone[]>(INITIAL_VENUE_ZONES);
  const [analytics, setAnalytics] = useState<CrowdAnalytics>(INITIAL_ANALYTICS);
  const [liveEvents, setLiveEvents] = useState<LiveEventItem[]>(INITIAL_LIVE_EVENTS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [aiInsights, setAiInsights] = useState<AIInsightAlert[]>(INITIAL_AI_INSIGHTS);
  const [aiChatMessages, setAiChatMessages] = useState<AIChatMessage[]>(INITIAL_AI_CHAT_MESSAGES);

  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);

  // Audio synthesizer for interactive cyber sound effects
  const playSfx = useCallback((type: 'beep' | 'success' | 'alert' | 'cheer') => {
    if (!isAudioEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'beep') {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'cheer') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.07);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.14);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.21);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // Browser audio policy guard
    }
  }, [isAudioEnabled]);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EC4899']
      });
      playSfx('cheer');
    } catch {
      // Confetti fallback
    }
  }, [playSfx]);

  const updateParticipantProfile = (updates: Partial<UserProfile>) => {
    setParticipantUser(prev => ({ ...prev, ...updates }));
  };

  // 1. QR Check-in Station Action
  const checkInTicket = (ticketOrHash: string, zone: string = 'Main Stage Arena') => {
    const isMatched = ticketOrHash.toUpperCase().includes('EVOS') || ticketOrHash.includes('sig') || ticketOrHash.length > 4;
    
    if (isMatched) {
      const names = ['Kavita Rao', 'Jordan Hayes', 'Daniel Kim', 'Samantha Miller', 'Tariq Al-Mansoor'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      
      setAnalytics(prev => {
        const newCheckedIn = Math.min(prev.totalRegistered, prev.totalCheckedIn + 1);
        const newActive = prev.activeInVenue + 1;
        return {
          ...prev,
          totalCheckedIn: newCheckedIn,
          activeInVenue: newActive,
          attendanceRate: Number(((newCheckedIn / prev.totalRegistered) * 100).toFixed(1)),
        };
      });

      setVenueZones(prev => prev.map(z => {
        if (z.name === zone || z.id === 'z1') {
          const newOcc = Math.min(z.capacity, z.occupancy + 1);
          return {
            ...z,
            occupancy: newOcc,
            heatLevel: Number((newOcc / z.capacity).toFixed(2)),
            status: (newOcc / z.capacity > 0.88 ? 'crowded' : newOcc / z.capacity > 0.7 ? 'busy' : 'normal')
          };
        }
        return z;
      }));

      const newEvt: LiveEventItem = {
        id: `evt_${Date.now()}`,
        type: 'CHECK_IN',
        title: `${randomName} scanned pass at ${zone}`,
        description: `Ticket verified. Assigned to Table #${Math.floor(Math.random() * 40) + 1}`,
        timestamp: 'Just now',
        badgeColor: '#06B6D4'
      };

      setLiveEvents(prev => [newEvt, ...prev.slice(0, 19)]);
      playSfx('success');

      return {
        success: true,
        message: `Verification Success: ${randomName} checked in.`,
        participantName: randomName
      };
    }

    playSfx('alert');
    return {
      success: false,
      message: 'Invalid ticket signature. Please verify with helpdesk.'
    };
  };

  // 2. AI Multi-Channel Announcement Assistant
  const createAnnouncementFromPrompt = (rawPrompt: string, priority: 'normal' | 'high' | 'urgent' | 'emergency' = 'normal') => {
    const cleanPrompt = rawPrompt.trim();
    const isUrgent = priority === 'urgent' || priority === 'emergency';
    
    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title: isUrgent ? `🚨 ${cleanPrompt.slice(0, 45)}...` : `📢 ${cleanPrompt.slice(0, 45)}...`,
      rawPrompt: cleanPrompt,
      priority,
      targetAudience: 'all',
      channels: ['push', 'sms', 'email', 'discord'],
      variants: {
        push: {
          title: isUrgent ? `⚡ URGENT UPDATE: EventOS` : `📢 EventOS Announcement`,
          body: cleanPrompt.length > 90 ? cleanPrompt.slice(0, 87) + '...' : cleanPrompt
        },
        sms: `EVENTOS AI: ${cleanPrompt} — Details at os.ai/live`,
        email: {
          subject: `${isUrgent ? '[URGENT] ' : ''}Important Event Update: ${cleanPrompt.slice(0, 40)}`,
          htmlSnippet: `<div style="font-family:sans-serif; color:#1e293b;"><h3>Hackathon Update</h3><p>${cleanPrompt}</p><p>Check the live dashboard for real-time room assignments and schedules.</p></div>`
        },
        slackDiscord: `@everyone ${isUrgent ? '🚨 **URGENT BROADCAST**' : '📢 **ANNOUNCEMENT**'}\n${cleanPrompt}\n*Broadcasted via EventOS AI Mission Control*`
      },
      deliveredCount: analytics.totalCheckedIn,
      readCount: Math.floor(analytics.totalCheckedIn * 0.85),
      timestamp: 'Just now'
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);

    const newEvt: LiveEventItem = {
      id: `evt_${Date.now()}`,
      type: 'ANNOUNCEMENT',
      title: `Broadcast: ${newAnnouncement.title}`,
      description: `Dispatched across Push (${newAnnouncement.deliveredCount}), SMS & Discord`,
      timestamp: 'Just now',
      badgeColor: priority === 'urgent' ? '#F43F5E' : '#6366F1'
    };
    setLiveEvents(prev => [newEvt, ...prev.slice(0, 19)]);
    playSfx('alert');

    return newAnnouncement;
  };

  // 3. Smart Rubric Scoring & AI Bias Detection
  const submitRubricEvaluation = (
    submissionId: string, 
    scores: RubricScores, 
    feedbackPublic: string, 
    feedbackPrivate: string
  ) => {
    const rawTotal = scores.technicalComplexity + scores.innovation + scores.designAndUX + scores.businessImpact;
    
    const isAnomaly = rawTotal >= 99 || rawTotal < 65;
    const biasReason = isAnomaly 
      ? rawTotal >= 99 
        ? 'AI Bias Alert: Score is 2.4 σ higher than track median. Verified as potential lenient grading.' 
        : 'AI Bias Alert: Score is 2.1 σ below rubric norm. Flagged for secondary judge review.'
      : undefined;

    setSubmissions(prev => {
      const updated = prev.map(sub => {
        if (sub.id === submissionId) {
          const rankDelta = rawTotal > sub.totalScore ? 1 : rawTotal < sub.totalScore ? -1 : 0;
          return {
            ...sub,
            rubricScores: scores,
            totalScore: Number(rawTotal.toFixed(1)),
            judgeFeedbackPublic: feedbackPublic,
            judgeFeedbackPrivate: feedbackPrivate,
            evaluatedByJudgeId: judgeUser.id,
            biasAnomalyDetected: isAnomaly,
            biasAnomalyReason: biasReason,
            status: 'evaluated' as const,
            rankDelta
          };
        }
        return sub;
      });

      const sorted = [...updated].sort((a, b) => b.totalScore - a.totalScore);
      return sorted.map((item, idx) => ({ ...item, rank: idx + 1 }));
    });

    setJudgeUser(prev => ({
      ...prev,
      evaluatedCount: prev.evaluatedCount + 1,
      pendingCount: Math.max(0, prev.pendingCount - 1),
    }));

    const evaluatedSub = submissions.find(s => s.id === submissionId);
    const newEvt: LiveEventItem = {
      id: `evt_${Date.now()}`,
      type: 'SCORE_UPDATE',
      title: `Judge ${judgeUser.name} scored ${evaluatedSub?.teamName || 'Team'}`,
      description: `Final Score: ${rawTotal.toFixed(1)}/100 ${isAnomaly ? '⚠️ [AI Bias Flagged]' : '✅ [Rubric Verified]'}`,
      timestamp: 'Just now',
      badgeColor: isAnomaly ? '#F59E0B' : '#10B981'
    };
    setLiveEvents(prev => [newEvt, ...prev.slice(0, 19)]);
    playSfx(isAnomaly ? 'alert' : 'success');

    if (rawTotal >= 95) {
      triggerConfetti();
    }

    return {
      totalScore: rawTotal,
      biasDetected: isAnomaly,
      biasReason
    };
  };

  // 4. Participant Project Submission
  const submitProject = (projectData: {
    title: string;
    tagline: string;
    description: string;
    techStack: string[];
    track: string;
    githubUrl: string;
    demoUrl: string;
  }) => {
    const newSub: Submission = {
      id: `sub_${Date.now()}`,
      teamId: 'tm_1',
      teamName: 'OmniNexus AI',
      teamAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      projectTitle: projectData.title,
      tagline: projectData.tagline,
      description: projectData.description,
      techStack: projectData.techStack,
      track: projectData.track,
      githubUrl: projectData.githubUrl,
      demoUrl: projectData.demoUrl,
      submittedAt: 'Just now',
      rubricScores: { technicalComplexity: 25, innovation: 25, designAndUX: 24, businessImpact: 24 },
      totalScore: 98.0,
      status: 'submitted',
      rank: 1,
      rankDelta: 0
    };

    setSubmissions(prev => [newSub, ...prev.filter(s => s.teamId !== 'tm_1')]);
    
    setParticipantUser(prev => ({
      ...prev,
      xpPoints: prev.xpPoints + 500,
      level: prev.level + 1,
      badges: prev.badges.map(b => b.id === 'b4' ? { ...b, unlockedAt: 'Just now' } : b)
    }));

    const newEvt: LiveEventItem = {
      id: `evt_${Date.now()}`,
      type: 'SUBMISSION',
      title: `OmniNexus AI submitted "${projectData.title}"`,
      description: `Track: ${projectData.track} • Ready for Smart Judging`,
      timestamp: 'Just now',
      badgeColor: '#6366F1'
    };
    setLiveEvents(prev => [newEvt, ...prev.slice(0, 19)]);
    playSfx('success');
    triggerConfetti();
  };

  // 5. AI Matchmaker: Invite & Auto-Assemble
  const inviteCandidateToTeam = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    setTeams(prev => prev.map(t => {
      if (t.id === 'tm_1') {
        const newMember = {
          userId: candidate.id,
          name: candidate.name,
          avatar: candidate.avatar,
          roleInTeam: candidate.preferredRole,
          skills: candidate.skills,
          experienceLevel: candidate.experienceLevel
        };
        return {
          ...t,
          members: [...t.members.filter(m => m.userId !== candidate.id), newMember],
          compatibilityScore: Math.min(99, (t.compatibilityScore || 90) + 3),
          lookingForRoles: t.lookingForRoles.filter(r => r !== candidate.preferredRole)
        };
      }
      return t;
    }));

    setCandidates(prev => prev.filter(c => c.id !== candidateId));

    const newEvt: LiveEventItem = {
      id: `evt_${Date.now()}`,
      type: 'TEAM_MATCH',
      title: `${candidate.name} joined OmniNexus AI!`,
      description: `Role: ${candidate.preferredRole} • AI Compatibility: ${candidate.compatibilityScore}%`,
      timestamp: 'Just now',
      badgeColor: '#10B981'
    };
    setLiveEvents(prev => [newEvt, ...prev.slice(0, 19)]);
    playSfx('success');
  };

  const autoAssembleDreamTeam = () => {
    candidates.forEach(cand => {
      inviteCandidateToTeam(cand.id);
    });
    triggerConfetti();
  };

  // 6. Support Tickets Actions
  const createSupportTicket = (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    const newTkt: SupportTicket = {
      ...ticket,
      id: `tkt_${Date.now()}`,
      createdAt: 'Just now',
      status: 'open'
    };
    setSupportTickets(prev => [newTkt, ...prev]);
    const newEvt: LiveEventItem = {
      id: `evt_${Date.now()}`,
      type: 'SUPPORT_TICKET',
      title: `Help Request: ${newTkt.category}`,
      description: `${newTkt.authorName} at ${newTkt.tableNumber}`,
      timestamp: 'Just now',
      badgeColor: '#8B5CF6'
    };
    setLiveEvents(prev => [newEvt, ...prev.slice(0, 19)]);
    playSfx('alert');
  };

  const claimSupportTicket = (ticketId: string, mentorName: string) => {
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'in_progress', assignedTo: mentorName } : t));
    playSfx('beep');
  };

  const resolveSupportTicket = (ticketId: string) => {
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'resolved' } : t));
    playSfx('success');
  };

  // 7. AI Assistant Chat Co-Pilot
  const sendAIChatMessage = (userText: string) => {
    const userMsg: AIChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Just now'
    };

    setAiChatMessages(prev => [...prev, userMsg]);
    playSfx('beep');

    // Simulate smart contextual assistant response
    setTimeout(() => {
      let reply = "I'm checking the event operating system for you.";
      const lower = userText.toLowerCase();

      if (lower.includes('wifi') || lower.includes('password') || lower.includes('internet')) {
        reply = "📶 The high-speed event WiFi SSID is **HackMatrix-5G-Ultra** and the WPA2 password is **`build_the_future_2026`**. Dedicated ethernet drops are available in Hub 01 & Hub 02.";
      } else if (lower.includes('deadline') || lower.includes('submission') || lower.includes('freeze')) {
        reply = "⏰ Submissions lock at **11:00 AM sharp (Code Freeze)**. Please upload your GitHub repo, a working live demo link, and a 2-minute Loom/YouTube walkthrough before the timer runs out.";
      } else if (lower.includes('rubric') || lower.includes('judging') || lower.includes('score')) {
        reply = "⚖️ Projects are judged on 4 weighted pillars (25 points each): **1. Technical Complexity**, **2. Innovation & Originality**, **3. Design & UX**, and **4. Business Viability & Impact**. Real-time AI bias audits ensure fair score normalization.";
      } else if (lower.includes('food') || lower.includes('pizza') || lower.includes('boba') || lower.includes('dinner')) {
        reply = "🍕 Hot artisan pizza, vegan ramen, and iced boba are currently available in **Cafeteria & Lounge (Hall C)**. Midnight Red Bull restocks occur every 2 hours.";
      } else if (lower.includes('mentor') || lower.includes('help') || lower.includes('bug')) {
        reply = "💡 Mentors specializing in PyTorch, Rust, Smart Contracts, and Cloud Architecture are available in **Mentorship Pod M**. You can also file a ticket directly from your dashboard!";
      } else {
        reply = `⚡ EventOS AI analyzed your inquiry: "${userText}". Our staff and mentors have been alerted. You can explore the live schedule, find teammates in the AI Matchmaker, or submit your project from the navigation tabs above!`;
      }

      const aiReplyMsg: AIChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now'
      };

      setAiChatMessages(prev => [...prev, aiReplyMsg]);
      playSfx('beep');
    }, 600);
  };

  const dismissAIInsight = (insightId: string) => {
    setAiInsights(prev => prev.filter(i => i.id !== insightId));
    playSfx('beep');
  };

  // 8. Live WebSocket Simulator
  const simulateLivePulse = useCallback((forcedType?: string) => {
    const actions = ['CHECK_IN', 'SCORE_UPDATE', 'SUBMISSION', 'ANNOUNCEMENT', 'HEAT_PULSE'];
    const chosenType = forcedType || actions[Math.floor(Math.random() * actions.length)];

    if (chosenType === 'CHECK_IN') {
      const names = ['Ethan Vance', 'Maya Lin', 'Rohan Gupta', 'Elena Rostova', 'Lucas Mendes'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      setAnalytics(prev => ({
        ...prev,
        totalCheckedIn: Math.min(prev.totalRegistered, prev.totalCheckedIn + 1),
        activeInVenue: prev.activeInVenue + 1
      }));
      setLiveEvents(prev => [
        {
          id: `evt_${Date.now()}`,
          type: 'CHECK_IN',
          title: `${randomName} checked in at Main Gates`,
          description: `Fast-track pass scanned • Assigned Pod #${Math.floor(Math.random() * 20) + 1}`,
          timestamp: 'Just now',
          badgeColor: '#06B6D4'
        },
        ...prev.slice(0, 19)
      ]);
    } else if (chosenType === 'SCORE_UPDATE') {
      const randomSubIndex = Math.floor(Math.random() * submissions.length);
      const sub = submissions[randomSubIndex];
      const delta = (Math.random() * 1.5 - 0.5);
      const newScore = Math.min(99.5, Math.max(85, sub.totalScore + delta));
      
      setSubmissions(prev => {
        const updated = prev.map((s, i) => i === randomSubIndex ? { ...s, totalScore: Number(newScore.toFixed(1)) } : s);
        return [...updated].sort((a, b) => b.totalScore - a.totalScore).map((s, idx) => ({ ...s, rank: idx + 1 }));
      });

      setLiveEvents(prev => [
        {
          id: `evt_${Date.now()}`,
          type: 'SCORE_UPDATE',
          title: `Smart Score Update: ${sub.teamName}`,
          description: `Aggregate updated to ${newScore.toFixed(1)}/100 (Judge Evaluation verified)`,
          timestamp: 'Just now',
          badgeColor: '#10B981'
        },
        ...prev.slice(0, 19)
      ]);
    } else if (chosenType === 'HEAT_PULSE') {
      setVenueZones(prev => prev.map(z => {
        const jitter = (Math.random() * 4 - 2);
        const newOcc = Math.max(10, Math.min(z.capacity, Math.round(z.occupancy + jitter)));
        return {
          ...z,
          occupancy: newOcc,
          heatLevel: Number((newOcc / z.capacity).toFixed(2))
        };
      }));
    }
  }, [submissions]);

  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      simulateLivePulse();
    }, 12000);

    return () => clearInterval(interval);
  }, [isLiveSimulating, simulateLivePulse]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        timeRemainingSeconds: Math.max(0, prev.timeRemainingSeconds - 1)
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <EventContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeRole,
        setActiveRole,
        currentEventType,
        setCurrentEventType,
        participantUser,
        organizerUser,
        judgeUser,
        mentorUser,
        updateParticipantProfile,
        teams,
        candidates,
        submissions,
        announcements,
        venueZones,
        analytics,
        liveEvents,
        supportTickets,
        aiInsights,
        aiChatMessages,
        isLiveSimulating,
        setIsLiveSimulating,
        isAudioEnabled,
        setIsAudioEnabled,
        playSfx,
        triggerConfetti,
        checkInTicket,
        createAnnouncementFromPrompt,
        submitRubricEvaluation,
        submitProject,
        inviteCandidateToTeam,
        autoAssembleDreamTeam,
        simulateLivePulse,
        createSupportTicket,
        claimSupportTicket,
        resolveSupportTicket,
        sendAIChatMessage,
        dismissAIInsight
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
