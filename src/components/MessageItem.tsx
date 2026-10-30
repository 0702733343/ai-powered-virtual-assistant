import { useState } from 'react';
import { Phone, Copy, Check, Volume2, VolumeX, Shield, User, Bot, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { COMPANY_PROFILE } from '../data/protocol';
import { speakText, stopSpeaking } from '../utils/audio';

interface MessageItemProps {
  message: ChatMessage;
  onCallCompany: () => void;
}

export function MessageItem({ message, onCallCompany }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isAssistant = message.role === 'assistant';
  const containsPhone =
    message.content.includes('(333) 333-3333') ||
    message.content.includes('333-3333') ||
    message.content.includes('333 333-3333');

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(message.content, () => {
        setIsSpeaking(false);
      });
    }
  };

  // Helper to format markdown text safely
  const renderFormattedContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      const lines = para.split('\n');
      return (
        <p key={pIdx} className="mb-2 last:mb-0 leading-relaxed">
          {lines.map((line, lIdx) => {
            // Check for list item
            const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            const cleanLine = isBullet ? line.trim().replace(/^[-*]\s+/, '') : line;

            // Highlight bold text & phone number
            const parts = cleanLine.split(/(\*\*.*?\*\*|\(333\)\s*333-3333)/g);

            const renderedLine = parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={partIdx} className="font-bold text-white">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.includes('333-3333') || part.includes('(333) 333-3333')) {
                return (
                  <span
                    key={partIdx}
                    className="font-bold text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/30"
                  >
                    {part}
                  </span>
                );
              }
              return part;
            });

            return (
              <span key={lIdx} className={isBullet ? 'flex items-start gap-2 pl-2 my-1' : 'block'}>
                {isBullet && <span className="text-blue-400 font-bold shrink-0">&bull;</span>}
                <span>{renderedLine}</span>
              </span>
            );
          })}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 my-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-slate-900 border border-blue-400/40 p-0.5 flex-shrink-0 shadow-md">
          <div className="w-full h-full bg-slate-900 rounded-[9px] flex items-center justify-center text-blue-400">
            <Bot className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${
          isAssistant ? 'items-start' : 'items-end'
        }`}
      >
        {/* Name and time */}
        <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">
            {isAssistant ? 'Cymbal Virtual Assistant' : 'You'}
          </span>
          <span>&bull;</span>
          <span>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.status === 'streaming' && (
            <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              Streaming...
            </span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`p-4 rounded-2xl text-sm shadow-md transition-all ${
            isAssistant
              ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
              : 'bg-blue-600 text-white border border-blue-500 rounded-tr-sm'
          }`}
        >
          {renderFormattedContent(message.content)}

          {/* Direct Phone Escalation Card if Phone number mentioned */}
          {isAssistant && containsPhone && (
            <div className="mt-3.5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-2 text-xs text-amber-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">Direct Company Line:</span>
                <span className="text-white font-mono font-bold">{COMPANY_PROFILE.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${COMPANY_PROFILE.phoneClean}`}
                  className="px-2.5 py-1 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Phone className="w-3 h-3 fill-current" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Message Actions Bar */}
        <div className="flex items-center gap-1.5 mt-1 px-1 text-slate-400 text-xs">
          <button
            onClick={handleCopy}
            className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Copy message"
            aria-label="Copy message"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {isAssistant && (
            <button
              onClick={handleToggleSpeak}
              className={`p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors ${
                isSpeaking ? 'text-blue-400' : ''
              }`}
              title={isSpeaking ? 'Stop read aloud' : 'Read aloud'}
              aria-label={isSpeaking ? 'Stop read aloud' : 'Read aloud'}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {isAssistant && (
            <span className="text-[10px] text-slate-500 ml-1">
              Verified &bull; Cymbal Standard Protocol
            </span>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 p-0.5 flex-shrink-0 shadow-md">
          <div className="w-full h-full bg-slate-850 rounded-[9px] flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
