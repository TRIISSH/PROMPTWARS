import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock QRCode
vi.mock('qrcode', () => ({
  default: { toCanvas: vi.fn((canvas, text, options, cb) => cb && cb()) },
  toCanvas: vi.fn((canvas, text, options, cb) => cb && cb()),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  const icons = [
    'Terminal', 'Radio', 'Users', 'Scale', 'Trophy', 'FileCode2', 'Volume2', 'VolumeX',
    'Sparkles', 'Menu', 'X', 'Play', 'HeartHandshake', 'Building2', 'QrCode', 'TrendingUp',
    'Clock', 'PlusCircle', 'Search', 'Bot', 'CheckCircle2', 'Check', 'Zap', 'Info', 'Calendar',
    'Cpu', 'Flame', 'ShieldAlert', 'Layers', 'Compass', 'Activity', 'Maximize2', 'Bell',
    'Send', 'ExternalLink', 'ChevronRight', 'ShieldCheck', 'UserCheck', 'AlertTriangle',
    'UserPlus', 'AlertCircle', 'Flame', 'Copy', 'Database', 'Network', 'Server', 'Minminus',
    'RotateCcw', 'Sliders', 'MapPin', 'LifeBuoy', 'Crown', 'Smartphone', 'MessageSquare',
    'Mail', 'Flame', 'Users', 'QrCode', 'RefreshCw', 'ScanLine', 'Zap', 'Trophy', 'Award', 'Minus', 'TrendingDown',
  ];
  const mockIcons: Record<string, React.FC<{ className?: string }>> = {};
  icons.forEach(name => {
    mockIcons[name] = ({ className, ...props }) => 
      React.createElement('svg', { className, 'data-testid': `icon-${name.toLowerCase()}`, ...props });
  });
  return mockIcons;
});

// Mock recharts
vi.mock('recharts', () => ({
  AreaChart: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'area-chart', ...props }, children),
  Area: ({ ...props }) => React.createElement('div', { 'data-testid': 'area', ...props }),
  PieChart: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'pie-chart', ...props }, children),
  Pie: ({ ...props }) => React.createElement('div', { 'data-testid': 'pie', ...props }),
  Cell: ({ ...props }) => React.createElement('div', { 'data-testid': 'cell', ...props }),
  XAxis: ({ ...props }) => React.createElement('div', { 'data-testid': 'x-axis', ...props }),
  YAxis: ({ ...props }) => React.createElement('div', { 'data-testid': 'y-axis', ...props }),
  Tooltip: ({ ...props }) => React.createElement('div', { 'data-testid': 'tooltip', ...props }),
  ResponsiveContainer: ({ children, ...props }) => React.createElement('div', { 'data-testid': 'responsive-container', ...props }, children),
  CartesianGrid: ({ ...props }) => React.createElement('div', { 'data-testid': 'cartesian-grid', ...props }),
}));

// Mock AudioContext
global.AudioContext = class MockAudioContext {
  createOscillator() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: {
        setValueAtTime: vi.fn(),
      },
      type: 'sine',
    };
  }
  createGain() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
    };
  }
  destination = {};
  currentTime = 0;
} as any;

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Suppress console.error in tests for known warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes?.('act(...)')) return;
    if (args[0]?.includes?.('Warning: ReactDOM.render is no longer supported')) return;
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});