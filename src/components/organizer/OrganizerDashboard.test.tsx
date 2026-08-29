import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrganizerDashboard } from './OrganizerDashboard';
import { EventProvider } from '../../context/EventContext';
import { INITIAL_TEAMS } from '../../data/mockData';
import React from 'react';

const renderDashboard = () => render(
  <EventProvider>
    <OrganizerDashboard />
  </EventProvider>
);

describe('OrganizerDashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders mission control header', () => {
    renderDashboard();
    expect(screen.getByText('Organizer Mission Control')).toBeInTheDocument();
    expect(screen.getByText('LIVE ECOSYSTEM')).toBeInTheDocument();
  });

  it('displays telemetry stats', () => {
    renderDashboard();
    expect(screen.getByText('Checked-In')).toBeInTheDocument();
    expect(screen.getByText('Active in Venue')).toBeInTheDocument();
    expect(screen.getByText('Teams Formed')).toBeInTheDocument();
    // Multiple "Submissions" elements - use getAllByText
    expect(screen.getAllByText('Submissions').length).toBeGreaterThan(0);
    expect(screen.getByText('Support Desk')).toBeInTheDocument();
    expect(screen.getByText('AI Insights')).toBeInTheDocument();
  });

  it('shows navigation tabs', () => {
    renderDashboard();
    expect(screen.getByText('Digital Twin & Crowd Analytics')).toBeInTheDocument();
    expect(screen.getByText('AI Multi-Channel Broadcast')).toBeInTheDocument();
    expect(screen.getByText('Fast-Track QR Scanner Desk')).toBeInTheDocument();
    expect(screen.getByText('Team Formation Radar & Submissions')).toBeInTheDocument();
    expect(screen.getByText('AI Insights & Bottleneck Alerts')).toBeInTheDocument();
  });

  it('displays event creation wizard button', () => {
    renderDashboard();
    expect(screen.getByText('Create Event')).toBeInTheDocument();
  });

  it('shows countdown timer', () => {
    renderDashboard();
    expect(screen.getByText('TIME REMAINING')).toBeInTheDocument();
  });
});

describe('OrganizerDashboard - Team filtering', () => {
  it('filters teams by search query', () => {
    const query = 'OmniNexus';
    const filtered = INITIAL_TEAMS.filter(t => 
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.track.toLowerCase().includes(query.toLowerCase()) ||
      t.tableNumber.toLowerCase().includes(query.toLowerCase())
    );
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('OmniNexus AI');
  });

  it('filters teams by track', () => {
    const filtered = INITIAL_TEAMS.filter(t => t.track === 'AI & Autonomous Agents');
    expect(filtered.length).toBe(2);
  });
});