import React from 'react';
import { LucideIcon, Minus, Plus } from 'lucide-react';

interface ScenarioSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: LucideIcon;
  description?: string;
  color?: string;
}

export const ScenarioSlider: React.FC<ScenarioSliderProps> = ({
  label,
  value,
  onChange,
  icon: Icon,
  description,
  color = 'emerald'
}) => {
  const handleIncrement = () => {
    onChange(Math.min(100, value + 5));
  };

  const handleDecrement = () => {
    onChange(Math.max(0, value - 5));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{label}</h4>
            {description && <p className="text-[11px] text-slate-500">{description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 min-w-[54px] text-center">
            {value}%
          </span>
        </div>
      </div>

      {/* Slider & Quick Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= 0}
          className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="-5%"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="grow h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= 100}
          className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="+5%"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ScenarioSlider;
