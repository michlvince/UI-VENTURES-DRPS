'use client';

import { useState, useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  DrpsState,
  BusinessProcess,
  BackupLogRecord,
  WorkspaceTab,
  UnitId,
} from '@/types/drps';
import {
  INITIAL_BUSINESS_UNITS,
  INITIAL_BUSINESS_PROCESSES,
  INITIAL_INFRASTRUCTURE_ASSETS,
  INITIAL_ENTERPRISE_RISKS,
  INITIAL_SIMULATIONS,
  INITIAL_BACKUP_LOGS,
} from '@/data/seedData';
import { evaluateRiskScore, evaluateRtoCompliance } from '@/lib/drpsEngine';

const STORAGE_KEY = 'ui_ventures_drps_v1';

export function getInitialDrpsState(): DrpsState {
  return {
    version: '1.0.0',
    units: INITIAL_BUSINESS_UNITS,
    processes: INITIAL_BUSINESS_PROCESSES,
    assets: INITIAL_INFRASTRUCTURE_ASSETS,
    risks: INITIAL_ENTERPRISE_RISKS,
    simulations: INITIAL_SIMULATIONS,
    backups: INITIAL_BACKUP_LOGS,
    activeIncidentSimulationId: 'SIM-01',
    guidedStep: 1,
    guidedDismissed: false,
    lastUpdated: '2026-11-16T00:00:00.000Z',
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
  const [selectedAssetId, setSelectedAssetId] = useState<string>('A13');
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
    setState(fresh);
    try {
      const serialized = JSON.stringify(fresh);
      localStorage.setItem(STORAGE_KEY, serialized);
      setStorageBytes(new Blob([serialized]).size);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // 2. Export Backup (JSON)
  const exportBackupJson = useCallback(() => {
    const jsonStr = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UI_Ventures_DRPS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state]);

  // 3. Export CSV Governance Report
  const exportCsvGovernanceReport = useCallback(() => {
    const headers = [
      'Unit ID',
      'Unit Name',
      'Unit Status',
      'Readiness Score (%)',
      'Process ID',
      'Process Name',
      'Criticality',
      'RTO (Hours)',
      'RPO (Hours)',
      'BIA Financial',
      'BIA Operational',
      'BIA Reputational',
      'Manual Workaround',
    ];

    const rows: string[][] = [];

    state.units.forEach((unit) => {
      const unitProcesses = state.processes.filter((p) => p.unitId === unit.id);
      if (unitProcesses.length === 0) {
        rows.push([
          unit.id,
          `"${unit.name}"`,
          unit.status,
          unit.currentReadiness.toFixed(1),
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          'N/A',
        ]);
      } else {
        unitProcesses.forEach((proc) => {
          rows.push([
            unit.id,
            `"${unit.name}"`,
            unit.status,
            unit.currentReadiness.toFixed(1),
            proc.id,
            `"${proc.name}"`,
            proc.criticality,
            proc.rtoHours.toString(),
            proc.rpoHours !== null ? proc.rpoHours.toString() : 'Physical N/A',
            proc.financialImpact.toString(),
            proc.operationalImpact.toString(),
            proc.reputationalImpact.toString(),
            proc.manualWorkaroundAvailable ? 'Yes' : 'No',
          ]);
        });
      }
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UI_Ventures_DRPS_Governance_Audit_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state]);

  // 4. Import Backup (JSON)
  const importBackupJson = useCallback(
    (file: File): Promise<{ success: boolean; message: string }> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const parsed = JSON.parse(content) as DrpsState;
            if (!parsed.units || !parsed.processes || !parsed.risks) {
              resolve({
                success: false,
                message: 'Invalid DRPS schema: required entities missing.',
              });
              return;
            }
            saveState(() => parsed);
            resolve({
              success: true,
              message: `Successfully restored ${parsed.units.length} units and ${parsed.processes.length} processes.`,
            });
          } catch {
            resolve({
              success: false,
              message: 'Failed to parse JSON file. Please check file formatting.',
            });
          }
        };
        reader.onerror = () => {
          resolve({ success: false, message: 'File read error.' });
        };
        reader.readAsText(file);
      });
    },
    [saveState]
  );

  // 5. Mutate Risk Likelihood / Impact
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

  // 6. Mutate Process RTO / RPO / Impacts
  const updateProcess = useCallback(
    (
      processId: string,
      updates: Partial<Pick<BusinessProcess, 'rtoHours' | 'rpoHours' | 'financialImpact' | 'operationalImpact' | 'reputationalImpact' | 'manualWorkaroundAvailable'>>
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

  // 7. Toggle Simulation Task completion
  const toggleSimulationTask = useCallback(
    (simulationId: string, taskId: string) => {
      saveState((prev) => {
        const updatedSims = prev.simulations.map((sim) => {
          if (sim.id !== simulationId) return sim;
          const updatedTasks = sim.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return { ...t, completed: !t.completed };
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

  // 8. Update Simulation Recovery Time (which recalculates compliance status)
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
    (unitId: UnitId, dataset: string, type: BackupLogRecord['backupType'], sizeMb: number, destination: BackupLogRecord['destination']) => {
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
  };
}
