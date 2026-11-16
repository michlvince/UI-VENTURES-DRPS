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

  // Generate 5x5 heatmap cells counts
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
    if (score >= 20) return 'bg-rose-50 border-rose-200 text-rose-800';
    if (score >= 10) return 'bg-amber-50 border-amber-200 text-amber-800';
    if (score >= 5) return 'bg-emerald-50 border-emerald-200 text-emerald-800';
    return 'bg-neutral-50 border-neutral-200 text-neutral-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#09090B]">
            Enterprise Risk Register & 5x5 Likelihood/Impact Matrix
          </h2>
          <p className="text-xs text-[#52525B]">
            15 catalogued operational, cyber, power, and supply risks. Adjust Likelihood (1–5) and Impact (1–5) to observe live score re-weighting and matrix redistribution.
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

      {/* 5x5 Matrix Visualizer & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5x5 Heatmap (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#09090B] uppercase tracking-wider">
              5x5 Qualitative Risk Distribution Heatmap
            </h3>
            <span className="text-[11px] text-[#71717A]">
              Rows: Likelihood (1–5) • Cols: Impact (1–5)
            </span>
          </div>

          <div className="space-y-2">
            {/* Table Matrix 5 down to 1 for L */}
            <div className="grid grid-cols-6 gap-1.5 text-center text-xs">
              <div className="text-[11px] font-semibold text-[#71717A] self-center">L \ I</div>
              <div className="text-[11px] font-semibold text-[#71717A]">1 (Negligible)</div>
              <div className="text-[11px] font-semibold text-[#71717A]">2 (Minor)</div>
              <div className="text-[11px] font-semibold text-[#71717A]">3 (Moderate)</div>
              <div className="text-[11px] font-semibold text-[#71717A]">4 (Major)</div>
              <div className="text-[11px] font-semibold text-[#71717A]">5 (Catastrophic)</div>

              {[5, 4, 3, 2, 1].map((l) => (
                <React.Fragment key={`row-${l}`}>
                  <div className="font-mono-metrics font-bold text-xs text-[#71717A] flex items-center justify-center">
                    L = {l}
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
                              className="text-[9px] font-mono-metrics font-bold px-1 py-0.2 bg-white/90 border rounded shadow-2xs text-[#09090B]"
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

        {/* Severity Count Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-[#09090B] uppercase tracking-wider">
              Risk Severity Breakdown
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-rose-800">Critical (Score 20–25)</div>
                  <div className="text-[11px] text-rose-600">Immediate holding-wide mitigation</div>
                </div>
                <div className="text-2xl font-bold font-mono-metrics text-rose-700">
                  {risks.filter((r) => r.severity === 'Critical').length}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-amber-800">High (Score 10–19)</div>
                  <div className="text-[11px] text-amber-600">Unit-level technical failover</div>
                </div>
                <div className="text-2xl font-bold font-mono-metrics text-amber-700">
                  {risks.filter((r) => r.severity === 'High').length}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-emerald-800">Moderate (Score 5–9)</div>
                  <div className="text-[11px] text-emerald-600">Monitored standard runbooks</div>
                </div>
                <div className="text-2xl font-bold font-mono-metrics text-emerald-700">
                  {risks.filter((r) => r.severity === 'Moderate').length}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#71717A] leading-relaxed pt-2 border-t border-[#E4E4E7]">
              Notice R01 (Power Grid Failure) sits at maximum score 25 (L=5, I=5), requiring centralized 500kVA automated generator transfer across all UI Ventures entities.
            </p>
          </div>
        </div>
      </div>

      {/* Editable Risk Table */}
      <div className="bg-white border border-[#E4E4E7] rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#E4E4E7] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#09090B] uppercase tracking-wider">
            Risk Register Details ({filteredRisks.length} Items)
          </span>
          <span className="text-[11px] text-[#71717A]">
            Use inline dropdowns to test likelihood and impact changes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E4E4E7] text-[#71717A] bg-[#FAFAFA]">
                <th className="py-2.5 px-3 font-medium">Risk ID</th>
                <th className="py-2.5 px-3 font-medium">Title & Category</th>
                <th className="py-2.5 px-3 font-medium text-center">Likelihood (L)</th>
                <th className="py-2.5 px-3 font-medium text-center">Impact (I)</th>
                <th className="py-2.5 px-3 font-medium text-center">Score (L×I)</th>
                <th className="py-2.5 px-3 font-medium text-center">Severity</th>
                <th className="py-2.5 px-3 font-medium">Mitigation Controls</th>
                <th className="py-2.5 px-3 font-medium text-right">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {filteredRisks.map((risk) => {
                return (
                  <tr key={risk.id} className="hover:bg-[#FAFAFA] transition-colors">
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

                    <td className="py-3 px-3 text-center align-top font-mono-metrics">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          risk.severity === 'Critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : risk.severity === 'High'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
