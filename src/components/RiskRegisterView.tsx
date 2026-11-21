'use client';

import React, { useState } from 'react';
import { RiskItem } from '@/types/drps';
import { StatusBadge } from './ui/StatusBadge';

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

  // Generate 5x5 matrix cells
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
    if (score >= 20) return 'bg-[#FEE2E2] border-[#FECACA] text-[#DC2626]';
    if (score >= 10) return 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]';
    if (score >= 5) return 'bg-[#DCFCE7] border-[#BBF7D0] text-[#16A34A]';
    return 'bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280]';
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      {/* Header Bento Card */}
      <div className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
            Enterprise Risk Register & 5×5 Heatmap Matrix
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            {risks.length} catalogued risks spanning power, equipment, cyber, and logistics. Adjust Likelihood (1–5) and Impact (1–5) to recompute scores.
          </p>
        </div>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="py-1.5 px-3.5 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#103E2E] text-[#111827] font-semibold"
        >
          <option value="ALL">All Categories ({risks.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Heatmap & Breakdown Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* 5x5 Heatmap Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[20px] p-5 sm:p-6 shadow-xs border border-[#E5E7EB] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111827]">
              5×5 Risk Distribution Matrix
            </h3>
            <span className="text-[11px] text-[#6B7280]">
              Rows: Likelihood (1–5) • Columns: Impact (1–5)
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[420px]">
              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                <div className="text-[11px] font-bold text-[#6B7280] self-center">L \ I</div>
                <div className="text-[11px] font-semibold text-[#6B7280]">1 (Minor)</div>
                <div className="text-[11px] font-semibold text-[#6B7280]">2</div>
                <div className="text-[11px] font-semibold text-[#6B7280]">3 (Moderate)</div>
                <div className="text-[11px] font-semibold text-[#6B7280]">4</div>
                <div className="text-[11px] font-semibold text-[#6B7280]">5 (Critical)</div>

                {[5, 4, 3, 2, 1].map((l) => (
                  <React.Fragment key={`row-${l}`}>
                    <div className="font-mono-metrics font-bold text-xs text-[#6B7280] flex items-center justify-center">
                      L={l}
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => {
                      const key = `${l}-${i}`;
                      const itemsInCell = matrixCells[key] || [];
                      const colorClass = getHeatmapColor(l, i);

                      return (
                        <div
                          key={key}
                          className={`h-14 p-1.5 rounded-xl border flex flex-col justify-between transition-transform duration-100 hover:scale-[1.02] ${colorClass}`}
                        >
                          <div className="text-[9px] font-mono-metrics font-bold opacity-75 self-start">
                            {l * i}
                          </div>
                          <div className="flex flex-wrap gap-1 justify-center items-center">
                            {itemsInCell.map((ri) => (
                              <span
                                key={ri.id}
                                title={`${ri.id}: ${ri.title}`}
                                className="text-[9px] font-mono-metrics font-bold px-1.5 py-0.2 bg-white rounded-md shadow-xs text-[#111827] border border-black/[0.06]"
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

        {/* Severity Count Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-xs border border-[#E5E7EB] space-y-4">
            <h3 className="text-sm font-bold text-[#111827]">
              Risk Severity Breakdown
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#FEE2E2]/60 border border-[#FECACA] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#DC2626]">Critical (Score 20–25)</div>
                  <div className="text-[11px] text-[#991B1B]/80 mt-0.5">Holding-wide immediate mitigation</div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono-metrics text-[#DC2626]">
                  {risks.filter((r) => r.severity === 'Critical').length}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FEF3C7]/60 border border-[#FDE68A] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#D97706]">High (Score 10–19)</div>
                  <div className="text-[11px] text-[#B45309]/80 mt-0.5">Unit-level technical failover</div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono-metrics text-[#D97706]">
                  {risks.filter((r) => r.severity === 'High').length}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#DCFCE7]/60 border border-[#BBF7D0] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#16A34A]">Moderate (Score 5–9)</div>
                  <div className="text-[11px] text-[#15803D]/80 mt-0.5">Standard monitored runbooks</div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono-metrics text-[#16A34A]">
                  {risks.filter((r) => r.severity === 'Moderate').length}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#6B7280] leading-relaxed pt-3 border-t border-[#E5E7EB]">
              R01 (Campus Power Grid Outage) is rated maximum score 25 (L=5, I=5), requiring centralized 500kVA automated generator transfer across UI Ventures facilities.
            </p>
          </div>
        </div>
      </div>

      {/* Editable Risk Table Bento */}
      <div className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB]">
        <div className="pb-3 border-b border-[#E5E7EB] flex items-center justify-between">
          <span className="text-sm font-bold text-[#111827]">
            Risk Register Details ({filteredRisks.length} items)
          </span>
          <span className="text-[11px] text-[#6B7280]">
            Use dropdowns to simulate probability shifts
          </span>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse text-xs min-w-[750px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280] bg-[#F9FAFB] rounded-xl">
                <th className="py-2.5 px-3.5 font-semibold rounded-l-xl">ID</th>
                <th className="py-2.5 px-3.5 font-semibold">Title & Category</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">Likelihood</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">Impact</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">Score (L×I)</th>
                <th className="py-2.5 px-3.5 font-semibold text-center">Severity</th>
                <th className="py-2.5 px-3.5 font-semibold">Mitigation Strategy</th>
                <th className="py-2.5 px-3.5 font-semibold text-right rounded-r-xl">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredRisks.map((risk) => (
                <tr key={risk.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-3.5 font-mono-metrics font-bold text-[#111827] align-top">
                    {risk.id}
                  </td>

                  <td className="py-3 px-3.5 align-top max-w-xs">
                    <div className="font-bold text-[#111827]">{risk.title}</div>
                    <div className="text-[11px] text-[#6B7280] mt-0.5">{risk.category}</div>
                    <div className="text-[10px] text-[#9CA3AF] mt-1">
                      Units: {risk.affectedUnitIds.join(', ')}
                    </div>
                  </td>

                  <td className="py-3 px-3.5 text-center align-top font-mono-metrics">
                    <select
                      value={risk.likelihood}
                      onChange={(e) => onUpdateRisk(risk.id, Number(e.target.value), risk.impact)}
                      className="py-1 px-2 border border-[#D1D5DB] rounded-lg text-xs bg-white text-[#111827] font-semibold"
                    >
                      {[1, 2, 3, 4, 5].map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3 px-3.5 text-center align-top font-mono-metrics">
                    <select
                      value={risk.impact}
                      onChange={(e) =>
                        onUpdateRisk(risk.id, risk.likelihood, Number(e.target.value))
                      }
                      className="py-1 px-2 border border-[#D1D5DB] rounded-lg text-xs bg-white text-[#111827] font-semibold"
                    >
                      {[1, 2, 3, 4, 5].map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3 px-3.5 text-center align-top font-mono-metrics font-extrabold text-sm text-[#111827]">
                    {risk.score}
                  </td>

                  <td className="py-3 px-3.5 text-center align-top">
                    <StatusBadge
                      label={risk.severity}
                      variant={
                        risk.severity === 'Critical'
                          ? 'danger'
                          : risk.severity === 'High'
                          ? 'warning'
                          : 'success'
                      }
                      size="sm"
                    />
                  </td>

                  <td className="py-3 px-3.5 align-top max-w-sm text-xs text-[#4B5563]">
                    {risk.mitigationStrategy}
                  </td>

                  <td className="py-3 px-3.5 text-right align-top font-mono-metrics font-bold text-[#103E2E]">
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
