export type UserRole = 'organizer' | 'participant' | 'judge' | 'mentor';

export type ViewMode = 'landing' | 'organizer' | 'participant' | 'judge' | 'mentor' | 'leaderboard' | 'docs';

export type EventType = 
  | 'hackathon' 
  | 'tech_fest' 
  | 'conference' 
  | 'startup_pitch' 
  | 'esports' 
  | 'college_fest' 
  | 'workshop_seminar';

export interface GamificationBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  bio: string;
  github: string;
  linkedin: string;
  discord: string;
  skills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'lead';
  preferredRole: 'Frontend Dev' | 'Backend Dev' | 'AI / ML Engineer' | 'UI/UX Designer' | 'Product Lead' | 'Full Stack' | 'Volunteer Lead';
  xpPoints: number;
  level: number;
  badges: GamificationBadge[];
  ticketCode: string;
  qrHash: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  tableAssigned?: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  avatar: string;
  roleInTeam: string;
  skills: string[];
  experienceLevel: string;
}

export interface Team {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
  leaderId: string;
  members: TeamMember[];
  track: string;
  tableNumber: string;
  lookingForRoles: string[];
  compatibilityScore?: number;
  missingSkills?: string[];
  submissionStatus: 'not_started' | 'draft' | 'submitted' | 'under_review' | 'evaluated';
  githubRepo?: string;
  demoUrl?: string;
  score?: number;
  rank?: number;
  rankDelta?: number;
}

export interface MatchmakingCandidate {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'lead';
  preferredRole: string;
  targetTrack: string;
  compatibilityScore: number;
  synergyReason: string;
  missingSkillsComplement: string[];
}

export interface RubricScores {
  technicalComplexity: number; // 0-25
  innovation: number;          // 0-25
  designAndUX: number;         // 0-25
  businessImpact: number;      // 0-25
}

export interface Submission {
  id: string;
  teamId: string;
  teamName: string;
  teamAvatar: string;
  projectTitle: string;
  tagline: string;
  description: string;
  techStack: string[];
  track: string;
  githubUrl: string;
  demoUrl: string;
  videoUrl?: string;
  submittedAt: string;
  rubricScores: RubricScores;
  totalScore: number;
  judgeFeedbackPublic?: string;
  judgeFeedbackPrivate?: string;
  evaluatedByJudgeId?: string;
  biasAnomalyDetected?: boolean;
  biasAnomalyReason?: string;
  status: 'submitted' | 'under_review' | 'evaluated';
  rank?: number;
  rankDelta?: number;
}

export interface Judge {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  assignedTracks: string[];
  assignedSubmissionIds: string[];
  evaluatedCount: number;
  pendingCount: number;
  averageScoreGiven: number;
  biasIndex: 'Optimal' | 'Mild Skew' | 'High Outlier';
}

export interface AnnouncementChannelVariants {
  push: { title: string; body: string };
  sms: string;
  email: { subject: string; htmlSnippet: string };
  slackDiscord: string;
}

export interface Announcement {
  id: string;
  title: string;
  rawPrompt: string;
  priority: 'normal' | 'high' | 'urgent' | 'emergency';
  targetAudience: 'all' | 'participants' | 'judges' | 'mentors';
  channels: ('push' | 'sms' | 'email' | 'discord')[];
  variants: AnnouncementChannelVariants;
  deliveredCount: number;
  readCount: number;
  timestamp: string;
}

export interface VenueZone {
  id: string;
  name: string;
  code: string;
  capacity: number;
  occupancy: number;
  heatLevel: number; // 0.0 - 1.0
  status: 'normal' | 'busy' | 'crowded' | 'restricted';
  color: string;
}

export interface CrowdAnalytics {
  totalRegistered: number;
  totalCheckedIn: number;
  activeInVenue: number;
  attendanceRate: number;
  peakHour: string;
  checkInVelocityPerHour: number;
  engagementScore: number;
  timeRemainingSeconds: number;
  hourlyTrends: { hour: string; checkIns: number; submissions: number; activeHeat: number }[];
  trackDistribution: { name: string; count: number; color: string }[];
}

export interface LiveEventItem {
  id: string;
  type: 'CHECK_IN' | 'SUBMISSION' | 'SCORE_UPDATE' | 'ANNOUNCEMENT' | 'TEAM_MATCH' | 'BADGE_UNLOCKED' | 'SUPPORT_TICKET';
  title: string;
  description: string;
  timestamp: string;
  badgeColor?: string;
}

export interface HackathonMilestone {
  id: string;
  title: string;
  time: string;
  isCompleted: boolean;
  isCurrent: boolean;
  description: string;
}

export interface SupportTicket {
  id: string;
  authorName: string;
  authorRole: string;
  tableNumber: string;
  category: 'Technical / API' | 'Hardware' | 'Logistics / Pass' | 'Mentorship' | 'General';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  assignedTo?: string;
  createdAt: string;
}

export interface AIInsightAlert {
  id: string;
  type: 'bottleneck' | 'attendance' | 'engagement' | 'judging';
  title: string;
  description: string;
  recommendation: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
