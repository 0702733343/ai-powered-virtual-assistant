import { useState } from 'react';
import { X, Check, Phone, Info, Box } from 'lucide-react';
import { CONTAINER_COLORS, COMPANY_PROFILE } from '../data/protocol';
import { ContainerGraphic } from './ContainerGraphic';

interface ColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutColor: (colorName: string) => void;
}

export function ColorModal({ isOpen, onClose, onAskAboutColor }: ColorModalProps) {
  const [selectedColor, setSelectedColor] = useState(CONTAINER_COLORS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Cymbal Storage Container Color Catalog
              </h2>
              <p className="text-xs text-slate-400">
                Official Production Standards &bull; Typically Blue or Green &bull; Occasionally Red
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close color catalog modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Notification banner */}
          <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-200 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-100">Standard Container Policy:</span> Cymbal storage containers are manufactured primarily in <strong>blue or green</strong>, and occasionally in <strong>red</strong>. For specific batch availability or special orders, please call us directly at{' '}
              <a href={`tel:${COMPANY_PROFILE.phoneClean}`} className="underline font-bold text-amber-300">
                {COMPANY_PROFILE.phone}
              </a>.
            </div>
          </div>

          {/* Color Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CONTAINER_COLORS.map((col) => {
              const isSelected = selectedColor.name === col.name;
              return (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col)}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-blue-400 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shadow-inner"
                        style={{ backgroundColor: col.colorHex }}
                      />
                      <span className="font-semibold text-sm text-white">{col.name}</span>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        col.frequency === 'Typical'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                          : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                      }`}
                    >
                      {col.frequency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{col.description}</p>
                </button>
              );
            })}
          </div>

          {/* Active Color Preview Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            {/* Visual Isometric Container Graphic */}
            <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-900/80 rounded-xl p-4 border border-slate-800">
              <ContainerGraphic colorHex={selectedColor.colorHex} className="w-full h-48" />
              <div className="mt-2 text-center">
                <span className="text-xs font-semibold text-slate-300">{selectedColor.name} Container</span>
                <p className="text-[11px] text-slate-500">Corrugated Heavy-Gauge Structural Shell</p>
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white">{selectedColor.name}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${selectedColor.accentBg}`}>
                    {selectedColor.frequency === 'Typical' ? 'Standard Core Run' : 'Occasional Specialty Batch'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{selectedColor.description}</p>

                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Standard Applications &amp; Uses
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedColor.applications.map((app, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    onAskAboutColor(`Can you tell me more about your ${selectedColor.name.toLowerCase()} containers?`);
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                >
                  Ask Assistant About {selectedColor.name}
                </button>

                <a
                  href={`tel:${COMPANY_PROFILE.phoneClean}`}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {COMPANY_PROFILE.phone} for Batch Availability</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Primary production: Blue &amp; Green &bull; Occasional: Red</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
