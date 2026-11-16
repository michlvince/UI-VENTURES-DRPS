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

function readinessBadge(score: number) {
  if (score >= 85) return 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]';
  if (score >= 75) return 'bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]';
  return 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]';
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
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="text-xs text-[#71717A]">Readiness Score</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#0F3D2E]">
            {aggregateReadiness.toFixed(1)}%
          </div>
          <p className="text-[11px] text-[#52525B]">9 operational entities</p>
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717A]">Critical Processes</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]">
              {criticalProcesses.length} Tier-1
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#09090B]">
            {processes.length}
          </div>
          <p className="text-[11px] text-[#52525B]">RTO limits 2h to 12h</p>
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717A]">Risk Register</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]">
              {criticalRisks.length} Crit / {highRisks.length} High
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#09090B]">
            {risks.length} Risks
          </div>
          <p className="text-[11px] text-[#52525B]">5x5 probability matrix</p>
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-lg p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717A]">Simulation Drills</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
              {metSims.length} Met / {missedSims.length} Missed
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-metrics text-[#0F3D2E]">
            {Math.round((metSims.length / simulations.length) * 100)}% Compliance
          </div>
          <p className="text-[11px] text-[#52525B]">8 operational drills</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subsidiary Readiness Table */}
        <div className="lg:col-span-2 bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#09090B]">
                Subsidiary Readiness & BIA Status
              </h3>
              <p className="text-xs text-[#52525B]">
                Ranked by recovery maturity across all 9 entities.
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
            <table className="w-full text-left border-collapse text-xs min-w-[480px]">
              <thead>
                <tr className="border-b border-[#E4E4E7] text-[#71717A] bg-[#FAFAFA]">
                  <th className="py-2.5 px-3 font-medium">Unit Code</th>
                  <th className="py-2.5 px-3 font-medium">Subsidiary</th>
                  <th className="py-2.5 px-3 font-medium">Category</th>
                  <th className="py-2.5 px-3 font-medium text-right">Readiness</th>
                  <th className="py-2.5 px-3 font-medium text-center">Status</th>
                  <th className="py-2.5 px-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {units
                  .slice()
                  .sort((a, b) => b.currentReadiness - a.currentReadiness)
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors duration-100">
                      <td className="py-2.5 px-3 font-mono-metrics font-semibold text-[#09090B]">
                        {u.id}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-[#09090B]">
                        {u.name}
                      </td>
                      <td className="py-2.5 px-3 text-[#52525B]">{u.category}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`font-mono-metrics font-bold px-2 py-0.5 rounded text-[11px] ${readinessBadge(u.currentReadiness)}`}>
                          {u.currentReadiness.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#52525B]">
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
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Shared Infrastructure snapshot */}
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#09090B]">
                  Shared Utilities Blast Radius
                </h3>
                <p className="text-xs text-[#52525B]">
                  Assets cascading across multiple units.
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
                  className="p-3 border border-[#E4E4E7] rounded-lg hover:border-[#0F3D2E] transition-[border-color] duration-150 cursor-pointer bg-[#FAFAFA]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-metrics text-xs font-semibold text-[#09090B]">
                      {asset.id}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#52525B]">
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

          {/* Focus alert */}
          <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#52525B]" />
              <h3 className="text-sm font-semibold text-[#09090B]">
                2 Over-RTO Scenarios
              </h3>
            </div>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Drills for SIM-03 (UI Water Treatment) and SIM-07 (Corporate Ransomware) exceeded allowed recovery objectives by +45m and +1h 30m respectively.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigateTab('incident_simulator')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E4E4E7] text-xs font-medium text-[#09090B] rounded-md hover:bg-[#F4F4F5] transition-colors"
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
