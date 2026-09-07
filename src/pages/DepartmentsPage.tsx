import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Droplets,
  Recycle,
  Sun,
  Trees,
  Car,
  BarChart2,
  RefreshCw,
  Clock,
  ShieldCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getDepartments, getDepartment } from '../services/api';
import type { Department } from '../types';

interface DepartmentsPageProps {
  selectedDeptInitial?: Department | null;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ selectedDeptInitial }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'waste' | 'electricity'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [deptDetails, setDeptDetails] = useState<any>(null);

  const fetchDepartmentsData = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data);
      if (selectedDeptInitial) {
        setSelectedDept(selectedDeptInitial);
      } else if (data.length > 0 && !selectedDept) {
        setSelectedDept(data[0]);
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentsData();
  }, []);

  useEffect(() => {
    if (selectedDept) {
      loadDepartmentDetails(selectedDept.id);
    }
  }, [selectedDept]);

  const loadDepartmentDetails = async (id: number) => {
    try {
      setDetailLoading(true);
      const details = await getDepartment(id);
      setDeptDetails(details);
    } catch (err) {
      console.error('Failed to load department details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = departments
    .filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let aVal: any = a.score;
      let bVal: any = b.score;

      if (sortBy === 'name') {
        aVal = a.name;
        bVal = b.name;
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (sortBy === 'waste') {
        aVal = a.wasteRecycling || 0;
        bVal = b.wasteRecycling || 0;
      }
      if (sortBy === 'electricity') {
        aVal = a.electricity || 0;
        bVal = b.electricity || 0;
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const comparisonChartData = departments.map((d) => ({
    name: d.name,
    Score: d.score,
    Electricity: d.electricity || 0,
    Water: d.water || 0,
    'Waste Recycling': d.wasteRecycling || 0,
    'Renewable Energy': d.renewableEnergy || 0,
    'Green Coverage': d.greenCoverage || 0
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 uppercase tracking-wider">
              Academic Wings Evaluation
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Chennai Institute of Technology</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Academic Departments Sustainability
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Multi-department comparison across ECE, IT, CSE, and MECH. Search, sort, and inspect telemetry records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDepartmentsData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh from Database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search departments (e.g., ECE, CSE)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs rounded-lg border border-slate-200 py-1.5 px-2.5 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="score">Sustainability Score</option>
              <option value="name">Department Name</option>
              <option value="waste">Waste Recycling</option>
              <option value="electricity">Electricity</option>
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Department Cards & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Cards Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((dept) => {
              const isSelected = selectedDept?.id === dept.id;
              const isHighest = dept.score >= 90;

              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDept(dept)}
                  className={`bg-white rounded-xl border p-5 shadow-xs cursor-pointer transition-all hover:shadow-md relative ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
                        {isHighest && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-600 text-white">
                            #1 Top
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">Department of Engineering</p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900 font-mono">
                        {dept.score}
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase">
                        {dept.status}
                      </span>
                    </div>
                  </div>

                  {/* Indicator Chips */}
                  <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-slate-100">
                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-600 block">Electricity</span>
                      <span className="font-mono font-bold text-slate-800">{dept.electricity || 0}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-600 block">Water</span>
                      <span className="font-mono font-bold text-slate-800">{dept.water || 0}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                      <span className="text-[10px] text-slate-600 block">Recycling</span>
                      <span className="font-mono font-bold text-slate-800">{dept.wasteRecycling || 0}%</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Renewable: <strong className="text-slate-800">{dept.renewableEnergy || 0}%</strong></span>
                    <span className="text-emerald-700 font-semibold">
                      {isSelected ? 'Currently Viewing •' : 'Click to inspect →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Department Comparison Chart */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Cross-Department Environmental Indicator Comparison
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Compare telemetry metrics between ECE, IT, CSE, and MECH
            </p>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Score" fill="#0F172A" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Waste Recycling" fill="#10B981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Renewable Energy" fill="#0284C7" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Electricity" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Inspection Panel (Right Column) */}
        <div className="lg:col-span-5">
          {selectedDept ? (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-6 sticky top-20">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Detailed Inspection
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {selectedDept.name} Department
                  </h3>
                  <p className="text-xs text-slate-500">Telemetry & Performance Dossier</p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900 font-mono">
                    {selectedDept.score}
                  </div>
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    {selectedDept.status}
                  </span>
                </div>
              </div>

              {/* Indicator Progress List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Environmental Indicators Breakdown
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> Electricity Efficiency (Weight: 20%)
                      </span>
                      <span className="font-mono font-bold text-slate-900">{selectedDept.electricity || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${selectedDept.electricity || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Droplets className="w-3.5 h-3.5 text-blue-500" /> Water Efficiency (Weight: 15%)
                      </span>
                      <span className="font-mono font-bold text-slate-900">{selectedDept.water || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${selectedDept.water || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Recycle className="w-3.5 h-3.5 text-emerald-500" /> Waste Recycling Rate (Weight: 20%)
                      </span>
                      <span className="font-mono font-bold text-slate-900">{selectedDept.wasteRecycling || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${selectedDept.wasteRecycling || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Car className="w-3.5 h-3.5 text-purple-500" /> Transportation Impact (Weight: 15%)
                      </span>
                      <span className="font-mono font-bold text-slate-900">{selectedDept.transportation || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${selectedDept.transportation || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Trees className="w-3.5 h-3.5 text-green-500" /> Green Canopy Coverage (Weight: 15%)
                      </span>
                      <span className="font-mono font-bold text-slate-900">{selectedDept.greenCoverage || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${selectedDept.greenCoverage || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Sun className="w-3.5 h-3.5 text-yellow-500" /> Renewable Energy Share (Weight: 15%)
                      </span>
                      <span className="font-mono font-bold text-slate-900">{selectedDept.renewableEnergy || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${selectedDept.renewableEnergy || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Specific Risk Alerts */}
              {deptDetails?.risks && deptDetails.risks.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Department Risk Factors
                  </h4>
                  <div className="space-y-2">
                    {deptDetails.risks.map((r: any) => (
                      <div key={r.id} className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs">
                        <div className="flex items-center justify-between font-bold text-amber-900 mb-0.5">
                          <span>{r.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold">
                            {r.severity}
                          </span>
                        </div>
                        <p className="text-amber-800 text-[11px]">{r.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              Select a department card to inspect detailed indicators and risks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
