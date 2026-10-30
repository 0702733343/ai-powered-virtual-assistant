import { Sparkles, Palette, Wrench, ShieldAlert, Package, HelpCircle } from 'lucide-react';
import { QUICK_PROMPTS } from '../data/protocol';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export function QuickPrompts({ onSelectPrompt, disabled }: QuickPromptsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'palette':
        return <Palette className="w-3.5 h-3.5 text-blue-400" />;
      case 'wrench':
        return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
      case 'shield-alert':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case 'package':
        return <Package className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="py-2">
      <div className="flex items-center gap-2 mb-2 px-1 text-xs font-semibold text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>Inquire with Cymbal Assistant:</span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700">
        {QUICK_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
            className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 text-xs transition-colors shadow-sm group text-left"
          >
            {getIcon(item.icon)}
            <span className="font-medium group-hover:text-blue-300 transition-colors">
              {item.label}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">[{item.tag}]</span>
          </button>
        ))}
      </div>
    </div>
  );
}
