import {
  BusinessUnit,
  BusinessProcess,
  InfrastructureAsset,
  RiskItem,
  RiskSeverity,
  ComplianceStatus,
  UnitId,
} from '@/types/drps';

export function evaluateRiskScore(likelihood: number, impact: number): {
  score: number;
  severity: RiskSeverity;
} {
  const clampedL = Math.max(1, Math.min(5, Math.round(likelihood)));
  const clampedI = Math.max(1, Math.min(5, Math.round(impact)));
  const score = clampedL * clampedI;

  let severity: RiskSeverity = 'Low';
  if (score >= 20) {
    severity = 'Critical';
  } else if (score >= 10) {
    severity = 'High';
  } else if (score >= 5) {
    severity = 'Moderate';
  } else {
    severity = 'Low';
  }

  return { score, severity };
}

export function evaluateRtoCompliance(rtoHours: number, simulatedRecoveryMinutes: number): {
  status: ComplianceStatus;
  varianceMinutes: number;
  formattedVariance: string;
} {
  const allowedMinutes = rtoHours * 60;
  const varianceMinutes = simulatedRecoveryMinutes - allowedMinutes;
  const status: ComplianceStatus = varianceMinutes <= 0 ? 'MET' : 'MISSED';

  const absVar = Math.abs(varianceMinutes);
  const h = Math.floor(absVar / 60);
  const m = absVar % 60;
  const timeStr = h > 0 ? `${h}h ${m}m` : `${m}m`;

  const formattedVariance = varianceMinutes <= 0 ? `-${timeStr}` : `+${timeStr}`;

  return {
    status,
    varianceMinutes,
    formattedVariance,
  };
}

export function getAssetBlastRadius(
  assetId: string,
  allAssets: InfrastructureAsset[],
  allProcesses: BusinessProcess[],
  allUnits: BusinessUnit[]
): {
  asset: InfrastructureAsset | undefined;
  impactedProcesses: BusinessProcess[];
  impactedUnits: BusinessUnit[];
  strictestRtoHours: number | null;
  hasSinglePointOfFailure: boolean;
} {
  const asset = allAssets.find((a) => a.id === assetId);
  if (!asset) {
    return {
      asset: undefined,
      impactedProcesses: [],
      impactedUnits: [],
      strictestRtoHours: null,
      hasSinglePointOfFailure: false,
    };
  }

  // Find all processes that depend on this asset or whose dependentAssetIds include this asset
  const impactedProcesses = allProcesses.filter((proc) =>
    asset.dependentProcessIds.includes(proc.id) || proc.dependentAssetIds.includes(assetId)
  );

  const unitIdSet = new Set<UnitId>();
  impactedProcesses.forEach((p) => unitIdSet.add(p.unitId));

  if (asset.isShared && asset.primaryUnitId === 'ALL') {
    allUnits.forEach((u) => unitIdSet.add(u.id));
  } else if (asset.primaryUnitId !== 'ALL') {
    unitIdSet.add(asset.primaryUnitId as UnitId);
  }

  const impactedUnits = allUnits.filter((u) => unitIdSet.has(u.id));

  let strictestRtoHours: number | null = null;
  if (impactedProcesses.length > 0) {
    strictestRtoHours = Math.min(...impactedProcesses.map((p) => p.rtoHours));
  }

  const hasSinglePointOfFailure = asset.redundancyLevel === 'Single Point of Failure';

  return {
    asset,
    impactedProcesses,
    impactedUnits,
    strictestRtoHours,
    hasSinglePointOfFailure,
  };
}

export function calculateUnitReadiness(
  unitId: UnitId,
  unitProcesses: BusinessProcess[],
  unitRisks: RiskItem[],
  unitSimulations: { complianceStatus: ComplianceStatus }[]
): number {
  // Base readiness components
  // 1. Process BIA posture: ratio of processes with manual workarounds or low impact
  const totalProcesses = unitProcesses.length;
  let processScore = 80;
  if (totalProcesses > 0) {
    const workaroundWeight = unitProcesses.filter((p) => p.manualWorkaroundAvailable).length / totalProcesses;
    processScore = 70 + workaroundWeight * 25; // 70 to 95
  }

  // 2. Risk severity drag: critical risks deduct 8 pts, high risks deduct 3 pts
  let riskPenalty = 0;
  unitRisks.forEach((r) => {
    if (r.severity === 'Critical') riskPenalty += 6;
    else if (r.severity === 'High') riskPenalty += 2.5;
  });

  // 3. Simulation test boost or penalty
  let simAdjustment = 0;
  if (unitSimulations.length > 0) {
    const metCount = unitSimulations.filter((s) => s.complianceStatus === 'MET').length;
    const ratio = metCount / unitSimulations.length;
    simAdjustment = (ratio - 0.75) * 10;
  }

  const calculated = Math.max(50, Math.min(98, processScore - riskPenalty + simAdjustment));
  return Math.round(calculated * 10) / 10;
}

export function calculateEnterpriseReadiness(units: BusinessUnit[]): number {
  if (units.length === 0) return 0;
  const sum = units.reduce((acc, u) => acc + u.currentReadiness, 0);
  return Math.round((sum / units.length) * 10) / 10;
}
