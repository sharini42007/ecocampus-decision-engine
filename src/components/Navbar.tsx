import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Settings,
  ShieldCheck,
  AlertTriangle,
  Building,
  CheckCircle2,
  X
} from 'lucide-react';
import type { RiskAlertItem } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  risks?: RiskAlertItem[];
  onOpenJavaModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  risks = [],
  onOpenJavaModal
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const highRisks = risks.filter((r) => r.severity === 'HIGH');

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              EcoCampus Decision Engine
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" /> Live SQLite Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Campus Sustainability Intelligence • <span className="text-slate-700 font-semibold">Chennai Institute of Technology</span>
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
            }}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            title="Environmental Risk Alerts"
          >
            <Bell className="w-5 h-5" />
            {risks.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                {risks.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Environmental Risk Alerts ({risks.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 mt-2">
                {risks.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    All environmental indicators are within safe limits.
                  </p>
                ) : (
                  risks.slice(0, 5).map((risk) => (
                    <div key={risk.id} className="py-2.5 text-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-800">{risk.title}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            risk.severity === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {risk.severity}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {risk.description}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <span className="text-[11px] font-semibold text-emerald-600">
                  Engine monitors SQLite records continuously
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Settings Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
            }}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="System Info & Preferences"
          >
            <Settings className="w-5 h-5" />
          </button>

          {showSettings && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  System Architecture
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-3 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Course:</span>
                  <span className="font-bold text-slate-800">Java Programming PBL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Institution:</span>
                  <span className="font-bold text-slate-800">Chennai Inst. of Tech.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Database:</span>
                  <span className="font-mono font-bold text-emerald-600">SQLite (WAL Mode)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Backend API:</span>
                  <span className="font-mono font-bold text-slate-800">Express / REST</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSettings(false);
                  onOpenJavaModal();
                }}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-emerald-700 transition-colors text-center"
              >
                View Spring Boot Migration Guide
              </button>
            </div>
          )}
        </div>

        {/* Profile / Avatar Badge */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-emerald-400 font-bold text-xs flex items-center justify-center border border-slate-800 shadow-xs">
            CIT
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">CIT Chennai</p>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">PBL Reviewer</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
