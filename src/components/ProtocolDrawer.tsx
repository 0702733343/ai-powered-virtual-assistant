import { X, CheckCircle2, AlertTriangle, Phone, Sparkles, Shield, Wrench, Palette, BookOpen } from 'lucide-react';
import { PROTOCOL_RULES, COMPANY_PROFILE } from '../data/protocol';

interface ProtocolDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export function ProtocolDrawer({ isOpen, onClose, onSelectPrompt }: ProtocolDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Cymbal Manufacturing Operating Protocol
              </h2>
              <p className="text-xs text-slate-400">
                Official Assistant Instructions, Behavioral Boundaries &amp; Verification Tests
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close protocol modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-slate-800/80">
          {/* Quick Summary Pill Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-2">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                Primary Business
              </div>
              <p className="text-sm font-medium text-slate-200">Storage Containers Primarily</p>
              <p className="text-xs text-slate-400 mt-0.5">Custom machining available upon request</p>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Palette className="w-3.5 h-3.5" />
                Colors
              </div>
              <p className="text-sm font-medium text-slate-200">Blue or Green (Typically)</p>
              <p className="text-xs text-slate-400 mt-0.5">Occasionally red</p>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Phone className="w-3.5 h-3.5" />
                Direct Escalation
              </div>
              <p className="text-sm font-medium text-slate-200">{COMPANY_PROFILE.phone}</p>
              <p className="text-xs text-slate-400 mt-0.5">Mandatory for machining &amp; unverified queries</p>
            </div>
          </div>

          {/* Detailed Directives */}
          {PROTOCOL_RULES.map((rule) => (
            <div key={rule.id} className="pt-5 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100 text-sm">{rule.title}</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                    {rule.badge}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onSelectPrompt(rule.samplePrompt);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-md border border-blue-500/30 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Test this rule</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-2 leading-relaxed">{rule.directive}</p>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-400 shrink-0">Sample Prompt:</span>
                  <span className="text-slate-200 italic">"{rule.samplePrompt}"</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-400 shrink-0">Expected Rule Action:</span>
                  <span className="text-slate-300">{rule.sampleExpected}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Machining Protocol Warning */}
          <div className="pt-5">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-300 block mb-1">Strict Machining Protocol Notice:</strong>
                Under no circumstances does this assistant produce custom machining quotes, dimensional tolerances, or job promises in the chat session. All machining requests are immediately routed to{' '}
                <a href={`tel:${COMPANY_PROFILE.phoneClean}`} className="underline font-bold text-amber-300">
                  {COMPANY_PROFILE.phone}
                </a>.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Active Assistant Model: Gemini 3.8 Flash</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
