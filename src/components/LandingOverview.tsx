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
    <div className="space-y-6 pb-16">
      {/* Hero Bento Banner with Room to Breathe */}
      <section className="card-hero-forest text-white p-7 sm:p-9 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#86EFAC] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            <span>University of Ibadan Holding Company Continuity System</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Multi-Unit Disaster Recovery Planning System
          </h2>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl font-normal">
            An enterprise disaster recovery and business continuity framework modeled for UI Ventures Limited.
            Empowering 10 commercial subsidiaries including UI Ventures Mart with automated RTO/RPO evaluation, blast radius impact analysis, and resilient offline local storage.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4ADE80] hover:bg-[#22C55E] text-[#0A261D] text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <span>Command Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('mart_ledger')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#0A261D] hover:bg-[#F8F9FA] text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <span>Mart Offline POS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onStartWalkthrough}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-medium rounded-xl transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>8-Step Tour</span>
            </button>

            <button
              onClick={() => onNavigateTab('efficiency_storage')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-white/80 hover:text-white text-xs font-medium rounded-xl transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#86EFAC]" />
              <span>Governance Audit</span>
            </button>
          </div>
        </div>

        {/* Hero Mini Stats Grid with clear separation */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-[11px] text-white/60 uppercase tracking-wide">Readiness Score</div>
            <div className="text-2xl font-bold font-mono-metrics text-[#4ADE80] mt-1">
              {aggregateReadiness.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-white/60 uppercase tracking-wide">Subsidiaries</div>
            <div className="text-2xl font-bold font-mono-metrics text-white mt-1">
              10 Units
            </div>
          </div>
          <div>
            <div className="text-[11px] text-white/60 uppercase tracking-wide">Critical Processes</div>
            <div className="text-2xl font-bold font-mono-metrics text-white mt-1">
              16 Tier-1
            </div>
          </div>
          <div>
            <div className="text-[11px] text-white/60 uppercase tracking-wide">Offline Storage</div>
            <div className="text-2xl font-bold font-mono-metrics text-[#86EFAC] mt-1">
              {(storageBytes / 1024).toFixed(1)} KB
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid with improved whitespace */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('units_bia')}
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-semibold border border-[#BBF7D0]">
              <Building2 className="w-4 h-4 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              Business Impact Analysis
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              16 critical business processes mapped across 10 units with verified RTO/RPO limits and BIA impact weights.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#103E2E] font-semibold pt-2">
            <span>Explore Matrix</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('blast_radius')}
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-semibold border border-[#BBF7D0]">
              <GitFork className="w-4 h-4 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              Asset Blast Radius
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              20 catalogued assets including shared campus utilities with cascading dependency evaluation.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#103E2E] font-semibold pt-2">
            <span>Calculate Radius</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('risk_register')}
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-semibold border border-[#BBF7D0]">
              <AlertTriangle className="w-4 h-4 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              5×5 Risk Heatmap
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              16 enterprise risks dynamically scored from R01 Grid Failure (25) to R16 Mart POS Outage (16).
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#103E2E] font-semibold pt-2">
            <span>Inspect Matrix</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('incident_simulator')}
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-semibold border border-[#BBF7D0]">
              <Flame className="w-4 h-4 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              Disaster Drills & Runbooks
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              9 controlled drill simulations evaluating RTO compliance (7 MET, 2 MISSED) with live stopwatch.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#103E2E] font-semibold pt-2">
            <span>Launch Drills</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* 10 Subsidiaries Grid */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-[#E5E7EB] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F1F3F5]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#111827]">
                Subsidiary Business Units
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F8F9FA] text-[11px] font-semibold text-[#475569] border border-[#E2E8F0]">
                10 Entities
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Continuity postures across retail, hospitality, bakery, water production, petroleum, print, and corporate arms.
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="group cursor-pointer rounded-xl p-4 bg-[#F8F9FA] hover:bg-white hover:border-[#CBD5E1] border border-[#E5E7EB] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-metrics text-xs font-bold px-2 py-0.5 rounded-lg bg-white border border-[#E2E8F0] text-[#111827]">
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
                    <div className="text-[11px] text-[#64748B] mt-0.5">{unit.location}</div>
                  </div>

                  <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                    {unit.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
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
      <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#103E2E]" />
            <h4 className="text-xs font-bold text-[#111827]">University of Ibadan</h4>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed max-w-xl">
            Multi-Unit Disaster Recovery Planning System (DRPS) prototype demonstrating ISO 22301 and NIST SP 800-34 principles tailored for commercial subsidiary holding companies.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('dashboard')}
          className="shrink-0 px-4 py-2 bg-[#0A261D] text-white hover:bg-[#14533D] text-xs font-semibold rounded-xl transition-colors"
        >
          Open Dashboard
        </button>
      </section>
    </div>
  );
};
