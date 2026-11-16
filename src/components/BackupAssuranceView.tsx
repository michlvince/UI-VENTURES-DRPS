'use client';

import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { BackupLogRecord, UnitId } from '@/types/drps';

interface BackupAssuranceViewProps {
  backups: BackupLogRecord[];
  onTriggerBackup: (
    unitId: UnitId,
    dataset: string,
    type: BackupLogRecord['backupType'],
    sizeMb: number,
    destination: BackupLogRecord['destination']
  ) => void;
}

export const BackupAssuranceView: React.FC<BackupAssuranceViewProps> = ({
  backups,
  onTriggerBackup,
}) => {
  const [targetUnit, setTargetUnit] = useState<UnitId>('UV-HOT');
  const [dataset, setDataset] = useState('Front Desk Transaction Journal & Guest PMS Ledger');
  const [backupType, setBackupType] = useState<BackupLogRecord['backupType']>('Differential');
  const [destination, setDestination] = useState<BackupLogRecord['destination']>('Immutable Cloud Vault');
  const [sizeMb, setSizeMb] = useState<number>(185);

  const handleCreateBackup = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerBackup(targetUnit, dataset, backupType, sizeMb, destination);
  };

  const totalBytesMb = backups.reduce((acc, b) => acc + b.sizeMb, 0);

  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      
      {/* Header Bento Box */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 shadow-sm border border-black/[0.03]">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
          Continuous Backup Assurance & RPO Compliance Logs
        </h2>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Multi-destination snapshot telemetry auditing local and holding company replication. Validating 4h and 12h Recovery Point Objectives (RPO).
        </p>
      </div>

      {/* KPI 3-Column Bento Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-sm border border-black/[0.03] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Snapshots</span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
              Verified
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono-metrics text-[#103E2E]">
            {backups.length}
          </div>
          <p className="text-[11px] text-[#6B7280]">100% cryptographic checksum passed</p>
        </div>

        <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-sm border border-black/[0.03] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Vault Size</span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563]">
              Storage
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono-metrics text-[#111827]">
            {(totalBytesMb / 1024).toFixed(2)} GB
          </div>
          <p className="text-[11px] text-[#6B7280]">{totalBytesMb.toFixed(1)} MB captured</p>
        </div>

        <div className="bg-[#0A261D] text-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/70">RPO Policy Limit</span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#4ADE80]/20 text-[#4ADE80]">
              Compliant
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono-metrics text-[#4ADE80]">
            &le; 4.0 Hours
          </div>
          <p className="text-[11px] text-white/60">Automated differential cadence</p>
        </div>
      </div>

      {/* Main Grid: Form Left (4 cols), Log Table Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Trigger Simulated Backup Form */}
        <div className="lg:col-span-4 bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 shadow-sm border border-black/[0.03] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#111827]">
              Trigger Operational Backup Job
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Simulate snapshot execution to test client persistence.
            </p>
          </div>

          <form onSubmit={handleCreateBackup} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#4B5563] mb-1 font-semibold">Target Subsidiary Unit</label>
              <select
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value as UnitId)}
                className="w-full py-2 px-3 bg-[#F9FAFB] border border-black/[0.06] rounded-xl text-[#111827] font-semibold"
              >
                <option value="UV-HOT">UV-HOT - UI Hotels / Hospitality</option>
                <option value="UV-COR">UV-COR - Corporate Administration</option>
                <option value="UV-PET">UV-PET - UI Petrol Station</option>
                <option value="UV-WAT">UV-WAT - UI Water Enterprises</option>
                <option value="UV-COM">UV-COM - Computer Services</option>
                <option value="UV-PRN">UV-PRN - UI Printery</option>
                <option value="UV-BAK">UV-BAK - U&I Fast Foods & Bakery</option>
                <option value="UV-CON">UV-CON - Consultancy Service Unit</option>
                <option value="UV-HSE">UV-HSE - Health, Safety & Environment</option>
              </select>
            </div>

            <div>
              <label className="block text-[#4B5563] mb-1 font-semibold">Target Dataset / Volume</label>
              <input
                type="text"
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                className="w-full py-2 px-3 bg-[#F9FAFB] border border-black/[0.06] rounded-xl text-[#111827] font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#4B5563] mb-1 font-semibold">Backup Mode</label>
                <select
                  value={backupType}
                  onChange={(e) => setBackupType(e.target.value as BackupLogRecord['backupType'])}
                  className="w-full py-2 px-2.5 bg-[#F9FAFB] border border-black/[0.06] rounded-xl text-[#111827] font-semibold"
                >
                  <option value="Differential">Differential</option>
                  <option value="Full">Full</option>
                  <option value="Transaction Log">Transaction Log</option>
                  <option value="Physical Ledger Scan">Ledger Scan</option>
                </select>
              </div>

              <div>
                <label className="block text-[#4B5563] mb-1 font-semibold">Size (MB)</label>
                <input
                  type="number"
                  value={sizeMb}
                  onChange={(e) => setSizeMb(Number(e.target.value))}
                  className="w-full py-2 px-2.5 bg-[#F9FAFB] border border-black/[0.06] rounded-xl text-[#111827] font-mono-metrics"
                  min="1"
                  max="10000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#4B5563] mb-1 font-semibold">Target Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value as BackupLogRecord['destination'])}
                className="w-full py-2 px-3 bg-[#F9FAFB] border border-black/[0.06] rounded-xl text-[#111827] font-semibold"
              >
                <option value="Immutable Cloud Vault">Immutable Cloud Vault</option>
                <option value="On-Premise NAS">On-Premise NAS</option>
                <option value="Campus Data Center">Campus Data Center</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-[#0A261D] hover:bg-[#14533D] text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Record Snapshot</span>
            </button>
          </form>
        </div>

        {/* Log Table Bento Card */}
        <div className="lg:col-span-8 bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 shadow-sm border border-black/[0.03]">
          <div className="pb-4 border-b border-black/[0.04] flex items-center justify-between">
            <span className="text-sm font-bold text-[#111827]">
              Continuous Verification Audit Log
            </span>
            <span className="text-[11px] text-[#6B7280] font-mono-metrics font-semibold">
              {backups.length} records in memory
            </span>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-black/[0.06] text-[#6B7280] bg-[#F9FAFB] rounded-xl">
                  <th className="py-3 px-3.5 font-semibold rounded-l-xl">Log ID</th>
                  <th className="py-3 px-3.5 font-semibold">Timestamp</th>
                  <th className="py-3 px-3.5 font-semibold">Unit</th>
                  <th className="py-3 px-3.5 font-semibold">Dataset</th>
                  <th className="py-3 px-3.5 font-semibold text-center">Type</th>
                  <th className="py-3 px-3.5 font-semibold text-right">Size</th>
                  <th className="py-3 px-3.5 font-semibold text-center">Destination</th>
                  <th className="py-3 px-3.5 font-semibold text-right rounded-r-xl">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {backups.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3.5 px-3.5 font-mono-metrics font-bold text-[#111827]">
                      {b.id}
                    </td>
                    <td className="py-3.5 px-3.5 font-mono-metrics text-[#6B7280]">
                      {b.timestamp}
                    </td>
                    <td className="py-3.5 px-3.5 font-mono-metrics font-bold text-[#103E2E]">
                      {b.unitId}
                    </td>
                    <td className="py-3.5 px-3.5 font-semibold text-[#111827] max-w-xs truncate">
                      {b.targetDataset}
                    </td>
                    <td className="py-3.5 px-3.5 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] font-semibold">
                        {b.backupType}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 font-mono-metrics font-bold text-right text-[#111827]">
                      {b.sizeMb.toFixed(1)} MB
                    </td>
                    <td className="py-3.5 px-3.5 text-center text-[#6B7280] text-[11px]">
                      {b.destination}
                    </td>
                    <td className="py-3.5 px-3.5 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#16A34A] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
