'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { IncidentSimulation } from '@/types/drps';
import { StatusBadge } from './ui/StatusBadge';

interface IncidentSimulatorViewProps {
  simulations: IncidentSimulation[];
  onToggleTask: (simulationId: string, taskId: string) => void;
  onUpdateRecoveryMinutes: (simulationId: string, minutes: number) => void;
}

export const IncidentSimulatorView: React.FC<IncidentSimulatorViewProps> = ({
  simulations,
  onToggleTask,
  onUpdateRecoveryMinutes,
}) => {
  const [activeSimId, setActiveSimId] = useState<string>('SIM-01');
  const [isRunningTimer, setIsRunningTimer] = useState<boolean>(false);
  const [elapsedDrillSeconds, setElapsedDrillSeconds] = useState<number>(0);

  const activeSim = simulations.find((s) => s.id === activeSimId) || simulations[0];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunningTimer) {
      interval = setInterval(() => {
        setElapsedDrillSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunningTimer]);

  const handleStartDrill = () => {
    setIsRunningTimer(true);
  };

  const handleStopDrill = () => {
    setIsRunningTimer(false);
  };

  const handleResetDrill = () => {
    setIsRunningTimer(false);
    setElapsedDrillSeconds(0);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const completedTaskCount = activeSim.tasks.filter((t) => t.completed).length;
  const taskProgressPercent = Math.round((completedTaskCount / activeSim.tasks.length) * 100);

  const hours = Math.floor(activeSim.simulatedRecoveryMinutes / 60);
  const mins = activeSim.simulatedRecoveryMinutes % 60;
  const formattedSimulatedTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      {/* Header Bento Box */}
      <div className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
            Controlled Incident Simulator & Phased Runbooks
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            {simulations.length} operational drills across university subsidiaries. Track recovery tasks, evaluate RTO compliance, and audit recovery latencies.
          </p>
        </div>

        {/* Live Elapsed Drill Stopwatch */}
        <div className="flex items-center gap-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-2 px-3.5 self-start sm:self-auto shadow-xs">
          <Timer className="w-4 h-4 text-[#103E2E]" />
          <div className="font-mono-metrics font-extrabold text-sm text-[#111827] w-14">
            {formatSeconds(elapsedDrillSeconds)}
          </div>
          {isRunningTimer ? (
            <button
              onClick={handleStopDrill}
              className="px-2.5 py-1 bg-[#4B5563] hover:bg-[#374151] text-white text-[11px] font-bold rounded-lg transition-colors"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={handleStartDrill}
              className="px-2.5 py-1 bg-[#103E2E] hover:bg-[#14533D] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Drill</span>
            </button>
          )}
          <button
            onClick={handleResetDrill}
            className="p-1 text-[#9CA3AF] hover:text-[#111827] transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scenarios Horizontal Selector Bento Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {simulations.map((sim) => {
          const isSelected = sim.id === activeSimId;
          const isMet = sim.complianceStatus === 'MET';

          return (
            <button
              key={sim.id}
              onClick={() => {
                setActiveSimId(sim.id);
                setElapsedDrillSeconds(0);
                setIsRunningTimer(false);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all duration-150 ${
                isSelected
                  ? 'border-[#103E2E] bg-[#0A261D] text-white shadow-xs'
                  : 'border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono-metrics font-extrabold text-xs ${isSelected ? 'text-white' : 'text-[#111827]'}`}>
                  {sim.id}
                </span>
                <span
                  className={`text-[9px] font-mono-metrics font-bold px-1.5 py-0.2 rounded-full ${
                    isMet
                      ? isSelected ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-[#DCFCE7] text-[#16A34A]'
                      : isSelected ? 'bg-[#DC2626]/20 text-[#FCA5A5]' : 'bg-[#FEE2E2] text-[#DC2626]'
                  }`}
                >
                  {sim.complianceStatus}
                </span>
              </div>
              <div className={`text-[10px] font-mono-metrics mt-1 ${isSelected ? 'text-white/60' : 'text-[#6B7280]'}`}>
                {sim.targetUnitId}
              </div>
              <div className={`text-[10px] font-bold mt-0.5 line-clamp-1 ${isSelected ? 'text-white' : 'text-[#111827]'}`}>
                {sim.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Column: Context Card + Runbook Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          {/* Active Sim Context Card */}
          <div className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB] space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono-metrics font-bold text-xs px-2.5 py-0.5 rounded-lg bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB]">
                    {activeSim.id}
                  </span>
                  <span className="text-xs text-[#6B7280]">
                    Target: <strong className="text-[#111827]">{activeSim.targetUnitId}</strong>
                  </span>
                  <StatusBadge
                    label={`RTO ${activeSim.complianceStatus} (${activeSim.varianceMinutes <= 0 ? `${activeSim.varianceMinutes}m` : `+${activeSim.varianceMinutes}m`})`}
                    variant={activeSim.complianceStatus === 'MET' ? 'success' : 'danger'}
                    size="sm"
                  />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#111827] mt-2">
                  {activeSim.title}
                </h3>
                <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                  {activeSim.description}
                </p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="pt-3 border-t border-[#E5E7EB] grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[#6B7280]">Mandated RTO</span>
                <div className="font-mono-metrics font-extrabold text-sm text-[#111827] mt-0.5">
                  {activeSim.rtoHours}h ({activeSim.rtoHours * 60}m)
                </div>
              </div>
              <div>
                <span className="text-[#6B7280]">Simulated Recovery</span>
                <div className="font-mono-metrics font-extrabold text-sm text-[#103E2E] mt-0.5">
                  {formattedSimulatedTime}
                </div>
              </div>
              <div>
                <span className="text-[#6B7280]">Target Processes</span>
                <div className="font-mono-metrics text-xs text-[#111827] font-semibold mt-0.5">
                  {activeSim.targetProcessIds.join(', ')}
                </div>
              </div>
            </div>

            {/* Slider to test recovery time */}
            <div className="pt-3 border-t border-[#E5E7EB] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280] font-semibold">
                  Test Simulated Recovery Time:
                </span>
                <span className="font-mono-metrics font-extrabold text-[#111827]">
                  {activeSim.simulatedRecoveryMinutes} mins ({formattedSimulatedTime})
                </span>
              </div>
              <input
                type="range"
                min="30"
                max={Math.max(600, activeSim.rtoHours * 60 * 1.5)}
                step="5"
                value={activeSim.simulatedRecoveryMinutes}
                onChange={(e) =>
                  onUpdateRecoveryMinutes(activeSim.id, parseInt(e.target.value))
                }
                className="w-full accent-[#103E2E] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-[#9CA3AF] font-mono-metrics">
                <span>30m</span>
                <span className="text-[#DC2626] font-bold">RTO Threshold: {activeSim.rtoHours * 60}m</span>
                <span>{Math.max(600, activeSim.rtoHours * 60 * 1.5)}m</span>
              </div>
            </div>
          </div>

          {/* Phased Checklist Bento Card */}
          <div className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#111827]">
                  Phased Recovery Tasks ({completedTaskCount}/{activeSim.tasks.length})
                </h4>
                <div className="text-[11px] text-[#6B7280] mt-0.5">
                  4 ISO 22301 standard emergency action phases.
                </div>
              </div>
              <div className="text-sm font-mono-metrics font-extrabold text-[#103E2E]">
                {taskProgressPercent}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#103E2E] transition-all duration-300 rounded-full"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>

            {/* Task rows */}
            <div className="space-y-2 mt-3">
              {activeSim.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(activeSim.id, task.id)}
                  className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-3 ${
                    task.completed
                      ? 'bg-[#F9FAFB] border-[#E5E7EB]'
                      : 'bg-white border-[#E5E7EB] hover:border-[#103E2E]/40 hover:bg-[#F9FAFB]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="mt-0.5 accent-[#103E2E] rounded cursor-pointer"
                  />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-metrics font-bold px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                        {task.phase}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF]">Role: {task.role}</span>
                    </div>
                    <div
                      className={`text-xs ${
                        task.completed ? 'text-[#9CA3AF] line-through' : 'text-[#111827] font-semibold'
                      }`}
                    >
                      {task.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: MTTR Impact & Event Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          {/* MTTR Benchmark Bento */}
          <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-xs border border-[#E5E7EB] space-y-3.5">
            <h4 className="text-sm font-bold text-[#111827]">
              Manual vs Automated Recovery Variance
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">Legacy Manual MTTR:</span>
                  <span className="font-mono-metrics font-extrabold text-[#DC2626]">
                    {Math.floor(activeSim.manualMttrMinutes / 60)}h {activeSim.manualMttrMinutes % 60}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">DRPS Automated MTTR:</span>
                  <span className="font-mono-metrics font-extrabold text-[#16A34A]">
                    {formattedSimulatedTime}
                  </span>
                </div>
              </div>

              {/* Time Saved Hero Box */}
              <div className="p-4 rounded-xl bg-[#0A261D] text-white flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-white">MTTR Reduction</div>
                  <div className="text-[11px] text-[#86EFAC] mt-0.5">
                    Saved {(activeSim.manualMttrMinutes - activeSim.simulatedRecoveryMinutes)} minutes
                  </div>
                </div>
                <div className="text-2xl font-extrabold font-mono-metrics text-[#4ADE80]">
                  {(
                    ((activeSim.manualMttrMinutes - activeSim.simulatedRecoveryMinutes) /
                      activeSim.manualMttrMinutes) *
                    100
                  ).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Chronological Log Bento */}
          <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-xs border border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <h4 className="text-sm font-bold text-[#111827]">
                Telemetry Sequence
              </h4>
              <span className="text-[10px] text-[#9CA3AF]">ISO 22301 Timestamp</span>
            </div>

            <div className="space-y-2.5 border-l-2 border-[#103E2E]/20 ml-2 pl-3 max-h-[360px] overflow-y-auto">
              {activeSim.logs.map((log, idx) => (
                <div key={idx} className="text-xs">
                  <div className="text-[#111827] font-mono-metrics text-[11px] leading-relaxed">
                    {log}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
