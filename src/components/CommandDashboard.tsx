'use client';

import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  TrendingUp,
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

function readinessBadgeClass(score: number) {
  if (score >= 85) return 'text-[#16A34A] bg-[#DCFCE7] border-[#BBF7D0]';
  if (score >= 75) return 'text-[#0A261D] bg-[#F3F4F6] border-[#E5E7EB]';
  return 'text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]';
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
    <div className="space-y-4 sm:space-y-5 pb-16">
      
      {/* =========================================
          TOP BENTO STATS CARDS (Inspiration match)
         ========================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Primary Forest Green Accent Card (like inspo dark green hero card) */}
        <div className="bg-[#0A261D] text-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/70">Aggregate Posture</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#4ADE80]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono-metrics tracking-tight text-[#4ADE80]">
              {aggregateReadiness.toFixed(1)}%
            </div>
            <div className="text-xs text-white/70 mt-1">
              +14.2% from baseline drill
            </div>
          </div>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
            <span>9 Subsidiaries verified</span>
            <span className="font-semibold text-white">ISO 22301</span>
          </div>
        </div>

        {/* Card 2: Tier-1 Critical Processes */}
        <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-sm border border-black/[0.03] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Critical Processes</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626]">
              {criticalProcesses.length} Tier-1
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono-metrics tracking-tight text-[#111827]">
              {processes.length}
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              RTO deadlines from 2h to 12h
            </div>
          </div>
          <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-[#6B7280]">
            <span>Active BIA profiles</span>
            <button 
              onClick={() => onNavigateTab('units_bia')}
              className="text-[#103E2E] font-semibold hover:underline"
            >
              View catalog →
            </button>
          </div>
        </div>

        {/* Card 3: Risk Register Balance */}
        <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-sm border border-black/[0.03] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Risk Register</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F3F4F6] text-[#111827]">
              {criticalRisks.length} Crit / {highRisks.length} High
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono-metrics tracking-tight text-[#111827]">
              {risks.length}
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              5×5 qualitative heatmap
            </div>
          </div>
          <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-[#6B7280]">
            <span>Peak hazard: R01 (25)</span>
            <button 
              onClick={() => onNavigateTab('risk_register')}
              className="text-[#103E2E] font-semibold hover:underline"
            >
              Inspect 5×5 →
            </button>
          </div>
        </div>

        {/* Card 4: Simulation Drills Compliance */}
        <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-sm border border-black/[0.03] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Simulation Drills</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A]">
              {metSims.length} Met / {missedSims.length} Missed
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono-metrics tracking-tight text-[#16A34A]">
              {Math.round((metSims.length / simulations.length) * 100)}%
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              Recovery compliance rate
            </div>
          </div>
          <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-[#6B7280]">
            <span>8 verified drills</span>
            <button 
              onClick={() => onNavigateTab('incident_simulator')}
              className="text-[#103E2E] font-semibold hover:underline"
            >
              Test drills →
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          MAIN BENTO GRID: Table (Left) + Side Modules (Right)
         ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Left Column: Subsidiary Readiness Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 shadow-sm border border-black/[0.03] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                Subsidiary Readiness & BIA Catalog
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Continuity posture ranked across all 9 commercial subsidiaries.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('units_bia')}
              className="text-xs text-[#103E2E] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Manage BIA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-black/[0.06] text-[#6B7280] bg-[#F9FAFB] rounded-xl">
                  <th className="py-3 px-3.5 font-semibold rounded-l-xl">Code</th>
                  <th className="py-3 px-3.5 font-semibold">Subsidiary</th>
                  <th className="py-3 px-3.5 font-semibold">Category</th>
                  <th className="py-3 px-3.5 font-semibold text-right">Readiness</th>
                  <th className="py-3 px-3.5 font-semibold text-center">Status</th>
                  <th className="py-3 px-3.5 font-semibold text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {units
                  .slice()
                  .sort((a, b) => b.currentReadiness - a.currentReadiness)
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3 px-3.5 font-mono-metrics font-bold text-[#111827]">
                        {u.id}
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-[#111827]">
                        {u.name}
                      </td>
                      <td className="py-3 px-3.5 text-[#6B7280]">{u.category}</td>
                      <td className="py-3 px-3.5 text-right">
                        <span className={`font-mono-metrics font-bold px-2.5 py-0.5 rounded-full text-[11px] border ${readinessBadgeClass(u.currentReadiness)}`}>
                          {u.currentReadiness.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] font-medium">
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          onClick={() => {
                            onSelectUnitFilter(u.id);
                            onNavigateTab('units_bia');
                          }}
                          className="text-[#103E2E] hover:underline text-[11px] font-semibold"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Shared Assets & Quick Alert (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-5">
          
          {/* Shared Infrastructure Blast Radius */}
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 shadow-sm border border-black/[0.03] space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#111827]">
                  Shared Campus Utilities
                </h4>
                <p className="text-xs text-[#6B7280]">
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

            <div className="space-y-2.5">
              {sharedAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => onNavigateTab('blast_radius')}
                  className="p-3.5 rounded-2xl border border-black/[0.05] hover:border-[#103E2E]/30 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-metrics text-xs font-bold text-[#111827]">
                      {asset.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-bold">
                      {asset.redundancyLevel}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-[#111827] mt-1.5 line-clamp-1">
                    {asset.name}
                  </h5>
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mt-2">
                    <span>{asset.dependentProcessIds.length} dependent procs</span>
                    <span className="text-[#103E2E] font-bold">9 Subsidiaries</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Alert Card */}
          <div className="bg-[#FEF2F2] rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 border border-[#FECACA] space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#DC2626]/10 flex items-center justify-center text-[#DC2626]">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-[#991B1B]">
                2 Scenarios Exceeded RTO
              </h4>
            </div>
            <p className="text-xs text-[#991B1B]/80 leading-relaxed">
              Drills SIM-03 (UI Water Treatment) and SIM-07 (Corporate Ransomware) ran +45m and +1h 30m beyond allowed recovery thresholds.
            </p>
            <button
              onClick={() => onNavigateTab('incident_simulator')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#DC2626] text-white hover:bg-[#B91C1C] text-xs font-semibold rounded-xl transition-colors shadow-sm"
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
