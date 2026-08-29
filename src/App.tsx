import React, { Suspense, lazy, useCallback } from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Navbar } from './components/common/Navbar';
import { LiveTicker } from './components/common/LiveTicker';
import { SimControlModal } from './components/common/SimControlModal';
import { ErrorBoundary, ComponentErrorBoundary } from './components/common/ErrorBoundary';
import { Spinner } from './components/common/Spinner';

// Lazy load heavy dashboard components for code splitting & optimal TTI
const LandingPage = lazy(() => import('./components/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const OrganizerDashboard = lazy(() => import('./components/organizer/OrganizerDashboard').then(m => ({ default: m.OrganizerDashboard })));
const ParticipantDashboard = lazy(() => import('./components/participant/ParticipantDashboard').then(m => ({ default: m.ParticipantDashboard })));
const JudgeDashboard = lazy(() => import('./components/judge/JudgeDashboard').then(m => ({ default: m.JudgeDashboard })));
const MentorDashboard = lazy(() => import('./components/mentor/MentorDashboard').then(m => ({ default: m.MentorDashboard })));
const EsportsLeaderboard = lazy(() => import('./components/leaderboard/EsportsLeaderboard').then(m => ({ default: m.EsportsLeaderboard })));
const ArchitectureAndSchemaHub = lazy(() => import('./components/docs/ArchitectureAndSchemaHub').then(m => ({ default: m.ArchitectureAndSchemaHub })));

const LoadingFallback: React.FC<{ label?: string }> = ({ label = 'Loading EventOS Module...' }) => (
  <div className="flex items-center justify-center min-h-[420px] w-full py-16">
    <ComponentErrorBoundary fallback={<div className="text-slate-400 font-mono text-xs">Loading...</div>}>
      <Spinner size="lg" label={label} />
    </ComponentErrorBoundary>
  </div>
);

const MainAppContent: React.FC = () => {
  const { currentView, setCurrentView, playSfx } = useEvent();

  const handleGoHome = useCallback(() => {
    setCurrentView('landing');
  }, [setCurrentView]);

  // Render the active view wrapped in error boundary & suspense
  const renderView = () => {
    const views = {
      landing: <LandingPage />,
      organizer: <OrganizerDashboard />,
      participant: <ParticipantDashboard />,
      judge: <JudgeDashboard />,
      mentor: <MentorDashboard />,
      leaderboard: <EsportsLeaderboard />,
      docs: <ArchitectureAndSchemaHub />,
    };

    return (
      <ErrorBoundary onHomeClick={handleGoHome}>
        <Suspense fallback={<LoadingFallback label={`Synchronizing ${currentView} workspace...`} />}>
          {views[currentView as keyof typeof views] || <LandingPage />}
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Real-time F1 Live Ticker Marquee */}
      <LiveTicker />

      {/* Main View Area */}
      <main 
        id="main-content"
        role="main"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 focus:outline-none"
      >
        {renderView()}
      </main>

      {/* Floating Simulation Engine Control Drawer */}
      <SimControlModal />

      {/* Global Futuristic Footer */}
      <footer 
        role="contentinfo" 
        className="w-full border-t border-white/10 bg-slate-950/90 py-8 px-4 mt-auto"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-400">
              <span className="text-[10px] font-mono">⚡</span>
            </div>
            <span>
              <strong className="text-white font-sans font-bold">EventOS AI</strong> — Next-Gen Smart Event Operating System
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button 
              onClick={() => { playSfx('beep'); setCurrentView('landing'); }}
              className="hover:text-cyan-400 transition-colors"
            >
              Home
            </button>
            <span>•</span>
            <button 
              onClick={() => { playSfx('beep'); setCurrentView('organizer'); }}
              className="hover:text-cyan-400 transition-colors"
            >
              Mission Control
            </button>
            <span>•</span>
            <button 
              onClick={() => { playSfx('beep'); setCurrentView('participant'); }}
              className="hover:text-cyan-400 transition-colors"
            >
              Hacker Hub
            </button>
            <span>•</span>
            <button 
              onClick={() => { playSfx('beep'); setCurrentView('judge'); }}
              className="hover:text-cyan-400 transition-colors"
            >
              Judge Room
            </button>
            <span>•</span>
            <button 
              onClick={() => { playSfx('beep'); setCurrentView('mentor'); }}
              className="hover:text-cyan-400 transition-colors"
            >
              Mentor Desk
            </button>
            <span>•</span>
            <button 
              onClick={() => { playSfx('beep'); setCurrentView('leaderboard'); }}
              className="hover:text-cyan-400 transition-colors"
            >
              Esports Leaderboard
            </button>
            <span>•</span>
            <button 
              onClick={() => { playSfx('beep'); setCurrentView('docs'); }}
              className="hover:text-cyan-400 transition-colors"
            >
              Schema & Architecture
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span>Powered by React 19, Vite & Supabase</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <EventProvider>
      <MainAppContent />
    </EventProvider>
  );
}