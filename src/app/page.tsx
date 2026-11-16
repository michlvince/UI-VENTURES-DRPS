'use client';

import React from 'react';
import {
  LayoutDashboard,
  Building2,
  GitFork,
  AlertTriangle,
  Flame,
  HardDrive,
  BarChart3,
  Home,
  ShieldCheck,
  RotateCcw,
  Sparkles,
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-[#09090B]">
        <div className="flex items-center gap-2 text-xs font-mono-metrics text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-[#0F3D2E] animate-pulse" />
          <span>Mounting UI Ventures DRPS Client Engine...</span>
        </div>
      </div>
    );
  }

  const navItems: { id: WorkspaceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'units_bia', label: 'Units & BIA', icon: Building2 },
    { id: 'blast_radius', label: 'Blast Radius', icon: GitFork },
    { id: 'risk_register', label: 'Risk Matrix', icon: AlertTriangle },
    { id: 'incident_simulator', label: 'Simulator', icon: Flame },
    { id: 'backup_assurance', label: 'Backups', icon: HardDrive },
    { id: 'efficiency_storage', label: 'Storage & Efficiency', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#09090B]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E4E4E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-2.5 text-left focus:outline-none"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0F3D2E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  UI
                </div>
                <div>
                  <div className="text-xs font-bold text-[#09090B] leading-none tracking-tight">
                    UI VENTURES LIMITED
                  </div>
                  <div className="text-[10px] text-[#71717A] tracking-wider font-mono-metrics uppercase mt-0.5">
                    Multi-Unit DRPS • Enterprise Edition
                  </div>
                </div>
              </button>
            </div>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${isActive
                      ? 'bg-[#ECFDF5] text-[#0F3D2E] font-semibold border border-[#A7F3D0]/60'
                      : 'text-[#52525B] hover:text-[#09090B] hover:bg-[#FAFAFA]'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Telemetry Pill */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[11px] font-mono-metrics">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                <span className="text-[#71717A]">Posture:</span>
                <span className="font-bold text-[#0F3D2E]">
                  {aggregateEnterpriseReadiness.toFixed(1)}%
                </span>
              </div>

              {state.guidedDismissed && (
                <button
                  onClick={restoreGuidedWalkthrough}
                  className="px-2.5 py-1 text-xs font-medium text-[#0F3D2E] bg-white border border-[#E4E4E7] rounded-md hover:bg-[#ECFDF5] transition-colors flex items-center gap-1"
                  title="Open Walkthrough"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Walkthrough</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Strip */}
        <div className="md:hidden border-t border-[#E4E4E7] bg-white px-2 py-1.5 overflow-x-auto flex items-center gap-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs shrink-0 ${isActive
                  ? 'bg-[#0F3D2E] text-white font-medium'
                  : 'text-[#52525B] hover:bg-neutral-100'
                  }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Persistent Guided Walkthrough Docked Bar */}
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
