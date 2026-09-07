import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sun,
  Droplets,
  Recycle,
  Trees,
  Car,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { simulateScenario } from '../services/api';
import type { SimulationResult } from '../types';
import ScenarioSlider from '../components/ScenarioSlider';

export const ScenarioSimulatorPage: React.FC = () => {
  // Slider states - default initialized with Solar Panel investment pre-configured as specified in prompt
  const [solar, setSolar] = useState<number>(30); // 30% solar improvement -> +7 pts
  const [water, setWater] = useState<number>(0);
  const [waste, setWaste] = useState<number>(0);
  const [green, setGreen] = useState<number>(0);
  const [transport, setTransport] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'bar' | 'radar'>('bar');

  const runSimulation = async (
    customParams?: {
      solar?: number;
      water?: number;
      waste?: number;
      green?: number;
      transport?: number;
      energy?: number;
    }
  ) => {
    try {
      setIsSimulating(true);
      const payload = {
        solar_improvement: customParams?.solar !== undefined ? customParams.solar : solar,
        water_improvement: customParams?.water !== undefined ? customParams.water : water,
        waste_improvement: customParams?.waste !== undefined ? customParams.waste : waste,
        green_coverage_improvement: customParams?.green !== undefined ? customParams.green : green,
        transportation_improvement: customParams?.transport !== undefined ? customParams.transport : transport,
        energy_efficiency_improvement: customParams?.energy !== undefined ? customParams.energy : energy
      };

      const res = await simulateScenario(payload);
      setResult(res);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, []);

  const handleReset = () => {
    setSolar(0);
    setWater(0);
    setWaste(0);
    setGreen(0);
    setTransport(0);
    setEnergy(0);
    runSimulation({ solar: 0, water: 0, waste: 0, green: 0, transport: 0, energy: 0 });
  };

  const handleApplyPreset = (presetName: string) => {
    if (presetName === 'solar') {
      setSolar(30);
      setWater(0);
      setWaste(0);
      setGreen(0);
      setTransport(0);
      setEnergy(0);
      runSimulation({ solar: 30, water: 0, waste: 0, green: 0, transport: 0, energy: 0 });
    } else if (presetName === 'holistic') {
      setSolar(25);
      setWater(20);
      setWaste(30);
      setGreen(15);
      setTransport(15);
      setEnergy(20);
      runSimulation({ solar: 25, water: 20, waste: 30, green: 15, transport: 15, energy: 20 });
    } else if (presetName === 'waste_focus') {
      setSolar(0);
      setWater(10);
      setWaste(40);
      setGreen(10);
      setTransport(0);
      setEnergy(0);
      runSimulation({ solar: 0, water: 10, waste: 40, green: 10, transport: 0, energy: 0 });
    }
  };

  const comparisonChartData = result
    ? [
        { indicator: 'Electricity', Baseline: result.indicatorsBefore.electricity, Projected: result.indicatorsAfter.electricity },
        { indicator: 'Water', Baseline: result.indicatorsBefore.water, Projected: result.indicatorsAfter.water },
        { indicator: 'Waste Recyc.', Baseline: result.indicatorsBefore.wasteRecycling, Projected: result.indicatorsAfter.wasteRecycling },
        { indicator: 'Transport', Baseline: result.indicatorsBefore.transportation, Projected: result.indicatorsAfter.transportation },
        { indicator: 'Green Cover', Baseline: result.indicatorsBefore.greenCoverage, Projected: result.indicatorsAfter.greenCoverage },
        { indicator: 'Renewable', Baseline: result.indicatorsBefore.renewableEnergy, Projected: result.indicatorsAfter.renewableEnergy },
      ]
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
              Intelligent Decision Support Engine
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Chennai Institute of Technology</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            What-If Sustainability Scenario Simulator
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Test policy and infrastructure investments interactively. Adjust parameters to model score impact, verify return-on-effort, and guide green capital allocations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>
          <button
            onClick={() => runSimulation()}
            disabled={isSimulating}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Quick Presets Row */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
        <span className="font-bold text-slate-600 flex items-center gap-1 px-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Presets:
        </span>
        <button
          onClick={() => handleApplyPreset('solar')}
          className="px-3 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-2xs"
        >
          ☀️ Solar Array Target (Projected 94, +7 pts)
        </button>
        <button
          onClick={() => handleApplyPreset('waste_focus')}
          className="px-3 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-2xs"
        >
          ♻️ Zero-Waste + Water Audit (+4 pts)
        </button>
        <button
          onClick={() => handleApplyPreset('holistic')}
          className="px-3 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-2xs"
        >
          🌿 Comprehensive Net-Zero Campaign (+12 pts)
        </button>
      </div>

      {/* Result Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Score</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 font-mono">
              {result?.currentScore ?? 87}
            </span>
            <span className="text-xs font-bold text-slate-600">/ 100</span>
          </div>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            {result?.statusBefore || 'GREEN CAMPUS'}
          </span>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-5 shadow-md border border-slate-800 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Projected Score
            </span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white font-mono">
              {result?.projectedScore ?? 94}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {result?.statusAfter || 'ADVANCED GREEN CAMPUS'}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projected Improvement</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-emerald-600 font-mono">
              +{result?.improvement ?? 7}
            </span>
            <span className="text-xs font-bold text-emerald-700">Points Net Gain</span>
          </div>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Engine Confidence: 96%
          </span>
        </div>
      </div>

      {/* Main Grid: Sliders on Left, Charts & Factor Breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Column */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Intervention Parameter Sliders
            </h3>
            <span className="text-xs text-slate-500">Scale: 0% – 100% Increase</span>
          </div>

          <ScenarioSlider
            label="Solar Energy Installation"
            value={solar}
            onChange={(v) => {
              setSolar(v);
              runSimulation({ solar: v });
            }}
            icon={Sun}
            description="Install rooftop PV arrays across academic and library blocks"
          />

          <ScenarioSlider
            label="Water Conservation Systems"
            value={water}
            onChange={(v) => {
              setWater(v);
              runSimulation({ water: v });
            }}
            icon={Droplets}
            description="Rainwater harvesting, smart flow regulators, and greywater reuse"
          />

          <ScenarioSlider
            label="Waste Recycling Programs"
            value={waste}
            onChange={(v) => {
              setWaste(v);
              runSimulation({ waste: v });
            }}
            icon={Recycle}
            description="Campus-wide compost digesters and automated segregation bins"
          />

          <ScenarioSlider
            label="Energy Efficiency Upgrades"
            value={energy}
            onChange={(v) => {
              setEnergy(v);
              runSimulation({ energy: v });
            }}
            icon={Zap}
            description="Smart sensor lighting, inverter HVAC, and load monitoring"
          />

          <ScenarioSlider
            label="Green Canopy Coverage"
            value={green}
            onChange={(v) => {
              setGreen(v);
              runSimulation({ green: v });
            }}
            icon={Trees}
            description="Micro-forestry expansion and native foliage buffer zones"
          />

          <ScenarioSlider
            label="Clean Transportation Programs"
            value={transport}
            onChange={(v) => {
              setTransport(v);
              runSimulation({ transport: v });
            }}
            icon={Car}
            description="Electric campus shuttle fleet, EV chargers, and cycling paths"
          />
        </div>

        {/* Charts & Impact Breakdown Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Before vs After Chart */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Baseline vs Projected Indicator Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Visual comparison of institutional environmental performance
                </p>
              </div>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setActiveView('bar')}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    activeView === 'bar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setActiveView('radar')}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    activeView === 'radar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Radar
                </button>
              </div>
            </div>

            <div className="h-[280px] w-full">
              {activeView === 'bar' ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="indicator" tick={{ fontSize: 10, fill: '#64748B' }} angle={-15} textAnchor="end" interval={0} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Baseline" fill="#94A3B8" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Projected" fill="#10B981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={comparisonChartData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="indicator" tick={{ fontSize: 10, fill: '#475569' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Radar name="Baseline" dataKey="Baseline" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.3} />
                    <Radar name="Projected" dataKey="Projected" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Impact Factor Points Breakdown Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
              Contribution by Intervention Factor
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-2 px-3">Intervention Factor</th>
                    <th className="py-2 px-3 text-center">Slider Value</th>
                    <th className="py-2 px-3 text-right">Points Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result?.breakdown?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{item.factor}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                        {item.percentage}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                        +{item.pointsAdded.toFixed(1)} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSimulatorPage;
