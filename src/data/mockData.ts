import { 
  UserProfile, 
  Team, 
  MatchmakingCandidate, 
  Submission, 
  Judge, 
  Announcement, 
  VenueZone, 
  CrowdAnalytics, 
  LiveEventItem, 
  HackathonMilestone,
  SupportTicket,
  AIInsightAlert,
  AIChatMessage
} from '../types';

export const INITIAL_USER_PARTICIPANT: UserProfile = {
  id: 'usr_alex_rivera',
  name: 'Alex Rivera',
  email: 'alex.rivera@craft.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'participant',
  bio: 'Full-stack AI developer specializing in real-time WebSockets, PyTorch embeddings & high-throughput systems.',
  github: 'alexrivera-ai',
  linkedin: 'alexrivera-dev',
  discord: 'alexrivera#4412',
  skills: ['TypeScript', 'PyTorch', 'React 19', 'Next.js', 'PostgreSQL', 'FastAPI'],
  experienceLevel: 'advanced',
  preferredRole: 'AI / ML Engineer',
  xpPoints: 2850,
  level: 6,
  ticketCode: 'EVOS-2026-X892',
  qrHash: 'evos_auth_sig_9901_38f8a7e0a9d821',
  isCheckedIn: true,
  checkedInAt: '10:14 AM',
  tableAssigned: 'Pod #14 - AI Arena',
  badges: [
    { id: 'b1', name: 'Early Bird Check-In', description: 'Arrived within the first 30 minutes of doors opening', icon: '⚡', tier: 'gold', unlockedAt: '10:15 AM' },
    { id: 'b2', name: 'AI Dream Weaver', description: 'Ran AI Matchmaker and built a multi-discipline team', icon: '🧠', tier: 'diamond', unlockedAt: '11:02 AM' },
    { id: 'b3', name: 'Midnight Committer', description: 'Pushed code during the 2:00 AM velocity surge', icon: '🔥', tier: 'silver', unlockedAt: '2:15 AM' },
    { id: 'b4', name: 'First Submission', description: 'Successfully published a project to the Smart Judging engine', icon: '🏆', tier: 'gold' },
  ]
};

export const INITIAL_USER_ORGANIZER: UserProfile = {
  id: 'usr_elena_vance',
  name: 'Elena Vance',
  email: 'elena@eventos.ai',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  role: 'organizer',
  bio: 'Lead Event Architect & Director of HackMatrix Global. Scaling hackathons to 2,000+ engineers.',
  github: 'elenavance',
  linkedin: 'elena-vance-events',
  discord: 'elena_lead#0001',
  skills: ['Event Operations', 'AI Systems', 'System Architecture', 'Live Stream Ops'],
  experienceLevel: 'lead',
  preferredRole: 'Product Lead',
  xpPoints: 9500,
  level: 15,
  ticketCode: 'EVOS-ORG-0001',
  qrHash: 'evos_org_master_88201',
  isCheckedIn: true,
  checkedInAt: '07:30 AM',
  tableAssigned: 'Mission Control Alpha',
  badges: []
};

export const INITIAL_USER_JUDGE: Judge = {
  id: 'jdg_marcus_sterling',
  name: 'Dr. Marcus Sterling',
  title: 'Principal AI Researcher & Tech Partner',
  company: 'Vertex Frontier Ventures',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  assignedTracks: ['AI & Autonomous Agents', 'Next-Gen Infrastructure', 'Developer Tooling'],
  assignedSubmissionIds: ['sub_1', 'sub_2', 'sub_3', 'sub_4'],
  evaluatedCount: 3,
  pendingCount: 1,
  averageScoreGiven: 91.8,
  biasIndex: 'Optimal'
};

export const INITIAL_USER_MENTOR: UserProfile = {
  id: 'usr_david_chen',
  name: 'David Chen',
  email: 'david.mentor@eventos.ai',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  role: 'mentor',
  bio: 'Senior Cloud & ML Architect at GCP. Helping teams debug distributed systems, CUDA pipelines & deployment configs.',
  github: 'davidchen-cloud',
  linkedin: 'davidchen-dev',
  discord: 'david_mentor#9012',
  skills: ['Kubernetes', 'PyTorch', 'Distributed Systems', 'FastAPI', 'Rust'],
  experienceLevel: 'lead',
  preferredRole: 'Volunteer Lead',
  xpPoints: 4200,
  level: 8,
  ticketCode: 'EVOS-MNT-7701',
  qrHash: 'evos_mentor_sig_882',
  isCheckedIn: true,
  checkedInAt: '08:15 AM',
  tableAssigned: 'Mentorship Pod 01',
  badges: []
};

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'tm_1',
    name: 'OmniNexus AI',
    tagline: 'Autonomous multi-modal event co-pilot with sub-second voice synthesis',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    leaderId: 'usr_alex_rivera',
    track: 'AI & Autonomous Agents',
    tableNumber: 'Table 14',
    lookingForRoles: [],
    compatibilityScore: 98,
    submissionStatus: 'evaluated',
    score: 97.4,
    rank: 1,
    rankDelta: 0,
    githubRepo: 'https://github.com/omninexus/copilot',
    demoUrl: 'https://omninexus-ai.live',
    members: [
      { userId: 'usr_alex_rivera', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', roleInTeam: 'Team Lead / AI Architect', skills: ['PyTorch', 'Next.js 15', 'TypeScript'], experienceLevel: 'advanced' },
      { userId: 'usr_sarah_c', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', roleInTeam: 'Full Stack & WebSockets', skills: ['React', 'Node.js', 'Redis'], experienceLevel: 'advanced' },
      { userId: 'usr_kai_t', name: 'Kai Tanaka', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', roleInTeam: 'UI/UX & Motion Designer', skills: ['Figma', 'Tailwind', 'Three.js'], experienceLevel: 'intermediate' },
    ]
  },
  {
    id: 'tm_2',
    name: 'ZeroLag ZK',
    tagline: 'Zero-knowledge credential verification for offline hackathon admission & prize splits',
    avatar: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=80',
    leaderId: 'usr_vikram_m',
    track: 'Web3 & Security',
    tableNumber: 'Table 22',
    lookingForRoles: ['Frontend Engineer'],
    compatibilityScore: 94,
    submissionStatus: 'evaluated',
    score: 96.2,
    rank: 2,
    rankDelta: 1,
    githubRepo: 'https://github.com/zerolag-zk/protocol',
    demoUrl: 'https://zerolag.network',
    members: [
      { userId: 'usr_vikram_m', name: 'Vikram Mehta', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', roleInTeam: 'ZK Cryptographer', skills: ['Rust', 'Circom', 'Solidity'], experienceLevel: 'advanced' },
      { userId: 'usr_amira_h', name: 'Amira Hassan', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', roleInTeam: 'Smart Contracts Lead', skills: ['Foundry', 'TypeScript', 'Ethers'], experienceLevel: 'intermediate' },
    ]
  },
  {
    id: 'tm_3',
    name: 'PulseFlow Bio',
    tagline: 'Computer-vision posture and stress bio-feedback for high-intensity hackathons',
    avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=80',
    leaderId: 'usr_liam_k',
    track: 'HealthTech & Social Impact',
    tableNumber: 'Table 08',
    lookingForRoles: [],
    compatibilityScore: 91,
    submissionStatus: 'evaluated',
    score: 95.8,
    rank: 3,
    rankDelta: -1,
    githubRepo: 'https://github.com/pulseflow/bio-sync',
    demoUrl: 'https://pulseflow.health',
    members: [
      { userId: 'usr_liam_k', name: 'Liam Keller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', roleInTeam: 'CV Engineer', skills: ['OpenCV', 'TensorFlow Lite', 'Python'], experienceLevel: 'advanced' },
      { userId: 'usr_zoe_b', name: 'Zoe Becker', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', roleInTeam: 'Biomedical Scientist', skills: ['Data Analysis', 'Clinical UX'], experienceLevel: 'intermediate' },
    ]
  },
  {
    id: 'tm_4',
    name: 'AetherDB',
    tagline: 'Distributed peer-to-peer cache designed for offline-first hackathons & edge computing',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    leaderId: 'usr_devon_p',
    track: 'Next-Gen Infrastructure',
    tableNumber: 'Table 31',
    lookingForRoles: ['DevOps'],
    compatibilityScore: 89,
    submissionStatus: 'under_review',
    score: 93.4,
    rank: 4,
    rankDelta: 2,
    githubRepo: 'https://github.com/aetherdb/core',
    demoUrl: 'https://aetherdb.io',
    members: [
      { userId: 'usr_devon_p', name: 'Devon Park', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', roleInTeam: 'Distributed Systems Dev', skills: ['Go', 'gRPC', 'Raft'], experienceLevel: 'advanced' },
    ]
  },
  {
    id: 'tm_5',
    name: 'NeuroSynthetix',
    tagline: 'Synthesizing voice & visual avatars for non-verbal children with ALS using edge Neural Nets',
    avatar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80',
    leaderId: 'usr_chloe_w',
    track: 'AI & Autonomous Agents',
    tableNumber: 'Table 05',
    lookingForRoles: [],
    compatibilityScore: 96,
    submissionStatus: 'submitted',
    score: 92.5,
    rank: 5,
    rankDelta: -1,
    githubRepo: 'https://github.com/neurosynthetix/avatar',
    demoUrl: 'https://neurosynthetix.app',
    members: [
      { userId: 'usr_chloe_w', name: 'Chloe Wang', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', roleInTeam: 'AI Researcher', skills: ['PyTorch', 'Diffusion', 'Audio ML'], experienceLevel: 'advanced' },
    ]
  }
];

export const INITIAL_CANDIDATES: MatchmakingCandidate[] = [
  {
    id: 'cand_1',
    name: 'Siddharth Rao',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    skills: ['Rust', 'WebAssembly', 'Solidity', 'Zero Knowledge'],
    experienceLevel: 'advanced',
    preferredRole: 'Backend Dev',
    targetTrack: 'Web3 & Security',
    compatibilityScore: 97,
    synergyReason: 'Complements your AI skillset with high-performance Rust/Wasm backend execution.',
    missingSkillsComplement: ['Rust Memory Safety', 'Cryptography']
  },
  {
    id: 'cand_2',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skills: ['UI/UX Design', 'Framer Motion', 'Tailwind', 'Design Systems', '3D Spline'],
    experienceLevel: 'advanced',
    preferredRole: 'UI/UX Designer',
    targetTrack: 'AI & Autonomous Agents',
    compatibilityScore: 95,
    synergyReason: 'Transforms complex AI outputs into high-gloss, award-winning user interfaces.',
    missingSkillsComplement: ['Product UX', 'Interactive 3D']
  },
  {
    id: 'cand_3',
    name: 'Lucas Dupont',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    skills: ['Kubernetes', 'Docker', 'Go', 'Terraform', 'Prometheus'],
    experienceLevel: 'lead',
    preferredRole: 'Backend Dev',
    targetTrack: 'Next-Gen Infrastructure',
    compatibilityScore: 92,
    synergyReason: 'Ensures zero downtime and automated cluster scaling for production live demos.',
    missingSkillsComplement: ['DevOps & Cloud Orchestration']
  },
  {
    id: 'cand_4',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    skills: ['Product Strategy', 'FinTech APIs', 'Stripe', 'Pitch Presentation'],
    experienceLevel: 'intermediate',
    preferredRole: 'Product Lead',
    targetTrack: 'HealthTech & Social Impact',
    compatibilityScore: 89,
    synergyReason: 'Strong business viability model & pitch delivery tailored for judge Q&A.',
    missingSkillsComplement: ['Market Strategy', 'Financial Modeling']
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_1',
    teamId: 'tm_1',
    teamName: 'OmniNexus AI',
    teamAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    projectTitle: 'OmniNexus AI: Autonomous Multi-Modal Hackathon Co-Pilot',
    tagline: 'Real-time agentic orchestrator that writes, tests, and deploys full micro-apps live.',
    description: 'OmniNexus leverages an ensemble of specialized subagents running over low-latency WebSockets. Features sub-100ms neural audio feedback, dynamic code synthesis, and automated cloud deployments.',
    techStack: ['PyTorch', 'Next.js 15', 'TypeScript', 'WebSockets', 'Tailwind', 'Supabase'],
    track: 'AI & Autonomous Agents',
    githubUrl: 'https://github.com/omninexus/copilot',
    demoUrl: 'https://omninexus-ai.live',
    videoUrl: 'https://youtube.com/watch?v=demo-omninexus',
    submittedAt: '10:45 AM',
    rubricScores: { technicalComplexity: 25, innovation: 25, designAndUX: 24, businessImpact: 23.4 },
    totalScore: 97.4,
    judgeFeedbackPublic: 'Monumental technical execution. The subagent orchestration feels 2 years ahead of existing tooling.',
    judgeFeedbackPrivate: 'Flawless demo. Architecture is clean and reproducible.',
    evaluatedByJudgeId: 'jdg_marcus_sterling',
    biasAnomalyDetected: false,
    status: 'evaluated',
    rank: 1,
    rankDelta: 0
  },
  {
    id: 'sub_2',
    teamId: 'tm_2',
    teamName: 'ZeroLag ZK',
    teamAvatar: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=80',
    projectTitle: 'ZeroLag ZK: Cryptographic Offline Verification Protocol',
    tagline: 'Instant zero-knowledge identity check-ins and escrowed prize splits with zero internet requirement.',
    description: 'Generates client-side SNARKs on mobile devices to prove event registration validity and escrow payouts without exposing personal data.',
    techStack: ['Rust', 'Circom', 'Wasm', 'Solidity', 'TailwindCSS'],
    track: 'Web3 & Security',
    githubUrl: 'https://github.com/zerolag-zk/protocol',
    demoUrl: 'https://zerolag.network',
    submittedAt: '10:12 AM',
    rubricScores: { technicalComplexity: 25, innovation: 24, designAndUX: 23, businessImpact: 24.2 },
    totalScore: 96.2,
    judgeFeedbackPublic: 'Incredible real-world utility for massive venues and privacy-centric conferences.',
    evaluatedByJudgeId: 'jdg_marcus_sterling',
    biasAnomalyDetected: false,
    status: 'evaluated',
    rank: 2,
    rankDelta: 1
  },
  {
    id: 'sub_3',
    teamId: 'tm_3',
    teamName: 'PulseFlow Bio',
    teamAvatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=80',
    projectTitle: 'PulseFlow: Real-Time Bio-Feedback & Fatigue Alerting',
    tagline: 'Browser-based computer vision assessing hacker burnout & posture during 36-hour hackathons.',
    description: 'Runs lightweight edge models in WebAssembly to monitor eye strain, posture degradation, and autonomic fatigue, offering adaptive break recommendations.',
    techStack: ['TensorFlow Lite', 'WebAssembly', 'OpenCV', 'React', 'Canvas API'],
    track: 'HealthTech & Social Impact',
    githubUrl: 'https://github.com/pulseflow/bio-sync',
    demoUrl: 'https://pulseflow.health',
    submittedAt: '09:50 AM',
    rubricScores: { technicalComplexity: 24, innovation: 24, designAndUX: 24, businessImpact: 23.8 },
    totalScore: 95.8,
    judgeFeedbackPublic: 'Very polished UI and high social importance for tech ergonomics.',
    evaluatedByJudgeId: 'jdg_marcus_sterling',
    biasAnomalyDetected: false,
    status: 'evaluated',
    rank: 3,
    rankDelta: -1
  },
  {
    id: 'sub_4',
    teamId: 'tm_4',
    teamName: 'AetherDB',
    teamAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    projectTitle: 'AetherDB: Offline-First Peer P2P Hackathon Mesh',
    tagline: 'High-throughput CRDT datastore synchronizing across local WiFi without external WAN connectivity.',
    description: 'Enables hackathon teams to continue real-time collaborative coding, database queries, and testing even during total venue network blackouts.',
    techStack: ['Go', 'Raft Consensus', 'CRDTs', 'gRPC', 'WebRTC'],
    track: 'Next-Gen Infrastructure',
    githubUrl: 'https://github.com/aetherdb/core',
    demoUrl: 'https://aetherdb.io',
    submittedAt: '10:30 AM',
    rubricScores: { technicalComplexity: 24, innovation: 23, designAndUX: 22, businessImpact: 24.4 },
    totalScore: 93.4,
    judgeFeedbackPublic: 'Crucial infrastructure for every organizer who has experienced WiFi collapses.',
    evaluatedByJudgeId: 'jdg_marcus_sterling',
    biasAnomalyDetected: false,
    status: 'under_review',
    rank: 4,
    rankDelta: 2
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: '🚨 Code Freeze in 60 Minutes!',
    rawPrompt: 'Code freeze in 1 hour. Upload demo video and repo links before 11:00 AM sharp.',
    priority: 'urgent',
    targetAudience: 'participants',
    channels: ['push', 'sms', 'email', 'discord'],
    variants: {
      push: {
        title: '⚡ 60-Min Code Freeze Alert!',
        body: 'Final stretch! Submit your GitHub repo & video demo before 11:00 AM hard deadline.'
      },
      sms: 'EVENTOS ALERT: 60 mins until Code Freeze! Verify your repository is public & submit at os.ai/sub',
      email: {
        subject: '🚨 Final Countdown: Submissions Close in 60 Minutes',
        htmlSnippet: '<p>The hacking clock is ticking down! Please ensure all team members approve the final submission link.</p>'
      },
      slackDiscord: '@everyone 🚨 **URGENT SUBMISSION REMINDER**\nOnly **60 minutes remaining** until code freeze! Submit now at `#submissions`.'
    },
    deliveredCount: 482,
    readCount: 461,
    timestamp: '10:00 AM'
  },
  {
    id: 'ann_2',
    title: '🍕 Midnight Fuel & Hot Boba in Cafeteria',
    rawPrompt: 'Midnight pizza and boba bar is now open in the food court.',
    priority: 'normal',
    targetAudience: 'all',
    channels: ['push', 'discord'],
    variants: {
      push: {
        title: '🍕 Midnight Snacks are Here!',
        body: 'Hot artisan pizza, vegan ramen, and iced boba available now in Hall C.'
      },
      sms: 'Midnight snacks ready in Hall C! Grab fresh pizza and recharge.',
      email: {
        subject: 'Midnight Fuel Available in Hall C',
        htmlSnippet: '<p>Recharge with midnight snacks, boba, and Red Bull in Cafeteria Lounge.</p>'
      },
      slackDiscord: ':pizza: **Midnight Fuel Bar is LIVE in Hall C!** Come grab fresh pizza and energy drinks.'
    },
    deliveredCount: 482,
    readCount: 418,
    timestamp: '12:00 AM'
  }
];

export const INITIAL_VENUE_ZONES: VenueZone[] = [
  { id: 'z1', name: 'Main Stage Arena', code: 'HALL-A', capacity: 250, occupancy: 215, heatLevel: 0.86, status: 'busy', color: '#6366F1' },
  { id: 'z2', name: 'AI Hacking Hub Alpha', code: 'HUB-01', capacity: 180, occupancy: 162, heatLevel: 0.90, status: 'crowded', color: '#06B6D4' },
  { id: 'z3', name: 'Hardware & Web3 Lab', code: 'HUB-02', capacity: 120, occupancy: 88, heatLevel: 0.73, status: 'normal', color: '#10B981' },
  { id: 'z4', name: 'Mentorship & Workshop Pod', code: 'POD-M', capacity: 60, occupancy: 42, heatLevel: 0.70, status: 'normal', color: '#F59E0B' },
  { id: 'z5', name: 'Cafeteria & Chill Lounge', code: 'LOUNGE', capacity: 150, occupancy: 95, heatLevel: 0.63, status: 'normal', color: '#8B5CF6' },
  { id: 'z6', name: 'Judge Chambers & VIP', code: 'EXEC', capacity: 30, occupancy: 18, heatLevel: 0.60, status: 'restricted', color: '#F43F5E' },
];

export const INITIAL_ANALYTICS: CrowdAnalytics = {
  totalRegistered: 512,
  totalCheckedIn: 484,
  activeInVenue: 462,
  attendanceRate: 94.5,
  peakHour: '02:00 PM',
  checkInVelocityPerHour: 142,
  engagementScore: 98.4,
  timeRemainingSeconds: 3600 * 2 + 14 * 60 + 22,
  hourlyTrends: [
    { hour: '08:00', checkIns: 85, submissions: 0, activeHeat: 45 },
    { hour: '10:00', checkIns: 190, submissions: 1, activeHeat: 70 },
    { hour: '12:00', checkIns: 120, submissions: 2, activeHeat: 85 },
    { hour: '14:00', checkIns: 60, submissions: 4, activeHeat: 95 },
    { hour: '16:00', checkIns: 20, submissions: 8, activeHeat: 98 },
    { hour: '18:00', checkIns: 9, submissions: 14, activeHeat: 92 },
    { hour: '20:00', checkIns: 0, submissions: 28, activeHeat: 96 },
    { hour: '22:00', checkIns: 0, submissions: 45, activeHeat: 94 },
  ],
  trackDistribution: [
    { name: 'AI & Agents', count: 32, color: '#6366F1' },
    { name: 'Web3 & ZK', count: 18, color: '#06B6D4' },
    { name: 'HealthTech', count: 14, color: '#10B981' },
    { name: 'Infra & Tools', count: 12, color: '#F59E0B' },
  ]
};

export const INITIAL_LIVE_EVENTS: LiveEventItem[] = [
  { id: 'evt_1', type: 'SCORE_UPDATE', title: 'Judge Marcus Sterling evaluated OmniNexus AI', description: 'Total Score: 97.4 / 100 — New #1 on Leaderboard!', timestamp: 'Just now', badgeColor: '#6366F1' },
  { id: 'evt_2', type: 'CHECK_IN', title: 'Kavita Patel verified ticket at Main Arena', description: 'Table 19 assigned (Team ZeroLag)', timestamp: '2m ago', badgeColor: '#06B6D4' },
  { id: 'evt_3', type: 'TEAM_MATCH', title: 'AI Matchmaker formed "NeuroSynthetix"', description: 'Synergy Score: 96% — 3 Solo Hackers Matched', timestamp: '5m ago', badgeColor: '#10B981' },
  { id: 'evt_4', type: 'SUBMISSION', title: 'AetherDB submitted to Next-Gen Infra track', description: 'GitHub repo & demo video verified with AI Complexity: 9.4/10', timestamp: '8m ago', badgeColor: '#F59E0B' },
  { id: 'evt_5', type: 'SUPPORT_TICKET', title: 'Mentor David Chen assigned to Pod #14', description: 'FastAPI WebSockets rate-limit resolution', timestamp: '10m ago', badgeColor: '#8B5CF6' },
];

export const INITIAL_MILESTONES: HackathonMilestone[] = [
  { id: 'm1', title: 'Doors Open & Check-In', time: '08:00 AM', isCompleted: true, isCurrent: false, description: 'Badge pickup, breakfast, and hardware distribution' },
  { id: 'm2', title: 'Opening Keynote & Track Reveal', time: '09:30 AM', isCompleted: true, isCurrent: false, description: 'Rules, sponsor API bounties, and criteria' },
  { id: 'm3', title: 'AI Team Matchmaking Sprint', time: '10:00 AM', isCompleted: true, isCurrent: false, description: 'Find teammates and lock team rosters' },
  { id: 'm4', title: 'Hacking Sprint Active', time: '11:00 AM - 10:00 AM', isCompleted: true, isCurrent: false, description: 'Mentor office hours, tech workshops, code commits' },
  { id: 'm5', title: 'Submission Deadline (Code Freeze)', time: '11:00 AM', isCompleted: false, isCurrent: true, description: 'GitHub repo submission & video demo freeze' },
  { id: 'm6', title: 'Smart Judging & Live Finals', time: '01:00 PM', isCompleted: false, isCurrent: false, description: 'Top 5 demo on Main Stage with live scoring' },
  { id: 'm7', title: 'Grand Awards & Closing Ceremony', time: '04:00 PM', isCompleted: false, isCurrent: false, description: '$50,000 in prizes and VC incubator awards' },
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_1',
    authorName: 'Alex Rivera (OmniNexus AI)',
    authorRole: 'Participant',
    tableNumber: 'Table 14 - AI Arena',
    category: 'Technical / API',
    description: 'Need assistance verifying WebSocket handshake latency under mock load testing.',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'David Chen (GCP Mentor)',
    createdAt: '10:20 AM'
  },
  {
    id: 'tkt_2',
    authorName: 'Vikram Mehta (ZeroLag ZK)',
    authorRole: 'Participant',
    tableNumber: 'Table 22 - Web3 Lab',
    category: 'Hardware',
    description: 'Need an extra high-wattage power strip & USB-C to Ethernet adapter for hardware wallet test.',
    priority: 'medium',
    status: 'open',
    createdAt: '10:40 AM'
  },
  {
    id: 'tkt_3',
    authorName: 'Samantha Miller (Solo Hacker)',
    authorRole: 'Participant',
    tableNumber: 'Lounge Seat #4B',
    category: 'Mentorship',
    description: 'Looking for a PyTorch mentor to review attention head visualization before pitch deck export.',
    priority: 'medium',
    status: 'open',
    createdAt: '10:55 AM'
  }
];

export const INITIAL_AI_INSIGHTS: AIInsightAlert[] = [
  {
    id: 'ins_1',
    type: 'judging',
    title: 'Judge Evaluation Pacing Alert',
    description: 'Track "Next-Gen Infrastructure" has 6 submissions pending review with only 45 minutes until finals lock.',
    recommendation: 'Auto-assign 2 additional judges (Dr. Sarah Lin & Marcus Vance) to load-balance the queue.',
    severity: 'warning',
    timestamp: 'Just now'
  },
  {
    id: 'ins_2',
    type: 'attendance',
    title: 'Zone Density Influx: AI Hacking Hub Alpha',
    description: 'AI Hub Alpha is currently at 90% capacity (162/180 devs).',
    recommendation: 'Dispatch an automated in-app prompt directing new teams to the open seats in Hub 02.',
    severity: 'info',
    timestamp: '5m ago'
  },
  {
    id: 'ins_3',
    type: 'engagement',
    title: 'High Team Formation Velocity',
    description: 'AI Team Matchmaker has resolved 98.4% of solo participants into balanced squads with 0 stragglers.',
    recommendation: 'Trigger milestone announcement: "Team Roster Lock Finalized".',
    severity: 'info',
    timestamp: '15m ago'
  }
];

export const INITIAL_AI_CHAT_MESSAGES: AIChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'assistant',
    text: 'Hello! I am your EventOS AI Co-Pilot. I can answer questions about the event schedule, WiFi passwords, mentor office hours, judging rubrics, or API credits. How can I assist your team?',
    timestamp: '10:00 AM',
    suggestedActions: [
      'What is the WiFi network & password?',
      'When is the submission deadline?',
      'How does Smart Rubric scoring work?',
      'Where is the hardware lab located?'
    ]
  }
];
