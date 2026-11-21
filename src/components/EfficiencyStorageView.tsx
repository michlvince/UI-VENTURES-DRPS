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
import { ConfirmationDialog } from './ui/ConfirmationDialog';
import { StatusBadge } from './ui/StatusBadge';

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

  // Benchmarks
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
    <div className="space-y-4 sm:space-y-5 pb-16">
      {/* Header Bento Box */}
      <div className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB]">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
          Efficiency Benchmarks & Local Storage Telemetry
        </h2>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Quantitative verification of recovery acceleration, client storage telemetry, and multi-format governance export utilities.
        </p>
      </div>

      {/* Metric 3-Card Bento Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="card-hero-forest text-white p-5 sm:p-6 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/70">MTTR Reduction</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4ADE80]/20 text-[#4ADE80]">
              Benchmark
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono-metrics text-[#4ADE80]">
            {mttrReductionPercent}%
          </div>
          <p className="text-[11px] text-white/60">
            MTTR reduced from {Math.round(manualMttrTotal / 60)}h to {Math.round(automatedMttrTotal / 60)}h
          </p>
        </div>

        <div className="bg-white rounded-[18px] p-5 sm:p-6 shadow-xs border border-[#E5E7EB] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Triage Latency</span>
            <StatusBadge label="Response" variant="success" size="sm" />
          </div>
          <div className="text-3xl font-extrabold font-mono-metrics text-[#111827]">
            95.6%
          </div>
          <p className="text-[11px] text-[#6B7280]">
            Incident declaration down from 45 mins to &lt; 2 minutes
          </p>
        </div>

        <div className="bg-white rounded-[18px] p-5 sm:p-6 shadow-xs border border-[#E5E7EB] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Storage Allocated</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
              {percentUsed}% of 5MB
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono-metrics text-[#103E2E]">
            {kbSize} KB
          </div>
          <p className="text-[11px] text-[#6B7280]">
            Key: <code className="font-mono-metrics text-[#111827] font-semibold">ui_ventures_drps_v1</code>
          </p>
        </div>
      </div>

      {/* Main Grid: Governance Tools (7 cols) + Telemetry (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Governance & State Management Bento */}
        <div className="lg:col-span-7 bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB] space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#111827]">
              Governance Audit Reports & Persistence Management
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Export audit artifacts for university council governance or restore full application state.
            </p>
          </div>

          {importStatus && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                importStatus.success
                  ? 'bg-[#DCFCE7] border-[#BBF7D0] text-[#16A34A]'
                  : 'bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]'
              }`}
            >
              {importStatus.success ? (
                <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Export CSV */}
            <div className="p-4 rounded-xl border border-[#E5E7EB] space-y-2 bg-[#F9FAFB]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#111827]">CSV Governance Audit</h4>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Download verified tabular report of all {state.units.length} business units, {state.processes.length} critical processes, and RTO/RPO limits.
              </p>
              <button
                onClick={onExportCsv}
                className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-xs font-bold text-[#111827] rounded-xl shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Report</span>
              </button>
            </div>

            {/* Export JSON */}
            <div className="p-4 rounded-xl border border-[#E5E7EB] space-y-2 bg-[#F9FAFB]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                  <FileCode className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#111827]">Full JSON State Backup</h4>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Export complete verified JSON snapshot including units, processes, assets, risks, and simulation checklists.
              </p>
              <button
                onClick={onExportJson}
                className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-xs font-bold text-[#111827] rounded-xl shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON State</span>
              </button>
            </div>

            {/* Restore JSON */}
            <div className="p-4 rounded-xl border border-[#E5E7EB] space-y-2 bg-[#F9FAFB]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                  <Upload className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#111827]">Restore State</h4>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
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
                className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-xs font-bold text-[#111827] rounded-xl shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select JSON File</span>
              </button>
            </div>

            {/* Factory Reset */}
            <div className="p-4 rounded-xl border border-[#FECACA] space-y-2 bg-[#FEE2E2]/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#DC2626]">Factory Reset</h4>
              </div>
              <p className="text-[11px] text-[#991B1B]/80 leading-relaxed">
                Revert all modified RTOs, risk scores, and simulations back to verified default seed dataset.
              </p>
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-[#FECACA] hover:bg-[#FEE2E2] text-xs font-bold text-[#DC2626] rounded-xl shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Seed Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Client Telemetry & Entity Registry Bento */}
        <div className="lg:col-span-5 bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB] space-y-4">
          <h3 className="text-sm font-bold text-[#111827]">
            Client Telemetry & Entity Registry
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Active Version:</span>
                <span className="font-mono-metrics font-bold text-[#111827]">{state.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Business Units:</span>
                <span className="font-mono-metrics font-bold text-[#103E2E]">{state.units.length} Units</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Critical Processes:</span>
                <span className="font-mono-metrics font-bold text-[#111827]">{state.processes.length} Processes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Infrastructure Assets:</span>
                <span className="font-mono-metrics font-bold text-[#111827]">{state.assets.length} Assets</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Enterprise Risks:</span>
                <span className="font-mono-metrics font-bold text-[#111827]">{state.risks.length} Risks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Drill Simulations:</span>
                <span className="font-mono-metrics font-bold text-[#111827]">{state.simulations.length} Scenarios</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Backup Logs:</span>
                <span className="font-mono-metrics font-bold text-[#111827]">{state.backups.length} Records</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                <span className="text-[#6B7280]">Last Saved:</span>
                <span className="font-mono-metrics text-[10px] text-[#4B5563]">
                  {state.lastUpdated.slice(0, 19).replace('T', ' ')}
                </span>
              </div>
            </div>

            <div className="card-hero-forest text-white p-4 rounded-xl text-xs space-y-1">
              <div className="font-bold text-[#4ADE80]">Zero External Database Architecture</div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Full client-side operation guaranteeing institutional air-gapped continuity even when central cloud networks or external databases are unreachable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Factory Reset */}
      <ConfirmationDialog
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        onConfirm={onResetFactory}
        title="Confirm Factory Reset"
        message="Are you sure you want to revert all business units, RTO thresholds, risk scores, and simulations back to verified default seed state? Any customized entries will be restored to baseline."
        confirmLabel="Reset All Data"
        cancelLabel="Keep Current State"
        variant="danger"
      />
    </div>
  );
};
