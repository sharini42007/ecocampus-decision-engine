import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { BarChart3, Radar as RadarIcon, LineChart as LineChartIcon } from 'lucide-react';
import type { EnvironmentalIndicator } from '../types';

interface EnvironmentalChartProps {
  data: EnvironmentalIndicator[];
}

export const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ data = [] }) => {
  const [chartType, setChartType] = useState<'bar' | 'radar' | 'line'>('bar');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl border border-slate-800 space-y-1">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span style={{ color: item.color }} className="font-medium">
                {item.name}:
              </span>
              <span className="font-mono font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-full">
      {/* Header with Chart Type Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Environmental Indicators</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Campus Average vs Benchmark & Institutional Target
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              chartType === 'bar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Bar
          </button>
          <button
            onClick={() => setChartType('radar')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              chartType === 'radar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RadarIcon className="w-3.5 h-3.5" /> Radar
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              chartType === 'line'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" /> Line
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="pt-4 grow min-h-[300px] w-full">
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="indicator"
                tick={{ fontSize: 11, fill: '#64748B' }}
                angle={-15}
                textAnchor="end"
                interval={0}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="campusAverage" name="Campus Average" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmark" name="Benchmark" fill="#64748B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target (2026)" fill="#0284C7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'radar' && (
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="indicator" tick={{ fontSize: 10, fill: '#475569' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Radar
                name="Campus Average"
                dataKey="campusAverage"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.4}
              />
              <Radar
                name="Target (2026)"
                dataKey="target"
                stroke="#0284C7"
                fill="#0284C7"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="indicator"
                tick={{ fontSize: 11, fill: '#64748B' }}
                angle={-15}
                textAnchor="end"
                interval={0}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Line
                type="monotone"
                dataKey="campusAverage"
                name="Campus Average"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5, fill: '#10B981' }}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                name="Benchmark"
                stroke="#64748B"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#64748B' }}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target (2026)"
                stroke="#0284C7"
                strokeWidth={2}
                dot={{ r: 4, fill: '#0284C7' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default EnvironmentalChart;
