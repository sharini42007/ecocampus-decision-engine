import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  FileText,
  Building,
  Award,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { getReports } from '../services/api';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReport(data);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!report) return;

    // Build CSV content
    const headers = ['Department', 'Score', 'Electricity', 'Water', 'Waste Recycling', 'Renewable Energy', 'Green Coverage', 'Status'];
    const rows = (report.departments || []).map((d: any) => [
      `"${d.name}"`,
      d.score,
      d.electricity || 0,
      d.water || 0,
      `${d.wasteRecycling || 0}%`,
      `${d.renewableEnergy || 0}%`,
      `${d.greenCoverage || 0}%`,
      `"${d.status}"`
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `Campus Sustainability Report - Chennai Institute of Technology\n`;
    csvContent += `Generated On: ${new Date().toISOString()}\n`;
    csvContent += `Overall Campus Score: ${report.overallScore} / 100 (${report.status})\n\n`;
    csvContent += headers.join(',') + '\n';
    rows.forEach((row: any) => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EcoCampus_Sustainability_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-500 text-xs">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Compiling comprehensive campus dossier...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Non-printed Toolbar */}
      <div className="print:hidden bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
              Formal Institutional Dossier
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Chennai Institute of Technology</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Comprehensive Sustainability Report
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Complete executive audit document with department rankings, telemetry benchmarks, risk detections, and investment recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReportData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-300"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header with College Letterhead */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-black text-lg sm:text-xl uppercase tracking-wider">
                <GraduationCap className="w-6 h-6" />
                <span>Chennai Institute of Technology (Autonomous)</span>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-0.5">
                Sarathy Nagar, Kundrathur, Chennai, Tamil Nadu – 600069
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                PBL Course – JAVA PROGRAMMING • Project: <strong className="text-slate-800">EcoCampus Decision Engine</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded bg-slate-100 text-slate-800 font-mono text-xs font-bold border border-slate-300">
                AUDIT REF: CIT-SUS-2026
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Generated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                ANNUAL CAMPUS SUSTAINABILITY AUDIT REPORT
              </h1>
              <p className="text-xs text-slate-600">
                Evaluation of Academic Wings: ECE, IT, CSE, and MECH
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-500 font-bold block">COMPOSITE SCORE</span>
                <span className="text-3xl font-black text-slate-900 font-mono">
                  {report?.overallScore}
                </span>
                <span className="text-xs font-bold text-slate-500"> / 100</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold uppercase">
                {report?.status}
              </div>
            </div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1">
            <Award className="w-4 h-4 text-emerald-600" />
            1. Executive Performance Summary
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            The EcoCampus Decision Engine evaluated telemetry across four core academic units using a weighted multi-criteria decision algorithm (Electricity: 20%, Water: 15%, Waste Recycling: 20%, Transportation: 15%, Green Coverage: 15%, Renewable Energy: 15%). The institution achieved a composite score of <strong>{report?.overallScore}/100</strong>, earning the designation of <strong>{report?.status}</strong>.
          </p>
        </section>

        {/* 2. Department Rankings Table */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1">
            <Building className="w-4 h-4 text-emerald-600" />
            2. Department Sustainability Ranking & Metric Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3 text-center">Electricity</th>
                  <th className="py-2.5 px-3 text-center">Water</th>
                  <th className="py-2.5 px-3 text-center">Recycling</th>
                  <th className="py-2.5 px-3 text-center">Renewable</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(report?.departments || []).map((dept: any, idx: number) => (
                  <tr key={dept.id} className={idx === 0 ? 'bg-emerald-50/40 font-semibold' : ''}>
                    <td className="py-2 px-3 text-center font-bold font-mono">#{idx + 1}</td>
                    <td className="py-2 px-3">{dept.name}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold">{dept.score}</td>
                    <td className="py-2 px-3 text-center font-mono">{dept.electricity || 0}</td>
                    <td className="py-2 px-3 text-center font-mono">{dept.water || 0}</td>
                    <td className="py-2 px-3 text-center font-mono">{dept.wasteRecycling || 0}%</td>
                    <td className="py-2 px-3 text-center font-mono">{dept.renewableEnergy || 0}%</td>
                    <td className="py-2 px-3 text-center">{dept.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Risk Alerts */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            3. Active Environmental Risk Registry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(report?.riskAlerts || []).map((risk: any) => (
              <div key={risk.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span>{risk.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    {risk.severity}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{risk.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Strategic Recommendations & Predictive Trajectory */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            4. Recommended Capital Interventions & 6-Month Projection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {(report?.recommendations || []).slice(0, 3).map((rec: any) => (
              <div key={rec.id} className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{rec.title}</span>
                  <span className="text-emerald-700">{rec.expected_improvement}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{rec.description}</p>
                <p className="text-[10px] text-slate-500 italic mt-1">Action: {rec.recommended_action}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between mt-4">
            <div>
              <p className="text-xs font-bold text-emerald-400">Forecast Model Output (6 Months)</p>
              <p className="text-xs text-slate-300">
                Executing the above solar and recycling investments is projected to lift the score from <strong>87</strong> to <strong>94 (+7 pts)</strong>.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono font-bold text-white">94/100</span>
              <span className="block text-[10px] text-emerald-400 font-bold uppercase">Advanced Green Campus</span>
            </div>
          </div>
        </section>

        {/* Signatures & Certification */}
        <div className="pt-12 border-t-2 border-slate-200 grid grid-cols-3 gap-8 text-center text-xs text-slate-600">
          <div>
            <div className="h-10 border-b border-slate-300"></div>
            <p className="font-bold text-slate-800 mt-2">PBL Student Investigator</p>
            <p className="text-[11px] text-slate-500">Java Programming PBL Course</p>
          </div>
          <div>
            <div className="h-10 border-b border-slate-300"></div>
            <p className="font-bold text-slate-800 mt-2">Faculty Project Guide</p>
            <p className="text-[11px] text-slate-500">Dept. of Computer Science & Engg.</p>
          </div>
          <div>
            <div className="h-10 border-b border-slate-300"></div>
            <p className="font-bold text-slate-800 mt-2">Campus Sustainability Dean</p>
            <p className="text-[11px] text-slate-500">Chennai Institute of Technology</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
