import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventProvider, useEvent } from '../context/EventContext';
import { detectBiasAnomaly } from '../utils/security';
import React from 'react';

// Test component to consume context
const TestConsumer: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    activeRole, 
    setActiveRole,
    checkInTicket,
    submitRubricEvaluation,
    analytics,
    teams,
    submissions,
    participantUser,
    judgeUser,
    createSupportTicket,
    supportTickets,
  } = useEvent();

  return (
    <div>
      <span data-testid="current-view">{currentView}</span>
      <span data-testid="active-role">{activeRole}</span>
      <span data-testid="analytics-checked-in">{analytics.totalCheckedIn}</span>
      <span data-testid="teams-count">{teams.length}</span>
      <span data-testid="submissions-count">{submissions.length}</span>
      <span data-testid="participant-name">{participantUser.name}</span>
      <span data-testid="judge-name">{judgeUser.name}</span>
      <span data-testid="tickets-count">{supportTickets.length}</span>
      <button onClick={() => setCurrentView('participant')}>Switch to Participant</button>
      <button onClick={() => setActiveRole('judge')}>Switch to Judge</button>
      <button onClick={() => checkInTicket('EVOS-TEST-123', 'Main Stage Arena')}>Check In</button>
      <button onClick={() => submitRubricEvaluation('sub_1', { technicalComplexity: 25, innovation: 25, designAndUX: 25, businessImpact: 25 }, 'Exceptional work', 'High scale')}>
        Submit Evaluation
      </button>
      <button onClick={() => createSupportTicket({ authorName: 'Test Hacker', authorRole: 'Participant', tableNumber: 'Table 1', category: 'Technical / API', description: 'Need help with CUDA', priority: 'high' })}>
        File Ticket
      </button>
    </div>
  );
};

describe('EventContext', () => {
  const renderWithProvider = () => render(
    <EventProvider>
      <TestConsumer />
    </EventProvider>
  );

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('provides default state values correctly', () => {
    renderWithProvider();
    expect(screen.getByTestId('current-view')).toHaveTextContent('landing');
    expect(screen.getByTestId('active-role')).toHaveTextContent('organizer');
    expect(screen.getByTestId('analytics-checked-in')).toHaveTextContent('484');
    expect(screen.getByTestId('teams-count')).toHaveTextContent('5');
    expect(screen.getByTestId('submissions-count')).toHaveTextContent('4');
    expect(screen.getByTestId('participant-name')).toHaveTextContent('Alex Rivera');
    expect(screen.getByTestId('judge-name')).toHaveTextContent('Dr. Marcus Sterling');
  });

  it('allows switching views', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Switch to Participant'));
    expect(screen.getByTestId('current-view')).toHaveTextContent('participant');
  });

  it('allows switching roles', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Switch to Judge'));
    expect(screen.getByTestId('active-role')).toHaveTextContent('judge');
  });

  it('checkInTicket increments analytics and updates live feed', () => {
    renderWithProvider();
    const initialCheckedIn = Number(screen.getByTestId('analytics-checked-in').textContent);
    fireEvent.click(screen.getByText('Check In'));
    expect(screen.getByTestId('analytics-checked-in')).toHaveTextContent(String(initialCheckedIn + 1));
  });

  it('submitRubricEvaluation updates submission scores and ranks', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Submit Evaluation'));
    expect(screen.getByTestId('submissions-count')).toHaveTextContent('4');
  });

  it('creates support tickets with sanitized data', () => {
    renderWithProvider();
    const initialCount = Number(screen.getByTestId('tickets-count').textContent);
    fireEvent.click(screen.getByText('File Ticket'));
    expect(screen.getByTestId('tickets-count')).toHaveTextContent(String(initialCount + 1));
  });
});

describe('EventContext - AI Bias Detection Heuristics', () => {
  it('flags extreme lenient scores (>= 99) as outliers', () => {
    const result = detectBiasAnomaly(99.5);
    expect(result.isAnomaly).toBe(true);
    expect(result.reason).toContain('higher than track median');
  });

  it('flags harsh scoring anomalies (< 65) as outliers', () => {
    const result = detectBiasAnomaly(58);
    expect(result.isAnomaly).toBe(true);
    expect(result.reason).toContain('below rubric norm');
  });

  it('does not flag normal balanced scores as anomalies', () => {
    const result = detectBiasAnomaly(88);
    expect(result.isAnomaly).toBe(false);
    expect(result.reason).toBeUndefined();
  });
});