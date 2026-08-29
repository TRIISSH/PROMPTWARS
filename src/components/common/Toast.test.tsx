import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastContainer } from './Toast';
import { ToastNotification } from '../../types';
import React from 'react';

describe('ToastContainer', () => {
  it('renders nothing when toasts array is empty', () => {
    const { container } = render(<ToastContainer toasts={[]} onDismiss={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders toasts with correct icons and messages', () => {
    const mockToasts: ToastNotification[] = [
      {
        id: 't_1',
        type: 'success',
        title: 'Project Submitted',
        message: 'Your project has been recorded.',
        durationMs: 4000
      },
      {
        id: 't_2',
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to telemetry node.',
        durationMs: 4000
      }
    ];
    const mockDismiss = vi.fn();

    render(<ToastContainer toasts={mockToasts} onDismiss={mockDismiss} />);

    expect(screen.getByText('Project Submitted')).toBeInTheDocument();
    expect(screen.getByText('Your project has been recorded.')).toBeInTheDocument();
    expect(screen.getByText('Network Error')).toBeInTheDocument();
    expect(screen.getByText('Could not connect to telemetry node.')).toBeInTheDocument();
  });

  it('calls onDismiss when close button is clicked', () => {
    const mockToasts: ToastNotification[] = [
      {
        id: 't_1',
        type: 'info',
        title: 'Information',
        message: 'System update in progress.',
        durationMs: 4000
      }
    ];
    const mockDismiss = vi.fn();

    render(<ToastContainer toasts={mockToasts} onDismiss={mockDismiss} />);

    const closeButton = screen.getByRole('button', { name: /dismiss notification/i });
    fireEvent.click(closeButton);

    expect(mockDismiss).toHaveBeenCalledWith('t_1');
  });
});
