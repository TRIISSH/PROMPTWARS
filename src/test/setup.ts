import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll } from 'vitest';
import React from 'react';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock QRCode
vi.mock('qrcode', () => ({
  default: { toCanvas: vi.fn((_canvas, _text, _options, cb) => cb && cb()) },
  toCanvas: vi.fn((_canvas, _text, _options, cb) => cb && cb()),
}));

// Mock lucide-react icons cleanly
vi.mock('lucide-react', () => {
  const icons = [
    'Terminal', 'Radio', 'Users', 'Scale', 'Trophy', 'FileCode2', 'Volume2', 'VolumeX',
    'Sparkles', 'Menu', 'X', 'Play', 'HeartHandshake', 'Building2', 'QrCode', 'TrendingUp',
    'Clock', 'PlusCircle', 'Search', 'Bot', 'CheckCircle2', 'Check', 'Zap', 'Info', 'Calendar',
    'Cpu', 'Flame', 'ShieldAlert', 'Layers', 'Compass', 'Activity', 'Maximize2', 'Bell',
    'Send', 'ExternalLink', 'ChevronRight', 'ShieldCheck', 'UserCheck', 'AlertTriangle',
    'UserPlus', 'AlertCircle', 'Copy', 'Database', 'Network', 'Server', 'Minminus',
    'RotateCcw', 'Sliders', 'MapPin', 'LifeBuoy', 'Crown', 'Smartphone', 'MessageSquare',
    'Mail', 'RefreshCw', 'ScanLine', 'Award', 'Minus', 'TrendingDown', 'XCircle'
  ];
  const mockIcons: Record<string, React.FC<{ className?: string }>> = {};
  icons.forEach(name => {
    mockIcons[name] = ({ className }) => 
      React.createElement('svg', { className, 'data-testid': `icon-${name.toLowerCase()}` });
  });
  return mockIcons;
});

// Mock recharts with SVG container for defs and gradients
vi.mock('recharts', () => ({
  AreaChart: ({ children, className }: { children?: React.ReactNode; className?: string }) => 
    React.createElement('svg', { 'data-testid': 'area-chart', className }, children),
  Area: ({ className }: { className?: string }) => 
    React.createElement('path', { 'data-testid': 'area', className }),
  PieChart: ({ children, className }: { children?: React.ReactNode; className?: string }) => 
    React.createElement('svg', { 'data-testid': 'pie-chart', className }, children),
  Pie: ({ className }: { className?: string }) => 
    React.createElement('g', { 'data-testid': 'pie', className }),
  Cell: () => React.createElement('circle', { 'data-testid': 'cell' }),
  XAxis: () => React.createElement('g', { 'data-testid': 'x-axis' }),
  YAxis: () => React.createElement('g', { 'data-testid': 'y-axis' }),
  Tooltip: () => React.createElement('g', { 'data-testid': 'tooltip' }),
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => 
    React.createElement('div', { 'data-testid': 'responsive-container' }, children),
  CartesianGrid: () => React.createElement('g', { 'data-testid': 'cartesian-grid' }),
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
} as unknown as typeof AudioContext;

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

// Suppress console.error in tests for known React 19 testing quirks
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