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
import { StatusBadge } from './ui/StatusBadge';

interface LandingOverviewProps {
  units: BusinessUnit[];
  aggregateReadiness: number;
  storageBytes: number;
  onNavigateTab: (tab: WorkspaceTab) => void;
  onStartWalkthrough: () => void;
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
      {/* Hero Bento Banner */}
      <section className="card-hero-forest text-white p-6 sm:p-8 md:p-9 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#86EFAC] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            <span>University of Ibadan Holding Company Continuity System</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Multi-Unit Disaster Recovery Planning System
          </h2>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl font-normal">
            An enterprise disaster recovery and business continuity framework modeled for UI Ventures Limited.
            Empowering 10 commercial subsidiaries including UI Ventures Mart with automated RTO/RPO evaluation, blast radius impact analysis, and resilient offline local storage.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4ADE80] hover:bg-[#22C55E] text-[#0A261D] text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm hover:scale-[1.01]"
            >
              <span>Command Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('mart_ledger')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#0A261D] hover:bg-[#F3F4F6] text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm"
            >
              <span>Mart Offline Ledger (UV-MRT)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onStartWalkthrough}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-medium rounded-xl transition-all"
            >
              <Compass className="w-4 h-4 text-[#4ADE80]" />
              <span>Start 8-Step Tour</span>
            </button>

            <button
              onClick={() => onNavigateTab('efficiency_storage')}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-transparent hover:bg-white/5 text-white/80 hover:text-white text-xs sm:text-sm font-medium rounded-xl transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#86EFAC]" />
              <span>Governance Audit</span>
            </button>
          </div>
        </div>

        {/* Hero Mini Stats Grid */}
        <div className="mt-7 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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

      {/* 4 Pillars Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div
          onClick={() => onNavigateTab('units_bia')}
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-semibold">
              <Building2 className="w-4 h-4 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              Business Impact Analysis
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              16 critical business processes mapped across 10 units with verified RTO/RPO limits and BIA impact weights.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#103E2E] font-semibold">
            <span>Explore Matrix</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('blast_radius')}
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-semibold">
              <GitFork className="w-4 h-4 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              Asset Blast Radius
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              20 catalogued assets including shared campus utilities with cascading dependency evaluation.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#103E2E] font-semibold">
            <span>Calculate Radius</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('risk_register')}
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-semibold">
              <AlertTriangle className="w-4 h-4 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              5×5 Risk Heatmap
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              16 enterprise risks dynamically scored from R01 Grid Failure (25) to R16 Mart POS Outage (16).
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#103E2E] font-semibold">
            <span>Inspect Matrix</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('incident_simulator')}
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-semibold">
              <Flame className="w-4 h-4 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              Disaster Drills & Runbooks
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              9 controlled drill simulations evaluating RTO compliance (7 MET, 2 MISSED) with live stopwatch.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#103E2E] font-semibold">
            <span>Launch Drills</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* 10 Subsidiaries Grid */}
      <section className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#111827]">
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
          {units.map((unit) => {
            const readinessVariant =
              unit.currentReadiness >= 85
                ? 'success'
                : unit.currentReadiness >= 75
                ? 'neutral'
                : 'danger';

            return (
              <div
                key={unit.id}
                onClick={() => onNavigateTab('units_bia')}
                className="group cursor-pointer rounded-2xl p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-metrics text-xs font-bold px-2 py-0.5 rounded-lg bg-white border border-[#E5E7EB] text-[#111827]">
                      {unit.id}
                    </span>
                    <StatusBadge
                      label={`${unit.currentReadiness.toFixed(1)}%`}
                      variant={readinessVariant}
                      size="sm"
                    />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
                      {unit.name}
                    </h4>
                    <div className="text-[11px] text-[#6B7280] mt-0.5">{unit.location}</div>
                  </div>

                  <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
                    {unit.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span>Lead: {unit.headOfUnit}</span>
                  <span className="font-mono-metrics font-medium text-[#111827]">
                    {unit.primaryStaffCount} staff
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Institutional Baseline Footer */}
      <section className="bg-white rounded-[18px] p-5 shadow-xs border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#103E2E]" />
            <h4 className="text-xs font-bold text-[#111827]">University of Ibadan</h4>
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed max-w-xl">
            Multi-Unit Disaster Recovery Planning System (DRPS) prototype demonstrating ISO 22301 and NIST SP 800-34 principles tailored for commercial subsidiary holding companies.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('dashboard')}
          className="shrink-0 px-4 py-2 bg-[#0A261D] text-white hover:bg-[#14533D] text-xs font-semibold rounded-xl transition-colors shadow-xs"
        >
          Open Dashboard
        </button>
      </section>
    </div>
  );
};
