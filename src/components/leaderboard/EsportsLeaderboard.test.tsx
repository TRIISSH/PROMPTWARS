import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EsportsLeaderboard } from '../leaderboard/EsportsLeaderboard';
import { EventProvider } from '../../context/EventContext';
import React from 'react';

const renderLeaderboard = () => render(
  <EventProvider>
    <EsportsLeaderboard />
  </EventProvider>
);

describe('EsportsLeaderboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders leaderboard header', () => {
    renderLeaderboard();
    expect(screen.getByText('Live Dynamic Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('ESPORTS LIVE CHAMPIONSHIP ARENA')).toBeInTheDocument();
  });

  it('shows track filters', () => {
    renderLeaderboard();
    expect(screen.getByText('All Tracks')).toBeInTheDocument();
    expect(screen.getByText('AI & Agents')).toBeInTheDocument();
    expect(screen.getByText('Web3 & ZK')).toBeInTheDocument();
    expect(screen.getByText('HealthTech')).toBeInTheDocument();
    expect(screen.getByText('Infra & Mesh')).toBeInTheDocument();
  });

  it('displays podium for top 3', () => {
    renderLeaderboard();
    expect(screen.getByText('GRAND CHAMPION (#1)')).toBeInTheDocument();
    expect(screen.getByText('#2 RANK')).toBeInTheDocument();
    expect(screen.getByText('#3 RANK')).toBeInTheDocument();
  });

  it('shows full standings table', () => {
    renderLeaderboard();
    expect(screen.getByText('Official Standings')).toBeInTheDocument();
    // Multiple elements with same text - use getAllByText
    expect(screen.getAllByText('OmniNexus AI: Autonomous Multi-Modal Hackathon Co-Pilot').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ZeroLag ZK: Cryptographic Offline Verification Protocol').length).toBeGreaterThan(0);
  });

  it('shows rank delta indicators', () => {
    renderLeaderboard();
    // Multiple "Breakdown" buttons - use getAllByText
    expect(screen.getAllByText('Breakdown').length).toBeGreaterThan(0);
  });

  it('has celebration button', () => {
    renderLeaderboard();
    expect(screen.getByText('Celebrate Top 3')).toBeInTheDocument();
  });

  it('has simulate score shift button', () => {
    renderLeaderboard();
    expect(screen.getByText('Simulate Score Shift')).toBeInTheDocument();
  });
});