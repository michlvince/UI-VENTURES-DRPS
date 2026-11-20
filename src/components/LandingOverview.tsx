'use client';

import React from 'react';
import {
  Building2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Compass,
  GitFork,
  FileSpreadsheet,
} from 'lucide-react';
import { BusinessUnit, WorkspaceTab } from '@/types/drps';

interface LandingOverviewProps {
  units: BusinessUnit[];
  aggregateReadiness: number;
  storageBytes: number;
  onNavigateTab: (tab: WorkspaceTab) => void;
  onStartWalkthrough: () => void;
}

function readinessColor(score: number) {
  if (score >= 85) return 'text-[#16A34A] bg-[#DCFCE7] border-[#BBF7D0]';
  if (score >= 75) return 'text-[#0A261D] bg-[#F3F4F6] border-[#E5E7EB]';
  return 'text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]';
}

export const LandingOverview: React.FC<LandingOverviewProps> = ({
  units,
  aggregateReadiness,
  storageBytes,
  onNavigateTab,
  onStartWalkthrough,
}) => {
  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      
      {/* =========================================
          HERO BENTO CARD: Deep Emerald Feature Banner
         ========================================= */}
      <section className="bg-gradient-to-br from-[#0A261D] via-[#103E2E] to-[#14533D] text-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-lg shadow-black/5 relative overflow-hidden">
        {/* Subtle decorative glow circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4ADE80]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#86EFAC] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            <span>University of Ibadan Holding Company Continuity System</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Multi-Unit Disaster Recovery Planning System
          </h2>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl font-normal">
            A cohesive operational disaster recovery framework modeled for UI Ventures Limited. 
            Empowering 10 commercial subsidiaries including UI Ventures Mart with automated RTO/RPO evaluation, blast radius impact analysis, and resilient offline local storage.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4ADE80] hover:bg-[#22C55E] text-[#0A261D] text-xs sm:text-sm font-bold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              <span>Open Command Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('mart_ledger')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#0A261D] hover:bg-[#F3F4F6] text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-md"
            >
              <span>Mart Offline Ledger (UV-MRT)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onStartWalkthrough}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-medium rounded-2xl transition-all backdrop-blur-sm"
            >
              <Compass className="w-4 h-4 text-[#4ADE80]" />
              <span>Start 8-Step Tour</span>
            </button>

            <button
              onClick={() => onNavigateTab('efficiency_storage')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-transparent hover:bg-white/5 text-white/80 hover:text-white text-xs sm:text-sm font-medium rounded-2xl transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#86EFAC]" />
              <span>Governance Audit</span>
            </button>
          </div>
        </div>

        {/* Floating Mini Stats in Hero */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-[11px] text-white/60">Readiness Score</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-metrics text-[#4ADE80]">
              {aggregateReadiness.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-white/60">Subsidiaries</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-metrics text-white">
              10 Units
            </div>
          </div>
          <div>
            <div className="text-[11px] text-white/60">Critical Processes</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-metrics text-white">
              16 Tier-1
            </div>
          </div>
          <div>
            <div className="text-[11px] text-white/60">Offline Storage</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-metrics text-[#86EFAC]">
              {(storageBytes / 1024).toFixed(1)} KB
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          FOUR PILLARS BENTO ROW
         ========================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div
          onClick={() => onNavigateTab('units_bia')}
          className="group cursor-pointer bg-white rounded-[24px] p-5 shadow-sm border border-black/[0.04] hover:shadow-md hover:border-[#103E2E]/30 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-semibold">
              <Building2 className="w-5 h-5 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              Business Impact Analysis
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              16 critical business processes mapped across 10 units with verified RTO/RPO limits and BIA scores (1–5).
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-[#103E2E] font-semibold">
            <span>Explore Matrix</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('blast_radius')}
          className="group cursor-pointer bg-white rounded-[24px] p-5 shadow-sm border border-black/[0.04] hover:shadow-md hover:border-[#103E2E]/30 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-semibold">
              <GitFork className="w-5 h-5 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              Asset Blast Radius
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Shared campus utilities (Fibre/ISP, 33kV Power) cascading downtime computation across all units.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-[#103E2E] font-semibold">
            <span>Calculate Radius</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('risk_register')}
          className="group cursor-pointer bg-white rounded-[24px] p-5 shadow-sm border border-black/[0.04] hover:shadow-md hover:border-[#103E2E]/30 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-semibold">
              <AlertTriangle className="w-5 h-5 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              5×5 Risk Heatmap
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              16 enterprise risks scored dynamically from R01 Grid Failure (25) to R16 Mart Outage (16).
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-[#103E2E] font-semibold">
            <span>Inspect Matrix</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('incident_simulator')}
          className="group cursor-pointer bg-white rounded-[24px] p-5 shadow-sm border border-black/[0.04] hover:shadow-md hover:border-[#103E2E]/30 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-semibold">
              <Flame className="w-5 h-5 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              Disaster Drills & Runbooks
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              9 controlled drill simulations evaluating RTO compliance (7 MET, 2 MISSED) with live stopwatch.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-[#103E2E] font-semibold">
            <span>Launch Drills</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* =========================================
          9 SUBSIDIARY BUSINESS UNITS GRID
         ========================================= */}
      <section className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 shadow-sm border border-black/[0.03] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#111827]">
                Subsidiary Business Units
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-xs font-semibold text-[#4B5563]">
                10 Entities
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Continuity postures across supermarket retail, hospitality, bakery, water production, petroleum, print, and corporate arms.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('units_bia')}
            className="text-xs text-[#103E2E] font-semibold flex items-center gap-1 hover:underline self-start sm:self-auto"
          >
            <span>Open Detailed BIA Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {units.map((unit) => (
            <div
              key={unit.id}
              onClick={() => onNavigateTab('units_bia')}
              className="group cursor-pointer rounded-2xl p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-black/[0.04] hover:border-[#103E2E]/20 transition-all duration-150 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-metrics text-xs font-bold px-2 py-0.5 rounded-lg bg-white border border-black/[0.06] text-[#111827]">
                    {unit.id}
                  </span>
                  <span className={`font-mono-metrics text-xs font-bold px-2.5 py-0.5 rounded-full border ${readinessColor(unit.currentReadiness)}`}>
                    {unit.currentReadiness.toFixed(1)}%
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
                    {unit.name}
                  </h4>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">{unit.location}</div>
                </div>

                <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
                  {unit.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-[#6B7280]">
                <span>Lead: {unit.headOfUnit}</span>
                <span className="font-mono-metrics font-medium text-[#111827]">{unit.primaryStaffCount} staff</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          UNIVERSITY OF IBADAN INSTITUTIONAL BADGE
         ========================================= */}
      <section className="bg-white rounded-[24px] sm:rounded-[28px] p-6 shadow-sm border border-black/[0.03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#103E2E]" />
            <h4 className="text-sm font-bold text-[#111827]">University of Ibadan</h4>
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed max-w-xl">
            Multi-Unit Disaster Recovery Planning System (DRPS) prototype demonstrating ISO 22301 and NIST SP 800-34 principles tailored for commercial subsidiary holding companies.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('dashboard')}
          className="shrink-0 px-4 py-2 bg-[#0A261D] text-white hover:bg-[#14533D] text-xs font-semibold rounded-xl transition-colors"
        >
          Open Workspace
        </button>
      </section>
    </div>
  );
};
