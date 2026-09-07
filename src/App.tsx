import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import JavaMigrationModal from './components/JavaMigrationModal';

import DashboardPage from './pages/DashboardPage';
import DepartmentsPage from './pages/DepartmentsPage';
import SustainabilityDataPage from './pages/SustainabilityDataPage';
import PredictionsPage from './pages/PredictionsPage';
import ScenarioSimulatorPage from './pages/ScenarioSimulatorPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ReportsPage from './pages/ReportsPage';

import { getRisks } from './services/api';
import type { Department, RecommendationItem, RiskAlertItem } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isJavaModalOpen, setIsJavaModalOpen] = useState<boolean>(false);
  const [selectedDeptForDetail, setSelectedDeptForDetail] = useState<Department | null>(null);
  const [risks, setRisks] = useState<RiskAlertItem[]>([]);

  const loadRisks = async () => {
    try {
      const data = await getRisks();
      setRisks(data);
    } catch (err) {
      console.error('Failed to load risk alerts:', err);
    }
  };

  useEffect(() => {
    loadRisks();
  }, [currentTab]);

  const handleSelectDepartment = (dept: Department) => {
    setSelectedDeptForDetail(dept);
    setCurrentTab('departments');
  };

  const handleSimulateRecommendation = (rec: RecommendationItem) => {
    setCurrentTab('scenarios');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Collapsible Responsive Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenJavaModal={() => setIsJavaModalOpen(true)}
      />

      {/* Main Content Area (offset by 64 Tailwind units on lg screens) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Sticky Top Navbar */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          risks={risks}
          onOpenJavaModal={() => setIsJavaModalOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage
              onNavigateToDepartments={() => setCurrentTab('departments')}
              onSelectDepartmentForDetail={handleSelectDepartment}
              onNavigateToSimulate={() => setCurrentTab('scenarios')}
            />
          )}

          {currentTab === 'departments' && (
            <DepartmentsPage selectedDeptInitial={selectedDeptForDetail} />
          )}

          {currentTab === 'sustainability' && (
            <SustainabilityDataPage />
          )}

          {currentTab === 'predictions' && (
            <PredictionsPage />
          )}

          {currentTab === 'scenarios' && (
            <ScenarioSimulatorPage />
          )}

          {currentTab === 'recommendations' && (
            <RecommendationsPage
              onSimulateRecommendation={handleSimulateRecommendation}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsPage />
          )}
        </main>
      </div>

      {/* Java Spring Boot PBL Architecture Modal */}
      <JavaMigrationModal
        isOpen={isJavaModalOpen}
        onClose={() => setIsJavaModalOpen(false)}
      />
    </div>
  );
}
