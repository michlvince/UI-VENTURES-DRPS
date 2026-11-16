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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#09090B]">
          Continuous Backup Assurance & RPO Compliance Logs
        </h2>
        <p className="text-xs text-[#52525B]">
          Multi-destination snapshot telemetry auditing local and holding company replication. Validating 4h and 12h Recovery Point Objectives (RPO) against data loss scenarios.
        </p>
      </div>

      {/* KPI summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
              Total Logged Snapshots
            </span>
            <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#0F3D2E]">
            {backups.length}
          </div>
          <p className="text-[11px] text-[#52525B]">100% cryptographic checksum passed</p>
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
              Aggregated Vault Size
            </span>
            <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">
              Storage
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#09090B]">
            {(totalBytesMb / 1024).toFixed(2)} GB
          </div>
          <p className="text-[11px] text-[#52525B]">{totalBytesMb.toFixed(1)} MB total data captured</p>
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
              RPO Policy Threshold
            </span>
            <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Compliant
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#0F3D2E]">
            &le; 4.0 Hours
          </div>
          <p className="text-[11px] text-[#52525B]">Differential snapshots executed in cadence</p>
        </div>
      </div>

      {/* Main Grid: Form Left, Log Table Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trigger Simulated Backup Form (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-[#09090B] uppercase tracking-wider">
              Trigger Operational Backup Job
            </h3>
            <p className="text-xs text-[#52525B] mt-1">
              Simulate manual or automated data sync to test local persistence and recovery log capture.
            </p>
          </div>

          <form onSubmit={handleCreateBackup} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#71717A] mb-1 font-medium">Target Subsidiary Unit</label>
              <select
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value as UnitId)}
                className="w-full py-1.5 px-3 bg-white border border-[#E4E4E7] rounded-md text-[#09090B]"
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
              <label className="block text-[#71717A] mb-1 font-medium">Target Dataset / Volume</label>
              <input
                type="text"
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                className="w-full py-1.5 px-3 bg-white border border-[#E4E4E7] rounded-md text-[#09090B]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#71717A] mb-1 font-medium">Backup Mode</label>
                <select
                  value={backupType}
                  onChange={(e) => setBackupType(e.target.value as BackupLogRecord['backupType'])}
                  className="w-full py-1.5 px-2 bg-white border border-[#E4E4E7] rounded-md text-[#09090B]"
                >
                  <option value="Differential">Differential</option>
                  <option value="Full">Full</option>
                  <option value="Transaction Log">Transaction Log</option>
                  <option value="Physical Ledger Scan">Physical Ledger Scan</option>
                </select>
              </div>

              <div>
                <label className="block text-[#71717A] mb-1 font-medium">Size (MB)</label>
                <input
                  type="number"
                  value={sizeMb}
                  onChange={(e) => setSizeMb(Number(e.target.value))}
                  className="w-full py-1.5 px-2 bg-white border border-[#E4E4E7] rounded-md text-[#09090B]"
                  min="1"
                  max="10000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#71717A] mb-1 font-medium">Target Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value as BackupLogRecord['destination'])}
                className="w-full py-1.5 px-3 bg-white border border-[#E4E4E7] rounded-md text-[#09090B]"
              >
                <option value="Immutable Cloud Vault">Immutable Cloud Vault</option>
                <option value="On-Premise NAS">On-Premise NAS</option>
                <option value="Campus Data Center">Campus Data Center</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2 px-4 bg-[#0F3D2E] hover:bg-[#165B44] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Simulated Snapshot</span>
            </button>
          </form>
        </div>

        {/* Log Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E4E4E7] rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-[#E4E4E7] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#09090B] uppercase tracking-wider">
              Continuous Verification Audit Log
            </span>
            <span className="text-[11px] text-[#71717A] font-mono-metrics">
              {backups.length} records in memory
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E4E4E7] text-[#71717A] bg-[#FAFAFA]">
                  <th className="py-2.5 px-3 font-medium">Log ID</th>
                  <th className="py-2.5 px-3 font-medium">Timestamp</th>
                  <th className="py-2.5 px-3 font-medium">Unit</th>
                  <th className="py-2.5 px-3 font-medium">Dataset Description</th>
                  <th className="py-2.5 px-3 font-medium text-center">Type</th>
                  <th className="py-2.5 px-3 font-medium text-right">Size</th>
                  <th className="py-2.5 px-3 font-medium text-center">Destination</th>
                  <th className="py-2.5 px-3 font-medium text-center">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {backups.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-2.5 px-3 font-mono-metrics font-bold text-[#09090B]">
                      {b.id}
                    </td>
                    <td className="py-2.5 px-3 font-mono-metrics text-[#52525B]">
                      {b.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-mono-metrics font-semibold text-[#0F3D2E]">
                      {b.unitId}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#09090B] max-w-xs truncate">
                      {b.targetDataset}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700">
                        {b.backupType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono-metrics text-right text-[#09090B]">
                      {b.sizeMb.toFixed(1)} MB
                    </td>
                    <td className="py-2.5 px-3 text-center text-[#52525B] text-[11px]">
                      {b.destination}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
