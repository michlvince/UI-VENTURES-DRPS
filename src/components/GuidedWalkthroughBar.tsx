'use client';

import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { WorkspaceTab, WalkthroughStep } from '@/types/drps';

interface GuidedWalkthroughBarProps {
  currentStep: number;
  isDismissed: boolean;
  onSetStep: (step: number) => void;
  onDismiss: () => void;
  onRestore: () => void;
  onNavigateTab: (tab: WorkspaceTab) => void;
  onSelectAsset?: (assetId: string) => void;
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    step: 1,
    title: 'Multi-Unit BIA & RTO Matrix',
    description: 'Inspect the 10 subsidiary units and 16 critical processes including UI Ventures Mart (UV-MRT). Check readiness and test editing RTO hours.',
    targetTab: 'units_bia',
    highlightAction: 'Review UV-MRT, UV-HOT and UV-BAK RTO/RPO requirements',
  },
  {
    step: 2,
    title: 'Shared Infrastructure Blast Radius',
    description: 'Discover how shared asset A13 (Enterprise Network) or A14 (Mains Power) cascades downtime across all subsidiaries.',
    targetTab: 'blast_radius',
    highlightAction: 'Click Asset A13, A14, or A20 (Offline Mart Ledger) to observe blast radius',
  },
  {
    step: 3,
    title: 'Enterprise Risk Matrix (5x5 Heatmap)',
    description: 'Examine 16 enterprise risks including R16 (Mart POS Outage). Adjust Likelihood and Impact sliders to observe live score recomputation.',
    targetTab: 'risk_register',
    highlightAction: 'Inspect R01 Power Outage (25 Critical) and R16 Mart Simultaneous Outage (16)',
  },
  {
    step: 4,
    title: 'Controlled Incident Simulation & Checklist',
    description: 'Run SIM-01 (Campus Outage) or SIM-09 (Mart Offline Ledger Failover). Track task phases and RTO compliance evaluation.',
    targetTab: 'incident_simulator',
    highlightAction: 'Switch to SIM-09 (Mart Offline Drill) to inspect 22m recovery checklist',
  },
  {
    step: 5,
    title: 'UI Ventures Mart Offline Continuity Ledger',
    description: 'Experience offline POS checkout mode, search pre-staged items, record customer sales with stock deduction, and export audit logs.',
    targetTab: 'mart_ledger',
    highlightAction: 'Add items to cart, confirm an offline sale, and export CSV/JSON logs',
  },
  {
    step: 6,
    title: 'Continuous Backup Assurance Log',
    description: 'Verify 4h and 12h RPO synchronization records across on-premise NAS, data center, and immutable vault including Mart backups.',
    targetTab: 'backup_assurance',
    highlightAction: 'Trigger a simulated live differential backup job for UV-MRT',
  },
  {
    step: 7,
    title: 'Operational Efficiency Benchmarks',
    description: 'Compare manual recovery triage with DRPS automation. See 57.8% MTTR reduction and 95.6% triage acceleration.',
    targetTab: 'efficiency_storage',
    highlightAction: 'Review manual vs automated MTTR variance metrics',
  },
  {
    step: 8,
    title: 'Client Storage Telemetry & Governance Export',
    description: 'Inspect live LocalStorage payload byte count, download CSV audit report, or export full JSON state.',
    targetTab: 'efficiency_storage',
    highlightAction: 'Export the complete CSV governance report or full JSON backup',
  },
];

export const GuidedWalkthroughBar: React.FC<GuidedWalkthroughBarProps> = ({
  currentStep,
  isDismissed,
  onSetStep,
  onDismiss,
  onRestore,
  onNavigateTab,
  onSelectAsset,
}) => {
  if (isDismissed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onRestore}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#0A261D] hover:bg-[#154E3A] rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <Compass className="w-3.5 h-3.5 text-[#4ADE80]" />
          <span>Resume Guided Tour</span>
        </button>
      </div>
    );
  }

  const stepData = WALKTHROUGH_STEPS.find((s) => s.step === currentStep) || WALKTHROUGH_STEPS[0];

  const handleStepJump = (stepNum: number) => {
    onSetStep(stepNum);
    const target = WALKTHROUGH_STEPS.find((s) => s.step === stepNum);
    if (target) {
      onNavigateTab(target.targetTab);
      if (stepNum === 2 && onSelectAsset) {
        onSelectAsset('A20');
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 8) {
      handleStepJump(currentStep + 1);
    } else {
      onDismiss();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      handleStepJump(currentStep - 1);
    }
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 max-w-4xl mx-auto z-50">
      <div className="bg-[#0A261D] text-white rounded-[18px] shadow-2xl p-4 sm:p-5 border border-white/10 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#14533D] text-[#4ADE80] flex items-center justify-center font-mono-metrics text-xs font-extrabold border border-white/10 shadow-inner shrink-0">
              {currentStep}/8
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#4ADE80]">
                  Guided Walkthrough
                </span>
                <span className="text-[11px] text-white/40">•</span>
                <span className="text-xs sm:text-sm font-bold text-white">{stepData.title}</span>
              </div>
              <p className="text-xs text-white/80 mt-0.5 max-w-2xl leading-relaxed">{stepData.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous Step"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#4ADE80] text-[#0A261D] rounded-xl hover:bg-[#22C55E] transition-all shadow-xs"
            >
              <span>{currentStep === 8 ? 'Finish' : 'Next'}</span>
              {currentStep === 8 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={onDismiss}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Dismiss Walkthrough"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step dots strip */}
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-white/10">
          {WALKTHROUGH_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => handleStepJump(s.step)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                s.step === currentStep
                  ? 'w-8 bg-[#4ADE80]'
                  : s.step < currentStep
                  ? 'w-3 bg-white/60'
                  : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
              title={`Jump to Step ${s.step}: ${s.title}`}
            />
          ))}
          <span className="text-[10px] text-white/70 ml-2 font-medium truncate">
            Step {currentStep} of 8: {stepData.highlightAction}
          </span>
        </div>
      </div>
    </div>
  );
};
