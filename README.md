# EventOS AI — Next-Generation Smart Event Operating System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://eventos-ai.vercel.app)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](https://github.com/yourusername/eventos-ai/actions)
[![Tests](https://img.shields.io/badge/Tests-46%20Passing-06B6D4?style=for-the-badge&logo=vitest)](https://vitest.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)

> **Unified platform for hackathons, tech fests, conferences, and esports tournaments.** Consolidates registration, check-in, team formation, announcements, judging, and live leaderboards into a single real-time dashboard.

---

## 🎯 Problem Statement

Organizing large-scale events like hackathons, tech fests, and conferences currently requires juggling multiple disjointed platforms for:
- Registration & attendee verification
- Team formation & matchmaking
- Announcements & broadcast communication
- Judging & evaluation
- Live leaderboards & analytics

This fragmented workflow creates administrative overhead, delays, and poor experience for both organizers and participants.

---

## ✨ Solution: EventOS AI

A **unified, real-time Smart Event Management Platform** that consolidates the end-to-end event lifecycle into a single interactive dashboard with four purpose-built workspaces:

| Workspace | Role | Key Features |
|-----------|------|--------------|
| 🎮 **Mission Control** | Organizer | Digital Twin 2.0 venue heatmaps, AI Multi-channel Broadcast Studio, Fast-track QR Scanner, Team Formation Radar, AI Insights & Bottleneck Alerts |
| 💻 **Hacker Hub** | Participant | Holographic Apple-Wallet QR Pass, AI Team Matchmaker (Vector Synergy v3), Project Submission Portal, Live Schedule, AI Event Co-Pilot Chat, Gamification & Badges |
| ⚖️ **Judge Studio** | Judge | 4-Pillar Rubric Scoring Matrix, AI Bias Detection (±2σ), Project Queue, Public/Private Feedback, Real-time Leaderboard Sync |
| ❤️ **Mentor Desk** | Mentor/Volunteer | Live Support Ticket Dispatcher, Table Assistance Routing, Zone Coordination |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/pnpm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/eventos-ai.git
cd eventos-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` — the app loads instantly with demo data.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run oxlint (fast ESLint alternative) |
| `npm run test` | Run Vitest unit/integration tests |
| `npm run test:ui` | Open Vitest UI |

---

## 🏗️ Architecture

### Tech Stack

```
Frontend:     React 19 + TypeScript + Vite 8
Styling:      Tailwind CSS 4 + Custom CSS Variables
Charts:       Recharts 3 (Area, Pie, Responsive)
Icons:        Lucide React
QR Codes:     qrcode.react
Animations:   canvas-confetti + CSS keyframes
Testing:      Vitest + React Testing Library + happy-dom
Linting:      oxlint (116 rules, 8 threads)
Deployment:   Vercel (static + edge functions ready)
```

### Project Structure

```
src/
├── components/
│   ├── common/           # Navbar, LiveTicker, SimControlModal, Icons
│   ├── organizer/        # Mission Control, QR Scanner, Broadcast Studio, Digital Twin
│   ├── participant/      # Hacker Hub, AI Matchmaker, Submission Portal
│   ├── judge/            # Judge Dashboard, Esports Leaderboard
│   ├── mentor/           # Mentor Help Desk
│   ├── landing/          # Marketing Landing Page
│   └── docs/             # Architecture & Schema Hub
├── context/
│   └── EventContext.tsx  # Global state + actions (668 lines)
├── types/
│   └── index.ts          # 226 lines of TypeScript interfaces
├── data/
│   └── mockData.ts       # 541 lines of realistic demo data
├── test/
│   └── setup.ts          # Vitest mocks & globals
└── App.tsx               # Root component with routing
```

### State Management

Single **EventContext** (React Context + useReducer pattern) manages:
- 4 user profiles (organizer, participant, judge, mentor)
- Teams, candidates, submissions, announcements
- Venue zones, crowd analytics, live events
- Support tickets, AI insights, chat messages
- Simulation controls, audio, view/role switching

All actions are **optimistic updates** with live event feed broadcasting changes.

---

## 🎨 Key Features Deep Dive

### 1. Registration & Check-in
- **QR Code Generation** — Cryptographic ticket codes rendered to canvas (Participant Dashboard)
- **Fast-Track Scanner** — Camera viewfinder with animated scanline, manual entry, batch simulation (5/15 check-ins)
- **Zone Routing** — Assigns attendees to venue zones, updates heatmaps in real-time
- **Analytics** — Check-in velocity, attendance rate, peak hour prediction

### 2. Smart Team Formation
- **Vector Compatibility Scoring** — Computes skill complementarities, experience parity, role gaps
- **Synergy Analysis** — Natural language explanations for each match
- **Missing Skill Detection** — Identifies gaps (e.g., "Fills team gap: Rust Memory Safety, Cryptography")
- **1-Click Auto-Assemble** — Instantly forms optimal teams from solo participants

### 3. AI Broadcast Studio
- **Single Prompt → 4 Channels** — Push, SMS (160 chars), HTML Email, Discord/Slack Markdown
- **Priority Levels** — Normal, High, Urgent, Emergency (visual + audio alerts)
- **Live Previews** — Mobile push mockup, SMS char count, HTML email render, Discord embed
- **Delivery Tracking** — Sent/read counts, timestamp, history log

### 4. Interactive Judging Portal
- **4-Pillar Rubric** — Technical (25), Innovation (25), Design/UX (25), Business Impact (25)
- **AI Bias Detection** — Flags scores ≥99 (leniency) or <65 (harshness) as ±2σ outliers
- **Preset Buttons** — Strong (90), Flawless (100), Harsh (56)
- **Real-time Sync** — Submissions auto-sort, rank deltas animate, leaderboard updates instantly

### 5. Live Leaderboard & Analytics
- **3D Podium** — Gold/Silver/Bronze with animated rank deltas (↑↓)
- **Track Filters** — All, AI & Agents, Web3 & ZK, HealthTech, Infra & Mesh
- **Deep Inspection Modal** — Rubric breakdown, judge feedback, GitHub/demo links
- **Digital Twin 2.0** — Interactive venue blueprint with zone occupancy, heat levels, AI crowd recommendations
- **F1 Telemetry Charts** — Hourly check-in vs submission velocity, track distribution pie

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# With UI
npm run test:ui

# Coverage report
npm run test -- --coverage
```

**Test Coverage: 46 tests across 5 suites**
- EventContext (9) — State, actions, bias detection logic
- OrganizerDashboard (7) — Telemetry, navigation, team filtering
- ParticipantDashboard (14) — Profile, QR pass, badges, matchmaker, tickets
- JudgeDashboard (9) — Rubric, bias indicator, project queue
- EsportsLeaderboard (7) — Podium, standings, track filters

---

## 🚀 Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Feventos-ai)

### Manual Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: EventOS AI"
   git branch -M main
   git remote add origin https://github.com/yourusername/eventos-ai.git
   git push -u origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel auto-detects Vite + React
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - Click **Deploy**

3. **Custom Domain** (optional)
   - Add domain in Vercel project settings
   - Configure DNS (CNAME → `cname.vercel-dns.com`)

### Environment Variables (Production)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | For backend |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | For backend |
| `VITE_FIREBASE_CONFIG` | Firebase config (JSON) | For auth |
| `VITE_VERTEX_AI_ENDPOINT` | Vertex AI endpoint | For ML matchmaking |

> **Note**: Current demo runs entirely client-side with mock data. Backend integration requires adding the above variables.

---

## 📊 Database Schema (Supabase/PostgreSQL)

```sql
-- Core tables (see Architecture Hub in app for full DDL)
profiles           -- Users (auth synced, RLS enabled)
events             -- Event metadata, tracks, rubric criteria
teams              -- Team formation, join codes, compatibility matrix
submissions        -- Project submissions, GitHub/demo URLs, scores
evaluation_scores  -- Judge rubric scores, bias flags, feedback
announcements      -- Multi-channel broadcasts, delivery tracking
support_tickets    -- Mentor/help desk tickets, assignments
venue_zones        -- Digital twin zones, capacity, occupancy
```

**Security**: Row Level Security (RLS) policies on all tables. Judges can only insert evaluations for assigned submissions. Participants see only public data.

---

## 🔌 API Specification (Ready for Backend)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/events/:id/matchmaker/suggest` | POST | Vector compatibility suggestions |
| `/api/v1/events/:id/announcements/generate` | POST | Multi-channel announcement synthesis |
| `/api/v1/events/:id/judging/evaluate` | POST | Rubric scoring + bias detection |
| `wss://api/event:realtime/:eventId` | WSS | Sub-50ms live telemetry stream |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Run tests: `npm run test && npm run lint`
4. Commit: `git commit -m 'feat: add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Design Inspiration**: Linear, Vercel, GitHub, F1 Telemetry HUDs
- **Icons**: [Lucide](https://lucide.dev)
- **Charts**: [Recharts](https://recharts.org)
- **Fonts**: Outfit, Inter, JetBrains Mono via Google Fonts
- **Deployment**: [Vercel](https://vercel.com)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/eventos-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/eventos-ai/discussions)
- **Email**: hello@eventos.ai

---

**Built with ❤️ for the hackathon community** — *Deploy your next event on EventOS AI*