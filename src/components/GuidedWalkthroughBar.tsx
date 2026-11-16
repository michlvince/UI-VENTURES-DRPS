'use client';

import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  HelpCircle,
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
    description: 'Inspect the 9 subsidiary units and 14 critical processes. Check the initial readiness and test editing RTO hours.',
    targetTab: 'units_bia',
    highlightAction: 'Review UV-HOT and UV-BAK RTO/RPO requirements',
  },
  {
    step: 2,
    title: 'Shared Infrastructure Blast Radius',
    description: 'Discover how shared asset A13 (Enterprise Network) or A14 (Mains Power) cascades downtime across all subsidiaries.',
    targetTab: 'blast_radius',
    highlightAction: 'Click Asset A13 or A14 to observe multi-unit blast radius',
  },
  {
    step: 3,
    title: 'Enterprise Risk Matrix (5x5 Heatmap)',
    description: 'Examine 15 enterprise risks. Adjust Likelihood and Impact sliders to observe live score recomputation.',
    targetTab: 'risk_register',
    highlightAction: 'Inspect R01 Power Outage (25 Critical) and tweak R04 PMS Ransomware',
  },
  {
    step: 4,
    title: 'Controlled Incident Simulation & Checklist',
    description: 'Run SIM-01 (Campus Power Outage) or SIM-07 (Ransomware). Track task phases and RTO compliance evaluation.',
    targetTab: 'incident_simulator',
    highlightAction: 'Switch between SIM-01 (MET) and SIM-03 (MISSED) scenarios',
  },
  {
    step: 5,
    title: 'Continuous Backup Assurance Log',
    description: 'Verify the 4-hour and 12-hour RPO synchronization records across on-premise NAS, data center, and immutable vault.',
    targetTab: 'backup_assurance',
    highlightAction: 'Trigger a simulated live differential or full backup job',
  },
  {
    step: 6,
    title: 'Operational Efficiency Benchmarks',
    description: 'Compare manual recovery triage with DRPS automation. See 57.8% MTTR reduction and 95.6% triage acceleration.',
    targetTab: 'efficiency_storage',
    highlightAction: 'Review manual vs automated MTTR variance metrics',
  },
  {
    step: 7,
    title: 'Client Storage Telemetry & Governance Export',
    description: 'Inspect the live LocalStorage payload byte count, download the CSV audit report, or export full JSON state.',
    targetTab: 'efficiency_storage',
    highlightAction: 'Export the complete CSV governance report or JSON backup',
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
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#0F3D2E] bg-white border border-[#E4E4E7] rounded-lg shadow-sm hover:bg-[#ECFDF5] transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#0F3D2E]" />
          <span>CSC 476 Guided Walkthrough</span>
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
        onSelectAsset('A13');
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 7) {
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
    <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-50">
      <div className="bg-white border border-[#E4E4E7] rounded-xl shadow-lg p-3.5 sm:p-4 text-[#09090B]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#0F3D2E] flex items-center justify-center font-mono-metrics text-xs font-semibold border border-[#D1FAE5]">
              {currentStep}/7
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#0F3D2E]">
                  Case Study Walkthrough (Appendix B)
                </span>
                <span className="text-[11px] text-[#71717A]">•</span>
                <span className="text-xs font-semibold text-[#09090B]">{stepData.title}</span>
              </div>
              <p className="text-xs text-[#52525B] mt-0.5 max-w-2xl">{stepData.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="p-1.5 rounded-md border border-[#E4E4E7] text-[#52525B] hover:text-[#09090B] hover:bg-[#FAFAFA] disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous Step"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#0F3D2E] text-white rounded-md hover:bg-[#165B44] transition-colors"
            >
              <span>{currentStep === 7 ? 'Finish' : 'Next'}</span>
              {currentStep === 7 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={onDismiss}
              className="p-1.5 rounded-md text-[#71717A] hover:text-[#09090B] hover:bg-[#FAFAFA]"
              title="Dismiss Walkthrough"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-[#E4E4E7]/60">
          {WALKTHROUGH_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => handleStepJump(s.step)}
              className={`h-1.5 rounded-full transition-all ${
                s.step === currentStep
                  ? 'w-8 bg-[#0F3D2E]'
                  : s.step < currentStep
                  ? 'w-3 bg-[#15803D]'
                  : 'w-3 bg-[#E4E4E7] hover:bg-[#D4D4D8]'
              }`}
              title={`Jump to Step ${s.step}: ${s.title}`}
            />
          ))}
          <span className="text-[10px] text-[#71717A] ml-2 font-mono-metrics">
            Step {currentStep} of 7: {stepData.highlightAction}
          </span>
        </div>
      </div>
    </div>
  );
};
