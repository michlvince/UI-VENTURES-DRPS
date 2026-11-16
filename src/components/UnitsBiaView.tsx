'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit2,
  Search,
  Check,
} from 'lucide-react';
import { BusinessUnit, BusinessProcess, UnitId } from '@/types/drps';

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
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#09090B]">
            Business Impact Analysis & Process Matrix
          </h2>
          <p className="text-xs text-[#52525B] mt-0.5">
            14 verified critical processes mapped across 9 UI Ventures subsidiaries with editable RTO / RPO thresholds.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search processes..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E4E4E7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] w-48"
            />
          </div>

          <select
            value={selectedUnitFilter}
            onChange={(e) => onSelectUnitFilter(e.target.value as UnitId | 'ALL')}
            className="py-1.5 px-3 text-xs bg-white border border-[#E4E4E7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] text-[#09090B]"
          >
            <option value="ALL">All 9 Subsidiaries</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.id} - {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Unit info */}
      {selectedUnitFilter !== 'ALL' && (
        (() => {
          const u = units.find((x) => x.id === selectedUnitFilter);
          if (!u) return null;
          return (
            <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-metrics text-xs font-bold px-2 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7]">
                    {u.id}
                  </span>
                  <span className="text-sm font-semibold text-[#09090B]">{u.name}</span>
                  <span className="text-[11px] text-[#71717A]">({u.location})</span>
                </div>
                <p className="text-xs text-[#52525B] max-w-2xl">{u.description}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-[11px] text-[#71717A]">Readiness</div>
                  <div className="font-mono-metrics font-bold text-lg text-[#0F3D2E]">
                    {u.currentReadiness.toFixed(1)}%
                  </div>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="0.5"
                  value={u.currentReadiness}
                  onChange={(e) => onUpdateUnitReadiness(u.id, parseFloat(e.target.value))}
                  className="w-24 accent-[#0F3D2E]"
                />
              </div>
            </div>
          );
        })()
      )}

      {/* Processes Table */}
      <div className="bg-white border border-[#E4E4E7] rounded-xl ring-1 ring-[#E4E4E7]">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs min-w-[800px]">
            <thead>
              <tr className="border-b border-[#E4E4E7] text-[#71717A] bg-[#FAFAFA]">
                <th className="py-2.5 px-3 font-medium">Process ID</th>
                <th className="py-2.5 px-3 font-medium">Unit</th>
                <th className="py-2.5 px-3 font-medium">Business Process & Context</th>
                <th className="py-2.5 px-3 font-medium text-center">Criticality</th>
                <th className="py-2.5 px-3 font-medium text-center">RTO</th>
                <th className="py-2.5 px-3 font-medium text-center">RPO</th>
                <th className="py-2.5 px-3 font-medium text-center">BIA (F/O/R)</th>
                <th className="py-2.5 px-3 font-medium text-center">Workaround</th>
                <th className="py-2.5 px-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {filteredProcesses.map((proc) => {
                const isEditing = editingProcessId === proc.id;
                const unit = units.find((u) => u.id === proc.unitId);

                return (
                  <tr
                    key={proc.id}
                    className={`hover:bg-[#FAFAFA] transition-colors duration-100 ${
                      isEditing ? 'bg-[#ECFDF5]/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-mono-metrics font-bold text-[#09090B] align-top">
                      {proc.id}
                    </td>

                    <td className="py-3 px-3 align-top">
                      <span className="font-mono-metrics font-semibold px-1.5 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B]">
                        {proc.unitId}
                      </span>
                      <div className="text-[10px] text-[#71717A] mt-1">{unit?.name}</div>
                    </td>

                    <td className="py-3 px-3 align-top max-w-sm">
                      <div className="font-medium text-[#09090B]">{proc.name}</div>
                      <div className="text-[11px] text-[#52525B] mt-1 line-clamp-2">
                        {proc.notes}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] text-[#71717A]">Assets:</span>
                        {proc.dependentAssetIds.map((aid) => (
                          <span
                            key={aid}
                            className="text-[10px] font-mono-metrics px-1 py-0.5 rounded bg-[#F4F4F5] text-[#52525B]"
                          >
                            {aid}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center align-top">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          proc.criticality === 'Critical'
                            ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                            : 'bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]'
                        }`}
                      >
                        {proc.criticality}
                      </span>
                    </td>

                    {/* RTO */}
                    <td className="py-3 px-3 text-center align-top font-mono-metrics">
                      {isEditing ? (
                        <select
                          value={editRto}
                          onChange={(e) => setEditRto(Number(e.target.value))}
                          className="px-1.5 py-0.5 border border-[#E4E4E7] rounded text-xs bg-white"
                        >
                          <option value={2}>2h</option>
                          <option value={4}>4h</option>
                          <option value={8}>8h</option>
                          <option value={12}>12h</option>
                          <option value={24}>24h</option>
                        </select>
                      ) : (
                        <span className="font-semibold text-[#09090B]">{proc.rtoHours}h</span>
                      )}
                    </td>

                    {/* RPO */}
                    <td className="py-3 px-3 text-center align-top font-mono-metrics">
                      {isEditing ? (
                        <select
                          value={editRpo === null ? 'null' : editRpo}
                          onChange={(e) =>
                            setEditRpo(e.target.value === 'null' ? null : Number(e.target.value))
                          }
                          className="px-1.5 py-0.5 border border-[#E4E4E7] rounded text-xs bg-white"
                        >
                          <option value="null">N/A</option>
                          <option value={2}>2h</option>
                          <option value={4}>4h</option>
                          <option value={8}>8h</option>
                          <option value={12}>12h</option>
                        </select>
                      ) : (
                        <span className="text-[#52525B]">
                          {proc.rpoHours !== null ? `${proc.rpoHours}h` : 'N/A'}
                        </span>
                      )}
                    </td>

                    {/* BIA scores */}
                    <td className="py-3 px-3 text-center align-top font-mono-metrics">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={editFin}
                            onChange={(e) => setEditFin(Number(e.target.value))}
                            className="w-8 border border-[#E4E4E7] text-center rounded text-xs py-0.5"
                            title="Financial Impact (1-5)"
                          />
                          <span>/</span>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={editOps}
                            onChange={(e) => setEditOps(Number(e.target.value))}
                            className="w-8 border border-[#E4E4E7] text-center rounded text-xs py-0.5"
                            title="Operational Impact (1-5)"
                          />
                          <span>/</span>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={editRep}
                            onChange={(e) => setEditRep(Number(e.target.value))}
                            className="w-8 border border-[#E4E4E7] text-center rounded text-xs py-0.5"
                            title="Reputational Impact (1-5)"
                          />
                        </div>
                      ) : (
                        <span className="font-medium text-[#09090B]">
                          {proc.financialImpact}/{proc.operationalImpact}/{proc.reputationalImpact}
                        </span>
                      )}
                    </td>

                    {/* Manual workaround */}
                    <td className="py-3 px-3 text-center align-top">
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={editWorkaround}
                          onChange={(e) => setEditWorkaround(e.target.checked)}
                          className="accent-[#0F3D2E] rounded cursor-pointer"
                        />
                      ) : proc.manualWorkaroundAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#15803D] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Enabled</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#71717A]">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right align-top">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(proc.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#0F3D2E] hover:bg-[#165B44] rounded transition-colors duration-150"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(proc)}
                          className="inline-flex items-center gap-1 text-[#0F3D2E] hover:underline text-[11px] font-medium"
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
