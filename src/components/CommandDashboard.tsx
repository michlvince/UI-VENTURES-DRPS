'use client';

import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import {
  BusinessUnit,
  BusinessProcess,
  InfrastructureAsset,
  RiskItem,
  IncidentSimulation,
  WorkspaceTab,
  UnitId,
} from '@/types/drps';

interface CommandDashboardProps {
  units: BusinessUnit[];
  processes: BusinessProcess[];
  assets: InfrastructureAsset[];
  risks: RiskItem[];
  simulations: IncidentSimulation[];
  aggregateReadiness: number;
  onNavigateTab: (tab: WorkspaceTab) => void;
  onSelectUnitFilter: (unitId: UnitId) => void;
}

export const CommandDashboard: React.FC<CommandDashboardProps> = ({
  units,
  processes,
  assets,
  risks,
  simulations,
  aggregateReadiness,
  onNavigateTab,
  onSelectUnitFilter,
}) => {
  const criticalProcesses = processes.filter((p) => p.criticality === 'Critical');
  const sharedAssets = assets.filter((a) => a.isShared);
  const criticalRisks = risks.filter((r) => r.severity === 'Critical');
  const highRisks = risks.filter((r) => r.severity === 'High');
  const metSims = simulations.filter((s) => s.complianceStatus === 'MET');
  const missedSims = simulations.filter((s) => s.complianceStatus === 'MISSED');

  return (
    <div className="space-y-6">
      {/* Top Banner KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
              Readiness Score
            </span>
            <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Enterprise
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#0F3D2E]">
            {aggregateReadiness.toFixed(1)}%
          </div>
          <p className="text-[11px] text-[#52525B]">9 subsidiary units benchmarked</p>
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
              Critical Processes
            </span>
            <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              {criticalProcesses.length} Tier-1
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#09090B]">
            {processes.length} Total
          </div>
          <p className="text-[11px] text-[#52525B]">RTO limits between 2h and 12h</p>
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
              Risk Register
            </span>
            <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              {criticalRisks.length} Crit / {highRisks.length} High
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#09090B]">
            {risks.length} Risks
          </div>
          <p className="text-[11px] text-[#52525B]">5x5 probability matrix scored</p>
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
              Simulation Drills
            </span>
            <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              {metSims.length} Met / {missedSims.length} Missed
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#0F3D2E]">
            {Math.round((metSims.length / simulations.length) * 100)}% Compliance
          </div>
          <p className="text-[11px] text-[#52525B]">8 operational drill scenarios</p>
        </div>
      </div>

      {/* Main Grid: Left Column Unit Readiness table; Right Column Shared Infrastructure & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Subsidiary Units Posture Table */}
        <div className="lg:col-span-2 bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#09090B]">
                Subsidiary Readiness & BIA Status
              </h3>
              <p className="text-xs text-[#52525B]">
                Ranked from highest recovery maturity to lowest across all 9 commercial units.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('units_bia')}
              className="text-xs text-[#0F3D2E] hover:underline font-medium flex items-center gap-1"
            >
              <span>Process Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E4E4E7] text-[#71717A] bg-[#FAFAFA]">
                  <th className="py-2.5 px-3 font-medium">Unit Code</th>
                  <th className="py-2.5 px-3 font-medium">Subsidiary Name</th>
                  <th className="py-2.5 px-3 font-medium">Category</th>
                  <th className="py-2.5 px-3 font-medium text-right">Readiness</th>
                  <th className="py-2.5 px-3 font-medium text-center">Status</th>
                  <th className="py-2.5 px-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {units
                  .slice()
                  .sort((a, b) => b.currentReadiness - a.currentReadiness)
                  .map((u) => {
                    const isHigh = u.currentReadiness >= 85;
                    const isMed = u.currentReadiness >= 75 && u.currentReadiness < 85;

                    return (
                      <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-2.5 px-3 font-mono-metrics font-semibold text-[#09090B]">
                          {u.id}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#09090B]">
                          {u.name}
                        </td>
                        <td className="py-2.5 px-3 text-[#52525B]">{u.category}</td>
                        <td className="py-2.5 px-3 font-mono-metrics font-bold text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              isHigh
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isMed
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {u.currentReadiness.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAFAFA] border border-[#E4E4E7] text-[#52525B]">
                            {u.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              onSelectUnitFilter(u.id);
                              onNavigateTab('units_bia');
                            }}
                            className="text-[#0F3D2E] hover:underline text-[11px] font-medium"
                          >
                            Drill Down
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Shared Assets & Vulnerability Focus */}
        <div className="space-y-6">
          {/* Shared Infrastructure Blast Radius Snapshot */}
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#09090B]">
                  Shared Utilities Blast Radius
                </h3>
                <p className="text-xs text-[#52525B]">
                  Shared assets cascading across multiple units.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('blast_radius')}
                className="text-xs text-[#0F3D2E] hover:underline font-medium"
              >
                Inspect
              </button>
            </div>

            <div className="space-y-2.5">
              {sharedAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => onNavigateTab('blast_radius')}
                  className="p-3 border border-[#E4E4E7] rounded-lg hover:border-[#0F3D2E] transition-colors cursor-pointer bg-[#FAFAFA]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-metrics text-xs font-semibold text-[#09090B]">
                      {asset.id}
                    </span>
                    <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {asset.redundancyLevel}
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-[#09090B] mt-1 line-clamp-1">
                    {asset.name}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-[#71717A] mt-2">
                    <span>{asset.dependentProcessIds.length} dependent processes</span>
                    <span className="text-[#0F3D2E] font-medium">All Units</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Scenario Alert Card */}
          <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-[#09090B]">
                Immediate Focus: 2 Over-RTO Scenarios
              </h3>
            </div>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Drills for SIM-03 (UI Water Treatment) and SIM-07 (Corporate Ransomware) exceeded allowed recovery objectives by +45m and +1h 30m respectively.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigateTab('incident_simulator')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E4E4E7] text-xs font-medium text-[#09090B] rounded-md hover:bg-neutral-50 transition-colors shadow-2xs"
              >
                <span>Review Simulator Runbooks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
