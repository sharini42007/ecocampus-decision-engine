import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  color?: 'emerald' | 'blue' | 'cyan' | 'amber' | 'indigo' | 'emerald';
  progress?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit = '%',
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'emerald',
  progress
}) => {
  const colorSchemes = {
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      bar: 'bg-emerald-500',
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-700',
      border: 'border-blue-200/80',
      bar: 'bg-blue-500',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-700',
      border: 'border-cyan-200/80',
      bar: 'bg-cyan-500',
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-700',
      border: 'border-amber-200/80',
      bar: 'bg-amber-500',
    },
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-700',
      border: 'border-indigo-200/80',
      bar: 'bg-indigo-500',
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.emerald;
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const progressValue = progress !== undefined ? progress : numValue;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{value}</span>
            {unit && <span className="text-sm font-semibold text-slate-600">{unit}</span>}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg ${scheme.bg} ${scheme.text} border ${scheme.border}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-3.5 space-y-1">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${scheme.bar} transition-all duration-500 rounded-full`}
              style={{ width: `${Math.min(100, Math.max(0, progressValue))}%` }}
            />
          </div>
        </div>
      )}

      {(trend || subtitle) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>{subtitle || 'Campus Benchmark'}</span>
          {trend && (
            <span className={`inline-flex items-center gap-0.5 font-semibold ${trendPositive ? 'text-emerald-700' : 'text-red-700'}`}>
              {trendPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
