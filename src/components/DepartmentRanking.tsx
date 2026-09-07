import React from 'react';
import { Trophy, Award, ArrowUpRight } from 'lucide-react';
import type { Department } from '../types';

interface DepartmentRankingProps {
  departments: Department[];
  onSelectDepartment?: (dept: Department) => void;
}

export const DepartmentRanking: React.FC<DepartmentRankingProps> = ({
  departments = [],
  onSelectDepartment
}) => {
  const sorted = [...departments].sort((a, b) => b.score - a.score);
  const mostSustainable = sorted[0];

  const getStatusBadge = (status: string, score: number) => {
    if (score >= 88 || status === 'Excellent') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          Excellent
        </span>
      );
    }
    if (score >= 80 || status === 'Good') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
          Good
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
        Needs Improvement
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Department Sustainability Ranking
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by multi-criteria environmental performance score
          </p>
        </div>

        {mostSustainable && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-900">
              Most Sustainable: <strong className="font-bold">{mostSustainable.name} ({mostSustainable.score})</strong>
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 w-16 text-center">Rank</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4 text-center">Score</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {sorted.map((dept, index) => {
              const rank = index + 1;
              const isFirst = rank === 1;

              return (
                <tr
                  key={dept.id || dept.name}
                  className={`transition-colors hover:bg-slate-50/80 ${
                    isFirst ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : rank === 2
                          ? 'bg-slate-200 text-slate-800'
                          : rank === 3
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rank}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <span>{dept.name}</span>
                      {isFirst && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-emerald-600 text-white">
                          Top Rank
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-base text-slate-900">
                      {dept.score}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">/100</span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {getStatusBadge(dept.status, dept.score)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {onSelectDepartment ? (
                      <button
                        onClick={() => onSelectDepartment(dept)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                      >
                        Details <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600 font-medium">Synced</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentRanking;
