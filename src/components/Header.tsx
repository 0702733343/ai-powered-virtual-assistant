import { useState } from 'react';
import { Phone, ShieldCheck, Volume2, VolumeX, FileText, Check, Copy, ExternalLink, HelpCircle } from 'lucide-react';
import { COMPANY_PROFILE } from '../data/protocol';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenProtocol: () => void;
  onOpenColorDrawer: () => void;
  onExportTranscript: () => void;
  messageCount: number;
}

export function Header({
  soundEnabled,
  onToggleSound,
  onOpenProtocol,
  onOpenColorDrawer,
  onExportTranscript,
  messageCount,
}: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(COMPANY_PROFILE.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      {/* Top Hotline Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-300">Cymbal Manufacturing Verified Assistant</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Storage Containers Primarily &amp; Custom Machining by Request</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-400 hidden md:inline">Direct Company Line:</span>
            <a
              href={`tel:${COMPANY_PROFILE.phoneClean}`}
              className="inline-flex items-center gap-1.5 font-bold text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30"
              title="Click to dial (333) 333-3333"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{COMPANY_PROFILE.phone}</span>
            </a>
            <button
              onClick={handleCopyPhone}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              title="Copy phone number"
              aria-label="Copy phone number"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-0.5 shadow-lg shadow-blue-900/30 flex items-center justify-center border border-blue-400/30">
            <div className="w-full h-full bg-slate-900 rounded-[6px] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-6 h-4 bg-blue-500 rounded-sm flex items-center justify-center text-[7px] font-black tracking-widest text-slate-950">
                CYM
              </div>
              <div className="w-4 h-0.5 bg-amber-400 mt-1 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Cymbal Manufacturing</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/30 hidden xs:inline-block">
                Virtual Assistant
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Industrial Storage Containers &bull; Verified Guidance</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Container Specs Button */}
          <button
            onClick={onOpenColorDrawer}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-colors shadow-sm"
            title="View standard container colors & specifications"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-1" />
            <span className="w-2 h-2 rounded-full bg-rose-500 -ml-1" />
            <span className="ml-1">Container Colors</span>
          </button>

          {/* Operating Protocol Drawer Button */}
          <button
            onClick={onOpenProtocol}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-950/60 hover:bg-blue-900/80 rounded-lg border border-blue-700/50 transition-colors shadow-sm"
            title="View Compliance Protocol & Guidelines"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">Protocol &amp; Rules</span>
            <span className="md:hidden">Rules</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Export Transcript */}
          {messageCount > 1 && (
            <button
              onClick={onExportTranscript}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors hidden sm:inline-flex"
              title="Export chat transcript"
              aria-label="Export chat transcript"
            >
              <FileText className="w-4 h-4" />
            </button>
          )}

          {/* Phone Call CTA */}
          <a
            href={`tel:${COMPANY_PROFILE.phoneClean}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span className="hidden lg:inline">Call Hotline</span>
            <span className="lg:hidden">(333) 333-3333</span>
          </a>
        </div>
      </div>
    </header>
  );
}
