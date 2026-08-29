import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  UserCheck
} from 'lucide-react';
import QRCode from 'qrcode';
import { useEvent } from '../../context/EventContext';
import { sanitizeTextInput } from '../../utils/security';

export const QRScannerModal: React.FC = () => {
  const { checkInTicket, playSfx, analytics } = useEvent();
  const [ticketInput, setTicketInput] = useState('EVOS-2026-X892');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; participantName?: string } | null>(null);
  const [isScanning] = useState(true);
  const [selectedZone, setSelectedZone] = useState('Main Stage Arena');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate a live demo QR on canvas
  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        ticketInput || 'EVOS-2026-X892',
        {
          width: 160,
          margin: 1,
          color: {
            dark: '#00F0FF',
            light: '#090D16'
          }
        },
        () => {}
      );
    }
  }, [ticketInput]);

  const handleScan = useCallback((codeToScan?: string) => {
    const code = sanitizeTextInput(codeToScan || ticketInput, 100);
    if (!code.trim()) return;

    playSfx('beep');
    const result = checkInTicket(code, selectedZone);
    setScanResult(result);

    setTimeout(() => {
      setScanResult(null);
    }, 4500);
  }, [ticketInput, playSfx, checkInTicket, selectedZone]);

  const handleBatchScan = useCallback((count: number) => {
    playSfx('cheer');
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        checkInTicket(`EVOS-BATCH-${Date.now()}-${i}`, selectedZone);
      }, i * 150);
    }
  }, [playSfx, checkInTicket, selectedZone]);

  return (
    <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white font-sans">Digital Pass & Attendance Desk</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                FAST-TRACK SCANNER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Real-time cryptographic QR ticket verification & seat routing</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10">
            <span className="text-slate-400 block text-[10px]">Checked In</span>
            <span className="font-bold text-cyan-400 text-sm">{analytics.totalCheckedIn} / {analytics.totalRegistered}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10">
            <span className="text-slate-400 block text-[10px]">Velocity</span>
            <span className="font-bold text-emerald-400 text-sm">{analytics.checkInVelocityPerHour}/hr</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Camera Viewfinder (Left) & Controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (6 cols): Viewfinder */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative bg-slate-950 rounded-2xl border border-cyan-500/30 p-6 flex flex-col items-center justify-center min-h-[320px] overflow-hidden group">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-radial-grid opacity-20" />

            {/* Target Reticle Corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

            {/* Laser Scanline Animation */}
            {isScanning && (
              <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-scanline z-20 pointer-events-none" />
            )}

            {/* Live Rendered Dynamic QR Pass */}
            <div className="relative z-10 p-3 bg-[#090D16] border border-white/10 rounded-xl shadow-2xl flex flex-col items-center">
              <canvas ref={canvasRef} className="rounded-lg" />
              <div className="mt-2 text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
                {ticketInput || 'SAMPLE PASS'}
              </div>
            </div>

            {/* Viewfinder Status Overlay */}
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center z-20">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 text-[10px] font-mono text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>CAMERA SENSOR ACTIVE • 60 FPS</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <label htmlFor="scanner-gate-select">Destination Gate:</label>
            <select
              id="scanner-gate-select"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Main Stage Arena">Main Stage Arena</option>
              <option value="AI Hacking Hub Alpha">AI Hacking Hub Alpha</option>
              <option value="Hardware & Web3 Lab">Hardware & Web3 Lab</option>
              <option value="Mentorship & Workshop Pod">Mentorship & Workshop Pod</option>
            </select>
          </div>
        </div>

        {/* Right (6 cols): Manual Verification & Quick Batch Sim */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="ticket-sig-input" className="text-xs font-mono text-slate-300 font-semibold block">
                Manual Cryptographic Ticket Code Entry:
              </label>
              <div className="flex gap-2">
                <input
                  id="ticket-sig-input"
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="e.g. EVOS-2026-X892"
                  className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => handleScan()}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Quick Preset Test Passes */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Quick Sample Ticket Signature Passes:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { label: 'Alex Rivera (Apex)', code: 'EVOS-2026-X892' },
                  { label: 'Kavita Rao (Lead)', code: 'EVOS-2026-B319' },
                  { label: 'Daniel Kim (AI/ML)', code: 'EVOS-2026-M442' },
                  { label: 'Invalid Pass (Test)', code: 'ERR-INVALID-SIG' },
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTicketInput(sample.code);
                      handleScan(sample.code);
                    }}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/50 hover:bg-slate-800 text-left text-[11px] text-slate-300 transition-all truncate"
                  >
                    🎫 {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Batch Simulator */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-indigo-300 font-semibold">Simulate Queue Influx:</span>
                <span className="text-[10px] text-slate-400">Stress Test Heatmaps</span>
              </div>
              <div className="flex gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleBatchScan(5)}
                  className="flex-1 py-2 rounded-lg bg-indigo-600/40 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/30 transition-all font-bold"
                >
                  +5 Check-Ins
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchScan(15)}
                  className="flex-1 py-2 rounded-lg bg-cyan-600/40 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/30 transition-all font-bold"
                >
                  +15 Surge
                </button>
              </div>
            </div>
          </div>

          {/* Verification Result Toast Box */}
          {scanResult && (
            <div 
              role="alert"
              className={`p-4 rounded-2xl border text-xs font-mono flex items-start gap-3 animate-fadeIn ${
                scanResult.success
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              }`}
            >
              {scanResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold text-sm">
                  {scanResult.success ? 'Access Granted' : 'Verification Denied'}
                </div>
                <div className="mt-0.5 leading-relaxed">{scanResult.message}</div>
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cryptographic Token Validated</span>
            </span>
            <span>Latency: 42ms</span>
          </div>

        </div>

      </div>
    </div>
  );
};
