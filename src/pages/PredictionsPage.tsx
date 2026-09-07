import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Info,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { getPredictions } from '../services/api';
import type { PredictionData } from '../types';

export const PredictionsPage: React.FC = () => {
  const [horizon, setHorizon] = useState<string>('6 Months');
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPrediction = async (selectedHorizon: string) => {
    try {
      setLoading(true);
      const res = await getPredictions(selectedHorizon);
      setData(res);
    } catch (err) {
      console.error('Failed to load predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction(horizon);
  }, [horizon]);

  const horizons = ['1 Month', '3 Months', '6 Months', '1 Year'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl border border-slate-800 space-y-1">
          <p className="font-bold text-slate-300 border-b border-slate-800 pb-1">{label}</p>
          <p className="font-mono font-bold text-emerald-400">
            Score: {payload[0].value} / 100
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
              Intelligent Forecasting Model
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Chennai Institute of Technology</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Future Sustainability Prediction
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Forecasted campus ratings based on planned clean energy interventions and indicator trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchPrediction(horizon)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Prediction"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model Transparency Disclaimer Banner */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Transparent Engineering Explanation:</p>
          <p className="text-blue-800 mt-0.5 leading-relaxed">
            Prototype prediction is calculated using current sustainability indicators and predefined improvement assumptions. This deterministic simulation projects institutional trajectory across monthly and quarterly milestones.
          </p>
        </div>
      </div>

      {/* Primary Forecast Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Score */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Score</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 font-mono">
                {data?.currentScore ?? 87}
              </span>
              <span className="text-xs font-bold text-slate-600">/ 100</span>
            </div>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              GREEN CAMPUS
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100">
            Current baseline derived from audited June telemetry
          </p>
        </div>

        {/* Predicted Score */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-6 shadow-md border border-slate-800 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Predicted Score ({horizon})
              </span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white font-mono">
                {data?.predictedScore ?? 94}
              </span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ADVANCED GREEN CAMPUS
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-800">
            Includes targeted Solar Array & Waste Upgrades
          </p>
        </div>

        {/* Expected Improvement */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expected Net Gain</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-emerald-600 font-mono">
                +{data?.improvement ?? 7}
              </span>
              <span className="text-xs font-bold text-emerald-700">Points</span>
            </div>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              +8.05% Efficiency Boost
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100">
            Propels campus into Tier-1 Sustainability status
          </p>
        </div>
      </div>

      {/* Time Horizon Selector & Forecast Chart */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Projected Trajectory Timeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical performance (Jan–Jun) followed by projected milestones
            </p>
          </div>

          {/* Horizon Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {horizons.map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  horizon === h
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Prediction Chart Canvas */}
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data?.timelineData || []} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Green Threshold (80)', position: 'insideTopLeft', fill: '#059669', fontSize: 10 }} />
              <ReferenceLine y={90} stroke="#0284C7" strokeDasharray="3 3" label={{ value: 'Excellence Target (90)', position: 'insideTopLeft', fill: '#0284C7', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#predictionGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Planned Action Milestones for Selected Horizon */}
      {data?.selectedHorizonDetails && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Target Execution Milestones ({horizon})
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Key operational steps required to achieve the predicted score of {data.selectedHorizonDetails.predictedScore}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.selectedHorizonDetails.milestones.map((milestone, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{milestone}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Scheduled for phased rollout across academic and hostel blocks.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionsPage;
