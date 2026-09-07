import React from 'react';
import { AlertCircle, AlertTriangle, Info, Clock, Building } from 'lucide-react';
import type { RiskAlertItem } from '../types';

interface RiskAlertProps {
  alerts: RiskAlertItem[];
  compact?: boolean;
}

export const RiskAlert: React.FC<RiskAlertProps> = ({ alerts = [], compact = false }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <AlertCircle className="w-3 h-3" /> HIGH SEVERITY
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3" /> MEDIUM
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Info className="w-3 h-3" /> LOW
          </span>
        );
    }
  };

  const getBorderColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
        return 'border-l-red-500 bg-red-50/30';
      case 'MEDIUM':
        return 'border-l-amber-500 bg-amber-50/30';
      case 'LOW':
      default:
        return 'border-l-blue-500 bg-blue-50/30';
    }
  };

  if (!alerts.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-xs">
        <p className="text-sm text-slate-500 font-medium">No environmental risk alerts detected across campus units.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`bg-white rounded-xl border border-slate-200/80 border-l-4 p-4 shadow-xs transition-all hover:shadow-md ${getBorderColor(
            alert.severity
          )}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
              {alert.department_name && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  <Building className="w-3 h-3 text-slate-400" />
                  {alert.department_name}
                </span>
              )}
            </div>
            {getSeverityBadge(alert.severity)}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>

          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
            <Clock className="w-3 h-3" />
            <span>Logged: {new Date(alert.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiskAlert;
