export type UnitId =
  | 'UV-HOT'
  | 'UV-COM'
  | 'UV-PRN'
  | 'UV-BAK'
  | 'UV-PET'
  | 'UV-CON'
  | 'UV-HSE'
  | 'UV-COR'
  | 'UV-WAT'
  | 'UV-MRT';

export type ProcessCriticality = 'Critical' | 'High' | 'Medium' | 'Low';

export type RiskSeverity = 'Critical' | 'High' | 'Moderate' | 'Low';

export type ComplianceStatus = 'MET' | 'MISSED';

export type AssetCategory = 'Physical' | 'Digital' | 'Shared Infrastructure';

export interface BusinessUnit {
  id: UnitId;
  name: string;
  category: 'Commercial' | 'Service' | 'Industrial' | 'Corporate';
  initialReadiness: number; // e.g. 88.0
  currentReadiness: number;
  status: 'Verified' | 'Modeled Holding Function';
  headOfUnit: string;
  location: string;
  primaryStaffCount: number;
  keyAssetCount: number;
  description: string;
}

export interface BusinessProcess {
  id: string; // P01 - P16
  unitId: UnitId;
  name: string;
  criticality: ProcessCriticality;
  rtoHours: number; // e.g. 1, 2, 4
  rpoHours: number | null; // e.g. 4 or null if physical/not applicable
  financialImpact: number; // 1-5
  operationalImpact: number; // 1-5
  reputationalImpact: number; // 1-5
  dependentAssetIds: string[];
  manualWorkaroundAvailable: boolean;
  notes: string;
}

export interface InfrastructureAsset {
  id: string; // A01 - A20
  name: string;
  category: AssetCategory;
  primaryUnitId: UnitId | 'ALL';
  isShared: boolean;
  description: string;
  redundancyLevel: 'N+1 Redundant' | 'Partial Failover' | 'Single Point of Failure';
  maintenanceSchedule: string;
  dependentProcessIds: string[];
}

export interface RiskItem {
  id: string; // R01 - R16
  title: string;
  category: 'Power & Infrastructure' | 'Hardware & Equipment' | 'Software & Cyber' | 'Supply & Utilities' | 'Personnel & Operations';
  likelihood: number; // 1-5
  impact: number; // 1-5
  score: number; // L x I (1 - 25)
  severity: RiskSeverity;
  affectedUnitIds: (UnitId | 'ALL')[];
  mitigationStrategy: string;
  ownerUnit: UnitId | 'UV-COR';
}

export interface SimulationTask {
  id: string;
  label: string;
  phase: 'Triage & Safety' | 'Containment' | 'Technical Failover' | 'Verification & Reconnect';
  completed: boolean;
  role: string;
}

export interface IncidentSimulation {
  id: string; // SIM-01 - SIM-09
  title: string;
  targetUnitId: UnitId | 'All Units';
  targetProcessIds: string[];
  description: string;
  rtoHours: number;
  simulatedRecoveryMinutes: number; // e.g. 95 (1h 35m)
  complianceStatus: ComplianceStatus;
  varianceMinutes: number; // difference from RTO (+ or -)
  manualMttrMinutes: number; // for manual benchmark
  tasks: SimulationTask[];
  logs: string[];
}

export interface BackupLogRecord {
  id: string;
  timestamp: string;
  unitId: UnitId;
  targetDataset: string;
  backupType: 'Full' | 'Differential' | 'Transaction Log' | 'Physical Ledger Scan';
  sizeMb: number;
  rpoWindowHours: number;
  integrityVerified: boolean;
  destination: 'On-Premise NAS' | 'Campus Data Center' | 'Immutable Cloud Vault';
}

export interface WalkthroughStep {
  step: number;
  title: string;
  description: string;
  targetTab: WorkspaceTab;
  highlightAction: string;
}

// UI Ventures Mart Offline Sales & Inventory Continuity Ledger Models
export interface MartInventoryItem {
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  openingStock: number;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  lastUpdated: string;
}

export interface MartSaleItem {
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface MartSaleTransaction {
  receiptId: string; // e.g., MRT-OFF-20261120-001
  timestamp: string;
  items: MartSaleItem[];
  subtotal: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Bank Transfer / POS Voucher' | 'Credit / Departmental Charge' | 'Campus Student Wallet';
  cashierName: string;
  notes?: string;
  offlineSyncStatus: 'Pending Sync' | 'Reconciled / Audited';
}

export interface MartLedgerState {
  inventory: MartInventoryItem[];
  sales: MartSaleTransaction[];
  offlineModeActive: boolean;
  activeBatchSessionId: string;
  lastPrestageTimestamp: string;
}

export type WorkspaceTab =
  | 'overview'
  | 'dashboard'
  | 'units_bia'
  | 'blast_radius'
  | 'risk_register'
  | 'incident_simulator'
  | 'backup_assurance'
  | 'efficiency_storage'
  | 'mart_ledger';

export interface DrpsState {
  version: string;
  units: BusinessUnit[];
  processes: BusinessProcess[];
  assets: InfrastructureAsset[];
  risks: RiskItem[];
  simulations: IncidentSimulation[];
  backups: BackupLogRecord[];
  martLedger: MartLedgerState;
  activeIncidentSimulationId: string | null;
  guidedStep: number; // 1-8 (0 if dismissed)
  guidedDismissed: boolean;
  lastUpdated: string;
}
