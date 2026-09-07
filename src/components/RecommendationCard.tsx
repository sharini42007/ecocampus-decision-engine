import React from 'react';
import {
  Sun,
  Droplets,
  Recycle,
  Cpu,
  Trees,
  ArrowUpRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import type { RecommendationItem } from '../types';

interface RecommendationCardProps {
  recommendation: RecommendationItem;
  onApplyAction?: (rec: RecommendationItem) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onApplyAction
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'renewable energy':
      case 'energy':
        return Sun;
      case 'water':
        return Droplets;
      case 'waste recycling':
      case 'waste':
        return Recycle;
      case 'energy efficiency':
        return Cpu;
      case 'greenery':
      case 'environment':
        return Trees;
      default:
        return Sparkles;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOW':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const Icon = getCategoryIcon(recommendation.category);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {recommendation.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityStyle(recommendation.priority)}`}>
              {recommendation.priority} PRIORITY
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-xs">
              {recommendation.expected_improvement} Pts
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-bold text-slate-900 mb-1.5">{recommendation.title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">{recommendation.description}</p>

        {/* Analytical Justification / Reason */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70 mb-3 space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Engine Justification:</p>
          <p className="text-xs text-slate-700 italic">"{recommendation.reason}"</p>
        </div>

        {/* Recommended Action */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recommended Action:</p>
          <p className="text-xs font-medium text-slate-800 flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
            <span>{recommendation.recommended_action}</span>
          </p>
        </div>
      </div>

      {/* Action footer */}
      {onApplyAction && (
        <div className="pt-3 border-t border-slate-100 mt-2">
          <button
            onClick={() => onApplyAction(recommendation)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg bg-slate-900 hover:bg-emerald-700 text-white transition-all shadow-xs"
          >
            <span>Simulate this Intervention</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
