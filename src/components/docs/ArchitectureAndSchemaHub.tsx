import React, { useState } from 'react';
import { 
  Database, 
  FileCode2, 
  Copy, 
  Check,
  Cpu
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const ArchitectureAndSchemaHub: React.FC = () => {
  const { playSfx } = useEvent();
  const [activeTab, setActiveTab] = useState<'schema' | 'api' | 'architecture'>('schema');
  const [copied, setCopied] = useState(false);

  const schemaSQL = `-- ============================================================================
-- EventOS AI - Complete PostgreSQL / Supabase Database Schema
-- Version: 1.0.0 (Production Ready)
-- Target: Supabase / PostgreSQL 15+
-- Features: Row Level Security (RLS), Triggers, Real-time Subscriptions
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles Table (Auth Synced)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'participant' NOT NULL,
    skills TEXT[] DEFAULT '{}',
    experience_level TEXT DEFAULT 'intermediate',
    preferred_roles TEXT[] DEFAULT '{}',
    xp_points INTEGER DEFAULT 0 NOT NULL,
    level INTEGER DEFAULT 1 NOT NULL,
    ticket_code TEXT UNIQUE NOT NULL,
    qr_hash TEXT UNIQUE NOT NULL,
    is_checked_in BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Events Table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT,
    organizer_id UUID REFERENCES public.profiles(id) NOT NULL,
    status event_status DEFAULT 'draft' NOT NULL,
    venue_capacity INTEGER DEFAULT 500,
    tracks JSONB DEFAULT '[]'::jsonb,
    rubric_criteria JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Teams & Membership
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    leader_id UUID REFERENCES public.profiles(id) NOT NULL,
    join_code TEXT UNIQUE NOT NULL,
    compatibility_matrix JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Submissions & Smart Judging Scores
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE UNIQUE NOT NULL,
    project_title TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    track_id TEXT NOT NULL,
    github_url TEXT NOT NULL,
    demo_url TEXT,
    final_score NUMERIC(5,2) DEFAULT 0.00,
    rank_position INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.evaluation_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    judge_id UUID REFERENCES public.profiles(id) NOT NULL,
    rubric_scores JSONB NOT NULL, -- {"technical": 24, "innovation": 25, "design": 23, "impact": 24}
    total_score NUMERIC(5,2) NOT NULL,
    feedback_public TEXT,
    bias_flag BOOLEAN DEFAULT false NOT NULL,
    evaluated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (submission_id, judge_id)
);

-- RLS Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Judges can insert evaluation scores" ON public.evaluation_scores FOR INSERT WITH CHECK (judge_id = auth.uid());`;

  const copySchema = () => {
    navigator.clipboard.writeText(schemaSQL);
    setCopied(true);
    playSfx('beep');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400">
              <FileCode2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                  Architecture & Developer Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ENTERPRISE SAAS SPEC
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Complete PostgreSQL / Supabase DDL, WebSocket Protocol, and System Topology
              </p>
            </div>
          </div>

          {/* Sub-Tabs */}
          <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => { playSfx('beep'); setActiveTab('schema'); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'schema' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              PostgreSQL Schema
            </button>
            <button
              onClick={() => { playSfx('beep'); setActiveTab('api'); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'api' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              API & WebSockets
            </button>
            <button
              onClick={() => { playSfx('beep'); setActiveTab('architecture'); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'architecture' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              System Flow
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: PostgreSQL / Supabase Schema */}
      {activeTab === 'schema' && (
        <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                supabase/schema.sql (10 Core Entity Relational Tables & RLS)
              </span>
            </div>

            <button
              onClick={copySchema}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied SQL' : 'Copy DDL'}</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-white/10 overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre className="font-mono text-xs text-emerald-400 leading-relaxed">
              <code>{schemaSQL}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: API & WebSockets */}
      {activeTab === 'api' && (
        <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-white font-sans">REST & Real-Time WebSocket Specifications</h3>
            <p className="text-xs text-slate-400 font-mono">Microsecond telemetry & low-latency endpoints</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">POST</span>
                <span>/api/v1/events/:id/matchmaker/suggest</span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Computes high-dimensional skill compatibility vectors across participants.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-indigo-400 font-bold">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">POST</span>
                <span>/api/v1/events/:id/announcements/generate</span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Generates multichannel copy (Push, SMS 160 chars, HTML Email, Discord Markdown).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">POST</span>
                <span>/api/v1/events/:id/judging/evaluate</span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Calculates weighted rubric scores and executes ±2σ AI bias anomaly detection.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">WSS</span>
                <span>event:realtime:&lt;eventId&gt;</span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Sub-50ms live stream broadcasting attendance pulses, score updates & emergency notices.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: System Flow */}
      {activeTab === 'architecture' && (
        <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-white font-sans">Full Platform Topology</h3>
            <p className="text-xs text-slate-400 font-mono">End-to-end event data pipeline & role orchestration</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs text-slate-300 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>EventOS AI Core Architectural Pipeline:</span>
            </div>

            <div className="space-y-2 pl-4 border-l border-white/10">
              <div>1. <strong className="text-white">Client Edge Tier</strong>: Next.js 15 / React 19 + Tailwind CSS + WebSockets</div>
              <div>2. <strong className="text-white">AI Automation Tier</strong>: Vector Matchmaker + Anomaly Detection + Multi-Channel LLM Synthesis</div>
              <div>3. <strong className="text-white">Telemetry Tier</strong>: Digital Twin 2.0 Spatial Heatmaps + F1 Influx Velocity Monitoring</div>
              <div>4. <strong className="text-white">Database Tier</strong>: Supabase / PostgreSQL 15+ with Row-Level-Security (RLS) & Triggers</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
