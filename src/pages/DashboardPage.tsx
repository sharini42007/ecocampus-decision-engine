import React, { useState, useEffect } from 'react';
import {
  Zap,
  Droplets,
  Recycle,
  Sun,
  Trees,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { getDashboard } from '../services/api';
import type { DashboardData, Department } from '../types';

import ScoreGauge from '../components/ScoreGauge';
import StatCard from '../components/StatCard';
import DepartmentRanking from '../components/DepartmentRanking';
import EnvironmentalChart from '../components/EnvironmentalChart';
import TrendChart from '../components/TrendChart';
import RiskAlert from '../components/RiskAlert';

interface DashboardPageProps {
  onNavigateToDepartments: () => void;
  onSelectDepartmentForDetail: (dept: Department) => void;
  onNavigateToSimulate: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToDepartments,
  onSelectDepartmentForDetail,
  onNavigateToSimulate
}) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Connecting to SQLite & Calculating Campus Scores...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl border border-red-200 p-8 text-center shadow-lg">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Backend Connection Error</h3>
        <p className="text-xs text-slate-600 mb-6">{error || 'Unable to retrieve dashboard metrics'}</p>
        <button
          onClick={fetchDashboard}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Heading Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
              Academic Session 2025–2026
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Chennai Institute of Technology</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Campus Sustainability Overview
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Real-time decision intelligence engine aggregating environmental telemetry, weighted multi-criteria scoring, and predictive interventions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboard}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Refresh Metrics from SQLite"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateToSimulate}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Launch What-If Simulator</span>
          </button>
        </div>
      </div>

      {/* Primary KPI & Gauge Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Circular Sustainability Score Gauge */}
        <div className="lg:col-span-1">
          <ScoreGauge
            score={data.overallScore}
            maxScore={100}
            status={data.status}
            size={220}
          />
        </div>

        {/* 5 Indicator KPI Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            title={data.kpis.electricityEfficiency.label}
            value={data.kpis.electricityEfficiency.value}
            unit={data.kpis.electricityEfficiency.unit}
            subtitle="Campus Avg Efficiency"
            icon={Zap}
            trend={data.kpis.electricityEfficiency.trend}
            trendPositive={true}
            color="amber"
            progress={data.kpis.electricityEfficiency.value}
          />
          <StatCard
            title={data.kpis.waterEfficiency.label}
            value={data.kpis.waterEfficiency.value}
            unit={data.kpis.waterEfficiency.unit}
            subtitle="Conservation Index"
            icon={Droplets}
            trend={data.kpis.waterEfficiency.trend}
            trendPositive={true}
            color="blue"
            progress={data.kpis.waterEfficiency.value}
          />
          <StatCard
            title={data.kpis.wasteRecycling.label}
            value={data.kpis.wasteRecycling.value}
            unit={data.kpis.wasteRecycling.unit}
            subtitle="Segregation & Reuse"
            icon={Recycle}
            trend={data.kpis.wasteRecycling.trend}
            trendPositive={true}
            color="emerald"
            progress={data.kpis.wasteRecycling.value}
          />
          <StatCard
            title={data.kpis.renewableEnergy.label}
            value={data.kpis.renewableEnergy.value}
            unit={data.kpis.renewableEnergy.unit}
            subtitle="Solar & Clean Grid"
            icon={Sun}
            trend={data.kpis.renewableEnergy.trend}
            trendPositive={true}
            color="amber"
            progress={data.kpis.renewableEnergy.value}
          />
          <StatCard
            title={data.kpis.greenCoverage.label}
            value={data.kpis.greenCoverage.value}
            unit={data.kpis.greenCoverage.unit}
            subtitle="Canopy & Micro-forest"
            icon={Trees}
            trend={data.kpis.greenCoverage.trend}
            trendPositive={true}
            color="indigo"
            progress={data.kpis.greenCoverage.value}
          />
          {/* Quick Highlight Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-5 text-white flex flex-col justify-between shadow-xs border border-slate-800">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
                <Award className="w-4 h-4" />
                <span>Top Performing Unit</span>
              </div>
              <p className="text-xl font-extrabold text-white">
                {data.mostSustainableDepartment.name} Department
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Rating Score: <span className="text-emerald-400 font-bold">{data.mostSustainableDepartment.score}/100</span> (Excellent)
              </p>
            </div>
            <button
              onClick={onNavigateToDepartments}
              className="mt-3 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              Compare All Departments →
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section: Department Ranking + Multi-Indicator Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Ranking Table */}
        <div className="lg:col-span-5">
          <DepartmentRanking
            departments={data.rankedDepartments}
            onSelectDepartment={(dept) => onSelectDepartmentForDetail(dept)}
          />
        </div>

        {/* Environmental Indicators Multi-mode Chart */}
        <div className="lg:col-span-7">
          <EnvironmentalChart data={data.environmentalIndicators} />
        </div>
      </div>

      {/* Bottom Section: Trend Chart + Risk Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sustainability Trend Line Chart */}
        <div className="lg:col-span-7">
          <TrendChart data={data.trendData} />
        </div>

        {/* Environmental Risk Alerts */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs h-full flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Active Environmental Risks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rule-based threshold alerts computed from latest readings
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {data.riskAlerts.length} Detected
              </span>
            </div>

            <div className="grow overflow-y-auto max-h-[360px] pr-1">
              <RiskAlert alerts={data.riskAlerts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
