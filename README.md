# EcoCampus Decision Engine

> **Predicting, Comparing and Improving Campus Sustainability through Intelligent Decision Support**
>
> **Institution:** Chennai Institute of Technology, Chennai (Autonomous)  
> **Course:** PBL Course – JAVA PROGRAMMING  
> **Evaluation Mode:** Prototype & Decision-Support System

---

## 🏛️ Project Architecture Overview

EcoCampus Decision Engine is a full-stack, data-driven campus sustainability management system designed for higher education institutions. It aggregates environmental telemetry across academic departments (ECE, IT, CSE, MECH), executes weighted multi-criteria scoring algorithms, detects operational risks, models future projections, and provides an interactive "What-If" scenario simulator to guide green capital investments.

### Key Capabilities
- **Real-Time Sustainability Scoring:** Weighted algorithm: Electricity (20%), Water (15%), Waste Recycling (20%), Transportation (15%), Green Coverage (15%), Renewable Energy (15%). Status thresholds: ≥80 Green Campus, 60–79 Moderate, <60 Needs Improvement.
- **Department Benchmarking & Rankings:** Automated ranking identifying ECE as the leading green department (Score: 91, Excellent), with comparison analytics for IT (88), CSE (85), and MECH (72).
- **Interactive Multi-Mode Charts (Recharts):** Switch between Bar, Radar, and Line visualizers comparing campus indicators against benchmarks and 2026 institutional targets.
- **Automated Risk Engine:** Heuristic risk detection for excessive electricity/water consumption or deficient renewable energy/recycling rates.
- **Future Sustainability Prediction:** 1-Month, 3-Month, 6-Month, and 1-Year deterministic forecasting models. Current Score: **87** → Projected: **94** (+7 improvement).
- **What-If Scenario Simulator:** Dynamic sliders for Solar, Water, Waste, Green Canopy, Transport, and Energy Efficiency with real-time recalculation and factor breakdown.
- **Prioritized Green Investments:** Actionable investment cards with priority badges, ROI expected score gains, and direct simulation triggers.
- **Auditable Reports:** Executive printable report with Chennai Institute of Technology letterhead and live CSV data export.
- **Java Spring Boot PBL Mapping Guide:** Built-in modal documenting the migration path from Express/SQLite to Spring Boot (`@RestController`, `@Service`, Spring Data JPA, Hibernate, `@Entity`).

---

## 🚀 How to Run Locally in VS Code

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Quick Start (Single Command Full-Stack Mode)
```bash
# 1. Install dependencies
npm install

# 2. Run the unified development server (Backend API + Frontend on http://localhost:3000)
npm run dev
```

The server automatically initializes and seeds the SQLite database (`ecocampus.db`) on startup.

---

## 📋 Demonstration Scenario Guide (Reviewer Walkthrough)

1. **Step 1: Dashboard Overview**
   - Review overall score: **87 / 100** with **GREEN CAMPUS** badge.
   - Inspect the circular SVG score gauge and 5 indicator KPI cards.
   - Verify Department Rankings table: **ECE (Rank 1, 91, Most Sustainable)**.
   - Switch chart views between **Bar**, **Radar**, and **Line**.
   - Check the **Sustainability Trend** line chart (Jan: 78 → Jun: 87).

2. **Step 2: Department Comparison**
   - Click **Departments** in the sidebar.
   - Search for departments or sort by score, recycling, or electricity.
   - Click **MECH** or **ECE** to inspect detailed telemetry, indicator bars, and department risks.

3. **Step 3: Sustainability Telemetry CRUD**
   - Navigate to **Sustainability Data**.
   - Click **Add Sustainability Data** and fill out the form.
   - Notice that submitting instantly updates SQLite and triggers real-time score recalculation across all pages.
   - Test editing and deleting records.

4. **Step 4: What-If Scenario Simulation**
   - Navigate to **Scenario Simulator**.
   - Adjust the **Solar Energy Installation** slider to 30%.
   - Observe the score jumping from **87** to **94** (+7 improvement).
   - Review the Before vs. After comparison radar/bar charts and impact contribution table.

5. **Step 5: Forecasting & Recommendations**
   - Navigate to **Predictions** to view monthly milestone roadmaps.
   - Navigate to **Recommendations** and filter by High, Medium, or Low priority.
   - Click "Simulate this Intervention" on Solar Panel Installation to test it.

6. **Step 6: Reports & Export**
   - Navigate to **Reports**.
   - Review the formatted institutional audit report with CIT letterhead.
   - Click **Export CSV** to download live CSV data.
   - Click **Print Report** to test browser print preview.

7. **Step 7: Java Spring Boot PBL Architecture Guide**
   - Click the **Java PBL Architecture** button in the sidebar or navbar.
   - Present the mapping of Express controllers, services, and SQLite schemas to Spring Boot `@RestController`, `@Service`, and `@Entity` classes for project viva.
