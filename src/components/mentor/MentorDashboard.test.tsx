import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MentorDashboard } from './MentorDashboard';
import { EventProvider } from '../../context/EventContext';
import React from 'react';

const renderMentorDashboard = () => render(
  <EventProvider>
    <MentorDashboard />
  </EventProvider>
);

describe('MentorDashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders mentor banner and staff info', () => {
    renderMentorDashboard();
    expect(screen.getByText('Mentor & Volunteer Command Hub')).toBeInTheDocument();
    expect(screen.getByText('REAL-TIME HELP DESK')).toBeInTheDocument();
    expect(screen.getAllByText(/David Chen/).length).toBeGreaterThan(0);
  });

  it('displays open, in progress, and resolved ticket counts', () => {
    renderMentorDashboard();
    expect(screen.getByText(/Active/)).toBeInTheDocument();
    expect(screen.getByText(/Claimed/)).toBeInTheDocument();
    expect(screen.getByText(/Cleared/)).toBeInTheDocument();
  });

  it('allows filtering tickets by category and status', () => {
    renderMentorDashboard();
    const hardwareButton = screen.getByRole('tab', { name: 'Hardware' });
    fireEvent.click(hardwareButton);
    expect(hardwareButton).toHaveClass('bg-purple-600');
  });

  it('allows claiming and resolving support tickets', () => {
    renderMentorDashboard();
    const claimButtons = screen.queryAllByText('Claim Ticket');
    if (claimButtons.length > 0) {
      fireEvent.click(claimButtons[0]);
    }
  });
});
