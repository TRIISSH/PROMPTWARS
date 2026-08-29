import React from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Navbar } from './components/common/Navbar';
import { LiveTicker } from './components/common/LiveTicker';
import { SimControlModal } from './components/common/SimControlModal';
import { LandingPage } from './components/landing/LandingPage';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { ParticipantDashboard } from './components/participant/ParticipantDashboard';
import { JudgeDashboard } from './components/judge/JudgeDashboard';
import { MentorDashboard } from './components/mentor/MentorDashboard';
import { EsportsLeaderboard } from './components/leaderboard/EsportsLeaderboard';
import { ArchitectureAndSchemaHub } from './components/docs/ArchitectureAndSchemaHub';
import { Terminal } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, setCurrentView, playSfx } = useEvent();

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Real-time F1 Live Ticker Marquee */}
      <LiveTicker />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'organizer' && <OrganizerDashboard />}
        {currentView === 'participant' && <ParticipantDashboard />}
        {currentView === 'judge' && <JudgeDashboard />}
        {currentView === 'mentor' && <MentorDashboard />}
        {currentView === 'leaderboard' && <EsportsLeaderboard />}
        {currentView === 'docs' && <ArchitectureAndSchemaHub />}
      </main>

      {/* Floating Simulation Engine Control Drawer */}
      <SimControlModal />

      {/* Global Futuristic Footer */}
      <footer className="w-full border-t border-white/10 bg-slate-950/90 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-400">
              <Terminal className="w-3.5 h-3.5" />
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
            <span>Powered by Next.js 15 & Supabase</span>
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
