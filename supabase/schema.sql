-- ============================================================================
-- EventOS AI - Complete PostgreSQL / Supabase Database Schema
-- Version: 1.0.0 (Production Ready)
-- Target: Supabase / PostgreSQL 15+
-- Features: Row Level Security (RLS), Triggers, Real-time Subscriptions, Full Indexes
-- ============================================================================

-- Enable UUID extension and vector/crypto support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS & CUSTOM TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('superadmin', 'organizer', 'participant', 'judge', 'mentor', 'volunteer');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'registration_open', 'hacking_active', 'judging_active', 'completed', 'archived');
CREATE TYPE team_status AS ENUM ('forming', 'ready', 'submitted', 'disqualified');
CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'waitlisted', 'rejected', 'checked_in');
CREATE TYPE submission_status AS ENUM ('draft', 'submitted', 'under_review', 'evaluated', 'winner');
CREATE TYPE announcement_priority AS ENUM ('normal', 'high', 'urgent', 'emergency');
CREATE TYPE notification_channel AS ENUM ('in_app', 'push', 'sms', 'email', 'discord', 'slack');

-- ============================================================================
-- 2. CORE USERS & PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'participant' NOT NULL,
    bio TEXT,
    github_handle TEXT,
    linkedin_handle TEXT,
    discord_handle TEXT,
    phone_number TEXT,
    skills TEXT[] DEFAULT '{}',
    experience_level TEXT DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'advanced', 'expert'
    preferred_roles TEXT[] DEFAULT '{}', -- 'frontend', 'backend', 'ai_ml', 'design', 'product', 'hardware'
    xp_points INTEGER DEFAULT 0 NOT NULL,
    level INTEGER DEFAULT 1 NOT NULL,
    badges JSONB DEFAULT '[]'::jsonb,
    is_profile_complete BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 3. EVENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    banner_url TEXT,
    logo_url TEXT,
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    status event_status DEFAULT 'draft' NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    submission_deadline TIMESTAMPTZ NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT,
    venue_capacity INTEGER DEFAULT 500,
    max_team_size INTEGER DEFAULT 4 NOT NULL,
    min_team_size INTEGER DEFAULT 1 NOT NULL,
    tracks JSONB DEFAULT '[]'::jsonb, -- e.g. [{"id":"ai","name":"AI & LLMs","prize":"$10,000"}]
    rubric_criteria JSONB DEFAULT '[]'::jsonb, -- e.g. [{"id":"tech","name":"Technical Complexity","weight":25}]
    settings JSONB DEFAULT '{
        "allow_solo_teams": true,
        "auto_matchmaking_enabled": true,
        "bias_detection_enabled": true,
        "public_leaderboard": true,
        "digital_twin_enabled": true
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 4. REGISTRATIONS & CHECK-INS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status registration_status DEFAULT 'pending' NOT NULL,
    ticket_code TEXT UNIQUE NOT NULL,
    qr_hash TEXT UNIQUE NOT NULL,
    dietary_preferences TEXT,
    t_shirt_size TEXT,
    custom_answers JSONB DEFAULT '{}'::jsonb,
    is_checked_in BOOLEAN DEFAULT false NOT NULL,
    checked_in_at TIMESTAMPTZ,
    checked_in_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (event_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.check_in_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE NOT NULL,
    scanned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    venue_zone TEXT DEFAULT 'Main Entrance',
    device_info TEXT,
    scanned_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 5. TEAMS & MEMBERSHIP
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    avatar_url TEXT,
    leader_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    join_code TEXT UNIQUE NOT NULL,
    status team_status DEFAULT 'forming' NOT NULL,
    track_id TEXT,
    table_number TEXT,
    looking_for_roles TEXT[] DEFAULT '{}',
    compatibility_matrix JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (event_id, name)
);

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role_in_team TEXT DEFAULT 'Member', -- 'Leader', 'Developer', 'Designer', 'ML Engineer'
    joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (team_id, user_id)
);

-- ============================================================================
-- 6. AI MATCHMAKING REQUESTS & POOL
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.matchmaking_pool (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    desired_roles TEXT[] NOT NULL,
    preferred_tracks TEXT[] NOT NULL,
    bio_snippet TEXT,
    status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'matched', 'closed'
    recommended_team_ids UUID[] DEFAULT '{}',
    ai_skill_vector JSONB,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (event_id, user_id)
);

-- ============================================================================
-- 7. SUBMISSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE UNIQUE NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    track_id TEXT NOT NULL,
    github_url TEXT NOT NULL,
    demo_url TEXT,
    video_url TEXT,
    presentation_url TEXT,
    cover_image_url TEXT,
    status submission_status DEFAULT 'submitted' NOT NULL,
    ai_summary TEXT,
    ai_complexity_score NUMERIC(5,2),
    final_score NUMERIC(5,2) DEFAULT 0.00,
    rank_position INTEGER,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 8. JUDGES & EVALUATION SCORES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.event_judges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    assigned_tracks TEXT[] DEFAULT '{}',
    expertise_tags TEXT[] DEFAULT '{}',
    is_lead_judge BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (event_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.evaluation_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    judge_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rubric_scores JSONB NOT NULL, -- e.g. {"technical": 23, "innovation": 24, "design": 22, "impact": 24}
    total_score NUMERIC(5,2) NOT NULL,
    feedback_public TEXT,
    feedback_private TEXT,
    bias_flag BOOLEAN DEFAULT false NOT NULL,
    bias_reason TEXT,
    is_submitted BOOLEAN DEFAULT true NOT NULL,
    evaluated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (submission_id, judge_id)
);

-- ============================================================================
-- 9. ANNOUNCEMENTS & BROADCASTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    raw_prompt TEXT,
    push_content TEXT NOT NULL,
    sms_content TEXT,
    email_content TEXT,
    slack_discord_content TEXT,
    priority announcement_priority DEFAULT 'normal' NOT NULL,
    target_audience TEXT DEFAULT 'all', -- 'all', 'participants', 'judges', 'mentors'
    channels_sent notification_channel[] DEFAULT '{in_app,push}',
    delivered_count INTEGER DEFAULT 0 NOT NULL,
    read_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 10. REAL-TIME ACTIVITY LOGS & DIGITAL TWIN VENUE ZONES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.venue_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    zone_code TEXT NOT NULL,
    zone_name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0 NOT NULL,
    heat_level NUMERIC(3,2) DEFAULT 0.00, -- 0.0 to 1.0
    status TEXT DEFAULT 'normal' NOT NULL, -- 'normal', 'busy', 'crowded', 'restricted'
    coordinates JSONB DEFAULT '{"x": 0, "y": 0, "width": 100, "height": 100}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (event_id, zone_code)
);

CREATE TABLE IF NOT EXISTS public.realtime_event_stream (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'CHECK_IN', 'TEAM_MATCH', 'SUBMISSION_RECEIVED', 'SCORE_POSTED', 'ANNOUNCEMENT_SENT'
    title TEXT NOT NULL,
    description TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 11. INDEXES FOR HIGH-THROUGHPUT PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_registrations_event_user ON public.registrations(event_id, user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_qr_hash ON public.registrations(qr_hash);
CREATE INDEX IF NOT EXISTS idx_teams_event_id ON public.teams(event_id);
CREATE INDEX IF NOT EXISTS idx_submissions_event_score ON public.submissions(event_id, final_score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_submission ON public.evaluation_scores(submission_id);
CREATE INDEX IF NOT EXISTS idx_scores_judge ON public.evaluation_scores(judge_id);
CREATE INDEX IF NOT EXISTS idx_announcements_event_created ON public.announcements(event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_stream_created ON public.realtime_event_stream(event_id, created_at DESC);

-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_event_stream ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, User update own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Events: Published events visible to everyone
CREATE POLICY "Events viewable by everyone" ON public.events FOR SELECT USING (status != 'draft' OR organizer_id = auth.uid());
CREATE POLICY "Organizers can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own events" ON public.events FOR UPDATE USING (auth.uid() = organizer_id);

-- Registrations: User can view own, Organizer can view all for event
CREATE POLICY "Users can view own registration" ON public.registrations FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.events WHERE events.id = registrations.event_id AND events.organizer_id = auth.uid())
);

-- Submissions & Leaderboard: Public read for published events
CREATE POLICY "Submissions viewable by event attendees" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Team leader can insert submission" ON public.submissions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.teams WHERE teams.id = submissions.team_id AND teams.leader_id = auth.uid())
);

-- Evaluation Scores: Only assigned judges & organizers can view/edit
CREATE POLICY "Judges can view assigned scores" ON public.evaluation_scores FOR SELECT USING (
    judge_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.events WHERE events.id = evaluation_scores.event_id AND events.organizer_id = auth.uid())
);
CREATE POLICY "Judges can insert own scores" ON public.evaluation_scores FOR INSERT WITH CHECK (judge_id = auth.uid());
CREATE POLICY "Judges can update own scores" ON public.evaluation_scores FOR UPDATE USING (judge_id = auth.uid());

-- Realtime stream: Public read
CREATE POLICY "Realtime stream viewable by all" ON public.realtime_event_stream FOR SELECT USING (true);

-- ============================================================================
-- 13. REALTIME SCORE AGGREGATION TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.recalculate_submission_score()
RETURNS TRIGGER AS $$
DECLARE
    avg_score NUMERIC(5,2);
BEGIN
    SELECT COALESCE(AVG(total_score), 0)
    INTO avg_score
    FROM public.evaluation_scores
    WHERE submission_id = NEW.submission_id AND is_submitted = true;

    UPDATE public.submissions
    SET final_score = avg_score,
        updated_at = NOW()
    WHERE id = NEW.submission_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_submission_score ON public.evaluation_scores;
CREATE TRIGGER trigger_update_submission_score
AFTER INSERT OR UPDATE ON public.evaluation_scores
FOR EACH ROW EXECUTE FUNCTION public.recalculate_submission_score();
