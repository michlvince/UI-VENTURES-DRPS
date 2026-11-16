# UI Ventures Limited Multi-Unit Disaster Recovery Planning System (DRPS)

**Case Study Model for UI Ventures Limited, University of Ibadan**  
*Enterprise Continuity & Resilience Framework*

---

## 1. Executive Summary & Problem Domain

UI Ventures Limited operates as the commercial subsidiary holding company for the University of Ibadan, administering 9 diverse commercial, industrial, hospitality, and corporate entities. Previously, disaster recovery across these units was characterized by:
- Isolated, paper-based incident reporting with high triage latency (upwards of 45 minutes).
- Unmapped cross-dependencies on shared university utilities (such as 33kV dedicated power feeder, central standby generators, and campus fibre backbones).
- Risk of catastrophic downtime across critical production cycles (perishable dough in U&I Bakery, reverse-osmosis filtration at UI Water Enterprises, guest check-in at UI Hotels, automated fuel sales at UI Petrol Station).

The **Multi-Unit Disaster Recovery Planning System (DRPS)** provides a federated, automated business continuity platform adhering to ISO 22301 and NIST SP 800-34 standards.

---

## 2. Core Architecture & Specifications

- **Framework:** Next.js 15 (App Router) with TypeScript in strict mode (`strict: true`).
- **Styling & Visual Design:** Tailwind CSS engineered with an editorial Stripe/Linear SaaS aesthetic.
  - Primary UI background: `#FAFAFA`
  - Cards & panels: `#FFFFFF` with `1px solid #E4E4E7` borders and subtle radius
  - Brand Accent: `#0F3D2E` (University of Ibadan Forest Green)
  - Typography: `Inter` for prose and headings; `JetBrains Mono` for IDs, RTO/RPO limits, and quantitative metrics (`tabular-nums`)
- **Persistence Engine:** Zero external database overhead. Operates as an air-gapped client persistence engine via `localStorage` under key `ui_ventures_drps_v1` with live byte-size telemetry, JSON state backup/restore, CSV governance reporting, and factory reset.

---

## 3. Seed Dataset Overview (Modeled & Verified)

### 3.1 9 Subsidiary Business Units
1. `UV-HOT`: UI Hotels / Hospitality (`88.0%` Initial Readiness)
2. `UV-COM`: Computer Services (`86.0%` Initial Readiness)
3. `UV-PRN`: UI Printery (`85.0%` Initial Readiness)
4. `UV-BAK`: U&I Fast Foods & Bakery (`84.0%` Initial Readiness)
5. `UV-PET`: UI Petrol Station (`82.0%` Initial Readiness)
6. `UV-CON`: Consultancy Service Unit (`80.0%` Initial Readiness)
7. `UV-HSE`: Health, Safety & Environment (`79.0%` Initial Readiness)
8. `UV-COR`: Corporate Administration (`76.0%` Modeled Holding Function)
9. `UV-WAT`: UI Water Enterprises (`72.0%` Initial Readiness)
- **Enterprise Aggregate Readiness:** `81.4%`

### 3.2 14 Critical Business Processes (`P01`–`P14`)
- Granular Recovery Time Objectives (RTO) ranging from `2h` to `12h`.
- Recovery Point Objectives (RPO) ranging from `4h` to `12h` (or physical N/A).
- Multi-dimensional Business Impact Analysis (BIA) scoring for Financial, Operational, and Reputational impact (1–5).

### 3.3 18 Infrastructure Assets (`A01`–`A18`) & Blast Radius
- Unit-specific equipment (`A01`–`A12`, `A15`) and 5 shared utilities (`A13` Fibre/WAN, `A14` 33kV/Generators, `A16` Immutable NAS Vault, `A17` Vendor Directory, `A18` Safety Escalation).
- Dynamic blast-radius query mapping cascading failures across all 9 units when shared utilities degrade.

### 3.4 15 Enterprise Risks (`R01`–`R15`) with 5x5 Matrix
- Matrix calculation: $\text{Score} = \text{Likelihood} \times \text{Impact}$ ($1 \le L, I \le 5$).
- `R01` (Campus grid power loss) ranked highest with score 25 (Critical).
- Interactive sliders for real-time recalculation of risk scores and matrix cells.

### 3.5 8 Controlled Incident Simulations (`SIM-01`–`SIM-08`)
- Real-time drill stopwatch and 4-phase checklists (Triage & Safety, Containment, Technical Failover, Verification & Reconnect).
- Automatic RTO compliance assessment (6 MET, 2 MISSED over-RTO scenarios).
- Quantified recovery acceleration: **57.8% MTTR reduction** and **95.6% triage acceleration**.

---

## 4. Local Development Setup

### Prerequisites
- Node.js `v18+` (v20 or v26 tested)
- npm `v9+`

### Installation & Execution
```bash
# Clone the repository
git clone <repository_url>
cd "UI Ventures DRPS"

# Install project dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the interactive web application.

### Building & Verification
```bash
# Type check and build static production bundle
npm run build

# Run linting checks
npm run lint
```

---

## 5. Walkthrough Guide (Case Study Verification)

The web application includes a docked 7-step interactive walkthrough bar:
1. **Step 1:** Multi-Unit BIA & RTO Matrix inspection
2. **Step 2:** Shared Infrastructure Blast Radius computation
3. **Step 3:** 5x5 Enterprise Risk Heatmap redistribution
4. **Step 4:** Controlled Incident Simulation & checklist tracking
5. **Step 5:** Continuous Backup Assurance & snapshot verification
6. **Step 6:** Operational Efficiency benchmarks & MTTR analysis
7. **Step 7:** Client Storage Telemetry, CSV governance download, and JSON backup

---

## 6. License
Designed and developed for enterprise demonstration and operational deployment for UI Ventures Limited, University of Ibadan.
