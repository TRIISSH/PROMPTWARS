import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Smartphone, 
  MessageSquare, 
  Mail, 
  Radio, 
  CheckCircle2, 
  Copy,
  Check,
  Users
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { AnnouncementChannelVariants } from '../../types';

export const AIAnnouncementStudio: React.FC = () => {
  const { announcements, createAnnouncementFromPrompt, playSfx, analytics } = useEvent();
  
  const [prompt, setPrompt] = useState('Venue changed to Hall B for keynote & opening ceremony');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent' | 'emergency'>('high');
  const [activeChannelTab, setActiveChannelTab] = useState<'push' | 'sms' | 'email' | 'slackDiscord'>('push');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  // Quick preset templates
  const presets = [
    { label: 'Venue changed to Hall B', prompt: 'Keynote venue shifted to Hall B immediately due to high capacity.' },
    { label: 'Code Freeze in 1 Hour', prompt: 'Final 60-minute code freeze alert. Submit GitHub repo and video demo to portal now.' },
    { label: 'Midnight Boba & Snacks Ready', prompt: 'Midnight artisan pizza, hot ramen, and boba bar is now open in Cafeteria Hall C!' },
    { label: 'Judging Round 1 Commencing', prompt: 'Judging Round 1 begins in 15 mins. Please ensure at least one team member remains at your table.' },
  ];

  // Dynamic preview generator based on current prompt
  const generatePreviewVariants = (text: string): AnnouncementChannelVariants => {
    const clean = text.trim() || 'Important event update for all attendees';
    return {
      push: {
        title: priority === 'urgent' ? '🚨 EVENTOS URGENT ALERT' : '📢 EventOS Announcement',
        body: clean.length > 85 ? clean.slice(0, 82) + '...' : clean
      },
      sms: `EVENTOS AI: ${clean} (Ref: ${analytics.totalCheckedIn} attendees). Details: os.ai/live`,
      email: {
        subject: `${priority === 'urgent' ? '[URGENT] ' : ''}HackMatrix 2026: ${clean.slice(0, 45)}...`,
        htmlSnippet: `<!DOCTYPE html>
<html>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #090D16; color: #ffffff; padding: 24px;">
  <div style="max-width: 580px; margin: 0 auto; background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 24px;">
    <h2 style="color: #38bdf8; margin-top: 0;">⚡ Important Event Announcement</h2>
    <p style="font-size: 16px; line-height: 1.5; color: #cbd5e1;">${clean}</p>
    <div style="margin-top: 20px; padding: 12px; background: #1e293b; border-radius: 8px; font-size: 13px; color: #94a3b8;">
      Broadcasted via EventOS AI Mission Control to <strong>${analytics.totalCheckedIn}</strong> registered attendees.
    </div>
  </div>
</body>
</html>`
      },
      slackDiscord: `@everyone ${priority === 'urgent' ? '🚨 **URGENT BROADCAST**' : '📢 **ANNOUNCEMENT**'}\n> ${clean}\n\n*Broadcasted via EventOS Mission Control* • *${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}*`
    };
  };

  const preview = generatePreviewVariants(prompt);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    playSfx('alert');

    setTimeout(() => {
      createAnnouncementFromPrompt(prompt, priority);
      setIsGenerating(false);
      setDispatchedSuccess(true);
      setTimeout(() => setDispatchedSuccess(false), 4000);
    }, 600);
  };

  const copyToClipboard = (text: string, channel: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(channel);
    playSfx('beep');
    setTimeout(() => setCopiedChannel(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-indigo-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white font-sans">AI Multi-Channel Broadcast Studio</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                OMNI-DISPATCH
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Type 1 sentence & AI formats for Push, SMS, Email, & Discord simultaneously</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Audience: <strong className="text-white">{analytics.totalCheckedIn} Hackers</strong></span>
        </div>
      </div>

      {/* Main Grid: Prompt Input (Left) & Live Multi-Channel Previews (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col (5 cols): Input & Controls */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Quick Presets */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Quick AI Presets (1-Click Fill):
            </span>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    playSfx('beep');
                    setPrompt(item.prompt);
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/50 hover:bg-slate-800 text-left text-xs text-slate-300 transition-all font-medium truncate"
                  title={item.prompt}
                >
                  ⚡ {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleBroadcast} className="glass-card rounded-2xl border border-white/10 p-5 space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                <span>Raw Organizer Intent:</span>
                <span className="text-[10px] text-cyan-400 font-normal">AI will auto-adapt copy</span>
              </label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your message here... e.g. Venue changed to Hall B"
                className="w-full bg-slate-950/90 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans leading-relaxed resize-none"
              />
            </div>

            {/* Priority Selector */}
            <div>
              <label className="text-xs font-mono text-slate-300 font-semibold mb-1.5 block">
                Broadcast Priority:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['normal', 'high', 'urgent', 'emergency'] as const).map((p) => {
                  const isCurrent = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        playSfx('beep');
                        setPriority(p);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold capitalize transition-all ${
                        isCurrent
                          ? p === 'urgent' || p === 'emergency'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Audience Pills */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
              <span>Target Channel Delivery:</span>
              <span className="text-cyan-400 font-semibold">Push + SMS + Email + Discord</span>
            </div>

            {/* Submit Broadcast Button */}
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-neon-indigo transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Synthesizing Multi-Channel Payload...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-cyan-300" />
                  <span>Broadcast to {analytics.totalCheckedIn} Attendees Now</span>
                </>
              )}
            </button>

            {dispatchedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dispatched successfully across all 4 channels in 42ms!</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Col (7 cols): Live Multi-Channel Generated Previews */}
        <div className="lg:col-span-7 glass-card rounded-2xl border border-white/10 p-5 space-y-4 flex flex-col justify-between">
          
          {/* Channel Tabs */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  AI Channel Payload Previews
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Live Formatted</span>
            </div>

            <div className="flex gap-2 pt-3">
              {[
                { id: 'push', label: 'Push Notification', icon: <Smartphone className="w-3.5 h-3.5" /> },
                { id: 'sms', label: 'SMS (160 Chars)', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                { id: 'email', label: 'HTML Email', icon: <Mail className="w-3.5 h-3.5" /> },
                { id: 'slackDiscord', label: 'Discord / Slack', icon: <Radio className="w-3.5 h-3.5" /> },
              ].map((tab) => {
                const isActive = activeChannelTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playSfx('beep');
                      setActiveChannelTab(tab.id as typeof activeChannelTab);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Preview Box */}
          <div className="my-auto py-2">
            {activeChannelTab === 'push' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Simulated Mobile Lock Screen Banner:</span>
                  <button
                    onClick={() => copyToClipboard(`${preview.push.title}: ${preview.push.body}`, 'push')}
                    className="flex items-center gap-1 text-[10px] text-cyan-400 hover:underline"
                  >
                    {copiedChannel === 'push' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedChannel === 'push' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                
                {/* Mobile Push Notification Mockup Card */}
                <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 shadow-xl space-y-1.5 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-indigo-600 flex items-center justify-center text-[9px] font-bold text-white">E</div>
                      <span className="font-semibold text-slate-300">EventOS Mobile</span>
                    </div>
                    <span>now</span>
                  </div>
                  <h4 className="font-bold text-xs text-white font-sans">{preview.push.title}</h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{preview.push.body}</p>
                </div>
              </div>
            )}

            {activeChannelTab === 'sms' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>SMS Character Count: <strong className="text-cyan-400">{preview.sms.length} / 160 chars</strong></span>
                  <button
                    onClick={() => copyToClipboard(preview.sms, 'sms')}
                    className="flex items-center gap-1 text-[10px] text-cyan-400 hover:underline"
                  >
                    {copiedChannel === 'sms' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedChannel === 'sms' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-white/10 font-mono text-xs text-emerald-400 leading-relaxed">
                  {preview.sms}
                </div>
              </div>
            )}

            {activeChannelTab === 'email' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Subject: <strong className="text-white font-sans">{preview.email.subject}</strong></span>
                  <button
                    onClick={() => copyToClipboard(preview.email.htmlSnippet, 'email')}
                    className="flex items-center gap-1 text-[10px] text-cyan-400 hover:underline"
                  >
                    {copiedChannel === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedChannel === 'email' ? 'Copied HTML' : 'Copy HTML'}</span>
                  </button>
                </div>

                <div className="bg-slate-900/90 rounded-xl border border-white/10 p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-[11px] text-slate-400">
                    <span className="font-mono">From: announcements@hackmatrix2026.eventos.ai</span>
                  </div>
                  <div className="text-slate-200 font-sans leading-relaxed pt-1">
                    <h4 className="font-bold text-sm text-cyan-300 mb-1">⚡ Important Event Announcement</h4>
                    <p className="text-xs text-slate-300">{prompt}</p>
                    <div className="mt-3 p-2 rounded bg-slate-950/60 text-[10px] font-mono text-slate-400">
                      Dispatched with high deliverability via EventOS SMTP Pool.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeChannelTab === 'slackDiscord' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>Discord / Slack Markdown:</span>
                  <button
                    onClick={() => copyToClipboard(preview.slackDiscord, 'discord')}
                    className="flex items-center gap-1 text-[10px] text-cyan-400 hover:underline"
                  >
                    {copiedChannel === 'discord' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedChannel === 'discord' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-[#313338] text-[#dbdee1] p-4 rounded-xl border border-white/10 font-sans text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-[10px]">
                      BOT
                    </div>
                    <span className="font-bold text-white text-xs">EventOS Announcements</span>
                    <span className="px-1 py-0.2 rounded bg-[#5865F2] text-[9px] text-white font-bold">APP</span>
                  </div>
                  <div className="pl-8 text-xs whitespace-pre-line leading-relaxed">
                    {preview.slackDiscord}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Broadcast History Log */}
          <div className="pt-3 border-t border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Recent Dispatches ({announcements.length} sent):
            </span>
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5 text-[11px]">
                  <span className="font-medium text-slate-200 truncate max-w-[280px]">{ann.title}</span>
                  <span className="text-[10px] font-mono text-cyan-400">{ann.deliveredCount} Delivered ({ann.timestamp})</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
