'use client';

import React, { useState } from 'react';
import {
  Building2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Compass,
  GitFork,
  FileSpreadsheet,
  Layers,
  ShoppingBag,
  Hotel,
  Droplets,
  Fuel,
  UtensilsCrossed,
  ShieldCheck,
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
  const [activeFilterPill, setActiveFilterPill] = useState<string>('all');

  const filteredUnits =
    activeFilterPill === 'all'
      ? units
      : units.filter((u) => u.id === activeFilterPill);

  const heroDockPills = [
    { id: 'all', label: 'All Units', icon: Layers },
    { id: 'UV-MRT', label: 'Mart POS', icon: ShoppingBag },
    { id: 'UV-HOT', label: 'Hospitality', icon: Hotel },
    { id: 'UV-WAT', label: 'Water Factory', icon: Droplets },
    { id: 'UV-PET', label: 'Petroleum', icon: Fuel },
    { id: 'UV-BAK', label: 'Bakery', icon: UtensilsCrossed },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. EDITORIAL CENTERED HERO HEADER */}
      <section className="pt-4 pb-2 text-center max-w-3xl mx-auto space-y-4 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#1B5E20] text-[11px] font-bold tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span>University of Ibadan Holding Company Continuity System</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] leading-[1.1]">
          Autonomous Holding Continuity, On Demand
        </h1>

        <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-xl mx-auto font-normal">
          Streamline holding disaster response, make automated RTO/RPO decisions, and maintain complete offline operational readiness across 10 commercial subsidiaries.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A261D] hover:bg-[#103E2E] text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Command Centre</span>
            <ArrowRight className="w-4 h-4 text-[#4ADE80]" />
          </button>

          <button
            onClick={onStartWalkthrough}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-[#F8F9FA] text-[#111827] border border-[#E5E7EB] text-xs sm:text-sm font-semibold rounded-full transition-all shadow-xs"
          >
            <Compass className="w-4 h-4 text-[#16A34A]" />
            <span>8-Step Tour</span>
          </button>
        </div>
      </section>

      {/* 2. LARGE ROUNDED HERO SHOWCASE VIEWPORT */}
      <section className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#061C14] via-[#0A261D] to-[#103E2E] border border-[#164E3A]/50 shadow-2xl p-6 sm:p-9 text-white">
        {/* Subtle atmospheric ambient glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4ADE80]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#22C55E]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Bar: Headline & Operational Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Live Continuity Telemetry</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[#86EFAC] font-mono-metrics">
                10 Units Armed
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 font-medium inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>ISO 22301 &amp; NIST SP 800-34 Aligned</span>
              </span>
            </div>
          </div>

          {/* Interactive Hero Content: Metric + Live Unit Spotlight Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Col: High-Impact Posture Gauge */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-6xl sm:text-7xl lg:text-8xl font-black font-mono-metrics tracking-tight text-white flex items-baseline gap-1">
                <span>{aggregateReadiness.toFixed(0)}</span>
                <span className="text-3xl sm:text-4xl font-normal text-[#4ADE80]">%</span>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-white tracking-wide">
                  Enterprise Resilience Posture
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-normal">
                  Composite readiness score calculated across 10 commercial subsidiaries and 16 tier-1 processes. Fully autonomous local persistence with {(storageBytes / 1024).toFixed(1)} KB offline storage.
                </p>
              </div>

              {/* Quick Stat Micro-Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px]">
                  <span className="text-white/60">Air-Gapped SOPs: </span>
                  <span className="font-bold text-[#86EFAC]">9 Drills</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px]">
                  <span className="text-white/60">POS Failover: </span>
                  <span className="font-bold text-[#4ADE80]">Active</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px]">
                  <span className="text-white/60">Assets Mapped: </span>
                  <span className="font-bold text-white">20 Nodes</span>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Unit Spotlight Preview Box */}
            <div className="lg:col-span-7 bg-black/25 rounded-2xl p-5 border border-white/10 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {activeFilterPill === 'all'
                      ? 'Subsidiary Matrix Preview'
                      : `${activeFilterPill} Focus Snapshot`}
                  </span>
                </div>

                <button
                  onClick={() => onNavigateTab(activeFilterPill === 'UV-MRT' ? 'mart_ledger' : 'units_bia')}
                  className="text-xs text-[#86EFAC] hover:text-white font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Launch Deep Dive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dynamic Focus Content based on pill selection */}
              {activeFilterPill === 'all' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {units.slice(0, 6).map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setActiveFilterPill(u.id)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono-metrics text-[11px] font-bold text-[#86EFAC]">{u.id}</span>
                        <span className="font-mono-metrics text-[11px] text-white/90">{u.currentReadiness.toFixed(0)}%</span>
                      </div>
                      <div className="text-xs font-medium text-white/90 truncate mt-1 group-hover:text-white">{u.name}</div>
                    </button>
                  ))}
                </div>
              ) : (
                (() => {
                  const focusedUnit = units.find((u) => u.id === activeFilterPill) || units[0];
                  return (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-[#4ADE80] text-[#0A261D] font-mono-metrics text-xs font-bold">
                              {focusedUnit.id}
                            </span>
                            <span className="text-sm font-bold text-white">{focusedUnit.name}</span>
                          </div>
                          <p className="text-xs text-white/70 mt-1">{focusedUnit.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold font-mono-metrics text-[#4ADE80]">
                            {focusedUnit.currentReadiness.toFixed(1)}%
                          </div>
                          <div className="text-[10px] text-white/50 uppercase">Readiness</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs">
                        <div className="bg-white/5 p-2 rounded-lg">
                          <div className="text-[10px] text-white/60">Location</div>
                          <div className="font-medium text-white truncate mt-0.5">{focusedUnit.location}</div>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg">
                          <div className="text-[10px] text-white/60">Head of Unit</div>
                          <div className="font-medium text-white truncate mt-0.5">{focusedUnit.headOfUnit}</div>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg">
                          <div className="text-[10px] text-white/60">Staff Armed</div>
                          <div className="font-medium text-white mt-0.5 font-mono-metrics">{focusedUnit.primaryStaffCount} personnel</div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Bottom Row inside Box: Floating Pill Dock */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-[11px] text-white/60 font-medium hidden sm:inline">Select Subsidiary:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                  {heroDockPills.map((pill) => {
                    const Icon = pill.icon;
                    const isActive = activeFilterPill === pill.id;
                    return (
                      <button
                        key={pill.id}
                        onClick={() => setActiveFilterPill(pill.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                          isActive
                            ? 'bg-white text-[#0A261D] shadow-sm'
                            : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20 border border-white/10'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0A261D]' : 'text-white/70'}`} />
                        <span>{pill.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4 PILLARS GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('units_bia')}
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#103E2E]/40 hover:shadow-md transition-all"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-semibold border border-[#BBF7D0]">
              <Building2 className="w-5 h-5 text-[#103E2E]" />
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
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#103E2E]/40 hover:shadow-md transition-all"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-semibold border border-[#BBF7D0]">
              <GitFork className="w-5 h-5 text-[#103E2E]" />
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
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#103E2E]/40 hover:shadow-md transition-all"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-semibold border border-[#BBF7D0]">
              <AlertTriangle className="w-5 h-5 text-[#103E2E]" />
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
          className="card-elevation-sm p-5 cursor-pointer flex flex-col justify-between group rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#103E2E]/40 hover:shadow-md transition-all"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-semibold border border-[#BBF7D0]">
              <Flame className="w-5 h-5 text-[#103E2E]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#103E2E] transition-colors">
              Disaster Drills &amp; Runbooks
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

      {/* 4. SUBSIDIARIES DIRECTORY */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-[#E5E7EB] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F1F3F5]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#111827]">
                Subsidiary Business Units
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F8F9FA] text-[11px] font-semibold text-[#475569] border border-[#E2E8F0]">
                {filteredUnits.length} of {units.length} Displayed
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
          {filteredUnits.map((unit) => {
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

      {/* 5. INSTITUTIONAL BASELINE FOOTER */}
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('efficiency_storage')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#103E2E] hover:bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Governance Audit</span>
          </button>

          <button
            onClick={() => onNavigateTab('dashboard')}
            className="shrink-0 px-4 py-2 bg-[#0A261D] text-white hover:bg-[#14533D] text-xs font-semibold rounded-xl transition-colors"
          >
            Open Dashboard
          </button>
        </div>
      </section>
    </div>
  );
};
