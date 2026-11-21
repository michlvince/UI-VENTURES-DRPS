'use client';

import React from 'react';
import {
  AlertOctagon,
} from 'lucide-react';
import {
  InfrastructureAsset,
  BusinessProcess,
  BusinessUnit,
} from '@/types/drps';
import { getAssetBlastRadius } from '@/lib/drpsEngine';
import { StatusBadge } from './ui/StatusBadge';

interface AssetBlastRadiusViewProps {
  assets: InfrastructureAsset[];
  processes: BusinessProcess[];
  units: BusinessUnit[];
  selectedAssetId: string;
  onSelectAssetId: (assetId: string) => void;
}

export const AssetBlastRadiusView: React.FC<AssetBlastRadiusViewProps> = ({
  assets,
  processes,
  units,
  selectedAssetId,
  onSelectAssetId,
}) => {
  const blastData = getAssetBlastRadius(selectedAssetId, assets, processes, units);
  const selectedAsset = blastData.asset;

  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      {/* Header Bento Box */}
      <div className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB]">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
          Infrastructure Dependency & Blast Radius Engine
        </h2>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Cascading impact simulator for shared campus assets. Click any equipment or utility to view affected subsidiaries and strictest recovery thresholds.
        </p>
      </div>

      {/* Main Grid: Left Assets List (5 cols) + Right Blast Radius Details (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Column: Assets List */}
        <div className="lg:col-span-5 bg-white rounded-[20px] p-5 sm:p-6 shadow-xs border border-[#E5E7EB] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
            <span className="text-xs font-bold text-[#111827]">
              {assets.length} Catalogued Assets (A01 - A{assets.length})
            </span>
            <span className="font-mono-metrics text-[11px] font-semibold text-[#103E2E]">
              {assets.filter((a) => a.isShared).length} Shared Utilities
            </span>
          </div>

          <div className="space-y-2 max-h-[660px] overflow-y-auto pr-1">
            {assets.map((asset) => {
              const isSelected = asset.id === selectedAssetId;
              const isShared = asset.isShared;

              return (
                <div
                  key={asset.id}
                  onClick={() => onSelectAssetId(asset.id)}
                  className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-[#103E2E] bg-[#ECFDF5] shadow-xs'
                      : 'border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F3F4F6] hover:border-[#D1D5DB]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-metrics font-bold text-xs text-[#111827]">
                        {asset.id}
                      </span>
                      {isShared ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#0A261D] text-[#4ADE80]">
                          SHARED ALL
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono-metrics font-semibold px-2 py-0.5 rounded-md bg-white border border-[#E5E7EB] text-[#4B5563]">
                          {asset.primaryUnitId}
                        </span>
                      )}
                    </div>

                    <StatusBadge
                      label={asset.redundancyLevel}
                      variant={
                        asset.redundancyLevel === 'Single Point of Failure'
                          ? 'danger'
                          : 'neutral'
                      }
                      size="sm"
                    />
                  </div>

                  <h4 className="text-xs font-bold text-[#111827] mt-1.5 line-clamp-1">
                    {asset.name}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] mt-2">
                    <span>{asset.category}</span>
                    <span className="font-mono-metrics font-semibold text-[#103E2E]">
                      {asset.dependentProcessIds.length} procs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Blast Radius Analysis */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          {selectedAsset ? (
            <>
              {/* Asset Hero Bento */}
              <div className="card-hero-forest text-white p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-metrics text-xs font-bold px-2.5 py-0.5 rounded-lg bg-white/10 text-[#4ADE80]">
                        {selectedAsset.id}
                      </span>
                      <span className="text-xs text-white/60">• Primary: {selectedAsset.primaryUnitId}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                      {selectedAsset.name}
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed max-w-xl">
                      {selectedAsset.description}
                    </p>
                  </div>

                  {selectedAsset.redundancyLevel === 'Single Point of Failure' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#DC2626]/20 border border-[#DC2626]/40 text-[#FCA5A5] rounded-xl shrink-0 text-xs font-semibold">
                      <AlertOctagon className="w-4 h-4" />
                      <span>SPOF Hazard</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-white/60">Category</span>
                    <div className="font-semibold text-white mt-0.5">{selectedAsset.category}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Redundancy</span>
                    <div className="font-semibold text-[#4ADE80] mt-0.5">{selectedAsset.redundancyLevel}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Maintenance</span>
                    <div className="text-white/80 mt-0.5 text-[11px]">{selectedAsset.maintenanceSchedule}</div>
                  </div>
                </div>
              </div>

              {/* Three Impact Metrics Bento Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white rounded-[18px] p-4 sm:p-5 shadow-xs border border-[#E5E7EB] space-y-1">
                  <div className="text-[11px] font-semibold text-[#6B7280]">Impacted Units</div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono-metrics text-[#103E2E]">
                    {blastData.impactedUnits.length} / {units.length}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {blastData.impactedUnits.length === units.length ? 'Full enterprise scope' : 'Localized unit'}
                  </div>
                </div>

                <div className="bg-white rounded-[18px] p-4 sm:p-5 shadow-xs border border-[#E5E7EB] space-y-1">
                  <div className="text-[11px] font-semibold text-[#6B7280]">Halted Processes</div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono-metrics text-[#111827]">
                    {blastData.impactedProcesses.length} / {processes.length}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">Direct operations stopped</div>
                </div>

                <div className="bg-white rounded-[18px] p-4 sm:p-5 shadow-xs border border-[#E5E7EB] space-y-1">
                  <div className="text-[11px] font-semibold text-[#6B7280]">Strictest RTO</div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono-metrics text-[#DC2626]">
                    {blastData.strictestRtoHours !== null ? `${blastData.strictestRtoHours}h` : 'N/A'}
                  </div>
                  <div className="text-[11px] text-[#6B7280]">Max failover window</div>
                </div>
              </div>

              {/* Impacted Subsidiary Units Bento */}
              <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-xs border border-[#E5E7EB] space-y-3">
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Impacted Subsidiary Units ({blastData.impactedUnits.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {blastData.impactedUnits.map((u) => (
                    <div
                      key={u.id}
                      className="px-3 py-1.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center gap-2 text-xs"
                    >
                      <span className="font-mono-metrics font-bold text-[#103E2E]">{u.id}</span>
                      <span className="text-[#111827] font-semibold">{u.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cascading Impacted Processes Detailed Bento */}
              <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-xs border border-[#E5E7EB] space-y-3">
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Cascading Impacted Processes ({blastData.impactedProcesses.length})
                </h4>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {blastData.impactedProcesses.map((proc) => (
                    <div
                      key={proc.id}
                      className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-metrics font-bold text-xs text-[#111827]">
                            {proc.id}
                          </span>
                          <span className="text-[10px] font-mono-metrics px-2 py-0.5 rounded-md bg-white border border-[#E5E7EB] text-[#4B5563]">
                            {proc.unitId}
                          </span>
                          <StatusBadge
                            label={proc.criticality}
                            variant={proc.criticality === 'Critical' ? 'danger' : 'neutral'}
                            size="sm"
                          />
                        </div>
                        <div className="text-xs font-semibold text-[#111827]">{proc.name}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-[#6B7280]">Target RTO</div>
                        <div className="font-mono-metrics font-bold text-xs text-[#DC2626]">
                          {proc.rtoHours}h
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-[20px] p-8 text-center text-[#6B7280] text-xs border border-[#E5E7EB]">
              Select an asset from the left catalog to compute live blast radius.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
