'use client';

import React from 'react';
import {
  Building2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sparkles,
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

export const LandingOverview: React.FC<LandingOverviewProps> = ({
  units,
  aggregateReadiness,
  storageBytes,
  onNavigateTab,
  onStartWalkthrough,
}) => {
  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="bg-white border border-[#E4E4E7] rounded-xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[#0F3D2E] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>CSC 476 Final Year Project Case Study • University of Ibadan</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#09090B] leading-tight">
            UI Ventures Limited Multi-Unit Disaster Recovery Planning System
          </h1>

          <p className="text-sm sm:text-base text-[#52525B] leading-relaxed">
            An enterprise-grade business continuity and disaster recovery planning architecture built for UI Ventures Limited.
            Designed to address multi-unit recovery dependencies across commercial, industrial, hospitality, and corporate operations
            without external database overhead.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F3D2E] hover:bg-[#165B44] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <span>Launch Command Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onStartWalkthrough}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E4E4E7] hover:bg-[#FAFAFA] text-[#09090B] text-xs sm:text-sm font-medium rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#0F3D2E]" />
              <span>Start 7-Step Guided Walkthrough</span>
            </button>

            <button
              onClick={() => onNavigateTab('efficiency_storage')}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs text-[#52525B] hover:text-[#09090B] transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#71717A]" />
              <span>Governance & Export</span>
            </button>
          </div>
        </div>

        {/* Top-Right KPI card */}
        <div className="mt-8 lg:mt-0 lg:absolute lg:top-10 lg:right-10 bg-[#FAFAFA] border border-[#E4E4E7] rounded-lg p-5 w-full sm:w-64 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#71717A] font-medium">Enterprise Posture</span>
            <span className="text-[11px] font-mono-metrics px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified
            </span>
          </div>

          <div>
            <div className="text-3xl font-bold font-mono-metrics text-[#0F3D2E]">
              {aggregateReadiness.toFixed(1)}%
            </div>
            <div className="text-[11px] text-[#52525B] mt-0.5">Aggregate Subsidiary Readiness</div>
          </div>

          <div className="pt-2 border-t border-[#E4E4E7] flex items-center justify-between text-xs text-[#71717A]">
            <span>Local Storage Engine</span>
            <span className="font-mono-metrics text-[#09090B] font-medium">
              {(storageBytes / 1024).toFixed(2)} KB
            </span>
          </div>
        </div>
      </section>

      {/* 9 Subsidiaries Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h2 className="text-lg font-semibold text-[#09090B]">9 Subsidiary Business Units</h2>
            <p className="text-xs text-[#52525B]">
              Federated business continuity profiles across commercial, service, industrial, and central corporate administrative arms.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('units_bia')}
            className="text-xs text-[#0F3D2E] hover:underline font-medium flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Detailed BIA & Process Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {units.map((unit) => {
            const isHigh = unit.currentReadiness >= 85;
            const isMedium = unit.currentReadiness >= 75 && unit.currentReadiness < 85;

            return (
              <div
                key={unit.id}
                onClick={() => onNavigateTab('units_bia')}
                className="group cursor-pointer bg-white border border-[#E4E4E7] rounded-lg p-4 hover:border-[#0F3D2E]/40 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-metrics text-xs font-semibold px-2 py-0.5 rounded bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B]">
                      {unit.id}
                    </span>
                    <span
                      className={`text-xs font-mono-metrics font-bold px-2 py-0.5 rounded ${
                        isHigh
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isMedium
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {unit.currentReadiness.toFixed(1)}%
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#09090B] group-hover:text-[#0F3D2E] transition-colors">
                      {unit.name}
                    </h3>
                    <div className="text-[11px] text-[#71717A] mt-0.5">{unit.location}</div>
                  </div>

                  <p className="text-xs text-[#52525B] line-clamp-2 leading-relaxed">
                    {unit.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] text-[#71717A]">
                  <span>Lead: {unit.headOfUnit}</span>
                  <span className="font-mono-metrics">{unit.primaryStaffCount} staff</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architectural Pillars */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[#09090B]">Disaster Recovery Architecture Pillars</h2>
          <p className="text-xs text-[#52525B]">
            Engineered to fulfill university enterprise business impact analysis and continuous operational readiness benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigateTab('units_bia')}
            className="cursor-pointer bg-white border border-[#E4E4E7] rounded-lg p-5 space-y-2.5 hover:border-[#0F3D2E] transition-colors"
          >
            <div className="w-8 h-8 rounded-md bg-[#ECFDF5] text-[#0F3D2E] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#09090B]">14 Critical Processes & BIA</h3>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Granular Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) calibrated per unit from 2h to 12h.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('blast_radius')}
            className="cursor-pointer bg-white border border-[#E4E4E7] rounded-lg p-5 space-y-2.5 hover:border-[#0F3D2E] transition-colors"
          >
            <div className="w-8 h-8 rounded-md bg-[#ECFDF5] text-[#0F3D2E] flex items-center justify-center">
              <GitFork className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#09090B]">Shared Blast Radius Matrix</h3>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Cross-dependency mapping for shared campus utilities (A13 Fibre/ISP, A14 33kV Power) cascading across units.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('risk_register')}
            className="cursor-pointer bg-white border border-[#E4E4E7] rounded-lg p-5 space-y-2.5 hover:border-[#0F3D2E] transition-colors"
          >
            <div className="w-8 h-8 rounded-md bg-[#ECFDF5] text-[#0F3D2E] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#09090B]">5x5 Risk Likelihood / Impact</h3>
            <p className="text-xs text-[#52525B] leading-relaxed">
              15 enterprise risks dynamically scored from R01 Grid Failure to R15 Staff Unavailability with live slider updates.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('incident_simulator')}
            className="cursor-pointer bg-white border border-[#E4E4E7] rounded-lg p-5 space-y-2.5 hover:border-[#0F3D2E] transition-colors"
          >
            <div className="w-8 h-8 rounded-md bg-[#ECFDF5] text-[#0F3D2E] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#09090B]">8 Incident Simulations</h3>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Step-by-step phased runbooks, automated RTO compliance checks (6 MET, 2 MISSED), and live disaster drills.
            </p>
          </div>
        </div>
      </section>

      {/* Case Study Project Credit Banner */}
      <section className="bg-[#0F3D2E] text-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="text-xs uppercase tracking-wider text-[#A7F3D0] font-mono-metrics">
            CSC 476 Course Project
          </div>
          <h3 className="text-lg font-semibold text-white">
            Department of Computer Science • University of Ibadan
          </h3>
          <p className="text-xs text-[#D1FAE5] leading-relaxed">
            Multi-Unit Disaster Recovery Planning System (DRPS) prototype demonstrating ISO 22301 and NIST SP 800-34 principles
            tailored for commercial subsidiary holding companies.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('dashboard')}
          className="shrink-0 px-4 py-2 bg-white text-[#0F3D2E] hover:bg-[#ECFDF5] text-xs font-semibold rounded-lg transition-colors"
        >
          Open Executive Dashboard
        </button>
      </section>
    </div>
  );
};
