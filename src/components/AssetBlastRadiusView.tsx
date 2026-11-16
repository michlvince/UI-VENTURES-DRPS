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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-[#09090B]">
          Infrastructure Cross-Dependency & Blast Radius Engine
        </h2>
        <p className="text-xs text-[#52525B] mt-0.5">
          Interactive dependency mapping across 18 enterprise assets. Click any equipment or shared utility to calculate impacted subsidiaries, cascading downtime, and strictest recovery deadlines.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Asset Catalog */}
        <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
            <span className="text-xs font-semibold text-[#09090B]">
              18 Catalogued Assets (A01 - A18)
            </span>
            <span className="font-mono-metrics text-[11px] text-[#52525B]">
              {assets.filter((a) => a.isShared).length} shared utilities
            </span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {assets.map((asset) => {
              const isSelected = asset.id === selectedAssetId;
              const isShared = asset.isShared;

              return (
                <div
                  key={asset.id}
                  onClick={() => onSelectAssetId(asset.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-[border-color,background-color] duration-150 ${
                    isSelected
                      ? 'border-[#0F3D2E] bg-[#ECFDF5]/40'
                      : 'border-[#E4E4E7] bg-white hover:border-[#D4D4D8] hover:bg-[#FAFAFA]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono-metrics font-bold text-xs text-[#09090B]">
                        {asset.id}
                      </span>
                      {isShared && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[#0F3D2E] text-white">
                          SHARED
                        </span>
                      )}
                      {!isShared && (
                        <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-[#F4F4F5] text-[#52525B]">
                          {asset.primaryUnitId}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        asset.redundancyLevel === 'Single Point of Failure'
                          ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                          : 'bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]'
                      }`}
                    >
                      {asset.redundancyLevel}
                    </span>
                  </div>

                  <h4 className="text-xs font-medium text-[#09090B] mt-1.5 line-clamp-1">
                    {asset.name}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-[#71717A] mt-2">
                    <span>{asset.category}</span>
                    <span className="font-mono-metrics">
                      {asset.dependentProcessIds.length} procs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blast Radius Analysis */}
        <div className="lg:col-span-7 space-y-5">
          {selectedAsset ? (
            <>
              {/* Asset Header */}
              <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-metrics text-sm font-bold px-2 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B]">
                        {selectedAsset.id}
                      </span>
                      <h3 className="text-base font-semibold text-[#09090B]">
                        {selectedAsset.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed">
                      {selectedAsset.description}
                    </p>
                  </div>

                  {selectedAsset.redundancyLevel === 'Single Point of Failure' && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] rounded-md shrink-0">
                      <AlertOctagon className="w-4 h-4" />
                      <span className="text-[11px] font-medium">SPOF</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E4E4E7] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#71717A]">Category</span>
                    <div className="font-medium text-[#09090B] mt-0.5">{selectedAsset.category}</div>
                  </div>
                  <div>
                    <span className="text-[#71717A]">Primary Owner</span>
                    <div className="font-mono-metrics font-medium text-[#09090B] mt-0.5">
                      {selectedAsset.primaryUnitId}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#71717A]">Maintenance</span>
                    <div className="text-[#52525B] mt-0.5 text-[11px]">
                      {selectedAsset.maintenanceSchedule}
                    </div>
                  </div>
                </div>
              </div>

              {/* Computed Metrics Strip - flat row, no nesting */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-[#E4E4E7] rounded-lg p-3.5 space-y-1">
                  <div className="text-[11px] text-[#71717A]">Impacted Units</div>
                  <div className="text-2xl font-bold font-mono-metrics text-[#0F3D2E]">
                    {blastData.impactedUnits.length} / 9
                  </div>
                  <div className="text-[11px] text-[#52525B]">
                    {blastData.impactedUnits.length === 9 ? 'Full enterprise' : 'Unit-isolated'}
                  </div>
                </div>

                <div className="bg-white border border-[#E4E4E7] rounded-lg p-3.5 space-y-1">
                  <div className="text-[11px] text-[#71717A]">Impacted Processes</div>
                  <div className="text-2xl font-bold font-mono-metrics text-[#09090B]">
                    {blastData.impactedProcesses.length} / 14
                  </div>
                  <div className="text-[11px] text-[#52525B]">Direct operational halt</div>
                </div>

                <div className="bg-white border border-[#E4E4E7] rounded-lg p-3.5 space-y-1">
                  <div className="text-[11px] text-[#71717A]">Strictest RTO</div>
                  <div className="text-2xl font-bold font-mono-metrics text-[#B91C1C]">
                    {blastData.strictestRtoHours !== null ? `${blastData.strictestRtoHours}h` : 'N/A'}
                  </div>
                  <div className="text-[11px] text-[#52525B]">Recovery failover window</div>
                </div>
              </div>

              {/* Impacted Subsidiary Units */}
              <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-semibold text-[#09090B]">
                  Impacted Subsidiary Units ({blastData.impactedUnits.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {blastData.impactedUnits.map((u) => (
                    <div
                      key={u.id}
                      className="px-2.5 py-1.5 rounded-md border border-[#E4E4E7] bg-[#FAFAFA] flex items-center gap-2 text-xs"
                    >
                      <span className="font-mono-metrics font-bold text-[#0F3D2E]">{u.id}</span>
                      <span className="text-[#09090B] font-medium">{u.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cascading Processes */}
              <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-semibold text-[#09090B]">
                  Cascading Impacted Processes ({blastData.impactedProcesses.length})
                </h4>

                <div className="space-y-2">
                  {blastData.impactedProcesses.map((proc) => (
                    <div
                      key={proc.id}
                      className="p-3 border border-[#E4E4E7] rounded-lg flex items-center justify-between gap-4 bg-[#FAFAFA]"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-metrics font-bold text-xs text-[#09090B]">
                            {proc.id}
                          </span>
                          <span className="font-mono-metrics text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E4E4E7] text-[#52525B]">
                            {proc.unitId}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              proc.criticality === 'Critical'
                                ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                                : 'bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]'
                            }`}
                          >
                            {proc.criticality}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-[#09090B]">{proc.name}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-[#71717A]">Target RTO</div>
                        <div className="font-mono-metrics font-bold text-xs text-[#B91C1C]">
                          {proc.rtoHours}h
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-[#E4E4E7] rounded-xl p-8 text-center text-[#71717A] text-xs">
              Select an asset from the catalog to compute live blast radius.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
