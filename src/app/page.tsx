'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  GitFork,
  AlertTriangle,
  Flame,
  HardDrive,
  BarChart3,
  Home,
  Sparkles,
  Search,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { WorkspaceTab } from '@/types/drps';
import { useDrpsStore } from '@/hooks/useDrpsStore';
import { LandingOverview } from '@/components/LandingOverview';
import { CommandDashboard } from '@/components/CommandDashboard';
import { UnitsBiaView } from '@/components/UnitsBiaView';
import { AssetBlastRadiusView } from '@/components/AssetBlastRadiusView';
import { RiskRegisterView } from '@/components/RiskRegisterView';
import { IncidentSimulatorView } from '@/components/IncidentSimulatorView';
import { BackupAssuranceView } from '@/components/BackupAssuranceView';
import { EfficiencyStorageView } from '@/components/EfficiencyStorageView';
import { GuidedWalkthroughBar } from '@/components/GuidedWalkthroughBar';

export default function HomeShell() {
  const {
    state,
    isLoaded,
    storageBytes,
    activeTab,
    setActiveTab,
    selectedAssetId,
    setSelectedAssetId,
    selectedUnitIdFilter,
    setSelectedUnitIdFilter,
    aggregateEnterpriseReadiness,
    resetToFactorySeed,
    exportBackupJson,
    exportCsvGovernanceReport,
    importBackupJson,
    updateRisk,
    updateProcess,
    toggleSimulationTask,
    updateSimulationRecoveryMinutes,
    updateUnitReadiness,
    triggerManualBackup,
    setGuidedStep,
    dismissGuidedWalkthrough,
    restoreGuidedWalkthrough,
  } = useDrpsStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECEEEF] text-[#111827]">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white shadow-sm border border-black/[0.04]">
          <div className="w-5 h-5 rounded-full border-2 border-[#103E2E] border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-[#4B5563]">Loading UI Ventures DRPS Console...</span>
        </div>
      </div>
    );
  }

  const primaryNavItems: { id: WorkspaceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'units_bia', label: 'Units & BIA', icon: Building2 },
    { id: 'blast_radius', label: 'Blast Radius', icon: GitFork },
  ];

  const secondaryNavItems: { id: WorkspaceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'risk_register', label: 'Risk Matrix', icon: AlertTriangle },
    { id: 'incident_simulator', label: 'Simulator', icon: Flame },
    { id: 'backup_assurance', label: 'Backups', icon: HardDrive },
    { id: 'efficiency_storage', label: 'Storage & Audit', icon: BarChart3 },
  ];

  const currentTabTitle = {
    overview: 'Executive Overview',
    dashboard: 'Command Dashboard',
    units_bia: 'Subsidiaries & BIA Matrix',
    blast_radius: 'Asset Blast Radius',
    risk_register: 'Risk Register 5×5',
    incident_simulator: 'Incident Simulator',
    backup_assurance: 'Backup Assurance',
    efficiency_storage: 'Efficiency & Storage',
  }[activeTab];

  return (
    <div className="min-h-screen p-2.5 sm:p-4 md:p-6 lg:p-7 bg-[#ECEEEF] text-[#111827] flex flex-col justify-between">
      {/* Outer Bento Container Shell */}
      <div className="w-full max-w-[1720px] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-5 flex-1 items-stretch">
        
        {/* =========================================
            LEFT CURVED DARK FOREST SIDEBAR
           ========================================= */}
        <aside className="w-full lg:w-[270px] xl:w-[290px] shrink-0 bg-[#0A261D] text-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 flex flex-col justify-between shadow-xl shadow-black/5 relative z-30">
          <div className="space-y-6">
            {/* Brand Header */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-3 text-left group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#14533D] flex items-center justify-center font-bold text-sm tracking-tight text-[#4ADE80] shadow-inner group-hover:scale-105 transition-transform duration-200">
                  UI
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight text-white group-hover:text-[#4ADE80] transition-colors">
                    UI Ventures
                  </div>
                  <div className="text-[11px] text-[#A7F3D0]/70 font-medium">
                    DRPS Enterprise
                  </div>
                </div>
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/10 text-white"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Quick search..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.08] text-white placeholder-white/40 rounded-xl border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#4ADE80] focus:bg-white/[0.12] transition-all"
              />
            </div>

            {/* Nav Groups (Hidden on mobile unless open) */}
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block space-y-6`}>
              {/* Main Menu */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-semibold tracking-wider text-white/40 uppercase px-3 pb-1">
                  Core Modules
                </div>
                {primaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-[#154E3A] text-white font-semibold shadow-md shadow-black/10'
                          : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#4ADE80]' : 'text-white/50'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Operational Tools */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-semibold tracking-wider text-white/40 uppercase px-3 pb-1">
                  Assurance & Controls
                </div>
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-[#154E3A] text-white font-semibold shadow-md shadow-black/10'
                          : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#4ADE80]' : 'text-white/50'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Sidebar Card: Compliance & ISO Status */}
          <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
                  <span className="text-[11px] font-semibold text-white">ISO 22301 Aligned</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#4ADE80]/20 text-[#4ADE80]">
                  Active
                </span>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed">
                9 subsidiaries monitored with air-gapped offline storage assurance.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-white/50">
                <span>Holdings Readiness</span>
                <span className="font-mono-metrics font-bold text-[#4ADE80]">
                  {aggregateEnterpriseReadiness.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Quick Walkthrough Trigger */}
            {state.guidedDismissed ? (
              <button
                onClick={restoreGuidedWalkthrough}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Open Walkthrough</span>
              </button>
            ) : null}
          </div>
        </aside>

        {/* =========================================
            RIGHT MAIN CANVAS AREA
           ========================================= */}
        <div className="flex-1 flex flex-col gap-4 lg:gap-5 min-w-0">
          
          {/* Top Navbar Header Bento Card */}
          <header className="bg-white rounded-[24px] sm:rounded-[28px] px-5 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm border border-black/[0.03]">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
                  {currentTabTitle}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] text-[11px] font-medium border border-[#A7F3D0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  University of Ibadan
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                UI Ventures Limited Disaster Recovery Planning System • Live Client Engine
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#F3F4F6] border border-black/[0.04]">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[11px] text-[#4B5563]">Readiness:</span>
                <span className="font-mono-metrics font-bold text-xs text-[#0A261D]">
                  {aggregateEnterpriseReadiness.toFixed(1)}%
                </span>
              </div>

              <button
                onClick={restoreGuidedWalkthrough}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#0A261D] text-white text-xs font-medium hover:bg-[#154E3A] transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span className="hidden sm:inline">Guide</span>
              </button>
            </div>
          </header>

          {/* Dynamic Active View Canvas */}
          <main className="flex-1">
            {activeTab === 'overview' && (
              <LandingOverview
                units={state.units}
                aggregateReadiness={aggregateEnterpriseReadiness}
                storageBytes={storageBytes}
                onNavigateTab={setActiveTab}
                onStartWalkthrough={restoreGuidedWalkthrough}
              />
            )}

            {activeTab === 'dashboard' && (
              <CommandDashboard
                units={state.units}
                processes={state.processes}
                assets={state.assets}
                risks={state.risks}
                simulations={state.simulations}
                aggregateReadiness={aggregateEnterpriseReadiness}
                onNavigateTab={setActiveTab}
                onSelectUnitFilter={setSelectedUnitIdFilter}
              />
            )}

            {activeTab === 'units_bia' && (
              <UnitsBiaView
                units={state.units}
                processes={state.processes}
                selectedUnitFilter={selectedUnitIdFilter}
                onSelectUnitFilter={setSelectedUnitIdFilter}
                onUpdateProcess={updateProcess}
                onUpdateUnitReadiness={updateUnitReadiness}
              />
            )}

            {activeTab === 'blast_radius' && (
              <AssetBlastRadiusView
                assets={state.assets}
                processes={state.processes}
                units={state.units}
                selectedAssetId={selectedAssetId}
                onSelectAssetId={setSelectedAssetId}
              />
            )}

            {activeTab === 'risk_register' && (
              <RiskRegisterView risks={state.risks} onUpdateRisk={updateRisk} />
            )}

            {activeTab === 'incident_simulator' && (
              <IncidentSimulatorView
                simulations={state.simulations}
                onToggleTask={toggleSimulationTask}
                onUpdateRecoveryMinutes={updateSimulationRecoveryMinutes}
              />
            )}

            {activeTab === 'backup_assurance' && (
              <BackupAssuranceView
                backups={state.backups}
                onTriggerBackup={triggerManualBackup}
              />
            )}

            {activeTab === 'efficiency_storage' && (
              <EfficiencyStorageView
                state={state}
                storageBytes={storageBytes}
                onResetFactory={resetToFactorySeed}
                onExportJson={exportBackupJson}
                onExportCsv={exportCsvGovernanceReport}
                onImportJson={importBackupJson}
              />
            )}
          </main>
        </div>
      </div>

      {/* Guided Walkthrough Bar */}
      <GuidedWalkthroughBar
        currentStep={state.guidedStep}
        isDismissed={state.guidedDismissed}
        onSetStep={setGuidedStep}
        onDismiss={dismissGuidedWalkthrough}
        onRestore={restoreGuidedWalkthrough}
        onNavigateTab={setActiveTab}
        onSelectAsset={setSelectedAssetId}
      />
    </div>
  );
}
