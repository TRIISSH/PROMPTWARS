import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JudgeDashboard } from './JudgeDashboard';
import { EventProvider } from '../../context/EventContext';
import React from 'react';

const renderJudge = () => render(
  <EventProvider>
    <JudgeDashboard />
  </EventProvider>
);

describe('JudgeDashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders judge header with bias audit badge', () => {
    renderJudge();
    expect(screen.getByText('Smart Judging & Evaluation Studio')).toBeInTheDocument();
    expect(screen.getByText('AI BIAS AUDIT v2')).toBeInTheDocument();
    expect(screen.getByText(/Judge:/)).toBeInTheDocument();
    expect(screen.getByText(/Dr\. Marcus/)).toBeInTheDocument();
    expect(screen.getByText(/Vertex/)).toBeInTheDocument();
  });

  it('shows judge stats', () => {
    renderJudge();
    expect(screen.getByText('Evaluated')).toBeInTheDocument();
    expect(screen.getByText('3 Projects')).toBeInTheDocument();
    // Multiple "Pending" - use getAllByText
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    expect(screen.getByText('1 Projects')).toBeInTheDocument();
    expect(screen.getByText('Judge Bias Index')).toBeInTheDocument();
    expect(screen.getByText('Optimal')).toBeInTheDocument();
  });

  it('shows project queue', () => {
    renderJudge();
    // Multiple elements with same text - use getAllByText
    expect(screen.getAllByText('OmniNexus AI: Autonomous Multi-Modal Hackathon Co-Pilot').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ZeroLag ZK: Cryptographic Offline Verification Protocol').length).toBeGreaterThan(0);
  });

  it('displays rubric scoring sliders', () => {
    renderJudge();
    expect(screen.getByText('Official Rubric Scoring Matrix')).toBeInTheDocument();
    expect(screen.getByText('1. Technical Complexity & Architecture (0-25)')).toBeInTheDocument();
    expect(screen.getByText('2. Innovation & Originality (0-25)')).toBeInTheDocument();
    expect(screen.getByText('3. Design, Polish & UX (0-25)')).toBeInTheDocument();
    expect(screen.getByText('4. Business Viability & Real-World Impact (0-25)')).toBeInTheDocument();
  });

  it('shows AI bias indicator', () => {
    renderJudge();
    expect(screen.getByText('Rubric Bias Check Passed')).toBeInTheDocument();
  });

  it('has preset buttons', () => {
    renderJudge();
    expect(screen.getByText('Strong (90)')).toBeInTheDocument();
    expect(screen.getByText('Flawless (100)')).toBeInTheDocument();
    expect(screen.getByText('Harsh (56)')).toBeInTheDocument();
  });

  it('shows feedback fields', () => {
    renderJudge();
    expect(screen.getByText('Public Constructive Feedback (Visible to Hackers):')).toBeInTheDocument();
    expect(screen.getByText('Private Jury Deliberation Notes (Internal Only):')).toBeInTheDocument();
  });

  it('has submit evaluation button', () => {
    renderJudge();
    expect(screen.getByText('Submit Evaluation & Update Leaderboard Live')).toBeInTheDocument();
  });

  it('filters by track', () => {
    renderJudge();
    expect(screen.getByText('Filter Track:')).toBeInTheDocument();
  });
});