'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Settings,
  ChevronDown,
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
import { MetricCard } from './ui/MetricCard';
import { StatusBadge } from './ui/StatusBadge';

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
  const [selectedRowId, setSelectedRowId] = useState<string>('UV-HOT');

  const criticalProcesses = processes.filter((p) => p.criticality === 'Critical');
  const sharedAssets = assets.filter((a) => a.isShared);
  const criticalRisks = risks.filter((r) => r.severity === 'Critical');
  const highRisks = risks.filter((r) => r.severity === 'High');
  const metSims = simulations.filter((s) => s.complianceStatus === 'MET');
  const missedSims = simulations.filter((s) => s.complianceStatus === 'MISSED');
  const complianceRate = Math.round((metSims.length / simulations.length) * 100);

  const sortedUnits = units.slice().sort((a, b) => b.currentReadiness - a.currentReadiness);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Metric Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Enterprise Posture"
          value={`${aggregateReadiness.toFixed(1)}%`}
          subValue="+14.2% from baseline holding drill"
          variant="forest"
          icon={TrendingUp}
          badge={{ text: 'ISO 22301', variant: 'accent' }}
          footer={
            <div className="flex items-center justify-between text-[11px]">
              <span>{units.length} Subsidiaries verified</span>
              <span className="font-semibold text-white">Full Scope</span>
            </div>
          }
        />

        <MetricCard
          label="Critical Processes"
          value={processes.length}
          subValue={`${criticalProcesses.length} Tier-1 critical (1h to 4h RTO)`}
          variant="surface"
          badge={{ text: `${criticalProcesses.length} Critical`, variant: 'danger' }}
          footer={
            <div className="flex items-center justify-between text-[11px]">
              <span>Active BIA profiles</span>
              <button
                onClick={() => onNavigateTab('units_bia')}
                className="text-[#103E2E] font-semibold hover:underline"
              >
                Inspect BIA →
              </button>
            </div>
          }
        />

        <MetricCard
          label="Enterprise Risks"
          value={risks.length}
          subValue={`${criticalRisks.length} Critical / ${highRisks.length} High severity`}
          variant="surface"
          badge={{ text: '5×5 Matrix', variant: 'warning' }}
          footer={
            <div className="flex items-center justify-between text-[11px]">
              <span>Peak hazard: R01 (25)</span>
              <button
                onClick={() => onNavigateTab('risk_register')}
                className="text-[#103E2E] font-semibold hover:underline"
              >
                Inspect 5×5 →
              </button>
            </div>
          }
        />

        <MetricCard
          label="Simulation Drills"
          value={`${complianceRate}%`}
          subValue={`${metSims.length} Met / ${missedSims.length} Missed RTO deadlines`}
          variant="surface"
          badge={{ text: `${metSims.length}/${simulations.length} Met`, variant: 'success' }}
          footer={
            <div className="flex items-center justify-between text-[11px]">
              <span>{simulations.length} verified drills</span>
              <button
                onClick={() => onNavigateTab('incident_simulator')}
                className="text-[#103E2E] font-semibold hover:underline"
              >
                Test drills →
              </button>
            </div>
          }
        />
      </div>

      {/* Main Grid: Subsidiaries Table + Shared Utilities & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subsidiary Leaderboard Table (8 cols) matching Inspiration Mechanism */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-xs border border-[#E5E7EB] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F3F5]">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">
                Subsidiary Continuity Directory
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Click any subsidiary row to highlight and inspect its full profile.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B] font-medium">
                {units.length} monitored subsidiaries
              </span>
              <button
                onClick={() => onNavigateTab('units_bia')}
                className="text-xs text-[#103E2E] hover:underline font-semibold flex items-center gap-1 ml-2"
              >
                <span>BIA Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[540px]">
              <thead>
                <tr className="text-[#64748B] text-[11px] uppercase tracking-wider font-semibold border-b border-[#F1F3F5]">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Subsidiary</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Readiness</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                {sortedUnits.map((u) => {
                  const isSelected = u.id === selectedRowId;
                  const statusVariant =
                    u.currentReadiness >= 85
                      ? 'success'
                      : u.currentReadiness >= 75
                      ? 'neutral'
                      : 'danger';

                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedRowId(u.id)}
                      className={`cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'table-row-selected-pill'
                          : 'hover:bg-[#F8F9FA] rounded-xl'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono-metrics font-bold">
                        {u.id}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isSelected
                                ? 'bg-[#154E3A] text-[#4ADE80]'
                                : 'bg-[#F0FDF4] text-[#16A34A]'
                            }`}
                          >
                            {u.id.slice(3, 5)}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${isSelected ? 'text-white/80' : 'text-[#64748B]'}`}>
                        {u.category}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isSelected ? (
                          <span className="font-mono-metrics font-bold text-sm text-[#4ADE80] pill-accent">
                            {u.currentReadiness.toFixed(1)}%
                          </span>
                        ) : (
                          <StatusBadge
                            label={`${u.currentReadiness.toFixed(1)}%`}
                            variant={statusVariant}
                            size="sm"
                          />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                            isSelected
                              ? 'bg-white/10 text-white border border-white/20'
                              : 'bg-[#F8F9FA] text-[#64748B] border border-[#E2E8F0]'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectUnitFilter(u.id);
                              onNavigateTab('units_bia');
                            }}
                            className={`p-1 rounded-md transition-colors ${
                              isSelected
                                ? 'text-white/80 hover:text-white hover:bg-white/10'
                                : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F1F3F5]'
                            }`}
                            title="Inspect Details"
                          >
                            <Settings className="w-3.5 h-3.5" />
                          </button>
                          <ChevronDown
                            className={`w-3.5 h-3.5 ${
                              isSelected ? 'text-[#4ADE80] pill-accent' : 'text-[#94A3B8]'
                            }`}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Shared Assets & Emergency Alert (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Shared Campus Utilities */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
              <div>
                <h4 className="text-sm font-bold text-[#111827]">
                  Shared Campus Utilities
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">
                  High blast radius assets cascading enterprise-wide.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('blast_radius')}
                className="text-xs text-[#103E2E] hover:underline font-semibold"
              >
                Inspect
              </button>
            </div>

            <div className="space-y-3">
              {sharedAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => onNavigateTab('blast_radius')}
                  className="p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#CBD5E1] bg-[#F8F9FA] hover:bg-white transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-metrics text-xs font-bold text-[#111827]">
                      {asset.id}
                    </span>
                    <StatusBadge
                      label={asset.redundancyLevel}
                      variant={
                        asset.redundancyLevel === 'Single Point of Failure'
                          ? 'danger'
                          : 'success'
                      }
                      size="sm"
                    />
                  </div>
                  <h5 className="text-xs font-semibold text-[#111827] mt-1.5 line-clamp-1">
                    {asset.name}
                  </h5>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-2">
                    <span>{asset.dependentProcessIds.length} dependent procs</span>
                    <span className="text-[#103E2E] font-semibold">{units.length} Subsidiaries</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Alert: Scenarios Exceeding RTO */}
          <div className="bg-[#FEF2F2] rounded-2xl p-6 border border-[#FECACA] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#DC2626]/10 flex items-center justify-center text-[#DC2626]">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#991B1B]">
                {missedSims.length} Scenarios Exceeded RTO
              </h4>
            </div>
            <p className="text-xs text-[#991B1B]/85 leading-relaxed">
              Drills SIM-03 (UI Water Treatment) and SIM-07 (Corporate Ransomware) ran +45m and +1h 30m beyond allowed recovery thresholds.
            </p>
            <button
              onClick={() => onNavigateTab('incident_simulator')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#DC2626] text-white hover:bg-[#B91C1C] text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              <span>Review Simulation Runbooks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
