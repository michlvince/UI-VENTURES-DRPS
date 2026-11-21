'use client';

import React from 'react';
import {
  Menu,
  RotateCcw,
  Compass,
  Wifi,
  WifiOff,
  Database,
} from 'lucide-react';
import { WorkspaceTab } from '@/types/drps';

interface AppHeaderProps {
  currentTab: WorkspaceTab;
  isOnline: boolean;
  storageBytes: number;
  aggregateReadiness: number;
  onOpenMobileMenu: () => void;
  onResetSeedData: () => void;
  onOpenWalkthrough: () => void;
  onQuickSearch?: (query: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentTab,
  isOnline,
  storageBytes,
  aggregateReadiness,
  onOpenMobileMenu,
  onResetSeedData,
  onOpenWalkthrough,
}) => {
  const currentTabTitle = {
    overview: 'Executive Overview',
    dashboard: 'Command Dashboard',
    mart_ledger: 'UI Ventures Mart Continuity Ledger',
    units_bia: 'Subsidiaries & BIA Matrix',
    blast_radius: 'Asset Blast Radius',
    risk_register: 'Risk Register 5×5',
    incident_simulator: 'Incident Simulator',
    backup_assurance: 'Backup Assurance',
    efficiency_storage: 'Efficiency & Storage',
  }[currentTab];

  const kbStorage = (storageBytes / 1024).toFixed(1);

  return (
    <header className="glass-header sticky top-3 z-30 rounded-[18px] px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB] transition-colors"
          title="Open Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#111827]">
              {currentTabTitle}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] text-[10px] font-semibold border border-[#A7F3D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              University of Ibadan
            </span>

            {/* Network / Offline Status Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isOnline
                  ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                  : 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
              }`}
            >
              {isOnline ? (
                <Wifi className="w-3 h-3 text-[#16A34A]" />
              ) : (
                <WifiOff className="w-3 h-3 text-[#DC2626]" />
              )}
              <span>{isOnline ? 'Online Sync' : 'Localhost / Offline Ready'}</span>
            </span>
          </div>
          <p className="text-[11px] text-[#6B7280] hidden sm:block mt-0.5">
            UI Ventures Limited Disaster Recovery Planning System (DRPS)
          </p>
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
        {/* Storage Size Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-[11px] text-[#4B5563]">
          <Database className="w-3 h-3 text-[#103E2E]" />
          <span className="font-mono-metrics font-bold">{kbStorage} KB</span>
          <span className="text-[10px] text-[#9CA3AF]">Native</span>
        </div>

        {/* Readiness Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[#6B7280]">Readiness:</span>
          <span className="font-mono-metrics font-bold text-[#0A261D]">
            {aggregateReadiness.toFixed(1)}%
          </span>
        </div>

        {/* Reset / Seed Default Data Button */}
        <button
          onClick={onResetSeedData}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-[#F3F4F6] text-xs font-semibold text-[#374151] border border-[#E5E7EB] transition-colors shadow-xs"
          title="Reset or seed default UI Ventures data"
        >
          <RotateCcw className="w-3 h-3 text-[#103E2E]" />
          <span className="hidden sm:inline">Seed Default</span>
        </button>

        {/* Guided Tour Trigger */}
        <button
          onClick={onOpenWalkthrough}
          className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#0A261D] hover:bg-[#154E3A] text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Compass className="w-3.5 h-3.5 text-[#4ADE80]" />
          <span className="hidden sm:inline">Tour</span>
        </button>
      </div>
    </header>
  );
};
