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
    <header className="glass-header sticky top-0 z-30 px-5 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#F8F9FA] text-[#111827] hover:bg-[#F1F3F5] border border-[#E5E7EB] transition-colors"
          title="Open Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#111827]">
              {currentTabTitle}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] text-[11px] font-medium border border-[#BBF7D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              University of Ibadan
            </span>

            {/* Network / Offline Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                isOnline
                  ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                  : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
              }`}
            >
              {isOnline ? (
                <Wifi className="w-3 h-3 text-[#16A34A]" />
              ) : (
                <WifiOff className="w-3 h-3 text-[#DC2626]" />
              )}
              <span>{isOnline ? 'Online Sync' : 'Localhost Offline'}</span>
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] hidden sm:block mt-0.5">
            UI Ventures Limited Disaster Recovery Planning System (DRPS)
          </p>
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        {/* Storage Size Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#475569]">
          <Database className="w-3 h-3 text-[#103E2E]" />
          <span className="font-mono-metrics font-semibold">{kbStorage} KB</span>
          <span className="text-[10px] text-[#94A3B8]">Native</span>
        </div>

        {/* Readiness Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <span className="text-[#64748B]">Readiness:</span>
          <span className="font-mono-metrics font-bold text-[#0A261D]">
            {aggregateReadiness.toFixed(1)}%
          </span>
        </div>

        {/* Reset / Seed Default Data Button */}
        <button
          onClick={onResetSeedData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8F9FA] text-xs font-semibold text-[#334155] border border-[#E5E7EB] transition-colors"
          title="Reset or seed default UI Ventures data"
        >
          <RotateCcw className="w-3 h-3 text-[#103E2E]" />
          <span className="hidden sm:inline">Seed Default</span>
        </button>

        {/* Guided Tour Trigger */}
        <button
          onClick={onOpenWalkthrough}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0A261D] hover:bg-[#154E3A] text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Compass className="w-3.5 h-3.5 text-[#4ADE80]" />
          <span className="hidden sm:inline">Tour</span>
        </button>
      </div>
    </header>
  );
};
