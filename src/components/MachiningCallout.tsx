import { Wrench, Phone, AlertCircle, ArrowUpRight } from 'lucide-react';
import { COMPANY_PROFILE } from '../data/protocol';

interface MachiningCalloutProps {
  onInquireMachining: () => void;
}

export function MachiningCallout({ onInquireMachining }: MachiningCalloutProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-4 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
          <Wrench className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Custom Machining Capability</span>
            </h3>
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
              By Request
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            While Cymbal Manufacturing primarily builds storage containers, we are also equipped for custom machining upon request. Per official protocol, all machining jobs, tolerances, and pricing require phone consultation.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${COMPANY_PROFILE.phoneClean}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Call {COMPANY_PROFILE.phone}</span>
            </a>

            <button
              onClick={onInquireMachining}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors"
            >
              <span>Test Chat Escalation</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
