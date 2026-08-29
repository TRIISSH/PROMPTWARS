# EventOS AI - Complete API & Real-Time WebSocket Specification

## 1. Overview & Protocol Architecture
EventOS AI utilizes a hybrid architecture:
- **REST Endpoints** (`/api/v1/*`): Transactional CRUD, AI LLM generation, QR auth, multi-channel broadcast dispatches.
- **WebSockets / Supabase Realtime Channels**: Sub-50ms live synchronization for Leaderboard changes, attendance check-ins, venue digital twin occupancy, and announcement popups.

---

## 2. Authentication & Authorization
All authenticated requests require standard Bearer JWT:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```
Roles: `organizer` | `participant` | `judge` | `superadmin`

---

## 3. Core REST Endpoints

### 3.1 AI Matchmaking & Team Formation
#### `POST /api/v1/events/:eventId/matchmaker/suggest`
Calculates AI compatibility vector based on skills, roles, and experience.
- **Request Body**:
```json
{
  "userId": "usr_9981",
  "skills": ["Rust", "Solidity", "TailwindCSS"],
  "experience": "advanced",
  "preferredRole": "backend",
  "targetTrack": "Web3 & Zero Knowledge"
}
```
- **Response (200 OK)**:
```json
{
  "compatibilityScore": 96.8,
  "synergyBreakdown": {
    "skillOverlap": "Optimal (No redundancies)",
    "roleComplement": "100% (Pairs with AI Engineer & UI Specialist)",
    "experienceBalance": "High Seniority Alignment"
  },
  "recommendedTeams": [
    {
      "teamId": "tm_hyperion",
      "teamName": "ZeroLag Protocol",
      "currentMembers": 3,
      "missingSkills": ["Smart Contract Auditor", "Rust Core"],
      "compatibilityScore": 98.2,
      "synergyTag": "Dream Team Match"
    }
  ],
  "recommendedIndividuals": [
    {
      "userId": "usr_sarah_k",
      "name": "Sarah Chen",
      "role": "AI / ML Researcher",
      "skills": ["PyTorch", "Transformers", "CUDA"],
      "compatibilityScore": 94.5
    }
  ]
}
```

---

### 3.2 AI Multi-Channel Broadcast Studio
#### `POST /api/v1/events/:eventId/announcements/generate`
Generates channel-optimized announcements using fine-tuned prompt templates.
- **Request Body**:
```json
{
  "rawPrompt": "Submissions close in 1 hour. Upload your demo video and GitHub link to the portal now.",
  "urgency": "urgent",
  "targetAudience": "participants"
}
```
- **Response (200 OK)**:
```json
{
  "pushNotification": {
    "title": "⚡ 60-Minute Submission Alert!",
    "body": "Final stretch! Submit your GitHub repo & video demo before the 11:00 AM hard deadline."
  },
  "sms": "EVENTOS ALERT: 60 mins left to submit your project. Ensure GitHub repo is public & video is uploaded: os.ai/sub",
  "emailHtml": "<div style='background:#0f172a; color:#fff;'><h2>🚨 Final Call for Submissions</h2><p>The hacking clock is ticking down...</p></div>",
  "discordSlackMarkdown": "@everyone 🚨 **URGENT SUBMISSION REMINDER**\nOnly **60 minutes remaining** until code freeze! Double check your demo link."
}
```

---

### 3.3 Smart QR Scanner & Check-In Desk
#### `POST /api/v1/events/:eventId/check-in/scan`
Validates holographic digital QR pass with cryptographic signature.
- **Request Body**:
```json
{
  "qrHash": "evos_sig_9901_38f8a7e0a",
  "venueZone": "Main Stage Atrium",
  "scannedBy": "org_alex_rivera"
}
```
- **Response (200 OK)**:
```json
{
  "status": "success",
  "participant": {
    "name": "Alex Rivera",
    "email": "alex@build.dev",
    "track": "AI & Large Models",
    "teamName": "NeuralMesh",
    "ticketType": "VIP Hacker",
    "checkedInAt": "2026-08-29T10:14:22Z"
  },
  "badgeUnlocked": "Checked In - Pioneer 2026",
  "totalAttendanceNow": 482
}
```

---

### 3.4 Smart Rubric Scoring & AI Bias Detection
#### `POST /api/v1/events/:eventId/judging/evaluate`
Submits rubric scores with real-time bias anomaly checking.
- **Request Body**:
```json
{
  "submissionId": "sub_omni_nexus",
  "judgeId": "jdg_dr_vance",
  "rubrics": {
    "technicalComplexity": 24,
    "innovation": 25,
    "designAndUX": 23,
    "businessImpact": 24
  },
  "feedbackPublic": "Exceptional architecture with zero cold-start latency.",
  "feedbackPrivate": "Verify live API limits under heavy concurrent load."
}
```
- **Response (200 OK)**:
```json
{
  "totalScore": 96.0,
  "normalizedRankScore": 97.2,
  "biasAudit": {
    "isAnomaly": false,
    "zScore": 0.42,
    "status": "Score matches historic rubric distribution within 0.5 σ"
  },
  "leaderboardShift": {
    "previousRank": 3,
    "newRank": 1,
    "rankDelta": "+2"
  }
}
```

---

## 4. WebSocket & Real-Time Event Topics

### Supabase / WebSocket Channel: `event:realtime:<eventId>`

#### Event: `ATTENDANCE_PULSE`
```json
{
  "type": "ATTENDANCE_PULSE",
  "totalCheckedIn": 483,
  "peakRatePerHour": 142,
  "zoneOccupancies": {
    "main_arena": 280,
    "hack_lounge": 120,
    "mentor_zone": 45,
    "food_court": 38
  }
}
```

#### Event: `LEADERBOARD_UPDATED`
```json
{
  "type": "LEADERBOARD_UPDATED",
  "topTeams": [
    { "rank": 1, "delta": "+2", "teamName": "OmniNexus AI", "score": 97.4 },
    { "rank": 2, "delta": "-1", "teamName": "ZeroLag ZK", "score": 96.2 },
    { "rank": 3, "delta": "-1", "teamName": "PulseFlow", "score": 95.8 }
  ]
}
```

#### Event: `BROADCAST_ALERT`
```json
{
  "type": "BROADCAST_ALERT",
  "id": "ann_9918",
  "priority": "urgent",
  "title": "Judging Round 1 Commencing in 15 Minutes",
  "message": "Please ensure at least one team member remains at your assigned table #42."
}
```
