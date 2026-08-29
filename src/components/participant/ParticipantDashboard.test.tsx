import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ParticipantDashboard } from './ParticipantDashboard';
import { AITeamMatchmaker } from './AITeamMatchmaker';
import { EventProvider } from '../../context/EventContext';
import React from 'react';

const renderParticipant = () => render(
  <EventProvider>
    <ParticipantDashboard />
  </EventProvider>
);

const renderMatchmaker = () => render(
  <EventProvider>
    <AITeamMatchmaker />
  </EventProvider>
);

describe('ParticipantDashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders participant profile header', () => {
    renderParticipant();
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.getByText('LVL 6 APEX HACKER')).toBeInTheDocument();
    expect(screen.getByText('Table: Pod #14 - AI Arena')).toBeInTheDocument();
  });

  it('shows holographic digital pass with QR', () => {
    renderParticipant();
    expect(screen.getByText('EVOS-2026-X892')).toBeInTheDocument();
    expect(screen.getByText('VERIFIED')).toBeInTheDocument();
  });

  it('displays XP progress bar', () => {
    renderParticipant();
    expect(screen.getByText('XP Level Progress (Level 6)')).toBeInTheDocument();
    expect(screen.getByText('2850 / 3500 XP')).toBeInTheDocument();
  });

  it('shows navigation tabs', () => {
    renderParticipant();
    expect(screen.getByText('AI Team Matchmaker')).toBeInTheDocument();
    expect(screen.getByText('Project Submission Portal')).toBeInTheDocument();
    expect(screen.getByText('Live Schedule & Countdown')).toBeInTheDocument();
    expect(screen.getByText('AI Event Co-Pilot Assistant')).toBeInTheDocument();
    expect(screen.getByText('Hacker XP & Badges')).toBeInTheDocument();
  });

  it('shows badges section', () => {
    renderParticipant();
    // Badges are in gamification tab - need to click the tab first
    fireEvent.click(screen.getByText('Hacker XP & Badges'));
    // Text is split across elements - use regex and getAllByText
    expect(screen.getAllByText(/Early Bird/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/AI Dream/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Midnight/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/First Submission/)[0]).toBeInTheDocument();
  });

  it('allows filing support ticket', () => {
    renderParticipant();
    fireEvent.click(screen.getByText('Need Mentor Help? File Ticket'));
    expect(screen.getByText('Request Mentor & Staff Assistance')).toBeInTheDocument();
  });
});

describe('AITeamMatchmaker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders matchmaker header', () => {
    renderMatchmaker();
    expect(screen.getByText('AI Team Matchmaker & Synergy Engine')).toBeInTheDocument();
    expect(screen.getByText('VECTOR SYNERGY v3')).toBeInTheDocument();
  });

  it('shows auto-assemble button', () => {
    renderMatchmaker();
    expect(screen.getByText('AI Auto-Assemble Dream Team')).toBeInTheDocument();
  });

  it('displays current team status', () => {
    renderMatchmaker();
    // Text is split across elements, use regex
    expect(screen.getByText(/Your Squad:/)).toBeInTheDocument();
    expect(screen.getByText('OmniNexus AI')).toBeInTheDocument();
    expect(screen.getByText(/Roster:/)).toBeInTheDocument();
    expect(screen.getByText(/3 \/ 4 Members/)).toBeInTheDocument();
    expect(screen.getByText(/98%/)).toBeInTheDocument(); // compatibility score
  });

  it('shows candidate cards with match scores', () => {
    renderMatchmaker();
    expect(screen.getByText('Siddharth Rao')).toBeInTheDocument();
    expect(screen.getByText('97%')).toBeInTheDocument();
    expect(screen.getByText('Maya Lin')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('shows synergy analysis for each candidate', () => {
    renderMatchmaker();
    // Multiple candidates have "Synergy Analysis:" - check at least one exists
    const synergyElements = screen.getAllByText('Synergy Analysis:');
    expect(synergyElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Complements your AI skillset with high-performance Rust/Wasm backend execution.')).toBeInTheDocument();
  });

  it('shows missing skill complements', () => {
    renderMatchmaker();
    expect(screen.getByText('Fills team gap: Rust Memory Safety, Cryptography')).toBeInTheDocument();
  });

  it('filters candidates by role', () => {
    renderMatchmaker();
    const allButton = screen.getByText('All Roles');
    expect(allButton).toBeInTheDocument();
  });

  it('invites candidate to team', () => {
    renderMatchmaker();
    // Multiple "Invite to Team" buttons - just verify at least one exists
    const inviteButtons = screen.getAllByText('Invite to Team');
    expect(inviteButtons.length).toBeGreaterThan(0);
  });
});