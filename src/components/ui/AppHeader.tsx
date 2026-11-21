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
  onSelectTab?: (tab: WorkspaceTab) => void;
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
  onSelectTab,
  isOnline,
  storageBytes,
  aggregateReadiness,
  onOpenMobileMenu,
  onResetSeedData,
  onOpenWalkthrough,
}) => {
  const kbStorage = (storageBytes / 1024).toFixed(1);

  const navLinks: { id: WorkspaceTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'dashboard', label: 'Command' },
    { id: 'mart_ledger', label: 'Mart POS', count: 16 },
    { id: 'units_bia', label: 'Units & BIA', count: 10 },
    { id: 'blast_radius', label: 'Blast Radius' },
    { id: 'risk_register', label: 'Risks', count: 16 },
    { id: 'incident_simulator', label: 'Drills', count: 9 },
  ];

  return (
    <header className="sticky top-3 z-30 flex items-center justify-between gap-3 w-full">
      {/* Mobile menu trigger */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-full bg-white text-[#111827] hover:bg-[#F1F3F5] border border-[#E5E7EB] shadow-xs transition-colors"
          title="Open Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Center Floating Pill Navbar (from Inspiration) */}
      <nav className="glass-header-pill px-2.5 py-1.5 flex items-center gap-1 shadow-md max-w-full overflow-x-auto no-scrollbar mx-auto">
        {navLinks.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab && onSelectTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#86EFAC] text-[#0A261D] shadow-xs'
                  : 'text-[#475569] hover:text-[#111827] hover:bg-black/[0.04]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-[#0A261D] text-white'
                      : 'bg-[#E2E8F0] text-[#475569]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls Pill */}
      <div className="glass-header-pill px-3 py-1.5 flex items-center gap-2 shrink-0 shadow-md">
        {/* Network status */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            isOnline
              ? 'bg-[#F0FDF4] text-[#16A34A]'
              : 'bg-[#FEF2F2] text-[#DC2626]'
          }`}
          title={isOnline ? 'Online Sync Active' : 'Offline Native Persistence'}
        >
          {isOnline ? (
            <Wifi className="w-3 h-3 text-[#16A34A]" />
          ) : (
            <WifiOff className="w-3 h-3 text-[#DC2626]" />
          )}
          <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </span>

        {/* Readiness Metric */}
        <div className="hidden sm:flex items-center gap-1 text-xs">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <span className="font-mono-metrics font-bold text-[#0A261D]">
            {aggregateReadiness.toFixed(0)}%
          </span>
        </div>

        {/* Native Storage */}
        <div className="hidden md:flex items-center gap-1 text-xs text-[#64748B]">
          <Database className="w-3 h-3 text-[#103E2E]" />
          <span className="font-mono-metrics font-medium text-[#111827]">{kbStorage} KB</span>
        </div>

        {/* Reset / Tour Buttons */}
        <button
          onClick={onResetSeedData}
          className="p-1.5 rounded-full hover:bg-black/5 text-[#475569] hover:text-[#111827] transition-colors"
          title="Reset or seed default UI Ventures data"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#103E2E]" />
        </button>

        <button
          onClick={onOpenWalkthrough}
          className="inline-flex items-center gap-1 px-3 py-1 bg-[#0A261D] hover:bg-[#154E3A] text-white text-xs font-semibold rounded-full transition-all shadow-xs"
        >
          <Compass className="w-3.5 h-3.5 text-[#4ADE80]" />
          <span className="hidden sm:inline">Tour</span>
        </button>
      </div>
    </header>
  );
};
