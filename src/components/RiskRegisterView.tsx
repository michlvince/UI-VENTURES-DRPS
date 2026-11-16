'use client';

import React, { useState } from 'react';
import { RiskItem } from '@/types/drps';

interface RiskRegisterViewProps {
  risks: RiskItem[];
  onUpdateRisk: (riskId: string, likelihood: number, impact: number) => void;
}

export const RiskRegisterView: React.FC<RiskRegisterViewProps> = ({
  risks,
  onUpdateRisk,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const filteredRisks = risks.filter((r) => {
    return selectedCategoryFilter === 'ALL' || r.category === selectedCategoryFilter;
  });

  const categories = Array.from(new Set(risks.map((r) => r.category)));

  // 5x5 heatmap cells
  const matrixCells: { [key: string]: RiskItem[] } = {};
  for (let l = 1; l <= 5; l++) {
    for (let i = 1; i <= 5; i++) {
      matrixCells[`${l}-${i}`] = [];
    }
  }
  risks.forEach((r) => {
    const key = `${r.likelihood}-${r.impact}`;
    if (matrixCells[key]) {
      matrixCells[key].push(r);
    }
  });

  const getHeatmapColor = (l: number, i: number) => {
    const score = l * i;
    if (score >= 20) return 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]';
    if (score >= 10) return 'bg-[#F4F4F5] border-[#E4E4E7] text-[#52525B]';
    if (score >= 5)  return 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]';
    return 'bg-white border-[#E4E4E7] text-[#71717A]';
  };

  const severityBadge = (severity: string) => {
    if (severity === 'Critical') return 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]';
    if (severity === 'High')     return 'bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]';
    return 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#09090B]">
            Enterprise Risk Register & 5x5 Likelihood / Impact Matrix
          </h2>
          <p className="text-xs text-[#52525B] mt-0.5">
            15 catalogued operational, cyber, power, and supply risks. Adjust Likelihood (1-5) and Impact (1-5) to observe live score re-weighting.
          </p>
        </div>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="py-1.5 px-3 text-xs bg-white border border-[#E4E4E7] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F3D2E] text-[#09090B]"
        >
          <option value="ALL">All Categories ({risks.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Heatmap + Severity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5x5 Heatmap */}
        <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#09090B]">
              5x5 Risk Distribution Heatmap
            </h3>
            <span className="text-[11px] text-[#71717A]">
              Rows: Likelihood (1-5) / Cols: Impact (1-5)
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[380px]">
              <div className="grid grid-cols-6 gap-1.5 text-center text-xs">
                <div className="text-[11px] font-semibold text-[#71717A] self-center">L \ I</div>
                <div className="text-[11px] font-semibold text-[#71717A]">1</div>
                <div className="text-[11px] font-semibold text-[#71717A]">2</div>
                <div className="text-[11px] font-semibold text-[#71717A]">3</div>
                <div className="text-[11px] font-semibold text-[#71717A]">4</div>
                <div className="text-[11px] font-semibold text-[#71717A]">5</div>

                {[5, 4, 3, 2, 1].map((l) => (
                  <React.Fragment key={`row-${l}`}>
                    <div className="font-mono-metrics font-bold text-xs text-[#71717A] flex items-center justify-center">
                      L={l}
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => {
                      const key = `${l}-${i}`;
                      const itemsInCell = matrixCells[key] || [];
                      const colorClass = getHeatmapColor(l, i);

                      return (
                        <div
                          key={key}
                          className={`h-14 p-1 rounded-md border flex flex-col justify-between ${colorClass}`}
                        >
                          <div className="text-[9px] font-mono-metrics opacity-75 self-start">
                            {l * i}
                          </div>
                          <div className="flex flex-wrap gap-1 justify-center items-center">
                            {itemsInCell.map((ri) => (
                              <span
                                key={ri.id}
                                title={`${ri.id}: ${ri.title}`}
                                className="text-[9px] font-mono-metrics font-bold px-1 py-0.5 bg-white/90 border rounded text-[#09090B]"
                              >
                                {ri.id}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Severity summary */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#09090B]">
              Risk Severity Breakdown
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-[#FECACA] bg-[#FEF2F2]/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#B91C1C]">Critical (Score 20-25)</div>
                  <div className="text-[11px] text-[#B91C1C]/80 mt-0.5">Immediate holding-wide mitigation</div>
                </div>
                <div className="text-2xl font-bold font-mono-metrics text-[#B91C1C]">
                  {risks.filter((r) => r.severity === 'Critical').length}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#E4E4E7] bg-[#F4F4F5]/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#09090B]">High (Score 10-19)</div>
                  <div className="text-[11px] text-[#52525B] mt-0.5">Unit-level technical failover</div>
                </div>
                <div className="text-2xl font-bold font-mono-metrics text-[#09090B]">
                  {risks.filter((r) => r.severity === 'High').length}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4]/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#15803D]">Moderate (Score 5-9)</div>
                  <div className="text-[11px] text-[#15803D]/80 mt-0.5">Monitored standard runbooks</div>
                </div>
                <div className="text-2xl font-bold font-mono-metrics text-[#15803D]">
                  {risks.filter((r) => r.severity === 'Moderate').length}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#71717A] leading-relaxed pt-2 border-t border-[#E4E4E7]">
              R01 (Power Grid Failure) sits at maximum score 25 (L=5, I=5), requiring centralized 500kVA automated generator transfer across all UI Ventures entities.
            </p>
          </div>
        </div>
      </div>

      {/* Editable Risk Table */}
      <div className="bg-white border border-[#E4E4E7] rounded-xl ring-1 ring-[#E4E4E7]">
        <div className="p-4 border-b border-[#E4E4E7] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#09090B]">
            Risk Register Details ({filteredRisks.length} items)
          </span>
          <span className="text-[11px] text-[#71717A]">
            Use inline dropdowns to test likelihood and impact changes
          </span>
        </div>

        <div className="overflow-x-auto rounded-b-xl">
          <table className="w-full text-left border-collapse text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E4E4E7] text-[#71717A] bg-[#FAFAFA]">
                <th className="py-2.5 px-3 font-medium">Risk ID</th>
                <th className="py-2.5 px-3 font-medium">Title & Category</th>
                <th className="py-2.5 px-3 font-medium text-center">L</th>
                <th className="py-2.5 px-3 font-medium text-center">I</th>
                <th className="py-2.5 px-3 font-medium text-center">Score</th>
                <th className="py-2.5 px-3 font-medium text-center">Severity</th>
                <th className="py-2.5 px-3 font-medium">Mitigation Controls</th>
                <th className="py-2.5 px-3 font-medium text-right">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {filteredRisks.map((risk) => (
                <tr key={risk.id} className="hover:bg-[#FAFAFA] transition-colors duration-100">
                  <td className="py-3 px-3 font-mono-metrics font-bold text-[#09090B] align-top">
                    {risk.id}
                  </td>

                  <td className="py-3 px-3 align-top max-w-xs">
                    <div className="font-semibold text-[#09090B]">{risk.title}</div>
                    <div className="text-[11px] text-[#71717A] mt-0.5">{risk.category}</div>
                    <div className="text-[10px] text-[#52525B] mt-1">
                      Affected: {risk.affectedUnitIds.join(', ')}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center align-top font-mono-metrics">
                    <select
                      value={risk.likelihood}
                      onChange={(e) => onUpdateRisk(risk.id, Number(e.target.value), risk.impact)}
                      className="py-1 px-1.5 border border-[#E4E4E7] rounded text-xs bg-white text-[#09090B]"
                    >
                      {[1, 2, 3, 4, 5].map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3 px-3 text-center align-top font-mono-metrics">
                    <select
                      value={risk.impact}
                      onChange={(e) =>
                        onUpdateRisk(risk.id, risk.likelihood, Number(e.target.value))
                      }
                      className="py-1 px-1.5 border border-[#E4E4E7] rounded text-xs bg-white text-[#09090B]"
                    >
                      {[1, 2, 3, 4, 5].map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3 px-3 text-center align-top font-mono-metrics font-bold text-sm">
                    {risk.score}
                  </td>

                  <td className="py-3 px-3 text-center align-top">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${severityBadge(risk.severity)}`}>
                      {risk.severity}
                    </span>
                  </td>

                  <td className="py-3 px-3 align-top max-w-sm text-xs text-[#52525B]">
                    {risk.mitigationStrategy}
                  </td>

                  <td className="py-3 px-3 text-right align-top font-mono-metrics font-semibold text-[#0F3D2E]">
                    {risk.ownerUnit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
