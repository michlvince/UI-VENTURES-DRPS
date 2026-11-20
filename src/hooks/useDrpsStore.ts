'use client';

import { useState, useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  DrpsState,
  BusinessProcess,
  BackupLogRecord,
  WorkspaceTab,
  UnitId,
  MartInventoryItem,
  MartSaleTransaction,
  MartSaleItem,
} from '@/types/drps';
import {
  INITIAL_BUSINESS_UNITS,
  INITIAL_BUSINESS_PROCESSES,
  INITIAL_INFRASTRUCTURE_ASSETS,
  INITIAL_ENTERPRISE_RISKS,
  INITIAL_SIMULATIONS,
  INITIAL_BACKUP_LOGS,
  INITIAL_MART_LEDGER_STATE,
} from '@/data/seedData';
import { evaluateRiskScore, evaluateRtoCompliance } from '@/lib/drpsEngine';

const STORAGE_KEY = 'ui_ventures_drps_v1';

export function getInitialDrpsState(): DrpsState {
  return {
    version: '1.2.0',
    units: INITIAL_BUSINESS_UNITS,
    processes: INITIAL_BUSINESS_PROCESSES,
    assets: INITIAL_INFRASTRUCTURE_ASSETS,
    risks: INITIAL_ENTERPRISE_RISKS,
    simulations: INITIAL_SIMULATIONS,
    backups: INITIAL_BACKUP_LOGS,
    martLedger: INITIAL_MART_LEDGER_STATE,
    activeIncidentSimulationId: 'SIM-09',
    guidedStep: 1,
    guidedDismissed: false,
    lastUpdated: '2026-11-20T08:00:00.000Z',
  };
}

const emptySubscribe = () => () => {};

export function useDrpsStore() {
  const isLoaded = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [state, setState] = useState<DrpsState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as DrpsState;
          if (parsed && Array.isArray(parsed.units)) {
            // Ensure martLedger exists even if restoring old v1 data
            if (!parsed.martLedger) {
              parsed.martLedger = INITIAL_MART_LEDGER_STATE;
            }
            // Ensure UV-MRT exists in units
            if (!parsed.units.some((u) => u.id === 'UV-MRT')) {
              const mrtUnit = INITIAL_BUSINESS_UNITS.find((u) => u.id === 'UV-MRT');
              if (mrtUnit) parsed.units.push(mrtUnit);
            }
            // Ensure P15, P16 exist
            INITIAL_BUSINESS_PROCESSES.forEach((p) => {
              if (!parsed.processes.some((existing) => existing.id === p.id)) {
                parsed.processes.push(p);
              }
            });
            // Ensure A19, A20 exist
            INITIAL_INFRASTRUCTURE_ASSETS.forEach((a) => {
              if (!parsed.assets.some((existing) => existing.id === a.id)) {
                parsed.assets.push(a);
              }
            });
            // Ensure R16 exists
            INITIAL_ENTERPRISE_RISKS.forEach((r) => {
              if (!parsed.risks.some((existing) => existing.id === r.id)) {
                parsed.risks.push(r);
              }
            });
            // Ensure SIM-09 exists
            INITIAL_SIMULATIONS.forEach((s) => {
              if (!parsed.simulations.some((existing) => existing.id === s.id)) {
                parsed.simulations.push(s);
              }
            });
            return parsed;
          }
        }
      } catch {
        // fallback
      }
    }
    return getInitialDrpsState();
  });

  const [storageBytes, setStorageBytes] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return new Blob([raw]).size;
      } catch {
        // ignore
      }
    }
    return 0;
  });

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('A20');
  const [selectedUnitIdFilter, setSelectedUnitIdFilter] = useState<UnitId | 'ALL'>('ALL');

  // Save to LocalStorage whenever state changes
  const saveState = useCallback((updater: (prev: DrpsState) => DrpsState) => {
    setState((prev) => {
      const next = updater({
        ...prev,
        lastUpdated: new Date().toISOString(),
      });
      try {
        const serialized = JSON.stringify(next);
        localStorage.setItem(STORAGE_KEY, serialized);
        setStorageBytes(new Blob([serialized]).size);
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
      return next;
    });
  }, []);

  // 1. Factory Reset
  const resetToFactorySeed = useCallback(() => {
    const fresh = getInitialDrpsState();
    saveState(() => fresh);
  }, [saveState]);

  // 2. Export full JSON backup
  const exportBackupJson = useCallback(() => {
    const jsonStr = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UI_VENTURES_DRPS_STATE_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state]);

  // 3. Export CSV Governance report
  const exportCsvGovernanceReport = useCallback(() => {
    const headers = [
      'Unit_ID',
      'Unit_Name',
      'Process_ID',
      'Process_Name',
      'Criticality',
      'RTO_Hours',
      'RPO_Hours',
      'Financial_Impact',
      'Operational_Impact',
      'Reputational_Impact',
      'Manual_Workaround',
      'Unit_Readiness_Pct',
    ];

    const rows: string[][] = [];

    state.processes.forEach((proc) => {
      const unit = state.units.find((u) => u.id === proc.unitId);
      rows.push([
        proc.unitId,
        `"${unit ? unit.name : ''}"`,
        proc.id,
        `"${proc.name}"`,
        proc.criticality,
        proc.rtoHours.toString(),
        proc.rpoHours !== null ? proc.rpoHours.toString() : 'N/A',
        proc.financialImpact.toString(),
        proc.operationalImpact.toString(),
        proc.reputationalImpact.toString(),
        proc.manualWorkaroundAvailable ? 'YES' : 'NO',
        unit ? unit.currentReadiness.toFixed(1) : '0.0',
      ]);
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `UI_VENTURES_GOVERNANCE_AUDIT_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state]);

  // 4. Import JSON backup
  const importBackupJson = useCallback(
    async (file: File): Promise<{ success: boolean; message: string }> => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as DrpsState;
        if (
          parsed &&
          Array.isArray(parsed.units) &&
          Array.isArray(parsed.processes) &&
          Array.isArray(parsed.assets) &&
          Array.isArray(parsed.risks) &&
          Array.isArray(parsed.simulations)
        ) {
          if (!parsed.martLedger) {
            parsed.martLedger = INITIAL_MART_LEDGER_STATE;
          }
          saveState(() => parsed);
          return { success: true, message: 'DRPS state imported successfully.' };
        } else {
          return {
            success: false,
            message: 'Invalid DRPS backup file schema. Missing required entity arrays.',
          };
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return { success: false, message: `Parse error: ${message}` };
      }
    },
    [saveState]
  );

  // 5. Update Risk
  const updateRisk = useCallback(
    (riskId: string, likelihood: number, impact: number) => {
      saveState((prev) => {
        const updatedRisks = prev.risks.map((r) => {
          if (r.id !== riskId) return r;
          const { score, severity } = evaluateRiskScore(likelihood, impact);
          return {
            ...r,
            likelihood,
            impact,
            score,
            severity,
          };
        });
        return {
          ...prev,
          risks: updatedRisks,
        };
      });
    },
    [saveState]
  );

  // 6. Update Process
  const updateProcess = useCallback(
    (
      processId: string,
      updates: Partial<
        Pick<
          BusinessProcess,
          | 'rtoHours'
          | 'rpoHours'
          | 'financialImpact'
          | 'operationalImpact'
          | 'reputationalImpact'
          | 'manualWorkaroundAvailable'
        >
      >
    ) => {
      saveState((prev) => {
        const updatedProcesses = prev.processes.map((p) => {
          if (p.id !== processId) return p;
          return {
            ...p,
            ...updates,
          };
        });
        return {
          ...prev,
          processes: updatedProcesses,
        };
      });
    },
    [saveState]
  );

  // 7. Toggle Simulation Task Check
  const toggleSimulationTask = useCallback(
    (simulationId: string, taskId: string) => {
      saveState((prev) => {
        const updatedSims = prev.simulations.map((sim) => {
          if (sim.id !== simulationId) return sim;
          const updatedTasks = sim.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              completed: !task.completed,
            };
          });
          return {
            ...sim,
            tasks: updatedTasks,
          };
        });
        return {
          ...prev,
          simulations: updatedSims,
        };
      });
    },
    [saveState]
  );

  // 8. Update Simulation Recovery Time
  const updateSimulationRecoveryMinutes = useCallback(
    (simulationId: string, minutes: number) => {
      saveState((prev) => {
        const updatedSims = prev.simulations.map((sim) => {
          if (sim.id !== simulationId) return sim;
          const evalResult = evaluateRtoCompliance(sim.rtoHours, minutes);
          return {
            ...sim,
            simulatedRecoveryMinutes: minutes,
            complianceStatus: evalResult.status,
            varianceMinutes: evalResult.varianceMinutes,
          };
        });
        return {
          ...prev,
          simulations: updatedSims,
        };
      });
    },
    [saveState]
  );

  // 9. Update Unit Readiness
  const updateUnitReadiness = useCallback(
    (unitId: UnitId, newReadiness: number) => {
      saveState((prev) => {
        const updatedUnits = prev.units.map((u) => {
          if (u.id !== unitId) return u;
          return { ...u, currentReadiness: newReadiness };
        });
        return {
          ...prev,
          units: updatedUnits,
        };
      });
    },
    [saveState]
  );

  // 10. Add New Backup Log Record
  const triggerManualBackup = useCallback(
    (
      unitId: UnitId,
      dataset: string,
      type: BackupLogRecord['backupType'],
      sizeMb: number,
      destination: BackupLogRecord['destination']
    ) => {
      const now = new Date();
      const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);
      const newRecord: BackupLogRecord = {
        id: `BKP-${String(state.backups.length + 1).padStart(2, '0')}`,
        timestamp,
        unitId,
        targetDataset: dataset,
        backupType: type,
        sizeMb,
        rpoWindowHours: 4,
        integrityVerified: true,
        destination,
      };

      saveState((prev) => ({
        ...prev,
        backups: [newRecord, ...prev.backups],
      }));
    },
    [saveState, state.backups.length]
  );

  // 11. Guided Walkthrough navigation
  const setGuidedStep = useCallback(
    (step: number) => {
      saveState((prev) => ({
        ...prev,
        guidedStep: step,
      }));
    },
    [saveState]
  );

  const dismissGuidedWalkthrough = useCallback(() => {
    saveState((prev) => ({
      ...prev,
      guidedDismissed: true,
    }));
  }, [saveState]);

  const restoreGuidedWalkthrough = useCallback(() => {
    saveState((prev) => ({
      ...prev,
      guidedDismissed: false,
      guidedStep: 1,
    }));
  }, [saveState]);

  // ==========================================
  // 12. UI VENTURES MART OFFLINE CONTINUITY ACTIONS
  // ==========================================

  // Toggle Mart Offline Mode
  const toggleMartOfflineMode = useCallback(
    (active?: boolean) => {
      saveState((prev) => ({
        ...prev,
        martLedger: {
          ...prev.martLedger,
          offlineModeActive: active !== undefined ? active : !prev.martLedger.offlineModeActive,
        },
      }));
    },
    [saveState]
  );

  // Pre-stage inventory list (via bulk upload, CSV parse, or form)
  const prestageMartInventory = useCallback(
    (newInventory: MartInventoryItem[]) => {
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
      saveState((prev) => ({
        ...prev,
        martLedger: {
          ...prev.martLedger,
          inventory: newInventory,
          lastPrestageTimestamp: timestamp,
        },
      }));
    },
    [saveState]
  );

  // Reset Mart inventory to factory seed
  const resetMartInventorySeed = useCallback(() => {
    saveState((prev) => ({
      ...prev,
      martLedger: {
        ...prev.martLedger,
        inventory: INITIAL_MART_LEDGER_STATE.inventory,
        lastPrestageTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      },
    }));
  }, [saveState]);

  // Add or update single inventory item
  const upsertMartInventoryItem = useCallback(
    (item: MartInventoryItem) => {
      saveState((prev) => {
        const existingIdx = prev.martLedger.inventory.findIndex((i) => i.sku.toLowerCase() === item.sku.toLowerCase());
        let updatedList: MartInventoryItem[];
        if (existingIdx >= 0) {
          updatedList = [...prev.martLedger.inventory];
          updatedList[existingIdx] = item;
        } else {
          updatedList = [item, ...prev.martLedger.inventory];
        }
        return {
          ...prev,
          martLedger: {
            ...prev.martLedger,
            inventory: updatedList,
          },
        };
      });
    },
    [saveState]
  );

  // Record Offline Sale Transaction & Deduct Stock
  const recordMartSale = useCallback(
    (saleData: {
      items: MartSaleItem[];
      paymentMethod: MartSaleTransaction['paymentMethod'];
      cashierName: string;
      notes?: string;
    }): MartSaleTransaction => {
      const now = new Date();
      const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
      const existingCount = state.martLedger.sales.length + 1;
      const receiptId = `MRT-OFF-${datePart}-${String(existingCount).padStart(3, '0')}`;
      const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);

      const subtotal = saleData.items.reduce((acc, item) => acc + item.lineTotal, 0);

      const transaction: MartSaleTransaction = {
        receiptId,
        timestamp,
        items: saleData.items,
        subtotal,
        totalAmount: subtotal,
        paymentMethod: saleData.paymentMethod,
        cashierName: saleData.cashierName || 'Cashier 1 (Terminal A)',
        notes: saleData.notes,
        offlineSyncStatus: 'Pending Sync',
      };

      saveState((prev) => {
        // Deduct quantities from stock
        const updatedInventory = prev.martLedger.inventory.map((invItem) => {
          const sold = saleData.items.find((si) => si.sku === invItem.sku);
          if (sold) {
            const nextStock = Math.max(0, invItem.currentStock - sold.quantity);
            return {
              ...invItem,
              currentStock: nextStock,
              lastUpdated: timestamp,
            };
          }
          return invItem;
        });

        return {
          ...prev,
          martLedger: {
            ...prev.martLedger,
            inventory: updatedInventory,
            sales: [transaction, ...prev.martLedger.sales],
          },
        };
      });

      return transaction;
    },
    [saveState, state.martLedger.sales.length]
  );

  // Mark all or specific sales as reconciled
  const reconcileMartSales = useCallback(
    (receiptIds?: string[]) => {
      saveState((prev) => {
        const updatedSales = prev.martLedger.sales.map((sale) => {
          if (!receiptIds || receiptIds.includes(sale.receiptId)) {
            return {
              ...sale,
              offlineSyncStatus: 'Reconciled / Audited' as const,
            };
          }
          return sale;
        });
        return {
          ...prev,
          martLedger: {
            ...prev.martLedger,
            sales: updatedSales,
          },
        };
      });
    },
    [saveState]
  );

  // Clear offline sales history (after verified export / sync)
  const clearMartSalesHistory = useCallback(() => {
    saveState((prev) => ({
      ...prev,
      martLedger: {
        ...prev.martLedger,
        sales: [],
      },
    }));
  }, [saveState]);

  // Export Mart Sales CSV
  const exportMartSalesCsv = useCallback(() => {
    const headers = [
      'Receipt_ID',
      'Timestamp',
      'SKU',
      'Item_Name',
      'Unit_Price',
      'Quantity_Sold',
      'Line_Total',
      'Payment_Method',
      'Cashier',
      'Sync_Status',
      'Notes',
    ];

    const rows: string[][] = [];

    state.martLedger.sales.forEach((sale) => {
      sale.items.forEach((item) => {
        rows.push([
          sale.receiptId,
          sale.timestamp,
          item.sku,
          `"${item.name.replace(/"/g, '""')}"`,
          item.unitPrice.toString(),
          item.quantity.toString(),
          item.lineTotal.toString(),
          sale.paymentMethod,
          `"${sale.cashierName.replace(/"/g, '""')}"`,
          sale.offlineSyncStatus,
          `"${(sale.notes || '').replace(/"/g, '""')}"`,
        ]);
      });
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `UI_VENTURES_MART_OFFLINE_SALES_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.martLedger.sales]);

  // Export Mart Inventory Status CSV
  const exportMartInventoryCsv = useCallback(() => {
    const headers = [
      'SKU',
      'Item_Name',
      'Category',
      'Unit_Price',
      'Opening_Stock',
      'Current_Stock',
      'Units_Sold',
      'Reorder_Level',
      'Stock_Status',
      'Unit',
      'Last_Updated',
    ];

    const rows: string[][] = [];

    state.martLedger.inventory.forEach((item) => {
      const unitsSold = item.openingStock - item.currentStock;
      const status = item.currentStock <= item.reorderLevel ? 'LOW_STOCK' : 'ADEQUATE';
      rows.push([
        item.sku,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.category.replace(/"/g, '""')}"`,
        item.unitPrice.toString(),
        item.openingStock.toString(),
        item.currentStock.toString(),
        unitsSold.toString(),
        item.reorderLevel.toString(),
        status,
        item.unit,
        item.lastUpdated,
      ]);
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `UI_VENTURES_MART_STOCK_RECONCILIATION_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.martLedger.inventory]);

  // Aggregate Metrics
  const aggregateEnterpriseReadiness = useMemo(() => {
    if (state.units.length === 0) return 0;
    const total = state.units.reduce((acc, u) => acc + u.currentReadiness, 0);
    return Math.round((total / state.units.length) * 10) / 10;
  }, [state.units]);

  return {
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
    // Actions
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
    // Mart Offline Ledger Actions
    toggleMartOfflineMode,
    prestageMartInventory,
    resetMartInventorySeed,
    upsertMartInventoryItem,
    recordMartSale,
    reconcileMartSales,
    clearMartSalesHistory,
    exportMartSalesCsv,
    exportMartInventoryCsv,
  };
}
