'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit2,
  Search,
  Check,
} from 'lucide-react';
import { BusinessUnit, BusinessProcess, UnitId } from '@/types/drps';
import { StatusBadge } from './ui/StatusBadge';

interface UnitsBiaViewProps {
  units: BusinessUnit[];
  processes: BusinessProcess[];
  selectedUnitFilter: UnitId | 'ALL';
  onSelectUnitFilter: (unitId: UnitId | 'ALL') => void;
  onUpdateProcess: (
    processId: string,
    updates: Partial<Pick<BusinessProcess, 'rtoHours' | 'rpoHours' | 'financialImpact' | 'operationalImpact' | 'reputationalImpact' | 'manualWorkaroundAvailable'>>
  ) => void;
  onUpdateUnitReadiness: (unitId: UnitId, newReadiness: number) => void;
}

export const UnitsBiaView: React.FC<UnitsBiaViewProps> = ({
  units,
  processes,
  selectedUnitFilter,
  onSelectUnitFilter,
  onUpdateProcess,
  onUpdateUnitReadiness,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProcessId, setEditingProcessId] = useState<string | null>(null);
  const [editRto, setEditRto] = useState<number>(4);
  const [editRpo, setEditRpo] = useState<number | null>(4);
  const [editWorkaround, setEditWorkaround] = useState<boolean>(true);
  const [editFin, setEditFin] = useState<number>(5);
  const [editOps, setEditOps] = useState<number>(5);
  const [editRep, setEditRep] = useState<number>(5);

  const filteredProcesses = processes.filter((proc) => {
    const matchesUnit = selectedUnitFilter === 'ALL' || proc.unitId === selectedUnitFilter;
    const matchesSearch =
      proc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proc.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUnit && matchesSearch;
  });

  const handleStartEdit = (proc: BusinessProcess) => {
    setEditingProcessId(proc.id);
    setEditRto(proc.rtoHours);
    setEditRpo(proc.rpoHours);
    setEditWorkaround(proc.manualWorkaroundAvailable);
    setEditFin(proc.financialImpact);
    setEditOps(proc.operationalImpact);
    setEditRep(proc.reputationalImpact);
  };

  const handleSaveEdit = (processId: string) => {
    onUpdateProcess(processId, {
      rtoHours: Number(editRto),
      rpoHours: editRpo !== null ? Number(editRpo) : null,
      manualWorkaroundAvailable: editWorkaround,
      financialImpact: Number(editFin),
      operationalImpact: Number(editOps),
      reputationalImpact: Number(editRep),
    });
    setEditingProcessId(null);
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      {/* Header Bento Box */}
      <div className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
            Business Impact Analysis (BIA) & Process Matrix
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            {processes.length} verified critical processes mapped across {units.length} UI Ventures subsidiaries with editable RTO / RPO thresholds.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search processes..."
              className="pl-8 pr-3 py-1.5 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#103E2E] w-48 text-[#111827]"
            />
          </div>

          <select
            value={selectedUnitFilter}
            onChange={(e) => onSelectUnitFilter(e.target.value as UnitId | 'ALL')}
            className="py-1.5 px-3 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#103E2E] text-[#111827] font-semibold"
          >
            <option value="ALL">All {units.length} Subsidiaries</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.id} - {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Unit Details Banner */}
      {selectedUnitFilter !== 'ALL' && (
        (() => {
          const u = units.find((x) => x.id === selectedUnitFilter);
          if (!u) return null;
          return (
            <div className="card-hero-forest text-white p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono-metrics text-xs font-bold px-2.5 py-0.5 rounded-lg bg-white/10 text-[#4ADE80]">
                    {u.id}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">{u.name}</h3>
                  <span className="text-xs text-white/60">({u.location})</span>
                </div>
                <p className="text-xs text-white/80 max-w-2xl leading-relaxed">{u.description}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0 bg-white/10 rounded-xl p-3.5 border border-white/10">
                <div className="text-right">
                  <div className="text-[11px] text-white/60">Unit Readiness</div>
                  <div className="font-mono-metrics font-extrabold text-lg text-[#4ADE80]">
                    {u.currentReadiness.toFixed(1)}%
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-white/60">Simulate Score</span>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="0.5"
                    value={u.currentReadiness}
                    onChange={(e) => onUpdateUnitReadiness(u.id, parseFloat(e.target.value))}
                    className="w-28 accent-[#4ADE80] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* Processes Table Bento Card */}
      <div className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[850px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280] bg-[#F9FAFB] rounded-xl">
                <th className="py-2.5 px-3.5 font-semibold rounded-l-xl">Process ID</th>
                <th className="py-2.5 px-3.5 font-semibold">Unit</th>
                <th className="py-2.5 px-3.5 font-semibold">Business Process & Assets</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">Criticality</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">RTO</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">RPO</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">BIA (Fin/Ops/Rep)</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">Workaround</th>
                <th className="py-2.5 px-3.5 font-semibold text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredProcesses.map((proc) => {
                const isEditing = editingProcessId === proc.id;
                const unit = units.find((u) => u.id === proc.unitId);

                return (
                  <tr
                    key={proc.id}
                    className={`hover:bg-[#F9FAFB] transition-colors ${
                      isEditing ? 'bg-[#ECFDF5]/50' : ''
                    }`}
                  >
                    <td className="py-3 px-3.5 font-mono-metrics font-bold text-[#111827] align-top">
                      {proc.id}
                    </td>

                    <td className="py-3 px-3.5 align-top">
                      <span className="font-mono-metrics font-bold px-2 py-0.5 rounded-lg bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB]">
                        {proc.unitId}
                      </span>
                      <div className="text-[10px] text-[#6B7280] mt-1">{unit?.name}</div>
                    </td>

                    <td className="py-3 px-3.5 align-top max-w-sm">
                      <div className="font-bold text-[#111827]">{proc.name}</div>
                      <div className="text-[11px] text-[#4B5563] mt-1 line-clamp-2">
                        {proc.notes}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-[#9CA3AF]">Assets:</span>
                        {proc.dependentAssetIds.map((aid) => (
                          <span
                            key={aid}
                            className="text-[10px] font-mono-metrics px-1.5 py-0.2 rounded-md bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]"
                          >
                            {aid}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3.5 text-center align-top">
                      <StatusBadge
                        label={proc.criticality}
                        variant={proc.criticality === 'Critical' ? 'danger' : 'neutral'}
                        size="sm"
                      />
                    </td>

                    {/* RTO */}
                    <td className="py-3 px-3.5 text-center align-top font-mono-metrics font-bold">
                      {isEditing ? (
                        <select
                          value={editRto}
                          onChange={(e) => setEditRto(Number(e.target.value))}
                          className="px-2 py-1 border border-[#D1D5DB] rounded-lg text-xs bg-white text-[#111827]"
                        >
                          <option value={1}>1h</option>
                          <option value={2}>2h</option>
                          <option value={4}>4h</option>
                          <option value={8}>8h</option>
                          <option value={12}>12h</option>
                          <option value={24}>24h</option>
                        </select>
                      ) : (
                        <span className="text-[#111827]">{proc.rtoHours}h</span>
                      )}
                    </td>

                    {/* RPO */}
                    <td className="py-3 px-3.5 text-center align-top font-mono-metrics">
                      {isEditing ? (
                        <select
                          value={editRpo === null ? 'null' : editRpo}
                          onChange={(e) =>
                            setEditRpo(e.target.value === 'null' ? null : Number(e.target.value))
                          }
                          className="px-2 py-1 border border-[#D1D5DB] rounded-lg text-xs bg-white text-[#111827]"
                        >
                          <option value="null">N/A</option>
                          <option value={2}>2h</option>
                          <option value={4}>4h</option>
                          <option value={8}>8h</option>
                          <option value={12}>12h</option>
                        </select>
                      ) : (
                        <span className="text-[#6B7280]">
                          {proc.rpoHours !== null ? `${proc.rpoHours}h` : 'N/A'}
                        </span>
                      )}
                    </td>

                    {/* BIA Impact Scores */}
                    <td className="py-3 px-3.5 text-center align-top font-mono-metrics">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={editFin}
                            onChange={(e) => setEditFin(Number(e.target.value))}
                            className="w-7 border border-[#D1D5DB] text-center rounded-md text-xs py-0.5"
                          />
                          <span>/</span>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={editOps}
                            onChange={(e) => setEditOps(Number(e.target.value))}
                            className="w-7 border border-[#D1D5DB] text-center rounded-md text-xs py-0.5"
                          />
                          <span>/</span>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={editRep}
                            onChange={(e) => setEditRep(Number(e.target.value))}
                            className="w-7 border border-[#D1D5DB] text-center rounded-md text-xs py-0.5"
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-[#111827]">
                          {proc.financialImpact}/{proc.operationalImpact}/{proc.reputationalImpact}
                        </span>
                      )}
                    </td>

                    {/* Workaround */}
                    <td className="py-3 px-3.5 text-center align-top">
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={editWorkaround}
                          onChange={(e) => setEditWorkaround(e.target.checked)}
                          className="accent-[#103E2E] rounded cursor-pointer mt-1"
                        />
                      ) : proc.manualWorkaroundAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#16A34A] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Enabled</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#9CA3AF]">None</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3.5 text-right align-top">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(proc.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-[#0A261D] hover:bg-[#154E3A] rounded-xl shadow-xs transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(proc)}
                          className="inline-flex items-center gap-1 text-[#103E2E] hover:underline text-[11px] font-bold"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
