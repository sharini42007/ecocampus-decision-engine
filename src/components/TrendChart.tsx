import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { TrendItem } from '../types';

interface TrendChartProps {
  data: TrendItem[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data = [] }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl border border-slate-800 space-y-1">
          <p className="font-bold text-slate-300 border-b border-slate-800 pb-1">{label} 2026</p>
          <p className="text-emerald-400 font-mono font-bold">
            Campus Score: {payload[0].value} / 100
          </p>
          {payload[1] && (
            <p className="text-sky-400 font-mono text-[11px]">
              Institutional Target: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Campus Sustainability Trend
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Progressive monthly evaluation leading to current Green Campus rating (87)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            +9 Pts YTD Gain
          </span>
        </div>
      </div>

      <div className="pt-4 grow min-h-[260px] w-full">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis domain={[70, 95]} tick={{ fontSize: 11, fill: '#64748B' }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={80} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Green Threshold (80)', position: 'insideTopLeft', fill: '#059669', fontSize: 10 }} />
            <Area
              type="monotone"
              dataKey="score"
              name="Sustainability Score"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scoreTrendGradient)"
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
