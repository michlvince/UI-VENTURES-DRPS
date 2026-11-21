'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { useDrpsStore } from '@/hooks/useDrpsStore';
import { LandingOverview } from '@/components/LandingOverview';
import { CommandDashboard } from '@/components/CommandDashboard';
import { UnitsBiaView } from '@/components/UnitsBiaView';
import { AssetBlastRadiusView } from '@/components/AssetBlastRadiusView';
import { RiskRegisterView } from '@/components/RiskRegisterView';
import { IncidentSimulatorView } from '@/components/IncidentSimulatorView';
import { BackupAssuranceView } from '@/components/BackupAssuranceView';
import { EfficiencyStorageView } from '@/components/EfficiencyStorageView';
import { MartContinuityView } from '@/components/MartContinuityView';
import { GuidedWalkthroughBar } from '@/components/GuidedWalkthroughBar';
import { AppSidebar } from '@/components/ui/AppSidebar';
import { AppHeader } from '@/components/ui/AppHeader';
import { ToastContainer, ToastMessage } from '@/components/ui/ToastContainer';

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
    // Mart Continuity Actions
    toggleMartOfflineMode,
    prestageMartInventory,
    resetMartInventorySeed,
    upsertMartInventoryItem,
    recordMartSale,
    reconcileMartSales,
    clearMartSalesHistory,
    exportMartSalesCsv,
    exportMartInventoryCsv,
  } = useDrpsStore();

  // Desktop sidebar collapsed by default on initial page load (does not automatically pop open)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Detect live browser online / offline connectivity without cascading render effects
  const isOnline = useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine,
    () => true
  );

  const handleResetFactory = () => {
    resetToFactorySeed();
    addToast('success', 'Default UI Ventures dataset reseeded successfully.');
  };

  const handleExportJson = () => {
    exportBackupJson();
    addToast('info', 'Full JSON state exported to disk.');
  };

  const handleExportCsv = () => {
    exportCsvGovernanceReport();
    addToast('info', 'Governance CSV audit report exported.');
  };

  const handleImportJson = async (file: File) => {
    const result = await importBackupJson(file);
    if (result.success) {
      addToast('success', result.message);
    } else {
      addToast('error', result.message);
    }
    return result;
  };

  const handleTriggerBackup = (
    unitId: Parameters<typeof triggerManualBackup>[0],
    dataset: Parameters<typeof triggerManualBackup>[1],
    type: Parameters<typeof triggerManualBackup>[2],
    sizeMb: Parameters<typeof triggerManualBackup>[3],
    destination: Parameters<typeof triggerManualBackup>[4]
  ) => {
    triggerManualBackup(unitId, dataset, type, sizeMb, destination);
    addToast('success', `Snapshot recorded for ${unitId}: ${dataset}`);
  };

  const handleRecordMartSale = (
    saleData: Parameters<typeof recordMartSale>[0]
  ) => {
    const transaction = recordMartSale(saleData);
    addToast('success', `Offline receipt ${transaction.receiptId} recorded: ₦${transaction.totalAmount.toLocaleString()}`);
    return transaction;
  };

  const handleReconcileMartSales = (receiptIds?: string[]) => {
    reconcileMartSales(receiptIds);
    addToast('success', 'Sales marked as reconciled in offline ledger.');
  };

  const handleClearMartSales = () => {
    clearMartSalesHistory();
    addToast('info', 'Offline sales history cleared.');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-[#111827]">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white shadow-xs border border-[#E5E7EB]">
          <div className="w-5 h-5 rounded-full border-2 border-[#103E2E] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-[#475569]">Loading UI Ventures DRPS Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] flex flex-col justify-between">
      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main Container Shell with generous max-width */}
      <div className="w-full max-w-[1680px] mx-auto flex flex-col lg:flex-row flex-1 items-stretch">
        {/* App Sidebar */}
        <AppSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          martOfflineActive={state.martLedger.offlineModeActive}
          aggregateReadiness={aggregateEnterpriseReadiness}
          onOpenWalkthrough={restoreGuidedWalkthrough}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col gap-5 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Floating Glass Header */}
          <AppHeader
            currentTab={activeTab}
            onSelectTab={setActiveTab}
            isOnline={isOnline}
            storageBytes={storageBytes}
            aggregateReadiness={aggregateEnterpriseReadiness}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onResetSeedData={handleResetFactory}
            onOpenWalkthrough={restoreGuidedWalkthrough}
          />

          {/* Active Workspace View */}
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

            {activeTab === 'mart_ledger' && (
              <MartContinuityView
                martLedger={state.martLedger}
                onToggleOfflineMode={toggleMartOfflineMode}
                onPrestageInventory={(inv) => {
                  prestageMartInventory(inv);
                  addToast('success', `${inv.length} items pre-staged in offline memory.`);
                }}
                onResetInventorySeed={() => {
                  resetMartInventorySeed();
                  addToast('info', 'Mart inventory catalog restored to default seed.');
                }}
                onUpsertInventoryItem={(item) => {
                  upsertMartInventoryItem(item);
                  addToast('success', `Saved SKU: ${item.sku}`);
                }}
                onRecordSale={handleRecordMartSale}
                onReconcileSales={handleReconcileMartSales}
                onClearSalesHistory={handleClearMartSales}
                onExportSalesCsv={() => {
                  exportMartSalesCsv();
                  addToast('info', 'Mart offline sales CSV exported.');
                }}
                onExportInventoryCsv={() => {
                  exportMartInventoryCsv();
                  addToast('info', 'Mart inventory CSV exported.');
                }}
              />
            )}

            {activeTab === 'units_bia' && (
              <UnitsBiaView
                units={state.units}
                processes={state.processes}
                selectedUnitFilter={selectedUnitIdFilter}
                onSelectUnitFilter={setSelectedUnitIdFilter}
                onUpdateProcess={(id, updates) => {
                  updateProcess(id, updates);
                  addToast('success', `Process ${id} updated.`);
                }}
                onUpdateUnitReadiness={(id, score) => {
                  updateUnitReadiness(id, score);
                  addToast('info', `${id} readiness set to ${score.toFixed(1)}%`);
                }}
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
              <RiskRegisterView
                risks={state.risks}
                onUpdateRisk={(id, l, i) => {
                  updateRisk(id, l, i);
                  addToast('success', `Risk ${id} re-evaluated (Score: ${l * i})`);
                }}
              />
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
                onTriggerBackup={handleTriggerBackup}
              />
            )}

            {activeTab === 'efficiency_storage' && (
              <EfficiencyStorageView
                state={state}
                storageBytes={storageBytes}
                onResetFactory={handleResetFactory}
                onExportJson={handleExportJson}
                onExportCsv={handleExportCsv}
                onImportJson={handleImportJson}
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
