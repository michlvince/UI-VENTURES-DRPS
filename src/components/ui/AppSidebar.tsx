'use client';

import React from 'react';
import {
  LayoutDashboard,
  Building2,
  GitFork,
  AlertTriangle,
  Flame,
  HardDrive,
  BarChart3,
  Home,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { WorkspaceTab } from '@/types/drps';

interface AppSidebarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  martOfflineActive: boolean;
  aggregateReadiness: number;
  onOpenWalkthrough: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  martOfflineActive,
  aggregateReadiness,
  onOpenWalkthrough,
}) => {
  const primaryNavItems: { id: WorkspaceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'dashboard', label: 'Command Centre', icon: LayoutDashboard },
    { id: 'mart_ledger', label: 'Mart Offline POS', icon: ShoppingCart },
    { id: 'units_bia', label: 'Units & BIA', icon: Building2 },
    { id: 'blast_radius', label: 'Blast Radius', icon: GitFork },
  ];

  const secondaryNavItems: { id: WorkspaceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'risk_register', label: '5×5 Risk Heatmap', icon: AlertTriangle },
    { id: 'incident_simulator', label: 'Incident Drills', icon: Flame },
    { id: 'backup_assurance', label: 'Backup Assurance', icon: HardDrive },
    { id: 'efficiency_storage', label: 'Storage & Governance', icon: BarChart3 },
  ];

  const renderNavButton = (item: { id: WorkspaceTab; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => {
          onSelectTab(item.id);
          onCloseMobile();
        }}
        title={isCollapsed ? item.label : undefined}
        className={`w-full flex items-center ${
          isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2.5'
        } rounded-xl text-xs font-medium transition-all duration-150 ${
          isActive
            ? 'bg-[#154E3A] text-white font-semibold'
            : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4ADE80]' : 'text-white/50'}`} />
          {!isCollapsed && <span className="truncate">{item.label}</span>}
        </div>
        {!isCollapsed && item.id === 'mart_ledger' && martOfflineActive && (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#4ADE80] text-[#0A261D]">
            OFFLINE
          </span>
        )}
        {!isCollapsed && isActive && item.id !== 'mart_ledger' && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Aside Element */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 z-40 bg-[#0A261D] text-white flex flex-col justify-between transition-all duration-200 border-r border-[#14533D]/40 ${
          isCollapsed ? 'w-[72px] p-3' : 'w-[260px] xl:w-[270px] p-5'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                onSelectTab('overview');
                onCloseMobile();
              }}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-[#14533D] flex items-center justify-center font-bold text-xs tracking-tight text-[#4ADE80] shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                UI
              </div>
              {!isCollapsed && (
                <div>
                  <div className="text-sm font-bold tracking-tight text-white group-hover:text-[#4ADE80] transition-colors leading-tight">
                    UI Ventures
                  </div>
                  <div className="text-[10px] text-[#A7F3D0]/70 font-medium">
                    DRPS Enterprise
                  </div>
                </div>
              )}
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-270px)] pr-1">
            {/* Core Modules */}
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="text-[10px] font-semibold tracking-wider text-white/40 uppercase px-3 pb-1">
                  Core Modules
                </div>
              )}
              {primaryNavItems.map(renderNavButton)}
            </div>

            {/* Assurance & Governance */}
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="text-[10px] font-semibold tracking-wider text-white/40 uppercase px-3 pb-1">
                  Assurance & Controls
                </div>
              )}
              {secondaryNavItems.map(renderNavButton)}
            </div>
          </div>
        </div>

        {/* Bottom Sidebar Card: Compliance & Status */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          {!isCollapsed ? (
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span className="text-[11px] font-semibold text-white">ISO 22301</span>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#4ADE80]/20 text-[#4ADE80]">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/60">
                <span>Holdings Readiness</span>
                <span className="font-mono-metrics font-bold text-[#4ADE80]">
                  {aggregateReadiness.toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="font-mono-metrics text-[10px] font-bold text-[#4ADE80]">
                {aggregateReadiness.toFixed(0)}%
              </span>
            </div>
          )}

          <button
            onClick={onOpenWalkthrough}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-2' : 'justify-center gap-2 py-2 px-3'
            } rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors`}
            title="Open 8-step product tour"
          >
            <Compass className="w-3.5 h-3.5 text-[#4ADE80]" />
            {!isCollapsed && <span>Guided Tour</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
