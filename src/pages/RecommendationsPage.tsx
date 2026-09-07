import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Filter,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award
} from 'lucide-react';
import { getRecommendations } from '../services/api';
import type { RecommendationItem } from '../types';
import RecommendationCard from '../components/RecommendationCard';

interface RecommendationsPageProps {
  onSimulateRecommendation: (rec: RecommendationItem) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  onSimulateRecommendation
}) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRecommendations = async (currentFilter: string) => {
    try {
      setLoading(true);
      const data = await getRecommendations(currentFilter);
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(filter);
  }, [filter]);

  const filterOptions = ['All', 'HIGH', 'MEDIUM', 'LOW'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
              Capital Investment Strategy
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Chennai Institute of Technology</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Green Investment Recommendations
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Prioritized capital and operational interventions engineered to maximize campus sustainability score gains and return-on-effort.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRecommendations(filter)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Recommendations"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter by Priority:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  filter === opt
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt === 'All' ? 'All Priorities' : `${opt} Priority`}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{recommendations.length}</strong> prioritized proposals
        </div>
      </div>

      {/* Recommendation Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Evaluating telemetry gaps & generating investment cards...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No recommendations found matching the selected priority filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onApplyAction={() => onSimulateRecommendation(rec)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
