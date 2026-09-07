import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Database,
  TrendingUp,
  Sliders,
  Lightbulb,
  FileText,
  Code2,
  Leaf,
  X,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenJavaModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  onOpenJavaModal
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'sustainability', label: 'Sustainability Data', icon: Database },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'scenarios', label: 'Scenario Simulator', icon: Sliders },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 shadow-md">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-sans">
                  EcoCampus
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PBL
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide">
                Decision Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* College & Course Info Pill */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/60">
          <div className="flex items-start gap-2 text-[11px] text-slate-300">
            <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Chennai Institute of Tech.</p>
              <p className="text-[10px] text-emerald-400 font-mono">JAVA PROGRAMMING PBL</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md font-bold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Java PBL Bridge Button */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/40">
          <button
            onClick={onOpenJavaModal}
            className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-white">Java PBL Architecture</p>
                <p className="text-[10px] text-slate-400">Spring Boot Mapping</p>
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Guide
            </span>
          </button>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-900 text-center">
          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-slate-900 text-slate-400 border border-slate-800">
            PROTOTYPE SAMPLE DATA
          </span>
          <p className="text-[10px] text-slate-300 mt-2">
            EcoCampus Decision Engine v1.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
