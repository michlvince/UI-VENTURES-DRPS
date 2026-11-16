'use client';

import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  FileCode,
  Check,
  AlertCircle,
} from 'lucide-react';
import { DrpsState } from '@/types/drps';

interface EfficiencyStorageViewProps {
  state: DrpsState;
  storageBytes: number;
  onResetFactory: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  onImportJson: (file: File) => Promise<{ success: boolean; message: string }>;
}

export const EfficiencyStorageView: React.FC<EfficiencyStorageViewProps> = ({
  state,
  storageBytes,
  onResetFactory,
  onExportJson,
  onExportCsv,
  onImportJson,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importStatus, setImportStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await onImportJson(file);
    setImportStatus(res);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => {
      setImportStatus(null);
    }, 4500);
  };

  const kbSize = (storageBytes / 1024).toFixed(2);
  const maxStorageBudgetKb = 5120; // 5 MB typical localStorage limit
  const percentUsed = ((storageBytes / (maxStorageBudgetKb * 1024)) * 100).toFixed(3);

  // Benchmarks from report
  const manualMttrTotal = state.simulations.reduce((acc, s) => acc + s.manualMttrMinutes, 0);
  const automatedMttrTotal = state.simulations.reduce(
    (acc, s) => acc + s.simulatedRecoveryMinutes,
    0
  );
  const mttrReductionPercent = (
    ((manualMttrTotal - automatedMttrTotal) / manualMttrTotal) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#09090B]">
          Efficiency Benchmarks & Local Client Storage Telemetry
        </h2>
        <p className="text-xs text-[#52525B]">
          Live quantitative verification of recovery time acceleration, client storage telemetry, and multi-format governance export utilities.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
              MTTR Reduction
            </span>
            <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Benchmark
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#0F3D2E]">
            {mttrReductionPercent}%
          </div>
          <p className="text-[11px] text-[#52525B]">
            Mean Time To Recovery reduced from {Math.round(manualMttrTotal / 60)}h to {Math.round(automatedMttrTotal / 60)}h
          </p>
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
              Triage Latency Acceleration
            </span>
            <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Response
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#09090B]">
            95.6%
          </div>
          <p className="text-[11px] text-[#52525B]">
            Incident declaration down from 45 mins to &lt; 2 minutes
          </p>
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
              Client Storage Usage
            </span>
            <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">
              {percentUsed}% of 5MB
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#0F3D2E]">
            {kbSize} KB
          </div>
          <p className="text-[11px] text-[#52525B]">
            Under key <code className="font-mono-metrics text-[#09090B]">ui_ventures_drps_v1</code>
          </p>
        </div>
      </div>

      {/* Main Grid: Governance Tools & LocalStorage Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Governance & State Management (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-[#09090B] uppercase tracking-wider">
              Governance Audit Reports & Persistence Management
            </h3>
            <p className="text-xs text-[#52525B] mt-0.5">
              Export audit artifacts for university council governance or restore full application state.
            </p>
          </div>

          {importStatus && (
            <div
              className={`p-3 rounded-lg border flex items-center gap-2 text-xs ${
                importStatus.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {importStatus.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Export CSV */}
            <div className="p-4 border border-[#E4E4E7] rounded-lg space-y-2 bg-[#FAFAFA]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#0F3D2E]" />
                <h4 className="text-xs font-semibold text-[#09090B]">CSV Governance Audit</h4>
              </div>
              <p className="text-[11px] text-[#52525B] leading-relaxed">
                Download verified tabular report of all 9 business units, 14 critical processes, and RTO/RPO limits.
              </p>
              <button
                onClick={onExportCsv}
                className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white border border-[#E4E4E7] hover:bg-[#FAFAFA] text-xs font-medium text-[#09090B] rounded shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Report</span>
              </button>
            </div>

            {/* Export JSON */}
            <div className="p-4 border border-[#E4E4E7] rounded-lg space-y-2 bg-[#FAFAFA]">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#0F3D2E]" />
                <h4 className="text-xs font-semibold text-[#09090B]">Full JSON State Backup</h4>
              </div>
              <p className="text-[11px] text-[#52525B] leading-relaxed">
                Export complete verified JSON snapshot including units, processes, assets, risks, and simulation checklists.
              </p>
              <button
                onClick={onExportJson}
                className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white border border-[#E4E4E7] hover:bg-[#FAFAFA] text-xs font-medium text-[#09090B] rounded shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON State</span>
              </button>
            </div>

            {/* Restore JSON */}
            <div className="p-4 border border-[#E4E4E7] rounded-lg space-y-2 bg-[#FAFAFA]">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#0F3D2E]" />
                <h4 className="text-xs font-semibold text-[#09090B]">Restore State from Backup</h4>
              </div>
              <p className="text-[11px] text-[#52525B] leading-relaxed">
                Upload a previous JSON export to overwrite current state and restore data.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white border border-[#E4E4E7] hover:bg-[#FAFAFA] text-xs font-medium text-[#09090B] rounded shadow-2xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select JSON File</span>
              </button>
            </div>

            {/* Factory Reset */}
            <div className="p-4 border border-rose-200 rounded-lg space-y-2 bg-rose-50/30">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-rose-700" />
                <h4 className="text-xs font-semibold text-rose-900">Factory Reset</h4>
              </div>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                Revert all modified RTOs, risk scores, and simulations back to verified default seed dataset.
              </p>
              {showConfirmReset ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onResetFactory();
                      setShowConfirmReset(false);
                    }}
                    className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded transition-colors"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="py-1.5 px-2 bg-white border border-[#E4E4E7] text-xs rounded hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white border border-rose-300 hover:bg-rose-50 text-xs font-medium text-rose-800 rounded shadow-2xs transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Factory Seed</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Local Storage Telemetry & Specs (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-[#09090B] uppercase tracking-wider">
            Client Telemetry & Entity Registry
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Active Version:</span>
                <span className="font-mono-metrics font-bold text-[#09090B]">{state.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Business Units:</span>
                <span className="font-mono-metrics font-bold text-[#0F3D2E]">{state.units.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Critical Processes:</span>
                <span className="font-mono-metrics font-bold text-[#09090B]">{state.processes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Infrastructure Assets:</span>
                <span className="font-mono-metrics font-bold text-[#09090B]">{state.assets.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Enterprise Risks:</span>
                <span className="font-mono-metrics font-bold text-[#09090B]">{state.risks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Drill Simulations:</span>
                <span className="font-mono-metrics font-bold text-[#09090B]">{state.simulations.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">Backup Logs:</span>
                <span className="font-mono-metrics font-bold text-[#09090B]">{state.backups.length}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#E4E4E7]">
                <span className="text-[#71717A]">Last Saved Timestamp:</span>
                <span className="font-mono-metrics text-[10px] text-[#52525B]">
                  {state.lastUpdated.slice(0, 19).replace('T', ' ')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-xs text-[#0F3D2E] space-y-1">
              <div className="font-semibold">Zero External Database Architecture</div>
              <p className="text-[11px] text-[#165B44] leading-relaxed">
                Full standalone client operation guaranteeing air-gapped continuity even when institutional cloud APIs or external databases are unreachable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
