'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { IncidentSimulation } from '@/types/drps';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#09090B]">
            Controlled Incident Simulator & Runbooks
          </h2>
          <p className="text-xs text-[#52525B] mt-0.5">
            8 operational drills across university subsidiaries. Track recovery tasks, evaluate RTO compliance, and audit recovery latencies.
          </p>
        </div>

        {/* Live Elapsed Drill Timer */}
        <div className="flex items-center gap-2 bg-white border border-[#E4E4E7] rounded-lg p-2 px-3">
          <Timer className="w-4 h-4 text-[#0F3D2E]" />
          <div className="font-mono-metrics font-bold text-sm text-[#09090B] w-14">
            {formatSeconds(elapsedDrillSeconds)}
          </div>
          {isRunningTimer ? (
            <button
              onClick={handleStopDrill}
              className="px-2 py-1 bg-[#52525B] hover:bg-[#3F3F46] text-white text-[11px] font-semibold rounded transition-colors"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={handleStartDrill}
              className="px-2 py-1 bg-[#0F3D2E] hover:bg-[#165B44] text-white text-[11px] font-semibold rounded flex items-center gap-1 transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>Drill</span>
            </button>
          )}
          <button
            onClick={handleResetDrill}
            className="p-1 text-[#71717A] hover:text-[#09090B]"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scenarios Horizontal Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
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
              className={`p-2.5 rounded-lg border text-left transition-[border-color,background-color] duration-150 ${
                isSelected
                  ? 'border-[#0F3D2E] bg-[#ECFDF5]/60'
                  : 'border-[#E4E4E7] bg-white hover:border-[#D4D4D8] hover:bg-[#FAFAFA]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-metrics font-bold text-xs text-[#09090B]">
                  {sim.id}
                </span>
                <span
                  className={`text-[9px] font-mono-metrics font-bold px-1 py-0.5 rounded ${
                    isMet
                      ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                      : 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                  }`}
                >
                  {sim.complianceStatus}
                </span>
              </div>
              <div className="text-[10px] text-[#71717A] font-mono-metrics mt-1">
                {sim.targetUnitId}
              </div>
              <div className="text-[11px] font-medium text-[#09090B] mt-1 line-clamp-1">
                {sim.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Drill Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Context, Sliders & Phased Checklist */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-metrics font-bold text-xs px-2 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7]">
                    {activeSim.id}
                  </span>
                  <span className="text-[11px] font-mono-metrics text-[#71717A]">
                    Target: {activeSim.targetUnitId}
                  </span>
                  <span
                    className={`text-[11px] font-mono-metrics font-bold px-2 py-0.5 rounded ${
                      activeSim.complianceStatus === 'MET'
                        ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                        : 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                    }`}
                  >
                    RTO {activeSim.complianceStatus} ({activeSim.varianceMinutes <= 0 ? `${activeSim.varianceMinutes}m` : `+${activeSim.varianceMinutes}m`})
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#09090B] mt-2">
                  {activeSim.title}
                </h3>
                <p className="text-xs text-[#52525B] mt-1 leading-relaxed">
                  {activeSim.description}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="pt-2 border-t border-[#E4E4E7] grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[#71717A]">Mandated RTO</span>
                <div className="font-mono-metrics font-bold text-sm text-[#09090B] mt-0.5">
                  {activeSim.rtoHours}h ({activeSim.rtoHours * 60}m)
                </div>
              </div>
              <div>
                <span className="text-[#71717A]">Simulated Recovery</span>
                <div className="font-mono-metrics font-bold text-sm text-[#0F3D2E] mt-0.5">
                  {formattedSimulatedTime}
                </div>
              </div>
              <div>
                <span className="text-[#71717A]">Processes</span>
                <div className="font-mono-metrics text-xs text-[#52525B] mt-0.5">
                  {activeSim.targetProcessIds.join(', ')}
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="pt-3 border-t border-[#E4E4E7] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#71717A] font-medium">
                  Simulated Recovery Time:
                </span>
                <span className="font-mono-metrics font-bold text-[#09090B]">
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
                className="w-full accent-[#0F3D2E]"
              />
              <div className="flex items-center justify-between text-[10px] text-[#71717A] font-mono-metrics">
                <span>30m</span>
                <span className="text-[#B91C1C] font-semibold">RTO: {activeSim.rtoHours * 60}m</span>
                <span>{Math.max(600, activeSim.rtoHours * 60 * 1.5)}m</span>
              </div>
            </div>
          </div>

          {/* Phased Checklist */}
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-[#09090B]">
                  Technical & Continuity Tasks ({completedTaskCount}/{activeSim.tasks.length})
                </h4>
                <div className="text-[11px] text-[#52525B] mt-0.5">
                  Standard operating procedures across 4 ISO 22301 incident phases.
                </div>
              </div>
              <div className="text-xs font-mono-metrics font-bold text-[#0F3D2E]">
                {taskProgressPercent}%
              </div>
            </div>

            {/* Task Progress Bar */}
            <div className="w-full h-1.5 bg-[#F4F4F5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0F3D2E] transition-[width] duration-300"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>

            {/* Tasks list */}
            <div className="space-y-2">
              {activeSim.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(activeSim.id, task.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-[border-color,background-color] duration-150 flex items-start gap-3 ${
                    task.completed
                      ? 'bg-[#FAFAFA] border-[#E4E4E7]'
                      : 'bg-white border-[#E4E4E7] hover:border-[#0F3D2E]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="mt-0.5 accent-[#0F3D2E] rounded cursor-pointer"
                  />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-metrics px-1.5 py-0.5 rounded bg-[#F4F4F5] text-[#52525B]">
                        {task.phase}
                      </span>
                      <span className="text-[10px] text-[#71717A]">Assigned: {task.role}</span>
                    </div>
                    <div
                      className={`text-xs ${
                        task.completed ? 'text-[#71717A]' : 'text-[#09090B] font-medium'
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

        {/* Right Column: MTTR Benchmarks & Chronological Telemetry */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-3.5">
            <h4 className="text-xs font-semibold text-[#09090B]">
              Manual vs Automated Efficiency Impact
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E4E4E7] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">Legacy Manual MTTR:</span>
                  <span className="font-mono-metrics font-bold text-[#B91C1C]">
                    {Math.floor(activeSim.manualMttrMinutes / 60)}h {activeSim.manualMttrMinutes % 60}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A]">DRPS Automated MTTR:</span>
                  <span className="font-mono-metrics font-bold text-[#15803D]">
                    {formattedSimulatedTime}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-[#0F3D2E]">
                <div>
                  <div className="font-semibold text-xs">Simulated MTTR Reduction</div>
                  <div className="text-[11px] text-[#165B44]">
                    Saved {(activeSim.manualMttrMinutes - activeSim.simulatedRecoveryMinutes)} minutes
                  </div>
                </div>
                <div className="text-xl font-bold font-mono-metrics">
                  {(
                    ((activeSim.manualMttrMinutes - activeSim.simulatedRecoveryMinutes) /
                      activeSim.manualMttrMinutes) *
                    100
                  ).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Log */}
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[#09090B]">
                Telemetry Log Sequence
              </h4>
              <span className="text-[10px] text-[#71717A]">ISO 22301 Timestamp</span>
            </div>

            <div className="space-y-2 border-l border-[#E4E4E7] ml-2 pl-3">
              {activeSim.logs.map((log, idx) => (
                <div key={idx} className="text-xs">
                  <div className="text-[#09090B] font-mono-metrics text-[11px] leading-relaxed">
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
